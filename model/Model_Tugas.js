db = require(`../config/db`)

class Model_Tugas{
    static getNowTugasByJadwal(id){
        return new Promise((resolve, reject) => {
            db.query(`select * from tugas where id_jadwal = ? order by id_tugas desc LIMIT 1`, [id], (err, rows) => {
                if(err) return reject(err)
                resolve(rows[0])
            })
        })
    }

    static getTugasByJadwal(id_jadwal) {
        return new Promise((resolve, reject) => {
            db.query(`select * from tugas where id_jadwal = ?`, [id_jadwal], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)        
            })
        })
    }

    static getTugasById(id_tugas) {
        return new Promise((resolve, reject) => {
            db.query(`select * from tugas where id_tugas = ?`, [id_tugas], (err, rows) => {
                if(err) return reject(err)
                resolve(rows[0])        
            })
        })
    }

    static addTugas(data) {
        return new Promise((resolve, reject) => {
            db.query(`insert into tugas set ? `, data, (err, rows) => {
                if(err) return reject(err)
                resolve(rows)        
            })
        })
    }    

    static updateTugas(id_tugas, data) {
        return new Promise((resolve, reject) => {
            db.query(`update tugas set ? where id_tugas = ? `, [data, id_tugas], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)        
            })
        })
    }    

    static deleteTugas(id_tugas) {
        return new Promise((resolve, reject) => {
            db.query(`delete from tugas where id_tugas = ? `, [id_tugas], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)        
            })
        })
    }    
}

module.exports = Model_Tugas