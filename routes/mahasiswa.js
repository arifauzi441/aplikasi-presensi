var express = require('express');
var router = express.Router();
const multer = require(`multer`)
const fs = require(`fs`)
const path = require(`path`)
const Model_Users = require(`../model/Model_Users`)
const Model_Mahasiswa = require(`../model/Model_Mahasiswa`)
const Model_Jadwal = require(`../model/Model_Jadwal`);
const Model_Presensi = require('../model/Model_Presensi');
const Model_History_Presensi = require('../model/Model_History_Presensi');
const Model_Materi = require('../model/Model_Materi');
const Model_Tugas = require('../model/Model_Tugas');
const Model_Pengumpulan = require('../model/Model_Pengumpulan');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/pengumpulan')
    },
    filename: function (req, file, cb) {
        idUnik = Date.now() + Math.floor(Math.random() * 1743872)
      cb(null, idUnik + ` - ` + file.originalname)
    }
})

const fileFilter = (req,file,cb,res) => {
    let extFile = path.extname(file.originalname).toLowerCase()
    if(extFile === `.png` || extFile === `.jpg` || extFile === `.jpeg` || extFile === `.docx` || extFile === `.pdf`){
        cb(null, true)
    }else{
        req.flash(`wrongExt`, `extension yang diizinkan yaitu png, jpg, dan jpeg`)
        cb(null, false)
    }
}
const upload = multer({ storage, fileFilter})


const auth = async (req, res, next) => {
  let data = await Model_Users.getUserId(req.session.userId)
  if(data && data.level_users === "dosen") return next()
    res.redirect(`/login`)
}

router.use(auth)

/* GET users listing. */
router.get('/beranda', async (req, res, next) => {
    let data = await Model_Users.getUserId(req.session.id)
    let dosen = await Model_Dosen.getByIdUser(req.session.id)
    res.render(`users/admin/index`)
});

router.get('/matakuliah', async (req, res, next) => {
    let jadwal = await Model_Jadwal.getJadwalByMahasiswa(req.session.id)
    res.render(`users/admin/index`, {jadwal})
});

router.get('/jadwal-online', async (req, res, next) => {
    let jadwal = await Model_Jadwal.getJadwalByMahasiswa(req.session.id)
    res.render(`users/admin/index`, {jadwal})
});

router.get(`/kuliah/detail/:id`, async (req, res, next) => {
    let id_jadwal = req.params.id

    let jadwalDetail = await Model_Jadwal.getById(id_jadwal)
    
    res.render(`matakuliah/detail`,{jadwal_detail})
})

router.get(`/kuliah/presensi/:id`, async (req, res, next) => {
    let id_jadwal = req.params.id

    let jadwalDetail = await Model_Jadwal.getById(id_jadwal)
    let mahasiswa = await Model_Mahasiswa.getByIdJadwal(id_jadwal)
    let presensi = await Model_Presensi.getPresensiByJadwal(id_jadwal)
    let presensiSekarang = await Model_Presensi.getNowPresensiByJadwal(id_jadwal)
    let statusPresensi = ``

    if(presensiSekarang.status == `terbuka`){
        let historyPresensi = await Model_History_Presensi.getHistoryPresensi(presensiSekarang.id_presensi, req.session.id)

        if(historyPresensi) statusPresensi = `selesai`
        else statusPresensi = `belum selesai`
    }else{
        statusPresensi = `selesai`
    }

    res.render(`matakuliah/presensi`,{
        jadwalDetail,
        mahasiswa,
        presensi,
        statusPresensi,
        presensiSekarang
    })
})

router.post(`/presensi`, async (req, res, next) => {

    try {
        let {id_presensi} = req.body
    
        let waktuSekarang = new Date()
        let jam = String(waktuSekarang.getHours()).padStart(2, `0`)
        let menit = String(waktuSekarang.getMinutes()).padStart(2, `0`)
        let detik = String(waktuSekarang.getSeconds()).padStart(2, `0`)
        let waktu_presensi = `${jam}:${menit}:${detik}`
    
        let id = await Model_Mahasiswa.getByIdUser(req.session.id)
        let id_mahasiswa = id.id_mahasiswa
    
        data = {
            id_presensi,
            waktu_presensi,
            id_mahasiswa
        }
        await Model_History_Presensi.addHistoryPresensi(data)

        res.redirect(`/kuliah/detail`)
    } catch (error) {
        console.log(error)
        res.redirect(`/kuliah/detail`)
    }
})

router.get(`/kuliah/materi/:id`, async (req, res, next) => {
    let id_jadwal  = req.params.id
    let data_materi = await Model_Materi.getMateriByJadwal(id_jadwal)

    res.render(`/materi`, {data_materi})
})

router.get(`/kuliah/tugas/:id`, async (req, res, next) => {
    let id_jadwal = req.params.id
    let data_tugas = await Model_Tugas.getTugasByJadwal(id_jadwal)
    
    res.render(`/tugas`, {data_tugas})
})

router.get(`/kuliah/tugas/detail/:id`, async (req, res, next) => {
    let id_tugas = req.params.id
    let mahasiswa = await Model_Mahasiswa.getByIdUser(req.session.id)
    let tugasDetail = await Model_Tugas.getTugasById(id_tugas)
    let pengumpulan = await Model_Pengumpulan.getPengumpulanByTugas(id_tugas, mahasiswa.id_mahasiswa)

    res.render(`tugas/detail`,{tugasDetail, pengumpulan})
})

router.post(`/storepengumpulan/:id`, upload.single(`file_pengumpulan`), async (req, res, next) => {
    try {
        let file_pengumpulan = `/pengumpulan/${req.file.filename}`
        let id_tugas = req.params.id
        
        let mahasiswa = await Model_Mahasiswa.getByIdUser(req.session.id)
        let id_mahasiswa = mahasiswa.id_mahasiswa
    
        let data = {
            file_pengumpulan,
            id_tugas,
            id_mahasiswa
        }
        await Model_Pengumpulan.addPengumpulan(data)
        
        res.redirect(`/mahasiswa/kuliah/tugas`)
    } catch (error) {
        console.log(error)
        res.redirect(`/mahasiswa/kuliah/tugas`)
    }
})

router.get(`/kuliah/tugas/editPengumpulan/:id`, async (req, res, next) => {
    let id_pengumpulan = req.params.id
    let dataPengumpulan = await Model_Pengumpulan.getPengumpulanById(id_pengumpulan)

    res.render(`edit`, {dataPengumpulan})
})

router.post(`/updatepengumpulan/:id`, upload.single(`file_pengumpulan`), async (req, res, next) => {
    let id_pengumpulan = req.params.id
    try {
        let {deskripsi} = req.body
        let dataPengumpulan = await Model_Pengumpulan.getPengumpulanById(id_pengumpulan)

        let file_pengumpulan = ``
        file_pengumpulan = (req.file) ? `/pengumpulan/${req.file.filename}` : dataPengumpulan.file_pengumpulan

        if(req.file) {
            let pathFileLama = path.join(__dirname, `../public/${dataPengumpulan.file_pengumpulan}`)
            fs.unlinkSync(pathFileLama)
        }

        data = {dataPengumpulan, file_pengumpulan, deskripsi}
        await Model_Pengumpulan.updatePengumpulan(data, id_pengumpulan)
        res.redirect(`/mahasiswa/kuliah/tugas`)
    } catch (error) {
        console.log(error)
        res.redirect(`mahasiswa/kuliah/tugas/editPengumpulan`)   
    }
})


module.exports = router;
