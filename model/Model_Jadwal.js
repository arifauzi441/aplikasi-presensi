const db = require(`../config/db`)

class Model_Jadwal{
    static getById(idJadwal){
        return new Promise((resolve, reject) => {
            db.query(`select * from jadwal j join jurusan ju on j.id_jurusan = ju.id_jurusan 
                join kelas k on j.id_kelas = k.id_kelas 
                join dosen d on d.id_dosen = j.id_dosen 
                join matakuliah m on m.id_matakuliah = j.id_matakuliah
                join ruangan r on r.id_ruangan = j.id_ruangan
                where j.id_jadwal = ?`, [idJadwal], (err, rows) => {
                if(err) return reject(err)
                resolve(rows[0])
            })
        })
    }

    static getJadwalByDosen(id){
        return new Promise((resolve, reject) => {
            db.query(`select * from jadwal j join dosen d on d.id_dosen = j.id_dosen where d.id_users = ?`, [id], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)
            })
        })
    }

    static getJadwalByMahasiswa(id){
        return new Promise((resolve, reject) => {
            db.query(`select * from jadwal j join kelas k on k.id_kelas = j.id_kelas join mahasiswa m on m.id_kelas = j.id_kelas && j.id_jurusan = m.id_jurusan where m.id_users = ?`, [id], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)
            })
        })
    }
}

module.exports = Model_Jadwal