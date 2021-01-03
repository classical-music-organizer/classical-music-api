const route = require('express-promise-router')()
const { PostSchema, PatchSchema } = require('../schemas/composer')
const ComposerService = require('../../services/composer')
const { NotFoundError } = require('../middleware/errors')
const { bodyValidator } = require('../middleware/validation')

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