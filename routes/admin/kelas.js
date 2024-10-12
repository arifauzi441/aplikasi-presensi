let express = require('express');
let routes = express.Router();
const Model_Kelas = require('../../model/Model_Kelas');

routes.get('/', async (req, res, next) => {
    try {
        let data = await Model_Kelas.getAll();
        res.render('users/admin/kelas/index', {
            data
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/create', (req, res, next) => {
    res.render('users/admin/kelas/create');
});

routes.post('/store', async (req, res, next) => {
    try {
        let { nama_kelas } = req.body;
        let data = { nama_kelas };
        await Model_Kelas.store(data);
        res.redirect('/admin/kelas');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/edit/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let data = await Model_Kelas.getId(id);
        res.render('users/admin/kelas/edit', {
            id: data[0].id_kelas,
            nama_kelas: data[0].nama_kelas
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.post('/update/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let { nama_kelas } = req.body;
        let data = { nama_kelas };
        await Model_Kelas.update(id, data);
        res.redirect('/admin/kelas');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/delete/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        await Model_Kelas.delete(id);
        res.redirect('/admin/kelas');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = routes;
