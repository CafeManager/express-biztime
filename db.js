/** Database setup for BizTime. */

const { Client, Pool } = require("pg")

console.log("Connected to biztime")
const DB_URI = (process.env.NODE_ENV !== "test") ? "postgresql://postgres:password@127.0.0.1:5432/biztime" : "postgresql://postgres:password@127.0.0.1:5432/biztime_test" 


let db = new Client({
    connectionString: DB_URI
}) 

db.connect()


module.exports = db