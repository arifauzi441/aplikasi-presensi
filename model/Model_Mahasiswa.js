const connection = require('../config/db');

class Model_Mahasiswa {

    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT m.*, k.nama_kelas, j.nama_jurusan, u.email, u.level_users 
                              FROM mahasiswa m 
                              JOIN kelas k ON m.id_kelas = k.id_kelas 
                              JOIN jurusan j ON m.id_jurusan = j.id_jurusan 
                              JOIN users u ON m.id_users = u.id_users 
                              ORDER BY m.id_mahasiswa DESC`, (err, rows) => {
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
            connection.query('INSERT INTO mahasiswa SET ?', data, (err, result) => {
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
            connection.query(`SELECT m.*, k.nama_kelas, j.nama_jurusan, u.email, u.level_users 
                              FROM mahasiswa m 
                              JOIN kelas k ON m.id_kelas = k.id_kelas 
                              JOIN jurusan j ON m.id_jurusan = j.id_jurusan 
                              JOIN users u ON m.id_users = u.id_users 
                              WHERE m.id_mahasiswa = ?`, [id], (err, rows) => {
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
            connection.query('UPDATE mahasiswa SET ? WHERE id_mahasiswa = ?', [data, id], (err, result) => {
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
            connection.query('DELETE FROM mahasiswa WHERE id_mahasiswa = ?', [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Model_Mahasiswa;
