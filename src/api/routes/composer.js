const route = require('express-promise-router')()
const ComposerService = require('../../services/composer')
const { NotFoundError } = require('../middleware/errors')
const { bodyValidator } = require('../middleware/validation')

// req is a bool that turns required fields on or off; used to generate a POST or PATCH schema
const ComposerSchema = req => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'object',
        properties: {
          title: {type: 'string'},
          first: {type: 'string'},
          last: {type: 'string'},
          middle: {type: 'string'},
          suffix: {type: 'string'},
          nick: {type: 'string'}
        },
        required: req ? ['first', 'last'] : undefined,
        additionalProperties: false
      }
    },
    required: req ? ['name'] : undefined,
    additionalProperties: false
  }
}

const PostSchema = ComposerSchema(true)
const PatchSchema = ComposerSchema(false)

module.exports = (router) => {
  router.use('/composer', route)

  route.get('/:id', async (req, res) => {
    const id = req.params.id
    const composer = await ComposerService.findById(id)

    if (!composer) throw new NotFoundError(`Composer with id '${id}' does not exist.`)

    res.sendDocument(composer)
  })

  route.post('/', bodyValidator(PostSchema), async (req, res) => {
    const composer = await ComposerService.create(req.body)

    res.sendDocument(composer)
  })

  route.patch('/:id', bodyValidator(PatchSchema), async (req, res) => {
    const id = req.params.id
    const composer = await ComposerService.update(id, req.body)

    if (!composer) throw new NotFoundError(`Composer with id ${id} does not exist.`)

    res.sendDocument(composer)
  })

  route.delete('/:id', async (req, res) => {
    const id = req.params.id
    const composer = await ComposerService.delete(id)

    if (!composer) throw new NotFoundError(`Composer with id '${id}' does not exist.`)

    res.sendDocument(composer)
  })
}