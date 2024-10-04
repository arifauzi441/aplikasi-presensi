let express = require('express');
let routes = express.Router();
const Model_Ruangan = require('../../model/Model_Ruangan');

routes.get('/', async (req, res, next) => {
    try {
        let data = await Model_Ruangan.getAll();
        res.render('users/admin/ruangan/index', {
            data
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/create', (req, res, next) => {
    res.render('users/admin/ruangan/create');
});

routes.post('/store', async (req, res, next) => {
    try {
        let { nama_ruangan } = req.body;
        let data = { nama_ruangan };
        await Model_Ruangan.store(data);
        res.redirect('/ruangan');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/edit/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let data = await Model_Ruangan.getId(id);
        res.render('users/admin/ruangan/edit', {
            id: data[0].id_ruangan,
            nama_ruangan: data[0].nama_ruangan
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.post('/update/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let { nama_ruangan } = req.body;
        let data = { nama_ruangan };
        await Model_Ruangan.update(id, data);
        res.redirect('/ruangan');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/delete/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        await Model_Ruangan.delete(id);
        res.redirect('/ruangan');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = routes;
