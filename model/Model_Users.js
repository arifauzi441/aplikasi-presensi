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
    
    static storeData(data){
        return new Promise((resolve, reject) => {
            db.query(`insert into users set ?`, data, (err, rows) => {
                if(err) return reject(err)
                resolve(rows)
            })
        })
    }

    static updateData(id, data){
        return new Promise((resolve, reject) => {
            db.query(`update users set ? where id_users = ?`, [id, data], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)
            })
        })
    }
    
    static deleteData(id){
        return new Promise((resolve, reject) => {
            db.query(`delete from users where id_users = ?`, [id], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)
            })
        })
    }
    
    static getUserMahasiswa(id){
        return new Promise((resolve, reject) => {
            db.query(`select * from users u join mahasiswa m on u.id_users = m.id_users where id_users = ?`, [id], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)
            })
        })
    }

}

module.exports = Model_Users