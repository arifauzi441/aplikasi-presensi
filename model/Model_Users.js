const db = require(`../config/db`)

class Model_Users{
    static getAll(){
        return new Promise((resolve, reject) => {
            db.query(`select * from users order by id_users`, (err, rows) => {
                if(err) return reject(err)
                resolve(rows)
            })
        })
    }
    
    static async store(data) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO users SET ?', data, (err, result) => {
                if (err) {
                    reject(err);
                    console.log(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static getEmail(email){
        return new Promise((resolve, reject) => {
            db.query(`select * from users where email = ?`, [email], (err, rows) => {
                if(err) return reject(err)
                resolve(rows[0])
            })
        })
    }

    static getUserId(userId){
        return new Promise((resolve, reject) => {
            db.query(`select * from users where id_users = ?`, [userId], (err, rows) => {
                if(err) return reject(err)
                resolve(rows[0])
            })
        })
    }

    static async update(id, data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE users SET ? WHERE id_users = ?', [data, id], (err, result) => {
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

    static async delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM users WHERE id_users = ?', [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Model_Users