db = require(`../config/db`)

class Model_Pengumpulan{
    static getAllPengumpulanByJadwal(id_jadwal, id_mahasiswa) {
        return new Promise((resolve, reject) => {
            db.query(`select p.* from pengumpulan p
                join tugas t on t.id_tugas = p.id_tugas
                join jadwal j on j.id_jadwal = t.id_jadwal
                join mahasiswa m on m.id_mahasiswa = p.id_mahasiswa
                where j.id_jadwal = ? && m.id_mahasiswa = ?`, [id_jadwal, id_mahasiswa], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)        
            })
        })
    }

    static getPengumpulanByTugas(id_tugas, id_mahasiswa) {
        return new Promise((resolve, reject) => {
            db.query(`select * from pengumpulan where id_tugas = ? && id_mahasiswa = ?`, [id_tugas, id_mahasiswa], (err, rows) => {
                if(err) return reject(err)
                resolve(rows[0])        
            })
        })
    }

    static getPengumpulanByTugasId(id_tugas) {
        return new Promise((resolve, reject) => {
            db.query(`select m.nrp, m.nama_mahasiswa, p.* from pengumpulan p 
                join mahasiswa m on m.id_mahasiswa = p.id_mahasiswa 
                where id_tugas = ?`, [id_tugas], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)        
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