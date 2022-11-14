const controller = require('../../controllers/product.controller')
const {
    sequelize: { models },
} = require('../../models')

const http = require('node-mocks-http')
const newProduct = require('../data/new_product.json')

// 실제 데이터가 저장되면 안되기때문에 mock 함수활용
models.Product.create = jest.fn()
let req,
    res,
    next = null
beforeEach(() => {
    req = http.createRequest()
    res = http.createResponse()
    next = jest.fn()
})

describe('Product Controller Create ', () => {
    it('create 함수를 가지고있는가?', () => {
        expect(typeof controller.create).toBe('function')
    })

    it('controller create 실행시, model.create가 실행되는가?', async () => {
        req.body = newProduct
        await controller.create(req, res, next)
        expect(models.Product.create).toBeCalled()
        expect(models.Product.create).toBeCalledWith(newProduct)
    })

    it('응답이 정확히 잘도착하는가?', async () => {
        await controller.create(req, res, next)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
    })

    it('응답 데이터가 정확한가.', async () => {
        models.Product.create.mockReturnValue(newProduct)
        await controller.create(req, res, next)
        expect(res._getJSONData()).toStrictEqual(newProduct)
    })

    it('controller.create 가 예외처리가 되었는가?', async () => {
        const errorMessage = { message: 'description property missing' }
        const reject = Promise.reject(errorMessage)
        models.Product.create.mockReturnValue(reject)
        await controller.create(req, res, next)
        expect(next).toBeCalledWith(errorMessage)
    })
})
