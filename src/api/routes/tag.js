const route = require('express-promise-router')()
const { ListSchema, TagSchema } = require('../schemas/tag')
const TagService = require('../../services/tag')
const { NotFoundError } = require('../middleware/errors')
const { bodyValidator, queryValidator } = require('../middleware/validation')
const { isAdmin } = require('../middleware/auth')

module.exports = (router) => {
  router.use('/tag', route)

  route.get('/', queryValidator(ListSchema), async (req, res) => {
    const {limit, start} = req.query

    const tags = await TagService.list({limit, skip: start})

    res.sendDocument(tags)
  })

  route.get('/:id', async (req, res) => {
    const id = req.params.id
    const tag = await TagService.findById(id)

    if (!tag) throw new NotFoundError(`Tag with id '${id}' does not exist.`)

    res.sendDocument(tag)
  })

  route.post('/', isAdmin, bodyValidator(TagSchema), async (req, res) => {
    const tag = await TagService.create(req.body)

    res.sendDocument(tag)
  })

  route.patch('/:id', isAdmin, bodyValidator(TagSchema), async (req, res) => {
    const id = req.params.id
    const tag = await TagService.update(id, req.body)

    if (!tag) throw new NotFoundError(`Tag with id ${id} does not exist.`)

    res.sendDocument(tag)
  })

  route.delete('/:id', isAdmin, async (req, res) => {
    const id = req.params.id
    const tag = await TagService.delete(id)

    if (!tag) throw new NotFoundError(`Tag with id '${id}' does not exist.`)

    res.sendDocument(tag)
  })
}