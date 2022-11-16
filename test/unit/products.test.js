const controller = require('../../controllers/product.controller')
const {
    sequelize: {
        models: { Product },
    },
} = require('../../models')

const http = require('node-mocks-http')
const newProduct = require('../data/new_product.json')
const allProducts = require('../data/all_products.json')
const updateProduct = require('../data/update_product.json')

const productId = 1

// 실제 데이터가 저장되면 안되기때문에 mock 함수활용
Product.create = jest.fn()
Product.findAll = jest.fn()
Product.findOne = jest.fn()
Product.update = jest.fn()
Product.destroy = jest.fn()
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
        expect(Product.create).toBeCalled()
        expect(Product.create).toBeCalledWith(newProduct)
    })

    it('응답이 정확히 잘도착하는가?', async () => {
        await controller.create(req, res, next)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
    })

    it('응답 데이터가 정확한가.', async () => {
        Product.create.mockReturnValue(newProduct)
        await controller.create(req, res, next)
        expect(res._getJSONData()).toStrictEqual(newProduct)
    })

    it('controller.create 가 예외처리가 되었는가?', async () => {
        const errorMessage = { message: 'description property missing' }
        const reject = Promise.reject(errorMessage)
        Product.create.mockReturnValue(reject)
        await controller.create(req, res, next)
        expect(next).toBeCalledWith(errorMessage)
    })
})

describe('Product Controller get', () => {
    it('getProducts 함수를 잘가지고있는가?', () => {
        expect(typeof controller.getProducts).toBe('function')
    })

    it('controller getProducts 실행시, model.findAll가 실행되는가?', async () => {
        await controller.getProducts(req, res, next)
        expect(Product.findAll).toHaveBeenCalledWith({})
    })
    it('응답코드가 200 정확히 잘도착하는가?', async () => {
        await controller.getProducts(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled).toBeTruthy()
    })

    it('응답 데이터가 정확한가.', async () => {
        Product.findAll.mockReturnValue(allProducts)
        await controller.getProducts(req, res, next)
        expect(res._getJSONData()).toStrictEqual(allProducts)
    })

    it('controller.getProducts 가 예외처리가 되었는가?', async () => {
        const errorMessage = { message: 'Error finding product data' }
        const reject = Promise.reject(errorMessage)
        Product.findAll.mockReturnValue(reject)
        await controller.getProducts(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
})

describe('Product Controller getById', () => {
    it('getProductById는 함수인가', () => {
        expect(typeof controller.getProductById).toBe('function')
    })

    it('controller.findOne() 실행이 잘되는가?', async () => {
        req.params.id = productId
        await controller.getProductById(req, res, next)
        expect(Product.findOne).toBeCalledWith({
            where: {
                id: productId,
            },
        })
    })

    it('getProductById() 응답내용 과 응답코드 확인하기', async () => {
        Product.findOne.mockReturnValue(newProduct)
        await controller.getProductById(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(newProduct)
        expect(res._isEndCalled()).toBeTruthy()
    })

    it('getProductById() 응답실패 (데이터베이스 없는경우) 확인', async () => {
        Product.findOne.mockReturnValue(null)
        await controller.getProductById(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })

    it('getProductById() error가 났을경우', async () => {
        const errorMessage = { message: 'error' }
        const rejected = Promise.reject(errorMessage)
        Product.findOne.mockReturnValue(rejected)
        await controller.getProductById(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
})

describe('Product Controller update', () => {
    it('productUpdate 함수가 존재하는가', () => {
        expect(typeof controller.updateProduct).toBe('function')
    })

    it('product.update 함수가 잘 작동하는가?', async () => {
        req.body = updateProduct
        req.params = { id: 1 }
        await controller.updateProduct(req, res, next)
        const data = { ...req.body }
        const where = { ...req.params }
        expect(Product.update).toBeCalledWith(data, { where })
    })

    it('product.update 응답코드와 응답내용 확인', async () => {
        Product.update.mockReturnValue(1)
        await controller.updateProduct(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
    })

    it('product.update 해당 아이디가 없을경우', async () => {
        Product.update.mockReturnValue(null)
        await controller.updateProduct(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled).toBeTruthy()
    })

    it('product.update 에러가 났을경우', async () => {
        const errorMessage = { error: 'error' }
        const rejected = Promise.reject(errorMessage)
        Product.update.mockReturnValue(rejected)
        await controller.updateProduct(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
})

describe('Product Controller Delete', () => {
    it('should have a deleteProduct function', () => {
        expect(typeof controller.deleteProduct).toBe('function')
    })

    it('should call product.destory ', async () => {
        req.params = { id: 1 }
        const where = { ...req.params }
        await controller.deleteProduct(req, res, next)
        expect(Product.destroy).toBeCalledWith({ where })
    })

    it('should return 200 response', async () => {
        const deleteProduct = {
            id: 1,
        }
        Product.destroy.mockReturnValue(deleteProduct)
        await controller.deleteProduct(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(deleteProduct)
        expect(res._isEndCalled()).toBeTruthy()
    })

    it('should handle 404 when item doen`t exist', async () => {
        Product.destory.mockReturnValue(null)
        await controller.deleteProduct(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })

    it('should handle errors', async () => {
        const errorMessage = { error: 'Error deleting' }
        const rejected = Promise.reject(errorMessage)
        Product.destroy.mockReturnValue(rejected)
        await controller.deleteProduct(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
})
