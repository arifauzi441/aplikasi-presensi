const db = require(`../config/db`)

class Model_Mahasiswa{
    static getByIdJadwal(id){
        return new Promise((resolve, reject) => {
            db.query(`select * from mahasiswa m join jurusan ju on m.id_jurusan = ju.id_jurusan
                join jadwal j on j.id_jurusan = ju.id_jurusan
                where j.id_jurusan = m.id_jurusan && j.id_kelas = m.id_kelas && j.id_jadwal = ?`, [id], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)
            })
        })
    }

    static getByIdUser(id){
        return new Promise((resolve, reject) => {
            db.query(`select * from mahasiswa where id_users = ?`, [id], (err, rows) => {
                if(err) return reject(err)
                resolve(rows[0])
            })
        })
    }
    
}

module.exports = Model_Mahasiswa