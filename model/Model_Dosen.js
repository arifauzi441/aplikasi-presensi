const db = require(`../config/db`)

class Model_Dosen{
    static getByIdUser(id){
        return new Promise((resolve, reject) => {
            db.query(`select * from dosen where id_users = ?`, [id], (err, rows) => {
                if(err) return reject(err)
                resolve(rows[0])
            })
        })
    }
}

module.exports = Model_Dosen