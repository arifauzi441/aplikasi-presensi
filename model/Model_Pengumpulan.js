db = require(`../config/db`)

class Model_Pengumpulan{
    static getPengumpulanByTugas(id_tugas, id_mahasiswa) {
        return new Promise((resolve, reject) => {
            db.query(`select * from pengumpulan where id_tugas = ? && id_mahasiswa = ?`, [id_tugas, id_mahasiswa], (err, rows) => {
                if(err) return reject(err)
                resolve(rows[0])        
            })
        })
    }

    static getPengumpulanById(id_pengumpulan) {
        return new Promise((resolve, reject) => {
            db.query(`select * from pengumpulan where id_pengumpulan = ?`, [id_pengumpulan], (err, rows) => {
                if(err) return reject(err)
                resolve(rows[0])        
            })
        })
    }

    static addPengumpulan(data) {
        return new Promise((resolve, reject) => {
            db.query(`insert into pengumpulan set ?`, data, (err, rows) => {
                if(err) return reject(err)
                resolve(rows)        
            })
        })
    }

    static updatePengumpulan(data,id) {
        return new Promise((resolve, reject) => {
            db.query(`update pengumpulan set ? where id_pengumpulan = ?`, [data,id], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)        
            })
        })
    }
    
}

module.exports = Model_Pengumpulan