const db = require(`../config/db`)

class Model_History_Presensi{
    static getHistoryPresensi(id_presensi, id_users){
        return new Promise((resolve, reject) => {
            db.query(`select * from history_presensi h 
                join mahasiswa m on m.id_mahasiswa = h.id_mahasiswa where h.id_presensi = ? && m.id_users = ?`, [id_presensi, id_users], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)
            })
        })
    }

    static getById(id_history_presensi){
        return new Promise((resolve, reject) => {
            db.query(`select id_presensi from history_presensi where id_history_presensi = ?`, [id_history_presensi], (err, rows) => {
                if(err) return reject(err)
                resolve(rows[0].id_presensi)
            })
        })
    }

    static addHistoryPresensi(data){
        return new Promise((resolve, reject) => {
            db.query(`insert into history_presensi set ?`, data, (err, rows) => {
                if(err) return reject(err)
                resolve(rows)
            })
        })
    }

    static getHistoryPresensiByPresensi(id_presensi){
        return new Promise((resolve, reject) => {
            db.query(`select * from history_presensi h 
                join mahasiswa m on m.id_mahasiswa = h.id_mahasiswa where h.id_presensi = ?`, [id_presensi], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)
            })
        })
    }

    static deleteHistoryPresensi(id_history_presensi){
        return new Promise((resolve, reject) => {
            db.query(`delete from history_presensi where id_history_presensi = ?`, [id_history_presensi], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)
            })
        })
    }
}

module.exports = Model_History_Presensi