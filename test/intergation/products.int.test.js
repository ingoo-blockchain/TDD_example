const request = require('supertest')
const app = require('../../server.js') // app 내용을 가져오기 위해서 server.js 파일 아래에 module.exports = app 내용넣기
const { sequelize } = require('../../models')
const newProduct = require('../data/new_product.json')

beforeAll(async () => {
    await sequelize.sync({ force: true })
})

it('POST /api/product/create', async () => {
    const response = await request(app).post('/api/product/create').set('Content-type', 'application/json').send(newProduct)
    expect(response.statusCode).toBe(201)
    expect(response.body.name).toBe(newProduct.name)
    expect(response.body.description).toBe(newProduct.description)
})

it('POST /api/product/create response Status 500', async () => {
    const response = await request(app).post('/api/product/create').set('Content-type', 'application/json').send({
        name: 'ingoo',
    })

    expect(response.statusCode).toBe(500)
    expect(response.body).toStrictEqual({ message: 'notNull Violation: Product.description cannot be null' })
})
