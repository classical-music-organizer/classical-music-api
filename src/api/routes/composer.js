const { Router } = require('express');
const route = Router();

module.exports = (router) => {
  router.use('/composer', route);

  route.get('/:id', (req, res) => {
    
  });

  route.post('/', (req, res) => {

  })

  route.patch('/:id', (req, res) => {

  })

  route.delete('/:id', (req, res) => {

  });
};