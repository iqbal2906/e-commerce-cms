const router = require('express').Router()
const ProductController = require('../controllers/productController')
const Authentication = require('../middlewares/auth')

router.use(Authentication)
router.post('/', ProductController.create)
router.put('/:id', ProductController.update)
router.delete('/:id', ProductController.delete)

module.exports = router