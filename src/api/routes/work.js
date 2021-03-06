const route = require('express-promise-router')()
const { ListSchema, RetrieveSchema, PostSchema, PatchSchema } = require('../schemas/work')
const WorkService = require('../../services/work')
const { NotFoundError } = require('../middleware/errors')
const { bodyValidator, queryValidator } = require('../middleware/validation')
const { isAdmin } = require('../middleware/auth')

module.exports = (router) => {
  router.use('/work', route)

  route.get('/', queryValidator(ListSchema), async (req, res) => {
    const {composer, limit, start, search} = req.query

    const works = await WorkService.list({composer, limit, skip: start, search})

    res.sendDocument(works)
  })

  route.get('/:id', queryValidator(RetrieveSchema), async (req, res) => {
    const { populateTags } = req.query

    const id = req.params.id
    const work = await WorkService.findById(id, {populateTagWorks: populateTags})

    if (!work) throw new NotFoundError(`Work with id '${id}' does not exist.`)

    res.sendDocument(work)
  })

  route.post('/', isAdmin, bodyValidator(PostSchema), async (req, res) => {
    const work = await WorkService.create(req.body)

    res.sendDocument(work)
  })

  route.patch('/:id', isAdmin, bodyValidator(PatchSchema), async (req, res) => {
    const id = req.params.id
    const work = await WorkService.update(id, req.body)

    if (!work) throw new NotFoundError(`Work with id '${id}' does not exist.`)

    res.sendDocument(work)
  })

  route.delete('/:id', isAdmin, async (req, res) => {
    const id = req.params.id
    const work = await WorkService.delete(id)

    if (!work) throw new NotFoundError(`Work with id '${id}' does not exist.`)

    res.sendDocument(work)
  })
}