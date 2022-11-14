# TDD (Test Driven Development)



## 1. TDD 웹 개발



1. 단위 테스트 (unit test) 작성
2. C, R, U, D 부분 코드 작성
3. 통합테스트 (integration test) 작성



흐름으로 진행됨.



기본적으로 

Express 사용과, Mysql 을 사용할수있다는 전재하에 시작함.



간단한 Application 을 만들도록함.



## 1. 1 라이브러리 설치.

```sh
npm init
npm install express mongoose
npm install -D jest supertest node-mocks-http
```





## 1.2 server.js 만들기

```javascript
const express = require('express')
const app = express()
const port = 3000

app.use(express.json())
app.get('/', (req,res,next)=>{
  res.send('hello world!')
})

app.listen(port,()=>{
  console.log(`Running on http://localhost:${port}`)
})
```





## 1.3 Router 나누기 



**./routes/product.route.js**

```javascript
const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.controller");

router.get("/create", controller.create);
router.get("/read", controller.read);
router.get("/update", controller.update);
router.get("/delete", controller.delete);

module.exports = router;

```



**./controller/product.controller.js**

```javascript
exports.create = (req, res) => {
  res.send("Create");
};

exports.update = (req, res) => {
  res.send("Update");
};

exports.read = (req, res) => {
  res.send("Read");
};

exports.delete = (req, res) => {
  res.send("delete");
};

```





**server.js**

```javascript
const express = require("express");
const product = require("./routes/product.route");
const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/product", product);

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});

