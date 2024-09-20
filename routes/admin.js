var express = require('express');
var router = express.Router();
const Model_Users = require(`../model/Model_Users`)
const adminDosenRouter = require(`./admin/dosen`)
const adminJadwalRouter = require(`./admin/jadwal`)
const adminJurusanRouter = require(`./admin/jurusan`)
const adminKelasRouter = require(`./admin/kelas`)
const adminMahasiswaRouter = require(`./admin/mahasiswa`)
const adminMatakuliahRouter = require(`./admin/matakuliah`)
const adminRuanganRouter = require(`./admin/ruangan`)
const adminUserRouter = require(`./admin/user`)

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

router.use(`/dosen`, adminDosenRouter)
router.use(`/jadwal`, adminJadwalRouter)
router.use(`/jurusan`, adminJurusanRouter)
router.use(`/kelas`, adminKelasRouter)
router.use(`/mahasiswa`, adminMahasiswaRouter)
router.use(`/matakuliah`, adminMatakuliahRouter)
router.use(`/ruangan`, adminRuanganRouter)
router.use(`/user`, adminUserRouter)


module.exports = router;
