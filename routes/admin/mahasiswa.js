let express = require('express');
let routes = express.Router();
const Model_Mahasiswa = require('../../model/Model_Mahasiswa');
const Model_Kelas = require('../../model/Model_Kelas');
const Model_Jurusan = require('../../model/Model_Jurusan');
const Model_Users = require('../../model/Model_Users');

routes.get('/', async (req, res, next) => {
    try {
        let data = await Model_Mahasiswa.getAll();
        res.render('users/admin/mahasiswa/index', {
            data
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/create', async (req, res, next) => {
    try {
        let kelas = await Model_Kelas.getAll();
        let jurusan = await Model_Jurusan.getAll();
        let users = await Model_Users.getAll();
        res.render('users/admin/mahasiswa/create', {
            kelas,
            jurusan,
            users
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.post('/store', async (req, res, next) => {
    try {
        let { nama_mahasiswa, nrp, jenis_kelamin, id_kelas, id_jurusan, id_users } = req.body;
        let data = { nama_mahasiswa, nrp, jenis_kelamin, id_kelas, id_jurusan, id_users };
        await Model_Mahasiswa.store(data);
        res.redirect('/admin/mahasiswa');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/edit/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let data = await Model_Mahasiswa.getId(id);
        let kelas = await Model_Kelas.getAll();
        let jurusan = await Model_Jurusan.getAll();
        let users = await Model_Users.getAll();
        res.render('users/admin/mahasiswa/edit', {
            id: data[0].id_mahasiswa,
            nama_mahasiswa: data[0].nama_mahasiswa,
            nrp: data[0].nrp,
            jenis_kelamin: data[0].jenis_kelamin,
            id_kelas: data[0].id_kelas,
            id_jurusan: data[0].id_jurusan,
            id_users: data[0].id_users,
            kelas,
            jurusan,
            users
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.post('/update/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let { nama_mahasiswa, nrp, jenis_kelamin, id_kelas, id_jurusan, id_users } = req.body;
        let data = { nama_mahasiswa, nrp, jenis_kelamin, id_kelas, id_jurusan, id_users };
        await Model_Mahasiswa.update(id, data);
        res.redirect('/admin/mahasiswa');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/delete/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        await Model_Mahasiswa.delete(id);
        res.redirect('/admin/mahasiswa');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = routes;
