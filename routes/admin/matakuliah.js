let express = require('express');
let routes = express.Router();
const Model_Matakuliah = require('../../model/Model_Matakuliah');

routes.get('/', async (req, res, next) => {
    try {
        let data = await Model_Matakuliah.getAll();
        res.render('users/admin/matakuliah/index', {
            data
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/create', (req, res, next) => {
    res.render('users/admin/matakuliah/create');
});

routes.post('/store', async (req, res, next) => {
    try {
        let { nama_matakuliah } = req.body;
        let data = { nama_matakuliah };
        await Model_Matakuliah.store(data);
        res.redirect('/matakuliah');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/edit/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let data = await Model_Matakuliah.getId(id);
        res.render('users/admin/matakuliah/edit', {
            id: data[0].id_matakuliah,
            nama_matakuliah: data[0].nama_matakuliah
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.post('/update/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let { nama_matakuliah } = req.body;
        let data = { nama_matakuliah };
        await Model_Matakuliah.update(id, data);
        res.redirect('/matakuliah');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/delete/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        await Model_Matakuliah.delete(id);
        res.redirect('/matakuliah');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = routes;
