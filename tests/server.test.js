const { expect } = require("@jest/globals")
const app = require('../src/app')();

test('GET /', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  expect(response.statusCode).toBe(200);
})