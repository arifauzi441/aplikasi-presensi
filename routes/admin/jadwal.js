let express = require('express');
let routes = express.Router();
const Model_Jadwal = require('../../model/Model_Jadwal');
const Model_Kelas = require('../../model/Model_Kelas');
const Model_Matakuliah = require('../../model/Model_Matakuliah');
const Model_Jurusan = require('../../model/Model_Jurusan');
const Model_Ruangan = require('../../model/Model_Ruangan');
const Model_Dosen = require('../../model/Model_Dosen');

routes.get('/', async (req, res, next) => {
    try {
        let data = await Model_Jadwal.getAll();
        res.render('users/admin/jadwal/index', {
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
        let matakuliah = await Model_Matakuliah.getAll();
        let jurusan = await Model_Jurusan.getAll();
        let ruangan = await Model_Ruangan.getAll();
        let dosen = await Model_Dosen.getAll();
        res.render('users/admin/jadwal/create', {
            kelas,
            matakuliah,
            jurusan,
            ruangan,
            dosen
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.post('/store', async (req, res, next) => {
    try {
        let { hari, id_kelas, id_matakuliah, id_jurusan, id_ruangan, id_dosen, waktu } = req.body;
        let data = { hari, id_kelas, id_matakuliah, id_jurusan, id_ruangan, id_dosen, waktu};
        await Model_Jadwal.store(data);
        res.redirect('/admin/jadwal');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/edit/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let data = await Model_Jadwal.getId(id);
        console.log(data)
        let kelas = await Model_Kelas.getAll();
        let matakuliah = await Model_Matakuliah.getAll();
        let jurusan = await Model_Jurusan.getAll();
        let ruangan = await Model_Ruangan.getAll();
        let dosen = await Model_Dosen.getAll();
        res.render('users/admin/jadwal/edit', {
            id: data.id_jadwal,
            hari: data.hari,
            id_kelas: data.id_kelas,
            id_matakuliah: data.id_matakuliah,
            id_jurusan: data.id_jurusan,
            id_ruangan: data.id_ruangan,
            id_dosen: data.id_dosen,
            waktu: data.waktu,
            kelas,
            matakuliah,
            jurusan,
            ruangan,
            dosen
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.post('/update/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let { hari, id_kelas, id_matakuliah, id_jurusan, id_ruangan, id_dosen, waktu } = req.body;
        let data = { hari, id_kelas, id_matakuliah, id_jurusan, id_ruangan, id_dosen, waktu };
        await Model_Jadwal.update(id, data);
        res.redirect('/admin/jadwal');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/delete/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        await Model_Jadwal.delete(id);
        res.redirect('/admin/jadwal');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = routes;
