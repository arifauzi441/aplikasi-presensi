let express = require('express');
let routes = express.Router();
const Model_Users = require('../../model/Model_Users');

routes.get('/', async (req, res, next) => {
    try {
        let data = await Model_Users.getAll();
        res.render('users/admin/users/index', { data });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/create', (req, res, next) => {
    let userEmail = req.session.userEmail || '';
    res.render('users/admin/users/create', { 
        userEmail 
    }); 
});

routes.post('/store', async (req, res, next) => {
    try {
        let { email, password, level_users } = req.body;
        let data = { email, password, level_users };
        await Model_Users.storeData(data);

        // Simpan email ke session untuk digunakan di halaman mahasiswa/dosen
        req.session.userEmail = email;

        // Redirect berdasarkan level_users
        if (level_users === 'mahasiswa') {
            return res.redirect('/admin/mahasiswa/create');
        } else if (level_users === 'dosen') {
            return res.redirect('/admin/dosen/create');
        }

        res.redirect('/admin/user'); // Redirect ke halaman user jika level admin
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/edit/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let data = await Model_Users.getUserId(id);
        res.render('users/admin/users/edit', {
            id: data.id_users,
            email: data.email,
            password: data.password,
            level_users: data.level_users
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.post('/update/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let { email, password, level_users } = req.body;
        let data = { email, password, level_users };
        await Model_Users.updateData(id, data);
        res.redirect('/admin/user');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

routes.get('/delete/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        await Model_Users.deleteData(id);
        res.redirect('/admin/user');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = routes;
