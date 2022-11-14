const express = require('express')
const product = require('./routes/product.route')
const { sequelize } = require('./models')

const app = express()
const port = 3000

app.start = () => {
    app.listen(port, async () => {
        await sequelize.sync({ force: true })
        console.log(`Mysql Connected...`)
        console.log(`Running on http://localhost:${port}`)
    })
}

app.use(express.json())
app.use('/api/product', product)
app.use((error, req, res, next) => {
    res.status(500).json({ message: error.message })
})

module.exports = app
