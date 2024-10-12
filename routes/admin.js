var express = require('express');
var router = express.Router();
const Model_Users = require(`../model/Model_Users`)
var adminjurusanRouter = require('../routes/admin/jurusan');
var adminkelasRouter = require('../routes/admin/kelas');
var adminmatakuliahRouter = require('../routes/admin/matakuliah');
var adminruanganRouter = require('../routes/admin/ruangan');
var adminjadwalRouter = require('../routes/admin/jadwal');
var adminuserRouter = require('../routes/admin/user');
var adminmahasiswaRouter = require('../routes/admin/mahasiswa');
var admindosenRouter = require('../routes/admin/dosen');

const auth = async (req, res, next) => {
  let data = await Model_Users.getUserId(req.session.userId)
  if(data && data.level_users === "admin") return next()
    res.redirect(`/login`)
}

router.use(auth)

/* GET users listing. */
router.get('/beranda', function(req, res, next) {
  let data = Model_Users.getUserId(req.session.id)
  res.render(`users/admin/index`)
});

router.use('/jurusan', adminjurusanRouter);
router.use('/kelas', adminkelasRouter);
router.use('/matakuliah', adminmatakuliahRouter);
router.use('/ruangan', adminruanganRouter);
router.use('/jadwal', adminjadwalRouter);
router.use('/user', adminuserRouter);
router.use('/mahasiswa', adminmahasiswaRouter);
router.use('/dosen', admindosenRouter);

module.exports = router;
