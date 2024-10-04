const connection = require('../config/db');

class Model_Jadwal {

    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT j.*, k.nama_kelas, m.nama_matakuliah, r.nama_ruangan, d.nama_dosen, jur.nama_jurusan 
                              FROM jadwal j 
                              JOIN kelas k ON j.id_kelas = k.id_kelas 
                              JOIN matakuliah m ON j.id_matakuliah = m.id_matakuliah 
                              JOIN ruangan r ON j.id_ruangan = r.id_ruangan 
                              JOIN dosen d ON j.id_dosen = d.id_dosen 
                              JOIN jurusan jur ON j.id_jurusan = jur.id_jurusan 
                              ORDER BY j.id_jadwal DESC`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async store(data) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO jadwal SET ?', data, (err, result) => {
                if (err) {
                    reject(err);
                    console.log(err);
                } else {
                    resolve(result);
                    console.log(result);
                }
            });
        });
    }

    static async getId(id) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT j.*, k.nama_kelas, m.nama_matakuliah, r.nama_ruangan, d.nama_dosen, jur.nama_jurusan 
                              FROM jadwal j 
                              JOIN kelas k ON j.id_kelas = k.id_kelas 
                              JOIN matakuliah m ON j.id_matakuliah = m.id_matakuliah 
                              JOIN ruangan r ON j.id_ruangan = r.id_ruangan 
                              JOIN dosen d ON j.id_dosen = d.id_dosen 
                              JOIN jurusan jur ON j.id_jurusan = jur.id_jurusan 
                              WHERE j.id_jadwal = ?`, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            });
        });
    }

    static async update(id, data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE jadwal SET ? WHERE id_jadwal = ?', [data, id], (err, result) => {
                if (err) {
                    reject(err);
                    console.log(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM jadwal WHERE id_jadwal = ?', [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Model_Jadwal;
