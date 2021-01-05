const route = require('express-promise-router')()
const { ListSchema, PostSchema, PatchSchema } = require('../schemas/performer')
const PerformerService = require('../../services/performer')
const { NotFoundError } = require('../middleware/errors')
const { bodyValidator, queryValidator } = require('../middleware/validation')
const { isAdmin } = require('../middleware/auth')

module.exports = (router) => {
  router.use('/performer', route)

  route.get('/', queryValidator(ListSchema), async (req, res) => {
    const {limit, start} = req.query

    const components = await PerformerService.list({limit, skip: start})

    res.sendDocument(components)
  })

  route.get('/:id', async (req, res) => {
    const id = req.params.id
    const performer = await PerformerService.findById(id)

    if (!performer) throw new NotFoundError(`Performer with id '${id}' does not exist.`)

    res.sendDocument(performer)
  })

  route.post('/', isAdmin, bodyValidator(PostSchema), async (req, res) => {
    const performer = await PerformerService.create(req.body)

    res.sendDocument(performer)
  })

  route.patch('/:id', isAdmin, bodyValidator(PatchSchema), async (req, res) => {
    const id = req.params.id
    const performer = await PerformerService.update(id, req.body)

    if (!performer) throw new NotFoundError(`Performer with id ${id} does not exist.`)

    res.sendDocument(performer)
  })

  route.delete('/:id', isAdmin, async (req, res) => {
    const id = req.params.id
    const performer = await PerformerService.delete(id)

    if (!performer) throw new NotFoundError(`Performer with id '${id}' does not exist.`)

    res.sendDocument(performer)
  })
}