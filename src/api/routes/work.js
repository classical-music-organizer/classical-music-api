const route = require('express-promise-router')()
const { PostSchema, PatchSchema } = require('../schemas/work')
const WorkService = require('../../services/work')
const { NotFoundError } = require('../middleware/errors')
const { bodyValidator } = require('../middleware/validation')

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