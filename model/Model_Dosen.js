const connection = require('../config/db');

class Model_Dosen {

    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT d.*, u.email, u.level_users 
                              FROM dosen d 
                              JOIN users u ON d.id_users = u.id_users 
                              ORDER BY d.id_dosen DESC`, (err, rows) => {
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
            connection.query('INSERT INTO dosen SET ?', data, (err, result) => {
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
            connection.query(`SELECT d.*, u.email, u.level_users 
                              FROM dosen d 
                              JOIN users u ON d.id_users = u.id_users 
                              WHERE d.id_dosen = ?`, [id], (err, rows) => {
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
            connection.query('UPDATE dosen SET ? WHERE id_dosen = ?', [data, id], (err, result) => {
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
            connection.query('DELETE FROM dosen WHERE id_dosen = ?', [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Model_Dosen;
