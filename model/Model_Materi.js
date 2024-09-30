db = require(`../config/db`)

class Model_Materi{
    static getMateriByJadwal(id) {
        return new Promise((resolve, reject) => {
            db.query(`select * from materi where id_jadwal = ?`, [id], (err, rows) => {
                if(err) return reject(err)
                resolve(rows)        
            })
        })
    }
}

module.exports = Model_Materi