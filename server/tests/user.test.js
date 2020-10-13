const request = require('supertest')
const app = require('../app')


const userDataWrongEmail = {
    email: 'admin@gmail.com',
    password: '1234'
}

const userDataWrongPassword = {
    email: 'admin@gmail.com',
    password: '123456'
}

const userDataEmptyField = {
    email: '',
    password: ''
}

const userData = {
    email: 'admin@mail.com',
    password: '1234'
}

describe('Testing login success', () => {
    test('Succesfully login', (done) => {
        request(app)
            .post('/login')
            .send(userData)
            .set('Accept', 'application/json')
            .then(response => {
                const { status, body } = response
                expect(body).toHaveProperty('access_token', expect.any(String))
                expect(status).toBe(201)
                done()
            })
    })
})

describe('Testing login failed', () => {
    test('wrong password', (done) => {
        request(app)
            .post('/login')
            .send(userDataWrongPassword)
            .set('Accept', 'application/json')
            .then(response => {
                const { status, body } = response

                expect(body).toHaveProperty('message', 'Wrong email/password')
                expect(status).toBe(401)
                done()
            })
    })

    test('wrong email', (done) => {
        request(app)
            .post('/login')
            .send(userDataWrongEmail)
            .set('Accept', 'application/json')
            .then(response => {
                const { status, body } = response
                expect(body).toHaveProperty('message', 'Wrong email/password')
                expect(status).toBe(401)
                done()
            })
    })

    test('empty input', (done) => {
        request(app)
            .post('/login')
            .send(userDataEmptyField)
            .set('Accept', 'application/json')
            .then(response => {
                const { status, body } = response
                expect(body).toHaveProperty('message', 'Must Enter Email and Password')
                expect(status).toBe(400)
                done()
            })
    })

})