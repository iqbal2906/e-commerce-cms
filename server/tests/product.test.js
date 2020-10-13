const request = require('supertest');
const app = require('../app');
const { User, sequelize } = require('../models');
const { queryInterface } = sequelize;
const { signToken } = require('../helpers/jwt');

let access_token = ""

const userData = {
    email: "admin@mail.com",
    password: "1234"
}

beforeAll((done) => {
    User.findOne({
            where: {
                email: userData.email
            }
        })
        .then(user => {
            access_token = signToken({ id: user.id, email: user.email, role: user.role })
            done()
        })
        .catch(err => {
            console.log(err);
            done()
        })
})

afterAll((done) => {
    queryInterface.bulkDelete("Products")
        .then(() => {
            done()
        })
        .catch(err => {
            console.log(err);
            done()
        })
})

let id

describe("Create Success", () => {
    test("Success add Product", (done) => {
        const newProduct = {
            name: 'Play Station 5',
            image_url: 'https://asset.kompas.com/crops/lwopU4TvtIn9yic9PcZZNtc6msw=/133x201:959x751/750x500/data/photo/2020/06/12/5ee2d44300d7a.png',
            price: 7300000,
            stock: 10,
            category: 'game'
        }
        return request(app)
            .post("/products")
            .set('Accept', 'application/json')
            .send(newProduct)
            .set('access_token', access_token)
            .then(response => {
                const { status, body } = response
                id = body.id
                expect(status).toBe(201)
                expect(body).toHaveProperty("id", expect.any(Number))
                expect(body).toHaveProperty("name", expect.any(String))
                expect(body).toHaveProperty("image_url", expect.any(String))
                expect(body).toHaveProperty("price", expect.any(Number))
                expect(body).toHaveProperty("stock", expect.any(Number))
                expect(body).toHaveProperty("category", expect.any(String))
                done()
            })
            .catch(err => {
                console.log(err);
                done()
            })
    })
})

