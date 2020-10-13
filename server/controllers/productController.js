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

    static async update(req, res, next) {
        try {
            const id = req.params.id
            const { name, image_url, price, stock, category } = req.body
            const data = await Product.update({
                name,
                image_url,
                price,
                stock,
                category
            }, {
                where: {
                    id
                },
                returning: true
            })
            if (data) {
                res.status(200).json(data[1])
            }

        } catch (err) {
            next(err)
        }
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