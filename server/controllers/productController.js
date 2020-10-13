const { Product } = require('../models')

class ProductController {
    static create(req, res, next) {
        const newProduct = {
            name: req.body.name,
            image_url: req.body.image_url,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category
        }
        Product.create(newProduct)
            .then(data => {
                return res.status(201).json(data)
            })
            .catch(err => {
                return next(err)
            })
    }

    static update(req, res, next) {
        const updateProduct = {
            name: req.body.name,
            image_url: req.body.image_url,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category
        }
        Product.update(updateProduct, {
                where: {
                    id: +req.params.id
                }
            })
            .then(result => {
                res.status(201).json(result[1][0])
            })
            .catch(err => {
                return next(err)
            })
    }

    static delete(req, res, next) {
        Product.destroy({
                where: {
                    id: +req.params.id
                }
            })
            .then(result => {
                res.status(200).json({ message: 'Product is sucessfully deleted' })
            })
            .catch(err => {
                return next(err)
            })
    }
}

module.exports = ProductController