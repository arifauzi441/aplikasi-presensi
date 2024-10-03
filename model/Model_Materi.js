db = require(`../config/db`)

class Model_Materi{
    static getmateriByJadwal(id_jadwal) {
        return new Promise((resolve, reject) => {
            db.query(`select * from materi where id_jadwal = ?`, [id_jadwal], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)        
            })
        })
    }

    static getmateriById(id_materi) {
        return new Promise((resolve, reject) => {
            db.query(`select * from materi where id_materi = ?`, [id_materi], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)        
            })
        })
    }

    static addmateri(data) {
        return new Promise((resolve, reject) => {
            db.query(`insert into materi set ? `, data, (err, rows) => {
                if(err) return reject(err)
                resolve(rows)        
            })
        })
    }    

    static updatemateri(id_materi, data) {
        return new Promise((resolve, reject) => {
            db.query(`update materi set ? where id_materi = ? `, [data, id_materi], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)        
            })
        })
    }    

    static deletemateri(id_materi) {
        return new Promise((resolve, reject) => {
            db.query(`delete from materi where id_materi = ? `, [id_materi], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)        
            })
        })
    }
}

module.exports = Model_Materi