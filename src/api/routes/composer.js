const route = require('express-promise-router')()

const ComposerService = require('../../services/composer')

const { NotFoundError } = require('../middleware/errors')

module.exports = (router) => {
  router.use('/composer', route);

  route.get('/:id', async (req, res) => {
    const id = req.params.id
    const composer = await ComposerService.findById(id)

    if (!composer) throw new NotFoundError(`Composer with id '${id}' does not exist.`)

    res.sendDocument(composer)
  });

  route.post('/', async (req, res) => {
    const composer = await ComposerService.create(req.body)

    res.sendDocument(composer)
  })

  route.patch('/:id', async (req, res) => {
    const composer = await ComposerService.update(req.params.id, req.body)

    res.sendDocument(composer)
  })

  route.delete('/:id', async (req, res) => {
    const composer = await ComposerService.delete(req.params.id)

    res.sendDocument(composer)
  });
};