describe("Create Failed", () => {
    test("name cannot be empty!", (done) => {
        const newProduct = {
            name: '',
            image_url: 'https://asset.kompas.com/crops/lwopU4TvtIn9yic9PcZZNtc6msw=/133x201:959x751/750x500/data/photo/2020/06/12/5ee2d44300d7a.png',
            price: 7300000,
            stock: 10,
            category: 'game'
        }
        return request(app)
            .post(`/products`)
            .set("Accept", "application/json")
            .set("access_token", access_token)
            .send(newProduct)
            .then(result => {
                const { body, status } = result
                expect(status).toBe(400)
                expect(body).toHaveProperty("message", "Name cannot be empty")
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    test("image_url cannot be empty!", (done) => {
        const newProduct = {
            name: 'PlayStation 5',
            image_url: '',
            price: 7300000,
            stock: 10,
            category: 'game'
        }
        return request(app)
            .post(`/products`)
            .set("Accept", "application/json")
            .set("access_token", access_token)
            .send(newProduct)
            .then(result => {
                const { body, status } = result
                expect(status).toBe(400)
                expect(body).toHaveProperty("message", "Image_url cannot be empty")
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    test('price dibawah 1', function(done) {
        const newProduct = {
            name: 'PlayStation 5',
            image_url: 'https://asset.kompas.com/crops/lwopU4TvtIn9yic9PcZZNtc6msw=/133x201:959x751/750x500/data/photo/2020/06/12/5ee2d44300d7a.png',
            price: -1,
            stock: 10,
            category: 'game'
        }
        return request(app)
            .post('/products')
            .send(newProduct)
            .set("access_token", access_token)
            .set("Accept", "application/json")
            .then(response => {
                const { status, body } = response
                console.log(body);
                expect(status).toBe(400)
                expect(body).toHaveProperty("message", "Price must be greater than 0")
                done()
            })
    })

    test('stock dibawah 1', function(done) {
        const newProduct = {
            name: 'PlayStation 5',
            image_url: 'https://asset.kompas.com/crops/lwopU4TvtIn9yic9PcZZNtc6msw=/133x201:959x751/750x500/data/photo/2020/06/12/5ee2d44300d7a.png',
            price: 7300000,
            stock: -10,
            category: 'game'
        }
        return request(app)
            .post('/products')
            .send(newProduct)
            .set("access_token", access_token)
            .set("Accept", "application/json")
            .then(response => {
                const { status, body } = response
                console.log(body);
                expect(status).toBe(400)
                expect(body).toHaveProperty("message", "Stock must be more than 0")
                done()
            })
    })

    test('wrong stock data type', function(done) {
        const newProduct = {
            name: 'PlayStation 5',
            image_url: 'https://asset.kompas.com/crops/lwopU4TvtIn9yic9PcZZNtc6msw=/133x201:959x751/750x500/data/photo/2020/06/12/5ee2d44300d7a.png',
            price: 7300000,
            stock: "sepuluh",
            category: 'game'
        }
        return request(app)
            .post('/products')
            .send(newProduct)
            .set("access_token", access_token)
            .set("Accept", "application/json")
            .then(response => {
                const { status, body } = response
                console.log(body);
                expect(status).toBe(400)
                expect(body).toHaveProperty("message", "Stock must be number")
                done()
            })
    })

    test('wrong price data type', function(done) {
        const newProduct = {
            name: 'PlayStation 5',
            image_url: 'https://asset.kompas.com/crops/lwopU4TvtIn9yic9PcZZNtc6msw=/133x201:959x751/750x500/data/photo/2020/06/12/5ee2d44300d7a.png',
            price: "tujuh juta tiga ratus ribu",
            stock: 10,
            category: 'game'
        }
        return request(app)
            .post('/products')
            .send(newProduct)
            .set("access_token", access_token)
            .set("Accept", "application/json")
            .then(response => {
                const { status, body } = response
                console.log(body);
                expect(status).toBe(400)
                expect(body).toHaveProperty("message", "Price must be number")
                done()
            })
    })

    test("No access_token", (done) => {
        const newProduct = {
            name: 'PlayStation 5',
            image_url: 'https://asset.kompas.com/crops/lwopU4TvtIn9yic9PcZZNtc6msw=/133x201:959x751/750x500/data/photo/2020/06/12/5ee2d44300d7a.png',
            price: 7300000,
            stock: 10,
            category: 'game'
        }
        request(app)
            .post(`/products`)
            .send(newProduct)
            .set('Accept', 'application/json')
            .then(response => {
                const { status, body } = response
                expect(status).toBe(401)
                expect(body).toHaveProperty("message", "Please login first")
                done()
            })
            .catch(err => {
                console.log(err);
                done()
            })
    })

    test("Not admin access_token", (done) => {
        const newProduct = {
            name: 'PlayStation 5',
            image_url: 'https://asset.kompas.com/crops/lwopU4TvtIn9yic9PcZZNtc6msw=/133x201:959x751/750x500/data/photo/2020/06/12/5ee2d44300d7a.png',
            price: 7300000,
            stock: 10,
            category: 'game'
        }
        request(app)
            .post(`/products`)
            .send(newProduct)
            .set('Accept', 'application/json')
            .set('access_token', "invalid")
            .then(response => {
                const { status, body } = response
                expect(status).toBe(401)
                expect(body).toHaveProperty("message", "Not authorize")

                done()
            })
            .catch(err => {
                console.log(err);
                done()
            })
    })
})

describe("Edit Success", () => {
    test("Successfully update products", (done) => {
        const updateProduct = {
            name: 'PS5',
            image_url: 'https://asset.kompas.com/crops/lwopU4TvtIn9yic9PcZZNtc6msw=/133x201:959x751/750x500/data/photo/2020/06/12/5ee2d44300d7a.png',
            price: 7300000,
            stock: 10,
            category: 'game'
        }
        const id = 1
        return request(app)
            .put(`/products/${id}`)
            .set("Accept", "application/json")
            .set("access_token", access_token)
            .send(updateProduct)
            .then(response => {
                const { status, body } = response
                id = body.id
                expect(status).toBe(201)
                expect(body).toHaveProperty("id", expect.any(Number))
                expect(body).toHaveProperty("name", expect.any(String))
                expect(body).toHaveProperty("image_url", expect.any(String))
                expect(body).toHaveProperty("price", expect.any(Number))
                expect(body).toHaveProperty("stock", expect.any(Number))
                expect(body).toHaveProperty("category", expect.any(String))
                done()
            })
            .catch(err => {
                console.log(err);
                done()
            })
    })
})

describe("Edit Failed", () => {
    test("name cannot be empty!", (done) => {
        const updateProduct = {
            name: '',
            image_url: 'https://asset.kompas.com/crops/lwopU4TvtIn9yic9PcZZNtc6msw=/133x201:959x751/750x500/data/photo/2020/06/12/5ee2d44300d7a.png',
            price: 7300000,
            stock: 10,
            category: 'game'
        }
        const id = 1
        return request(app)
            .put(`/products/${id}`)
            .set("Accept", "application/json")
            .set("access_token", access_token)
            .send(updateProduct)
            .then(result => {
                const { body, status } = result
                expect(status).toBe(400)
                expect(body).toHaveProperty("message", "Name cannot be empty")
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    test("image_url cannot be empty!", (done) => {
        const updateProduct = {
            name: 'PlayStation 5',
            image_url: '',
            price: 7300000,
            stock: 10,
            category: 'game'
        }
        const id = 1
        return request(app)
            .put(`/products/${id}`)
            .set("Accept", "application/json")
            .set("access_token", access_token)
            .send(updateProduct)
            .then(result => {
                const { body, status } = result
                expect(status).toBe(400)
                expect(body).toHaveProperty("message", "Image_url cannot be empty")
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    test('price dibawah 1', function(done) {
        const updateProduct = {
            name: 'PlayStation 5',
            image_url: 'https://asset.kompas.com/crops/lwopU4TvtIn9yic9PcZZNtc6msw=/133x201:959x751/750x500/data/photo/2020/06/12/5ee2d44300d7a.png',
            price: -1,
            stock: 10,
            category: 'game'
        }
        const id = 1
        return request(app)
            .put(`/products/${id}`)
            .send(updateProduct)
            .set("access_token", access_token)
            .set("Accept", "application/json")
            .then(response => {
                const { status, body } = response
                console.log(body);
                expect(status).toBe(400)
                expect(body).toHaveProperty("message", "Price must be greater than 0")
                done()
            })
    })

    test('stock dibawah 1', function(done) {
        const updateProduct = {
            name: 'PlayStation 5',
            image_url: 'https://asset.kompas.com/crops/lwopU4TvtIn9yic9PcZZNtc6msw=/133x201:959x751/750x500/data/photo/2020/06/12/5ee2d44300d7a.png',
            price: 7300000,
            stock: -10,
            category: 'game'
        }
        const id = 1
        return request(app)
            .put(`/products/${id}`)
            .send(updateProduct)
            .set("access_token", access_token)
            .set("Accept", "application/json")
            .then(response => {
                const { status, body } = response
                console.log(body);
                expect(status).toBe(400)
                expect(body).toHaveProperty("message", "Stock must be more than 0")
                done()
            })
    })

    test('wrong stock data type', function(done) {
        const updateProduct = {
            name: 'PlayStation 5',
            image_url: 'https://asset.kompas.com/crops/lwopU4TvtIn9yic9PcZZNtc6msw=/133x201:959x751/750x500/data/photo/2020/06/12/5ee2d44300d7a.png',
            price: 7300000,
            stock: "sepuluh",
            category: 'game'
        }
        const id = 1
        return request(app)
            .put(`/products/${id}`)
            .send(updateProduct)
            .set("access_token", access_token)
            .set("Accept", "application/json")
            .then(response => {
                const { status, body } = response
                console.log(body);
                expect(status).toBe(400)
                expect(body).toHaveProperty("message", "Stock must be number")
                done()
            })
    })

    test('wrong price data type', function(done) {
        const updateProduct = {
            name: 'PlayStation 5',
            image_url: 'https://asset.kompas.com/crops/lwopU4TvtIn9yic9PcZZNtc6msw=/133x201:959x751/750x500/data/photo/2020/06/12/5ee2d44300d7a.png',
            price: "tujuh juta tiga ratus ribu",
            stock: 10,
            category: 'game'
        }
        const id = 1
        return request(app)
            .put(`/products/${id}`)
            .send(updateProduct)
            .set("access_token", access_token)
            .set("Accept", "application/json")
            .then(response => {
                const { status, body } = response
                console.log(body);
                expect(status).toBe(400)
                expect(body).toHaveProperty("message", "Price must be number")
                done()
            })
    })

    test("No access_token", (done) => {
        const updateProduct = {
            name: 'PlayStation 5',
            image_url: 'https://asset.kompas.com/crops/lwopU4TvtIn9yic9PcZZNtc6msw=/133x201:959x751/750x500/data/photo/2020/06/12/5ee2d44300d7a.png',
            price: 730000,
            stock: 10,
            category: 'game'
        }
        const id = 1
        return request(app)
            .put(`/products/${id}`)
            .send(updateProduct)
            .set('Accept', 'application/json')
            .then(response => {
                const { status, body } = response
                expect(status).toBe(401)
                expect(body).toHaveProperty("message", "Please login first")
                done()
            })
            .catch(err => {
                console.log(err);
                done()
            })
    })

    test("Not admin access_token", (done) => {
        const updateProduct = {
            name: 'PlayStation 5',
            image_url: 'https://asset.kompas.com/crops/lwopU4TvtIn9yic9PcZZNtc6msw=/133x201:959x751/750x500/data/photo/2020/06/12/5ee2d44300d7a.png',
            price: 730000,
            stock: 10,
            category: 'game'
        }
        const id = 1
        request(app)
            .put(`/products/${id}`)
            .send(updateProduct)
            .set('Accept', 'application/json')
            .set('access_token', "invalid")
            .then(response => {
                const { status, body } = response
                expect(status).toBe(401)
                expect(body).toHaveProperty("message", "Not authorize")
                done()
            })
            .catch(err => {
                console.log(err);
                done()
            })
    })
})

describe("Testing Delete Product Data", () => {
    test("Delete Product Success", (done) => {
        const id = 1;

        request(app)
            .delete(`/products/${id}`)
            .set("access_token", access_token)
            .then(response => {
                const { status, body } = response;
                expect(status).toBe(200);
                expect(body).toHaveProperty("message", "Product is sucessfully deleted");
                done();
            })
            .catch(err => {
                console.log(err);
                done()
            })
    });

    test("No access_token", (done) => {
        const id = 1001
        return request(app)
            .delete(`/products/${id}`)
            .set('Accept', 'application/json')
            .then(response => {
                const { status, body } = response
                expect(status).toBe(401)
                expect(body).toHaveProperty("message", "Please login first")
                done()
            })
            .catch(err => {
                console.log(err);
                done()
            })
    })

    test("Not admin access_token", (done) => {
        const id = 1001
        request(app)
            .delete(`/products/${id}`)
            .set('Accept', 'application/json')
            .set('access_token', "invalid")
            .then(response => {
                const { status, body } = response
                expect(status).toBe(401)
                expect(body).toHaveProperty("message", "Not authorize")
                done()
            })
            .catch(err => {
                console.log(err);
                done()
            })
    })
})