const db = require(`../config/db`)

class Model_Users{
    static getAll(){
        return new Promise((resolve, reject) => {
            db.query(`select * from users order by id_users`, (err, rows) => {
                if(err) return reject(err)
                resolve(rows)
            })
        })
    }
    
    static getEmail(email){
        return new Promise((resolve, reject) => {
            db.query(`select * from users where email = ?`, [email], (err, rows) => {
                if(err) return reject(err)
                resolve(rows[0])
            })
        })
    }

    static getUserId(userId){
        return new Promise((resolve, reject) => {
            db.query(`select * from users where id_users = ?`, [userId], (err, rows) => {
                if(err) return reject(err)
                resolve(rows[0])
            })
        })
    }

}

module.exports = Model_Users