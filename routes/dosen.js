var express = require('express');
var router = express.Router();
var path = require(`path`)
var fs = require(`fs`)
const Model_Users = require(`../model/Model_Users`)
const Model_Dosen = require(`../model/Model_Dosen`)
const Model_Jadwal = require(`../model/Model_Jadwal`);
const Model_Mahasiswa = require('../model/Model_Mahasiswa');
const Model_Presensi = require('../model/Model_Presensi');
const Model_Tugas = require('../model/Model_Tugas');

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
    let jadwal = await Model_Jadwal.getJadwalByDosen(req.session.id)
    res.render(`users/admin/index`, {jadwal})
});

router.get('/jadwal-online', async (req, res, next) => {
    let jadwal = await Model_Jadwal.getJadwalByDosen(req.session.id)
    res.render(`users/admin/index`, {jadwal})
});

router.get(`/kuliah/detail/:id`, async (req, res, next) => {
    let id_jadwal = req.params.id
    
    let jadwalDetail = await Model_Jadwal.getById(id_jadwal)

    res.render(`matakuliah/detail`,{jadwalDetail})
})

router.get(`/kuliah/presensi/:id`, async (req, res, next) => {
    let id_jadwal = req.params.id
    let dataPresensi = await Model_Presensi.getPresensiByJadwal(id_jadwal)
    let presensiSekarang = await Model_Presensi.getNowPresensiByJadwal(id_jadwal)
    let mahasiswa = await Model_Mahasiswa.getByIdJadwal(id_jadwal)
    let jadwalDetail = await Model_Jadwal.getById(id_jadwal)

    res.render(`matakuliah/detail`,{
        dataPresensi,
        status_presensi:presensiSekarang.status_presensi || "tertutup",
        mahasiswa,
        jadwalDetail
    })
})

router.post(`/buka_presensi`, async(req, res, next) => {
    try {
        let {id_jadwal} = req.body

        let dataPresensi = await Model_Presensi.getNowPresensiByJadwal(id_jadwal)
        let pertemuan = ""

        if(!dataPresensi) pertemuan = "pertemuan 1"
        else 
            pertemuan = dataPresensi.pertemuan.replace(/\d+$/,(p) =>{
                return parseInt(p) + 1
            })

        let waktuSekarang = new Date()
        let jam = String(waktuSekarang.getHours()).padStart(2, `0`)
        let menit = String(waktuSekarang.getMinutes()).padStart(2, `0`)
        let detik = String(waktuSekarang.getSeconds()).padStart(2, `0`)
        let waktu_buka = `${jam}:${menit}:${detik}`

        let jadwalSekarang = await Model_Jadwal.getById(id_jadwal)
        let [waktuJadwalBuka,waktuJadwalTutup] = jadwalSekarang.waktu.split(` - `)
        let [jamJadwalBuka,menitJadwalBuka] = waktuJadwalBuka.split(`:`).map(Number)
        let [jamJadwalTutup,menitJadwaltutup] = waktuJadwalTutup.split(`:`).map(Number)
        let selisihMenit = ((jamJadwalTutup*60) + menitJadwaltutup) - ((jamJadwalBuka*60) + menitJadwalBuka) 

        waktuSekarang.setMinutes(waktuSekarang.getMinutes() + selisihMenit)
        let waktu_tutup = `${waktuSekarang.getHours()}:${waktuSekarang.getMinutes()}:${waktuSekarang.getSeconds()}`
        
        let tahunSekarang = waktuSekarang.getFullYear()
        let bulanSekarang = String(waktuSekarang.getMonth() + 1).padStart(2, `0`)
        let hariSekarang = String(waktuSekarang.getDate()).padStart(2, `0`)
        let tanggal = `${tahunSekarang}-${bulanSekarang}-${hariSekarang}`

        let namaHari = [`minggu`,`senin`,`selasa`,`rabu`,`kamis`,`jumat`,`sabtu`]
        let hari = namaHari[waktuSekarang.getDay()]

        let status_presensi = "terbuka"

        let data = {
            id_jadwal,
            hari,
            pertemuan, 
            waktu_tutup,
            waktu_buka,
            tanggal,
            status_presensi
        }
        await Model_Presensi.addPresensi(data)

        let idPresensi = await Model_Presensi.getIdPresensi(id_jadwal)

        setTimeout(async() => {
            await Model_Presensi.updateStatusPresensi("tertutup",idPresensi)
        },selisihMenit * 60000)

        res.redirect(`/kuliah/detail`)
    } catch (error) {
        console.log(error)
        res.redirect(`/kuliah/detail`)
    }
})

