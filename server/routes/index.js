const { request } = require("express");

const router = require('express').Router()
const user = require('./user')
const product = require('./product')

router.use('/', user)
router.use('/products', product)

module.exports = router