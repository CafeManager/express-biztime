const express = require("express")
const router = new express.Router()
const db = require("../db")
const ExpressError = require("../expressError")

router.get('/', async (req, res, next) => {
    const results = await db.query(`SELECT code, name FROM companies`);
    return res.json({companies: results.rows})
})

router.get('/:code', async (req, res, next) => {
    try{
    const code = req.params.code
    const company = await db.query(`SELECT * FROM companies WHERE code = $1`, [code]);
    const invoices = await db.query(`SELECT * FROM invoices WHERE comp_code = $1`, [company.rows[0].code]);
    const data = {...company.rows[0], invoices: invoices.rows}
    return res.json(data)} catch (err) {
        next(new ExpressError(err))
    }
})
 
router.post('/', async (req, res, next) => {
    const code = req.body.code
    const name = req.body.name
    const description = req.body.description
    const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name, description]);
    return res.json({companies: results.rows})
})

router.put('/:code', async (req, res, next) => {
    const { name, description } = req.body
    const code = req.params.code

    const result = await db.query(
        `UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`, [name, description, code]
    )

    return res.json({company: result.rows})
})

router.delete('/:code', async (req, res, next) => {
    const code = req.params.code

    const result = await db.query(
        `DELETE FROM companies WHERE code=$1`, [code]
    )

    return res.json({'status': 'deleted'})
})


module.exports = router