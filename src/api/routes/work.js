const route = require('express-promise-router')()
const WorkService = require('../../services/work')
const { NotFoundError } = require('../middleware/errors')
const { bodyValidator } = require('../middleware/validation')

// req is a bool that turns required fields on or off; used to generate a POST or PATCH schema
const WorkSchema = req => {
  return {
    type: 'object',
    properties: {
      name: {type: 'string'},
      composer: {type: 'string'},
      movements: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            order: {type: 'integer'},
            name: {type: 'string'}
          },
          required: ['order', 'name'],
          additionalProperties: false
        }
      },
      catalog: {
        type: 'object',
        properties: {
          name: {type: 'string'},
          no: {type: 'string'}
        },
        additionalProperties: false
      },
      info: { // TODO: redesign InfoSchema
        type: 'object',
        properties: {
          content: {type: 'string'}
        },
        required: ['content'],
        additionalProperties: false
      }
    },
    required: req ? ['name', 'composer', 'info'] : undefined,
    additionalProperties: false
  }
}

const PostSchema = WorkSchema(true)
const PatchSchema = WorkSchema(false)

module.exports = (router) => {
  router.use('/work', route)

  route.get('/:id', async (req, res) => {
    const id = req.params.id
    const work = await WorkService.findById(id)

    if (!work) throw new NotFoundError(`Work with id '${id}' does not exist.`)

    res.sendDocument(work)
  })

  route.post('/', bodyValidator(PostSchema), async (req, res) => {
    const work = await WorkService.create(req.body)

    res.sendDocument(work)
  })

  route.patch('/:id', bodyValidator(PatchSchema), async (req, res) => {
    const id = req.params.id
    const work = await WorkService.update(id, req.body)

    if (!work) throw new NotFoundError(`Work with id '${id}' does not exist.`)

    res.sendDocument(work)
  })

  route.delete('/:id', async (req, res) => {
    const id = req.params.id
    const work = await WorkService.delete(id)

    if (!work) throw new NotFoundError(`Work with id '${id}' does not exist.`)

    res.sendDocument(work)
  })
}