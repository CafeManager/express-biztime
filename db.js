/** Database setup for BizTime. */

const { Client, Pool } = require("pg")

let DB_URI



console.log("Connected to biztime")
DB_URI = "postgresql://postgres:password@127.0.0.1:5432/biztime" 

// const pool = new Pool({
//     DB_URI
// })
// let test = {
//     host: '/var/run/postgresql:biztime',
//     user: 'postgres',
//     password: 'password',
//     database: 'biztime'
// }

let db = new Client({
    connectionString: DB_URI
})
// connectionString: DB_URI,
//     user: 'postgres',
//     password: 'password',
//     host: '127.0.0.1',
//     port: '5432'

db.connect()


module.exports = db