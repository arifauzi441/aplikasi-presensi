let express = require('express');
let routes = express.Router();
const Model_Dosen = require('../../model/Model_Dosen');
const Model_Users = require('../../model/Model_Users');

routes.get('/', async (req, res, next) => {
    try {
        let data = await Model_Dosen.getAll();
        res.render('users/admin/dosen/index', {
            data
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/create', async (req, res, next) => {
    try {
        let users = await Model_Users.getAll();
        let userEmail = req.session.userEmail || '';
        res.render('users/admin/dosen/create', {
            userEmail,
            users
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.post('/store', async (req, res, next) => {
    try {
        let email = req.session.userEmail;
        let { nama_dosen, nip, jenis_kelamin } = req.body;
        let id_users = await Model_Users.getIdByEmail(email);
        let data = { 
            nama_dosen, 
            nip, 
            jenis_kelamin, 
            id_users };
        await Model_Dosen.store(data);
        req.session.userEmail = null;
        res.redirect('/admin/dosen');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/edit/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let data = await Model_Dosen.getId(id);
        let users = await Model_Users.getAll();
        res.render('users/admin/dosen/edit', {
            id: data[0].id_dosen,
            nama_dosen: data[0].nama_dosen,
            nip: data[0].nip,
            jenis_kelamin: data[0].jenis_kelamin,
            id_users: data[0].id_users,
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
        let { nama_dosen, nip, jenis_kelamin, id_users } = req.body;
        let data = { nama_dosen, nip, jenis_kelamin, id_users };
        await Model_Dosen.update(id, data);
        res.redirect('/admin/dosen');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/delete/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        await Model_Dosen.delete(id);
        res.redirect('/admin/dosen');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = routes;
