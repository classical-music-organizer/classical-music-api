const app = require('../../src/app')
const request = require('supertest')(app)
const {ajv, toObjectResponseSchema, toDeleteResponseSchema, ComposerSchema} = require('../helpers/schema')

// the response schema includes more than just the Composer object, such as an 'object' prop
const ComposerResponseSchema = toObjectResponseSchema(ComposerSchema);

// Composer response validators
const validCompRes = ajv.compile(ComposerResponseSchema)
const validCompDelRes = ajv.compile(toDeleteResponseSchema(ComposerResponseSchema))

describe('Composer Endpoints', () => {
  let composerId;

  afterAll(done => {
    // Closing the server allows Jest to exit successfully.
    app.close()
    done()
  })

  it('POST /composer should return the new composer', async () => {
    const composer = {
      name: {
        first: 'Johann',
        middle: 'Sebastian',
        last: 'Bach',
        nick: 'Bach'
      }
    }

    const res = await request.post('/composer').send(composer);

    expect(res.statusCode).toEqual(200)
    expect(validCompRes(res.body)).toBeTruthy()
    expect(res.body.object).toEqual('composer')

    // share the composer ID with the following tests
    composerId = res.body.id;
  })

  it('GET /composer/:id should return a composer', async () => {
    const res = await request.get(`/composer/${composerId}`);

    expect(res.statusCode).toEqual(200)
    expect(validCompRes(res.body)).toBeTruthy()
    expect(res.body.object).toEqual('composer')
    expect(res.body.id == composerId)
  })

  it('PATCH /composer/:id should update a composer', async () => {
    const patch = {
      name: {
        title: 'Mr.',
        first: 'Jean'
      }
    }

    const res = await request.patch(`/composer/${composerId}`).send(patch);

    expect(res.statusCode).toEqual(200)
    expect(validCompRes(res.body)).toBeTruthy()
    expect(res.body.object).toEqual('composer')
    expect(res.body.id).toEqual(composerId)
  })

  it('DELETE /composer/:id should delete a composer', async () => {
    const res = await request.delete(`/composer/${composerId}`);

    expect(res.statusCode).toEqual(200)
    expect(validCompDelRes(res.body)).toBeTruthy()
    expect(res.body.object).toEqual('composer')
    expect(res.body.id == id)
    expect(res.body.deleted).toEqual(true)
  })

  // TODO: create/update/delete require authentication
})