router.post(`/tutup_presensi`, async (req, res, next) => {
    let {id_jadwal} = req.body

    try {
        let idPresensi = await Model_Presensi.getIdPresensi(id_jadwal)
        await Model_Presensi.updateStatusPresensi("tertutup",idPresensi)
        res.redirect(`/kuliah/detail`)
    } catch (error) {
        console.log(error)
        res.redirect(`/kuliah/detail`)
    }
})

router.get(`/kuliah/tugas/:id`, async (req, res, next) => {
    let id_jadwal = req.params.id
    let data_tugas = await Model_Tugas.getTugasByJadwal(id_jadwal)
    
    res.render(`/tugas`, {data_tugas})
})

router.get(`/kuliah/tugas/detail/:id`, async (req, res, next) => {
    let id_tugas = req.params.id
    let tugasDetail = await Model_Tugas.getTugasById(id_tugas)
    
    res.render(`tugas/detail`, {tugasDetail})
})

router.get(`/kuliah/tugas/:id/create`, async (req, res, next) => {
    let id_jadwal = req.params.id
    res.render(`tugas/create`,{id_jadwal})
})

router.post(`/kuliah/tugas/:id/store`, upload.single(`file_tugas`), async (req, res, next) => {
    let id_jadwal = req.params.id
    try {
        let {judul_tugas} = req.body
        let {file_tugas} = `/tugas/${req.file.filename}`
        
        let data = {
            id_jadwal,
            judul_tugas,
            file_tugas
        }
        await Model_Tugas.addTugas(data)
        
        res.redirect(`/kuliah/tugas/:${id_jadwal}`)
    } catch (error) {
        console.log(error)
        res.redirect(`/kuliah/tugas/:${id_jadwal}`)
    }
})

router.get(`/kuliah/tugas/:id/edit`, async (req, res, next) => {
    let id_tugas = req.params.id
    let tugasDetail = await Model_Tugas.getTugasById(id_tugas)
    
    res.render(`/`, {tugasDetail})
})

router.post(`/kuliah/tugas/:id/update`, upload.single(`file_tugas`), async (req, res, next) => {
    let id_tugas = req.params.id
    try {
        let {judul_tugas} = req.body
        let tugasDetail = await Model_Tugas.getTugasById(id_tugas)
        
        let file_tugas = ``
        file_tugas = (req.file) ? `/tugas/${req.file.filename}` : tugasDetail.file_tugas 
    
        if(req.file) {
            let pathFileLama = path.join(__dirname, `../public/${tugasDetail.file_tugas}`)
            fs.unlinkSync(pathFileLama)
        }
        data = {
            judul_tugas,
            file_tugas
        }
        await Model_Tugas.updateTugas(id_tugas, data)
        res.redirect(`/kuliah/tugas/${tugasDetail.id_jadwal}`)
    } catch (error) {
        console.log(error)
        res.redirect(`/kuliah/tugas/${tugasDetail.id_jadwal}`)
    }
})

router.post(`/kuliah/tugas/:id/delete`, async (req, res, next) => {
    let id_tugas = req.params.id
    try {
        let tugasDetail = await Model_Tugas.getTugasById(id_tugas) 
        let id_jadwal = tugasDetail.id_jadwal
    
        let pathFileLama = path.join(__dirname, `../public/${tugasDetail.file_tugas}`)
        fs.unlinkSync(pathFileLama)
    
        await Model_Tugas.deleteTugas(id_tugas)
        res.redirect(`/kuliah/tugas/${id_jadwal}`)
    } catch (error) {
        console.log(error)
        res.redirect(`/kuliah/tugas/${id_jadwal}`)
    }
})


module.exports = router;
