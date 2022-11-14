const express = require('express')
const router = express.Router()
const controller = require('../controllers/product.controller')

router.post('/create', controller.create)
router.get('/read', controller.read)
router.get('/update', controller.update)
router.get('/delete', controller.delete)

module.exports = router
