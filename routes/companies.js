const express = require("express");
const router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");
const slugify = require("slugify")

router.get("/", async (req, res, next) => {
    const results = await db.query(`SELECT code, name FROM companies`);
    return res.json({ companies: results.rows });
});

router.get("/:code", async (req, res, next) => {
    try {
        const code = req.params.code;
        const company = await db.query(
            `SELECT * FROM companies WHERE code = $1`,
            [code]
        );
        if (!company.rowCount) {
            throw new ExpressError("Company code not valid", 404);
        }
        const invoices = await db.query(
            `SELECT * FROM invoices WHERE comp_code = $1`,
            [company.rows[0].code]
        );
        const industries = await db.query(
            `SELECT industries.industry, industries.code FROM industries JOIN industries_companies ON industries.code = industries_companies.industry_code JOIN companies ON companies.code = industries_companies.company_code WHERE companies.code = $1;`,
            [company.rows[0].code]
        );
        const data = { ...company.rows[0], invoices: invoices.rows, industries: industries.rows };
        return res.json(data);
    } catch (err) {
        console.log(err)
        next(new ExpressError(err));
    }
});

router.post("/", async (req, res, next) => {
    const code = slugify(req.body.code, {lower: true, remove: /[*+~.()'"!:@]/g});
    const name = req.body.name;
    const description = req.body.description;
    const results = await db.query(
        `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`,
        [code, name, description]
    );
    return res.json({ companies: results.rows });
});

router.put("/:code", async (req, res, next) => {
    const { name, description } = req.body;
    const code = req.params.code;

    const result = await db.query(
        `UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`,
        [name, description, code]
    );

    return res.json({ company: result.rows });
});

router.delete("/:code", async (req, res, next) => {
    const code = req.params.code;

    const result = await db.query(`DELETE FROM companies WHERE code=$1`, [
        code,
    ]);

    return res.json({ status: "deleted" });
});

module.exports = router;
