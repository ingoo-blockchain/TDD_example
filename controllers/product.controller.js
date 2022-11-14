const {
    sequelize: { models },
} = require('../models/')

exports.create = async (req, res, next) => {
    try {
        const response = await models.Product.create(req.body)
        res.status(201).json(response)
    } catch (e) {
        next(e)
    }
}

exports.update = (req, res) => {
    res.send('Update')
}

exports.read = (req, res) => {
    res.send('Read')
}

exports.delete = (req, res) => {
    res.send('delete')
}
