const route = require('express-promise-router')()
const { ListSchema, RetrieveSchema, PostSchema, PatchSchema } = require('../schemas/composer')
const ComposerService = require('../../services/composer')
const { NotFoundError } = require('../middleware/errors')
const { bodyValidator, queryValidator } = require('../middleware/validation')
const { isAdmin } = require('../middleware/auth')

module.exports = (router) => {
  router.use('/composer', route)

  route.get('/', queryValidator(ListSchema), async (req, res) => {
    const {search, limit, start} = req.query

    const composers = await ComposerService.list({search, limit, skip: start})

    res.sendDocument(composers)
  })

  route.get('/:id', queryValidator(RetrieveSchema), async (req, res) => {
    const { populateTags } = req.query

    const id = req.params.id
    const composer = await ComposerService.findById(id, { populateTagComposers: populateTags })

    if (!composer) throw new NotFoundError(`Composer with id '${id}' does not exist.`)

    res.sendDocument(composer)
  })

  route.post('/', isAdmin, bodyValidator(PostSchema), async (req, res) => {
    const composer = await ComposerService.create(req.body)

    res.sendDocument(composer)
  })

  route.patch('/:id', isAdmin, bodyValidator(PatchSchema), async (req, res) => {
    const id = req.params.id
    const composer = await ComposerService.update(id, req.body)

    if (!composer) throw new NotFoundError(`Composer with id ${id} does not exist.`)

    res.sendDocument(composer)
  })

  route.delete('/:id', isAdmin, async (req, res) => {
    const id = req.params.id
    const composer = await ComposerService.delete(id)

    if (!composer) throw new NotFoundError(`Composer with id '${id}' does not exist.`)

    res.sendDocument(composer)
  })
}