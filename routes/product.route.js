const express = require('express')
const router = express.Router()
const controller = require('../controllers/product.controller')

router.get('/', controller.getProducts)
router.post('/', controller.create)
router.get('/:id', controller.getProductById)
router.put('/:id', controller.updateProduct)
router.delete('/:id', controller.deleteProduct)

module.exports = router
