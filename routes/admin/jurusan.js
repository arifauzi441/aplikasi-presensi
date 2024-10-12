let express = require('express');
let routes = express.Router();
const Model_Jurusan = require('../../model/Model_Jurusan');

routes.get('/', async (req, res, next) => {
    try {
        let data = await Model_Jurusan.getAll();
        res.render('users/admin/jurusan/index', {
            data
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/create', (req, res, next) => {
    res.render('users/admin/jurusan/create');
});

routes.post('/store', async (req, res, next) => {
    try {
        let { nama_jurusan } = req.body;
        let data = { nama_jurusan };
        await Model_Jurusan.store(data);
        res.redirect('/admin/jurusan');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/edit/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let data = await Model_Jurusan.getId(id);
        res.render('users/admin/jurusan/edit', {
            id: data[0].id_jurusan,
            nama_jurusan: data[0].nama_jurusan
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.post('/update/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let { nama_jurusan } = req.body;
        let data = { nama_jurusan };
        await Model_Jurusan.update(id, data);
        res.redirect('/admin/jurusan');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/delete/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        await Model_Jurusan.delete(id);
        res.redirect('/admin/jurusan');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = routes;
