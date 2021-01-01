const { Router } = require('express');
const route = Router();

const ComposerService = require('../../services/composer')

module.exports = (router) => {
  router.use('/composer', route);

  route.get('/:id', async (req, res) => {
    const composer = await ComposerService.findById(req.params.id)

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