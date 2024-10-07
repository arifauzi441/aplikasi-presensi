const db = require(`../config/db`)

class Model_Presensi{
    static getPresensiByJadwal(id){
        return new Promise((resolve, reject) => {
            db.query(`select * from presensi where id_jadwal = ?`, [id], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)
            })
        })
    }

    static getNowPresensiByJadwal(id){
        return new Promise((resolve, reject) => {
            db.query(`select * from presensi where id_jadwal = ? order by id_presensi desc`, [id], (err, rows) => {
                if(err) return reject(err)
                resolve(rows[0])
            })
        })
    }
    
    static addPresensi(data){
        return new Promise((resolve, reject) => {
            db.query(`insert into presensi set ?`, data, (err, rows) => {
                if(err) return reject(err)
                resolve(rows)
                console.log(data.hari)
            })
        })
    }
    
    static getById(id_presensi){
        return new Promise((resolve, reject) => {
            db.query(`select * from presensi where id_presensi = ?`, [id_presensi], (err, rows) => {
                if(err) return reject(err)
                resolve(rows[0])
            })
        })
    }
    
    static updateStatusPresensi(status,id){
        return new Promise((resolve, reject) => {
            db.query(`update presensi set status_presensi = ? where id_presensi = ?`, [status,id], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)
            })
        })
    }

    static getIdPresensi(id){
        return new Promise((resolve, reject) => {
            db.query(`select id_presensi from presensi where id_jadwal = ? order by id_presensi desc`, [id], (err, rows) => {
                if(err) return reject(err)
                resolve(rows[0].id_presensi)
            })
        })
    }
}

module.exports = Model_Presensi