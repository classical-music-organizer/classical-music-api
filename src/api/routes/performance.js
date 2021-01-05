const route = require('express-promise-router')()
const { ListSchema, PostSchema, PatchSchema } = require('../schemas/performance')
const PerformanceService = require('../../services/performance')
const { NotFoundError } = require('../middleware/errors')
const { bodyValidator, queryValidator } = require('../middleware/validation')
const { isAdmin } = require('../middleware/auth')

module.exports = (router) => {
  router.use('/performance', route)

  route.get('/', queryValidator(ListSchema), async (req, res) => {
    const {limit, start} = req.query

    const performances = await PerformanceService.list({limit, skip: start})

    res.sendDocument(performances)
  })

  route.get('/:id', async (req, res) => {
    const id = req.params.id
    const performance = await PerformanceService.findById(id)

    if (!performance) throw new NotFoundError(`Performance with id '${id}' does not exist.`)

    res.sendDocument(performance)
  })

  route.post('/', isAdmin, bodyValidator(PostSchema), async (req, res) => {
    const performance = await PerformanceService.create(req.body)

    res.sendDocument(performance)
  })

  route.patch('/:id', isAdmin, bodyValidator(PatchSchema), async (req, res) => {
    const id = req.params.id
    const performance = await PerformanceService.update(id, req.body)

    if (!performance) throw new NotFoundError(`Performance with id ${id} does not exist.`)

    res.sendDocument(performance)
  })

  route.delete('/:id', isAdmin, async (req, res) => {
    const id = req.params.id
    const performance = await PerformanceService.delete(id)

    if (!performance) throw new NotFoundError(`Performance with id '${id}' does not exist.`)

    res.sendDocument(performance)
  })
}