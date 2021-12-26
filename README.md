# learn-diff-sync-js
A simple implementation of Differential Synchronization with JSON Patch over HTTP

## How to navigate this project?
1. The first file you should be looking at is the `server.js`. This is the entry
point to the application.
2. The `server.js` start running the instance of application that was created by
the `build` function exposed by `app.js`
3. The `app.js` is the module is used for create an instance of the application
that can be run or tested. The `build` function also registers the routes as plugins
4. Finally define the different handlers for different endpoints in the `routes.js`
file.