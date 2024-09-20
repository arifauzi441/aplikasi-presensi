const mysql = require(`mysql`)

db = mysql.createConnection({
    host: `localhost`,
    user: `root`,
    password: ``,
    database: `db_express_ethol`
})

db.connect((err) => {
    if(err) return console.log(err)
    return console.log(`koneksi berhasil`)
})

module.exports = db