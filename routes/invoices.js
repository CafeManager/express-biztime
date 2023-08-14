const express = require("express")
const router = new express.Router()
const db = require("../db")
const ExpressError = require("../expressError")

router.get('/', async (req, res, next) => {
    const results = await db.query(`SELECT id, comp_code FROM invoices`);
    console.log(results.rows)
    return res.json({invoices: results.rows})
})

router.get('/:id', async (req, res, next) => {
    const id = req.params.id
    const invoice = await db.query(`SELECT * FROM invoices WHERE invoices.id = $1`, [id]);
    console.log(invoice.rows[0])
    const company = await db.query(`SELECT * FROM companies WHERE code=$1`, [invoice.rows[0].comp_code]);
    const data = {...invoice.rows[0], company: company.rows[0]}
    return res.json(data)
})
 
router.post('/', async (req, res, next) => {
    const comp_code = req.body.comp_code
    const amt = req.body.amt
    const results = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt]);
    return res.json({invoices: results.rows})
})

router.put('/:id', async (req, res, next) => {
    const { amt } = req.body
    const id = req.params.id

    const result = await db.query(
        `UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, id]
    )

    return res.json({invoices: result.rows})
})

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id

    const result = await db.query(
        `DELETE FROM invoices WHERE id=$1`, [id]
    )

    return res.json({'status': 'deleted'})
})

module.exports = router