```





## 1.4 mysql 설정



```sh
npm install mysql2 sequelize
```



**cli는 글로벌로 설치하자.**

```sh
npm install -g sequelize-cli
```



**sequelize 기본설정 실행하기**

```javascript
sequelize init
```



실행이후 디렉토리가 생성된것을 확인 할 수 있다.

```
|-- config
|   -- config.json
|-- migrations     
|-- models
|   -- index.js   
|-- seeders 
```



- **config** : 데이터베이스 설정 파일, 사용자 이름, DB 이름, 비밀번호 등의 정보 들어있다.
- **migrations** : git과 비슷하게, 데이터베이스 변화하는 과정들을 추적해나가는 정보로, 실제 데이터베이스에 반영할 수도 있고 변화를 취소할 수도 있다.
- **models** : 데이터베이스 각 테이블의 정보 및 필드타입을 정의하고 하나의 객체로 모은다.
- **seeders** : 테이블에 기본 데이터를 넣고 싶은 경우에 사용한다.



먼저 config 부터 설정해야합니다.



**./config/config.json**

```json
{
  "development": {
    "username": "root",
    "password": "root",
    "database": "tdd_app", 
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```



데이터베이스는 직접 생성해줘야하므로.

```sh
mysql -uroot -p[해당패스워드]
create database tdd_app;
```



**모델 생성하기**



Sequelize_cli 를 사용하면 쉽게 모델을 생성할수있습니다.

```sh
sequelize model:generate --name Product --attributes name:string,description:string,price:integer
```



이후



`models` 디렉토리에 파일 생성된것과 

`migration` 디렉토리에 파일 생성된것을 확인하자.



**실행하기**

```sh
sequelize db:migrate
```



이러면 기본 설정이 끝났습니다.





TDD 설정에 들어가겠습니다.



## 2. 단위테스트 작성



### 2. 1 단위(Unit) 테스트란 ?



단위 테스트는 개발자가 수행하고 자신이 개발 한 코드 단위 (일명 모듈, 구성요소)

를 테스트합니다. 소스 코드의 `개별 단위`를 테스트하여 사용할 준비가 되었는지 확인 하는 테스트 방법입니다.

개발 라이프 사이클의 초기 단계에서 버그가 식별되므로 버그 수정 비용을 줄이는 데 도움이 됩니다. 간단하게 생각하면 메소드를 테스트하는 또 다른 메서드라고 생각하면 됩니다.





## 2. 2 단위(Unit) 테스트의 조건



1. 독립적이야 하며, 어떤 테스트도 다른 테스트에 의존하지 않아야합니다.
2. 격리 되어야합니다. Ajax, Axios. LocalStorage등 테스트 대상이 의존하는 것을 다른 것으로 대체해야 합니다.



### 2. 3 왜 단위(Unit) 테스트를 하나요?



1. 첫번째는 프로그램이 크고 메모리가 많이들고, 다른 리소스( 데이터베이스)가 필요한 경우 로컬 환경에서 쉽게 코드를 실행시켜보기 어렵기때문이다. 이런 프로그램을 개발하는 개발자들은 유닛테스트를 만들어서 빠르게 자신의 코드가 정상적으로 작동하는지 확인 할 수 있다.
2. 종속성 있는 다른 클래스에서 버그가 나는것을 방지하기 위해서 입니다.



## 3. Jest



### 3.1 Jest 란 무엇



Facebook에 의해서 만들어진 테스팅 프레임워크입니다.

최소한의 설정으로 동작하며 Test Case 를 만들어서 어플리케이션 코드가 잘 돌아가는지 확인해줍니다.  단위 (Unit) 테스트를 위해서이용합니다.



### 3.2 Jest 시작하기



**1. Jest 라이브러리 설치**

기존에 설치가 되어있다면 생략해두됩니다.

`package.json` 를 확인해주세요.



```sh
npm install jest
```



**2. Package.json 에서 스크립트 수정하기**



```sh
"scripts":{
	"test":"test" # 또는 "jest --watchAll"
}
```



**3. 테스트 작성할 폴더 및 파일 기본 구조 생성**



Jest가 Test 파일을 찾는방법은 총 3가지입니다.

1. [filename].test.js 
2. [filename].spec.js
3. `tests` 디렉토리에 있는 파일들



이번에 만들 디렉토리구조는

```
| -- test
| 	-- integration
|			-- products.int.test.js
|		-- unit
|			-- products.test.js
```



로 만들 예정입니다.



**jest.config.js**

```javascript
module.exports = {
    testEnvironments: 'node',
}

```







### 3.3 Jest 문법 



이번엔 Jest 문법 구조를 살펴보도록 하겠습니다.



**예시 파일입니다.**

```javascript
describe('Product Controller Create', ()=>{
  beforEach(()=>{
    // codeblock..
  })
  
  it('should all product.create', ()=>{
    // codeblock..
  })
})
```



코드블럭을 살펴보자면.

- describe 

   - it...

   - it...

   - it...

​	

describe 안에. it 이 여러게 있습니다.



**describe 문법**

```js
describe('테스트할 이름', callback)
```



여러 관련 테스트를 그룹화 하는 내용



**it(test) 문법**

```js
it('테스트할 단위',callback, timeout)
```



개별 테스트를 수행하는 곳 각 테스트를 작은 문장처럼 설명함.

it만 개별적으로 사용은 가능하지만. 대부분

describe 안에서 작성함.



> ex) User 테이블안에 Signup, Login 테스를 진행한다하면
>
> describe 는 User 를 시작하겠다 하고.
>
> it을 통해 signup, login 를 테스트를 진행함



**sample code..**

```javascript
describe('User Controller', ()=>{
	it('should call singup', ()=>{
	
	})
	
	it('should all login', ()=>{
	
	})
})
```



이후 `it` 또는 `test` 안에서는

expect 와 matcher 라는 것이 존재함.



#### expect



expect 함수는 값을 테스트할 때마다 사용됩니다. 

> it 함수의 콜백함수 안에서 작성함.



그리고 expect 함수는 혼자서는 거의 사용되지않으며 꼭 matcher와 함께 사용합니다.



#### matcher



다른 방법으로 값을 테스트 하도록 `matcher` 를 사용하빈다.





**example**

```javascript
it('two plus two is four', ()=>{
  expect(2+2).toBe(4) 
})
```



이후 실행은

`npm run test` 로 실행해봅시다.





### 3.4 Jest.fn() 함수 알아보기



```javascript
const mockFn = jest.fn()
```



```javascript
mockFn('hello')
mockFn()

expect(mockFn).toBeCalledWith('hello') // 누굴가지고 실행했는가?
expect(mockFn).toBeCalledTimes(2) // 몇번실행됬는가?
```



```javascript
describe('계산기', () => {
    const mockFn = jest.fn()
    it('mock 함수 테스트', () => {
        mockFn('hello')
        mockFn()

        expect(mockFn).toBeCalledWith('hello') // 누굴가지고 실행했는가?
        expect(mockFn).toBeCalledTimes(2) // 몇번실행됬는가?
    })
})

```





## [Jest] Create 부분 단위테스트 만들어보기



1. 작업할 것을 생각합니다. Products 생성을 먼저 만들어 보도록하죠
2. 그다음에 본코드를 작성하는 것이아니라 `test` 코드를 먼저 작성합니다.
3. 테스트 코드에 대응하는 실제 코드를 작성



```javascript
const controller = require('../../controllers/product.controller')

describe('Product Controller Create ', () => {
    it('create 함수를 가지고있는가?', () => {
        expect(typeof controller.create).toBe('function')
    })
})

```



중요한건 실제코드 작성보다 test 코드가 먼저가 중요합니다 !



다음은 `controller.create` 함수가 호출시 `models 안에있는 create method` 가실행되는지 테스트 해보도록 하겠습니다.



```javascript
it('controller create 실행시, model.create가 실행되는가?', () => {
        controller.create()
        expect(model.create()).toBeCalled()
    })
```



당연히  에러가 날겁니다.

```sh
FAIL  test/unit/products.test.js
  Product Controller Create 
    ✓ create 함수를 가지고있는가? (1 ms)
    ✕ controller create 실행시, model.create가 실행되는가? (1 ms)

  ● Product Controller Create  › controller create 실행시, model.create가 실행되는가?

    TypeError: Cannot read property 'send' of undefined

      1 | exports.create = (req, res) => {
    > 2 |   res.send("Create");
        |       ^
      3 | };
      4 |
      5 | exports.update = (req, res) => {

      at Object.send [as create] (controllers/product.controller.js:2:7)
      at Object.create (test/unit/products.test.js:9:20)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
Snapshots:   0 total
Time:        0.392 s, estimated 1 s
```



저희는 모델도 가져오지 않았으며 구현도 하지않았거든요



이제부터 하나씩 맞춰갑니다.

모델부터 가져오죠



```javascript
const controller = require('../../controllers/product.controller')
const {
    sequelize: { models },
} = require('../../models')
// 실제 데이터가 저장되면 안되기때문에 mock 함수활용

models.Product.create = jest.fn() // mock 함수로 변경

describe('Product Controller Create ', () => {
    it('create 함수를 가지고있는가?', () => {
        expect(typeof controller.create).toBe('function')
    })

    it('controller create 실행시, model.create가 실행되는가?', () => {
    		// controller.create 실행시
        // models.Product.create 가 실행되는지 체크.
        controller.create() 
        expect(models.Product.create).toBeCalled()
    })
})

```



이번에는 http 요청을 보낸것처럼. 실행을 해보도록 하겠습니다.

http 요청을 보낸것처럼 테스트를 진행하려면 라이브러리가 필요합니다.



**Node-mock-http 라이브러리 설치**

기존에 설치가 되어있다면 생략해두됩니다.

`package.json` 를 확인해주세요.



```sh
npm install -D node-mocks-http
```



**./test/unit/create**

```javascript
const controller = require('../../controllers/product.controller')
const {
    sequelize: { models },
} = require('../../models')

const http = require('node-mocks-http')
const newProduct = require('../data/new_product.json')

// 실제 데이터가 저장되면 안되기때문에 mock 함수활용

models.Product.create = jest.fn()

describe('Product Controller Create ', () => {
    it('create 함수를 가지고있는가?', () => {
        expect(typeof controller.create).toBe('function')
    })

    it('controller create 실행시, model.create가 실행되는가?', () => {
        let req = http.createRequest()
        let res = http.createResponse()
        let next = null
        req.body = newProduct
        controller.create(req, res, next)
        expect(models.Product.create).toBeCalled()
        expect(models.Product.create).toBeCalledWith(newProduct)
    })
})

```



`controller.create` 매서드가 호출시

models.Product.create 함수가 실행되는지 확인하고,

그리고 create 매서드에 인자값이 잘전달되는지 확인하는 expect 와 metcher 로 확인하기.



이후 테스트코드마다 실행하는 코드가 존재한다면

`node-mocks-http` 와 같은 코드가 많아지면 귀찮아 지겠죠? 그럴때

사용하는게 `beforeEach` 입니다.



**beforeEach 사용**



```javascript
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
    next = null
})

describe('Product Controller Create ', () => {
    it('create 함수를 가지고있는가?', () => {
        expect(typeof controller.create).toBe('function')
    })

    it('controller create 실행시, model.create가 실행되는가?', () => {
        req.body = newProduct
        controller.create(req, res, next)
        expect(models.Product.create).toBeCalled()
        expect(models.Product.create).toBeCalledWith(newProduct)
    })
})

```



이후 controller 에서 응답을 보내는지 응답코드가 옳바른지 확인해 보도록 하겠습니다.



```javascript
it('응답이 정확히 잘도착하는가?', () => {
        controller.create(req, res, next)
        expect(res.statusCode).toBe(201) // 상태코드가 맞는가?
        expect(res._isEndCalled()).toBeTruthy() // 응답을 잘보냈는가?
    })
```



그다음에는 응답 내용을 확인하는 테스트 코드를 작성하겠습니다.



> 아직 작성이 덜됨..







## 3. 통합테스트 (supertest)



이번엔 실제 요청을 던져서 정말로 잘작동하는지 테스트 해보겠습니다.



해당 디렉토리에 파일을 생성합니다.

```
| -- test
|		-- intergration
|				-- products.int.test.js
```



**supertest 라이브러리 설치**

기존에 설치가 되어있다면 생략해두됩니다.

`package.json` 를 확인해주세요.



```sh
npm install -D supertest
```







**product.int.test.js**

```javascript
const reuqest = require('supertest')
const app = require('../../server.js') // app 내용을 가져오기 위해서 server.js 파일 아래에 module.exports = app 내용넣기

const newProduct = require('../data/new_product.json')

it("POST /api/product", async ()=>{
	const response = await request(app)
  	.post('/api/product/create')
  	expect(response.statusCode).toBe(201)
  	expect(response.body.name).toBe(newProduct.name)
  	expect(response.body.description).toBe(newProduct.description)
})
```



**server.js**

```javascript
// code 생략...

module.exports = app
```



이상하게 에러가 많이 발생했다.. supertest 에서 

app을 자체적으로 실행해주는것 같았다.



**server.js**

```javascript
/// code 생략 ...

app.start = () => {
    app.listen(port, async () => {
        await sequelize.sync({ force: true })
        console.log(`Mysql Connected...`)
        console.log(`Running on http://localhost:${port}`)
    })
}

// listen Method를 묶어줌으로써 실행을 하지않고. 실행이 필요할때, index.js 파일을 만들어서 실행하도록 했다.
```



**index.js**

```javascript
const app = require('./server')
app.start()

// npm run start -> node index...
```



이후 통합테스트 단에서

`beforeAll` 을 통해 DBConnection 을 따로 실행했다.

통합테스트를 진행하니깐 NODE_ENV 를 `test`  로 실행해주더라. 처음에 dbconnection 에러가 떠서 너무 당황했다.



**product.int.test.js**

```javascript
beforeAll(async () => {
    await sequelize.sync({ force: true })
})
```



현재까지 전체코드이다.





**product.int.test.js 전체코드**

```js
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
```









**product.int.test.js**

에러가 났을경우 예외 확인하기

```javascript
// code 생략

it('POST /api/product/create response Status 500', async ()=>{
	const response = await request(app).post('/api/product/create').send({
    name:'ingoo'
  })  
  
  expect(response.statusCode).toBe(500)
  console.log(reponse.body)
  expect(response.body).toStrictEqual({  })
})
```



현재 나의 모델은 

**./models/product.js**

```js
'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {}
    }
    Product.init(
        {
            name: DataTypes.STRING,
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Product',
        },
    )
    return Product
}

```



`description` 필드는 allowNull 을통해 꼭 null 이 아니도록 설정했다. 

하지만 test 코드에서는 입력데이터에 description 을 null 인체 **create()** 를 실행시켜서 일부로 에러를 띄웠다. 



현 저의 Controller 코드는



**./controllers/products.controller.js**

```js
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

// code... 생략
```



부분이 처리되었다.

만약 `create()`  실행이 실패한다면.

catch 문으로 빠지고. 



errorRouter 가 작동해야하는데 지금 app.js 에 error Router 가 존재하지않는다.. 작성해야함..



```js
app.use((error, req, res, next) => {
    res.status(500).json({ message: error.message })
})
```



이후 테스트 해보고 결과물을 확인해보자.



```js
it('POST /api/product/create response Status 500', async () => {
    const response = await request(app).post('/api/product/create').set('Content-type', 'application/json').send({
        name: 'ingoo',
    })

    expect(response.statusCode).toBe(500)
    expect(response.body).toStrictEqual({ message: 'notNull Violation: Product.description cannot be null' })
})
```



잘되는것을 확인할수 있었다. 



정리하면서 코드치느랴 하긴했는데 다시 정리해야겠다..

