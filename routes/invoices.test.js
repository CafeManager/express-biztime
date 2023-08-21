// beforeEach(async () => {
    
// })

// describe("test", ()=> {
//     test('memes', function(){
//         console.log("reach")
//     })
// })

process.env.NODE_ENV = 'test'

const request = require('supertest')
const app = require('../app')
const db = require('../db')

const INVOICES_TEST_DATA = {
    "invoices": [
        {
            "id": 1,
            "comp_code": "apple"
        },
        {
            "id": 2,
            "comp_code": "apple"
        },
        {
            "id": 3,
            "comp_code": "apple"
        },
        {
            "id": 4,
            "comp_code": "ibm"
        }
    ]
}
 


beforeEach(async () => {
    const company = await db.query(
        `INSERT INTO invoices (comp_code, amt) VALUES ('apple', 500)`
    );
})

afterEach(async function () {
    const company = await db.query(
        `DELETE FROM invoices WHERE amt NOT IN (100, 200, 300, 400)`
    );
});

// Route: get / return list

// Route: get /[id] return invoice or 404

// Route: post / add invoice get obj of new invoice

// Route: put / edit invoice get updated invoice obj or 404

// Route: delete / remove invoice get deleted message or 404


describe("GET /", () => {
    test('Get a list of invoices', async () => {
        const res = await request(app).get('/invoices')
        invoices = JSON.parse(res.text)
        trimmedInvoices = invoices.invoices.splice(0,4)
        originalInvoices = INVOICES_TEST_DATA.invoices.splice(0,4)
        expect(trimmedInvoices).toEqual(originalInvoices)
        expect(res.statusCode).toBe(200)
    })
})

describe("GET /[code]", () => {
    test('Get a invoice or 404', async () => {
        const invoiceQuery = await db.query(`SELECT id FROM invoices WHERE comp_code='apple' AND amt=500 `)
        const id = invoiceQuery.rows[0].id

        const res = await request(app).get(`/invoices/${id}`)

        const invoiceQueryVerify = await db.query(`SELECT * FROM invoices WHERE id=${id}`)
        expect(res.statusCode).toEqual(200)
        expect(invoiceQueryVerify.rowCount).toEqual(1)
    })
})

describe("POST /invoices", () => {
    test('Add company and get object of new company', async () => {
        
        const res = await request(app).post('/invoices').send({
            comp_code: 'apple',
            amt: '9000'
        })
        const invoiceQuery = await db.query(`SELECT * FROM invoices WHERE amt=9000 `)
        
        expect(res.statusCode).toBe(200)
        expect(invoiceQuery.rowCount).toEqual(1)
    })
})


describe("PUT /invoices/[id]", () => {
    test('Edit invoice and get object of new company', async () => {
        const invoiceQuery = await db.query(`SELECT id FROM invoices WHERE comp_code='apple' AND amt=500 `)
        const id = invoiceQuery.rows[0].id
        const res = await request(app).put(`/invoices/${id}`).send({
            amt: '601'
        })
        const invoiceQueryVerify = await db.query(`SELECT * FROM invoices WHERE amt=601 `)

        expect(res.statusCode).toBe(200)
        expect(invoiceQueryVerify.rowCount).toEqual(1)
    })
})



// describe("DELETE /companies/[code]", () => {
//     test('Add company and get object of new company', async () => {
//         const deleteRes = await request(app).delete('/companies/test1')
//         const companiesRes = await request(app).get('/companies')
//         const companies = JSON.parse(companiesRes.text)
//         console.log(companiesRes)
//         expect(companiesRes.statusCode).toBe(200)
//         expect(companies).toEqual(COMPANY_TEST_DATA)
//     })
// })


