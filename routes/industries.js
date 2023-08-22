const express = require("express")
const router = new express.Router()
const db = require("../db")
const ExpressError = require("../expressError")

router.get('/', async (req, res, next) => {
    const results = await db.query(` SELECT * FROM industries LEFT JOIN industries_companies ON industries.code = industries_companies.industry_code JOIN companies ON companies.code = industries_companies.company_code`);
    return res.json({industries: results.rows})
})

router.post('/', async (req, res, next) => {
    const code = req.body.code
    const industry = req.body.industry
    const results = await db.query(`INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry`, [code, industry]);
    return res.json({industry: results.rows})
})

router.post('/company', async (req, res, next) => {
    const companyCode = req.body.companyCode
    const industryCode = req.body.industryCode
    const results = await db.query(`INSERT INTO industries_companies (company_code, industry_code) VALUES ($1, $2) RETURNING company_code, industry_code`, [companyCode, industryCode]);
    
    return res.json({industries_companies: results.rows})
})

module.exports = router