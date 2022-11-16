const request = require('supertest')
const app = require('../../server.js') // app 내용을 가져오기 위해서 server.js 파일 아래에 module.exports = app 내용넣기
const { sequelize } = require('../../models')
const newProduct = require('../data/new_product.json')
const updateProduct = require('../data/update_product.json')
delete updateProduct.id

let product = null
beforeAll(async () => {
    await sequelize.sync({ force: true })
})

it('POST /api/product/create', async () => {
    const response = await request(app).post('/api/product').set('Content-type', 'application/json').send(newProduct)
    expect(response.statusCode).toBe(201)
    expect(response.body.name).toBe(newProduct.name)
    expect(response.body.description).toBe(newProduct.description)
})

it('POST /api/product/create response Status 500', async () => {
    const response = await request(app).post('/api/product').set('Content-type', 'application/json').send({
        name: 'ingoo',
    })

    expect(response.statusCode).toBe(500)
    expect(response.body).toStrictEqual({ message: 'notNull Violation: Product.description cannot be null' })
})

it('GET /api/product/', async () => {
    const response = await request(app).get('/api/product/').set('Content-type', 'application/json').send()
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body[0].name).toBeDefined()
    expect(response.body[0].description).toBeDefined()
    product = response.body[0]
})

it('GET /api/product/:productId', async () => {
    const response = await request(app).get(`/api/product/${product.id}`).set('Content-type', 'application/json').send()
    const { name, description, price } = response.body
    expect(response.statusCode).toBe(200)
    expect(name).toBe(product.name)
    expect(description).toBe(product.description)
    expect(price).toBe(product.price)
})

it('GET /api/product/:productId 데이터가 없을경우', async () => {
    const response = await request(app).get(`/api/product/111`).set('Content-type', 'application/json').send()
    expect(response.statusCode).toBe(404)
})

it('PUT /api/product/:productId', async () => {
    console.log({ ...updateProduct })
    const response = await request(app)
        .put(`/api/product/${product.id}`)
        .set('Content-type', 'application/json')
        .send({
            ...updateProduct,
        })
    const [result] = response.body
    expect(response.statusCode).toBe(200)
    expect(result).toBe(1)
})

it('PUT /api/product/:prudctId 가 없을경우', async () => {
    const response = await request(app).get(`/api/product/111`).set('Content-type', 'application/json').send()
    expect(response.statusCode).toBe(404)
})

it('DELETE /api/product', async () => {
    const response = await request(app).delete(`/api/product/${product.id}`).set('Content-type', 'application/json').send()
    const result = response.body
    expect(response.statusCode).toBe(200)
    expect(result).toBe(1)
})
