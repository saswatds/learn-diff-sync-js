const { ObjectID } = require('bson'),
  { applyPatch, compare } = require('fast-json-patch');

module.exports = async function ({ params, body }, reply) {
  const { id, sid } = params;

  // Get the shadow with the shadow id
  const shadow = await this.mongo.db
    .collection("shadow")
    .findOne({ _id: ObjectID(sid), record: ObjectID(id) });


  if (!shadow) {
    reply.status(410);
    return { code: 'ShadowExpired', message: 'The shadow copy has expired' };
  }

  const ccv = parseInt(body.cv, 10),
    csv = parseInt(body.sv, 10);

  let { cv, sv, doc } = shadow;

  if (!(ccv === cv && csv === sv)) {
    reply.status(409);
    return { code: 'VersionMismatch', message: 'The cv, sv of shadow did not match the client' };
  }

  let newDoc;
  // If there were any patch present then we will apply the patches
  if (body.patch.length) {
    // Here we are hard patching the document
    applyPatch(doc, body.patch);

    // Updating the shadow document
    await this.mongo.db
      .collection('shadow')
      .findOneAndUpdate({ _id: ObjectID(sid) }, {
        $set: {
          updatedAt: new Date(),
          doc,
          cv: ++cv, // Incrementing the client version as the changes came from client
          sv
        }
      });

    // Updating the actual document
    const session = this.mongo.startSession({ causalConsistency: false });

    try {
      // Starting a transaction because we don't want anyone else to update it while we are doing this
      // TODO: In future iteration we will replace it with a single aggregation query
      session.startTransaction({ readPreference: 'primary' });
      newDoc = await this.mongo.db
        .collection('doc')
        .findOne(
          { _id: ObjectID(id) },
          {
            projection: { _id: 0 },
            session
          });

      // Apply the patch to the new document
      applyPatch(newDoc, patch);

      // Save the document 
      await this.mongo.db
        .collection('doc')
        .findOneAndUpdate(
          { _id: ObjectID(id) },
          { $set: newDoc },
          { session }
        );

    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  } else {
    newDoc = this.mongo.db
      .collection('doc')
      .findOne({ _id: ObjectID(id) });
  }

  // Creating reverse patch
  const patch = compare(doc, newDoc);

  if (patch.length) {
    // Updating the shadow document
    await this.mongo.db
      .collection('shadow')
      .findOneAndUpdate({ _id: ObjectID(sid) }, {
        $set: {
          updatedAt: new Date(),
          doc: newDoc,
          cv,
          sv: ++sv
        }
      });
  }

  return { patch, cv, sv: csv };
};
