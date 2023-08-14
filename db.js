/** Database setup for BizTime. */

const { Client, Pool } = require("pg")

let DB_URI

console.log("Connected to biztime")
DB_URI = "postgresql://postgres:password@127.0.0.1:5432/biztime" 


let db = new Client({
    connectionString: DB_URI
}) 

db.connect()


module.exports = db