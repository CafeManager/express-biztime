process.env.NODE_ENV = 'test'

const request = require('supertest')
const app = require('../app')
const db = require('../db')

const COMPANY_TEST_DATA = {
    "companies": [
        {
            "code": "apple",
            "name": "Apple Computer"
        },
        {
            "code": "ibm",
            "name": "IBM"
        }
    ]
}
 


beforeEach(async () => {
    const company = await db.query(
        `INSERT INTO companies (code, name, description) VALUES ('test1', 'test1', 'test2') RETURNING code, name, description`
    );
})

afterEach(async function () {
    const company = await db.query(
        `DELETE FROM companies WHERE code NOT IN ('apple', 'ibm')`
    );
});


describe("GET /companies", () => {
    test('Get a list of companies', async () => {
        const res = await request(app).get('/companies')
        companies = JSON.parse(res.text)
        originalCompanies = companies.companies.splice(0,2)
        expect(originalCompanies).toEqual(COMPANY_TEST_DATA.companies)
        expect(res.statusCode).toBe(200)
    })
})

describe("GET /[code]", () => {
    test('Get a company or 404', async () => {
        const res = await request(app).get('/companies/test1')
        const compare_company = {"code":"test1","name":"test1","description":"test2","invoices":[]}
        const company = JSON.parse(res.text)
        expect(res.statusCode).toEqual(200)
        expect(company).toEqual(compare_company)
        const badRes = await request(app).get('/companies/invalidCode')
        expect(badRes.statusCode).toEqual(500)
    })
})

describe("POST /companies", () => {
    test('Add company and get object of new company', async () => {
        const res = await request(app).post('/companies').send({
            code: 'test2',
            name: 'test2name',
            description: 'test2description'
        })
        const compare_company = {"companies":[{"code":"test2","name":"test2name","description":"test2description"}]}
        const company = JSON.parse(res.text)
        expect(res.statusCode).toBe(200)
        expect(company).toEqual(compare_company)
    })
})


describe("PUT /companies/[code]", () => {
    test('Edit company and get object of new company', async () => {
        const res = await request(app).put('/companies/test1').send({
            name: 'rename',
            description: 'renameDesc'
        })
        const compare_company =  {"company":[{"code":"test1","name":"rename","description":"renameDesc"}]}
        const company = JSON.parse(res.text)
        expect(res.statusCode).toBe(200)
        expect(company).toEqual(compare_company)
    })
})



describe("DELETE /companies/[code]", () => {
    test('Add company and get object of new company', async () => {
        const deleteRes = await request(app).delete('/companies/test1')
        const companiesRes = await request(app).get('/companies')
        const companies = JSON.parse(companiesRes.text)
        expect(companiesRes.statusCode).toBe(200)
        expect(companies).toEqual(COMPANY_TEST_DATA)
    })
})

