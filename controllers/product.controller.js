const {
    sequelize: {
        models: { Product },
    },
} = require('../models/')

exports.create = async (req, res, next) => {
    try {
        const response = await Product.create(req.body)
        res.status(201).json(response)
    } catch (e) {
        next(e)
    }
}

exports.getProducts = async (req, res, next) => {
    try {
        const response = await Product.findAll({})
        res.status(200).json(response)
    } catch (e) {
        next(e)
    }
}

exports.getProductById = async (req, res, next) => {
    try {
        const where = { ...req.params }
        const response = await Product.findOne({ where })

        const statusCode = response ? 200 : 404
        res.status(statusCode).json(response)
    } catch (e) {
        next(e)
    }
}

exports.updateProduct = async (req, res, next) => {
    try {
        const data = { ...req.body }
        const where = { ...req.params }
        const response = await Product.update(data, { where })
        const statusCode = response ? 200 : 404
        res.status(statusCode).json(response)
    } catch (e) {
        next(e)
    }
}

exports.deleteProduct = async (req, res, next) => {
    try {
        const where = { ...req.params }
        console.log({ where })
        const response = await Product.destroy({ where })

        const statusCode = response ? 200 : 404
        res.status(statusCode).json(response)
    } catch (e) {
        next(e)
    }
}
