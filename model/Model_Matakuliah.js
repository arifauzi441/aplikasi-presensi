const connection = require('../config/db');

class Model_Matakuliah {

    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM matakuliah ORDER BY id_matakuliah DESC', (err, rows) => {
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
            connection.query('INSERT INTO matakuliah SET ?', data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async getId(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM matakuliah WHERE id_matakuliah = ?', [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async update(id, data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE matakuliah SET ? WHERE id_matakuliah = ?', [data, id], (err, result) => {
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
            connection.query('DELETE FROM matakuliah WHERE id_matakuliah = ?', [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Model_Matakuliah;
