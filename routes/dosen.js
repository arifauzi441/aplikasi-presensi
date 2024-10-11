var express = require('express');
var router = express.Router();
var path = require(`path`)
var fs = require(`fs`)
var multer = require(`multer`)
const Model_Users = require(`../model/Model_Users`)
const Model_Dosen = require(`../model/Model_Dosen`)
const Model_Jadwal = require(`../model/Model_Jadwal`);
const Model_Mahasiswa = require('../model/Model_Mahasiswa');
const Model_Presensi = require('../model/Model_Presensi');
const Model_Tugas = require('../model/Model_Tugas');
const Model_Materi = require(`../model/Model_Materi`)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.fieldname === `file_materi`){
            cb(null, 'public/materi')
        }else if(file.fieldname === `file_tugas`){
            cb(null, `public/tugas`)
        }
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
    let data = await Model_Users.getUserId(req.session.userId)
    let dosen = await Model_Dosen.getByIdUser(req.session.userId)
    let jadwal = await Model_Jadwal.getJadwalByDosen(req.session.userId)
    res.render(`dosen/landing_page/pagelanding`,{dosen, jadwal})
});

router.get('/matakuliah', async (req, res, next) => {
    let jadwal = await Model_Jadwal.getJadwalByDosen(req.session.userId)
    res.render(`dosen/matakuliah/matakuliah`, {jadwal})
});

router.get('/jadwal-online', async (req, res, next) => {
    let jadwal = await Model_Jadwal.getJadwalByDosen(req.session.userId)
    res.render(`dosen/jadwal-kuliah/jadwalkuliah`, {jadwal})
})

router.get(`/kuliah/detail/:id`, async (req, res, next) => {
    let id_jadwal = req.params.id
    
    let jadwalDetail = await Model_Jadwal.getId(id_jadwal)
    let dosen = await Model_Dosen.getByIdUser(req.session.userId)
    
    if(jadwalDetail.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)

    res.render(`dosen/detail_matkul/detailmatkul`,{jadwalDetail})
})

router.get(`/kuliah/presensi/:id`, async (req, res, next) => {
    let id_jadwal = req.params.id
    let data_presensi = await Model_Presensi.getPresensiByJadwal(id_jadwal)
    let presensiSekarang = await Model_Presensi.getNowPresensiByJadwal(id_jadwal)
    let mahasiswa = await Model_Mahasiswa.getMahasiswaByJadwal(id_jadwal)
    let jadwalDetail = await Model_Jadwal.getId(id_jadwal)
    let dosen = await Model_Dosen.getByIdUser(req.session.userId)

    if(jadwalDetail.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)

    let jml_lk = mahasiswa.filter(m => m.jenis_kelamin === "L").length
    let jml_pr = mahasiswa.filter(m => m.jenis_kelamin === "P").length
    let jumlah = jml_lk + jml_pr

    if(data_presensi){
        data_presensi.forEach(data_presensi => {
            data_presensi.tanggal = data_presensi.tanggal.toLocaleDateString(`en-CA`)
        })
    }
    if(presensiSekarang) presensiSekarang.tanggal = presensiSekarang.tanggal.toLocaleDateString(`en-CA`)

    res.render(`dosen/presensi/presensi`,{
        data_presensi,
        statusPresensi:presensiSekarang?.status_presensi || "tertutup",
        mahasiswa,
        jadwalDetail,
        presensiSekarang,
        jml_lk,
        jml_pr,
        jumlah
    })
})

router.get('/kuliah/presensi/detail', async (req, res, next) => {
    
    res.render(`dosen/presensi/detail_presensi`)
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
        
        let namaHari = [`minggu`,`senin`,`selasa`,`rabu`,`kamis`,`jumat`,`sabtu`]
        let hari = namaHari[waktuSekarang.getDay()]

        let dosen = await Model_Dosen.getByIdUser(req.session.userId)
        let jadwalSekarang = await Model_Jadwal.getId(id_jadwal)
        if(jadwalSekarang.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)

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

        res.redirect(`/dosen/kuliah/presensi/${id_jadwal}`)
    } catch (error) {
        console.log(error)
        res.redirect(`/dosen/kuliah/presensi/${id_jadwal}`)
    }
})

router.post(`/tutup_presensi`, async (req, res, next) => {
    let {id_presensi, id_jadwal} = req.body

    try {
        let jadwalDetail = await Model_Jadwal.getId(id_jadwal)
        let dosen = await Model_Dosen.getByIdUser(req.session.userId)
        
        if(jadwalDetail.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)

        await Model_Presensi.updateStatusPresensi("tertutup",id_presensi)
        
        res.redirect(`/dosen/kuliah/presensi/${id_jadwal}`)
    } catch (error) {
        console.log(error)
        res.redirect(`/dosen/kuliah/presensi/${id_jadwal}`)
    }
})

router.get(`/kuliah/tugas/:id`, async (req, res, next) => {
    let id_jadwal = req.params.id
    let data_tugas = await Model_Tugas.getTugasByJadwal(id_jadwal)
    let jadwalDetail = await Model_Jadwal.getId(id_jadwal)
    let dosen = await Model_Dosen.getByIdUser(req.session.userId)

    if(jadwalDetail.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)

    data_tugas.forEach(data_tugas => {
        data_tugas.tanggal_deadline = data_tugas.tanggal_deadline.toLocaleDateString(`en-CA`)
    });
    
    res.render(`dosen/upload_tugas/upload_tugas_dosen`, {data_tugas, jadwalDetail})
})

router.get(`/kuliah/tugas/detail/:id`, async (req, res, next) => {
    let id_tugas = req.params.id
    let tugasDetail = await Model_Tugas.getTugasById(id_tugas)
    let jadwalDetail = await Model_Jadwal.getId(tugasDetail.id_jadwal)
    let dosen = await Model_Dosen.getByIdUser(req.session.userId)

    if(jadwalDetail.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)

    let [temp, file_name] = tugasDetail.file_tugas.split(` - `)
    tugasDetail.tanggal_deadline = tugasDetail.tanggal_deadline.toLocaleDateString(`en-CA`)
    
    res.render(`dosen/detail_tugas/detail_tugas` , {tugasDetail, jadwalDetail, file_name})
})

router.get(`/kuliah/tugas/:id/create`, async (req, res, next) => {
    let id_jadwal = req.params.id
    let jadwalDetail = await Model_Jadwal.getId(id_jadwal)
    let dosen = await Model_Dosen.getByIdUser(req.session.userId)

    if(jadwalDetail.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)

    res.render(`dosen/form-tugas/formtugas`,{id_jadwal, jadwalDetail})
})

router.post(`/kuliah/tugas/:id/store`, upload.single(`file_tugas`), async (req, res, next) => {
    let id_jadwal = req.params.id
    try {
        let {judul_tugas, tanggal_deadline, jam, menit, deskripsi} = req.body
        let jadwalDetail = await Model_Jadwal.getId(id_jadwal)
        let dosen = await Model_Dosen.getByIdUser(req.session.userId)
        
        if(jadwalDetail.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)

        let file_tugas = ``
        if(req.file) file_tugas = `/tugas/${req.file.filename}`
            
        let waktu = new Date(tanggal_deadline)
        let namaHari = [`minggu`,`senin`,`selasa`,`rabu`,`kamis`,`jumat`,`sabtu`,`minggu`]
        let hari_deadline = namaHari[waktu.getDay()]

        waktu_deadline = `${jam.padStart(2, '0')}:${menit.padStart(2, `0`)}:00`
        
        let data = {
            id_jadwal,
            judul_tugas,
            file_tugas,
            deskripsi,
            tanggal_deadline,
            waktu_deadline,
            hari_deadline
        }
        await Model_Tugas.addTugas(data)
        
        res.redirect(`/dosen/kuliah/tugas/${id_jadwal}`)
    } catch (error) {
        console.log(error)
        res.redirect(`/dosen/kuliah/tugas/${id_jadwal}/create`)
    }
})

router.get(`/kuliah/tugas/:id/edit`, async (req, res, next) => {
    let id_tugas = req.params.id
    let tugasDetail = await Model_Tugas.getTugasById(id_tugas)
    let jadwalDetail = await Model_Jadwal.getId(tugasDetail.id_jadwal)
    let dosen = await Model_Dosen.getByIdUser(req.session.userId)

    if(jadwalDetail.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)
    
    res.render(`dosen/form-edit-tugas/formedittugas`, {tugasDetail, jadwalDetail})
})

router.post(`/kuliah/tugas/:id/update`, upload.single(`file_tugas`), async (req, res, next) => {
    let id_tugas = req.params.id
    try {
        let {judul_tugas, tanggal_deadline, jam, menit, deskripsi} = req.body
        let tugasDetail = await Model_Tugas.getTugasById(id_tugas)
        let jadwalDetail = await Model_Jadwal.getId(tugasDetail.id_jadwal)
        let dosen = await Model_Dosen.getByIdUser(req.session.userId)
        
        if(jadwalDetail.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)
        
        if(tanggal_deadline === ``) tanggal_deadline = tugasDetail.tanggal_deadline.toLocaleDateString(`en-CA`)
        let waktu = new Date(tanggal_deadline)
        let namaHari = [`minggu`,`senin`,`selasa`,`rabu`,`kamis`,`jumat`,`sabtu`,`minggu`]
        let hari_deadline = namaHari[waktu.getDay()]

        let waktu_deadline = ``
        if(jam === `` && menit === ``) {
            waktu_deadline = tugasDetail.waktu_deadline
        }else{
            waktu_deadline = `${jam.padStart(2, `0`)}:${menit.padStart(2, `0`)}:00`
        }

        let file_tugas = ``
        file_tugas = (req.file) ? `/tugas/${req.file.filename}` : tugasDetail.file_tugas 

        if(req.file) {
            let pathFileLama = path.join(__dirname, `../public/${tugasDetail.file_tugas}`)
            fs.unlinkSync(pathFileLama)
        }
        data = {
            judul_tugas,
            file_tugas,
            waktu_deadline,
            tanggal_deadline,
            deskripsi,
            hari_deadline
        }
        await Model_Tugas.updateTugas(id_tugas, data)
        res.redirect(`/dosen/kuliah/tugas/${tugasDetail.id_jadwal}`)
    } catch (error) {
        console.log(error)
        res.redirect(`/dosen/kuliah/tugas/${tugasDetail.id_tugas}/edit`)
    }
})

router.get(`/kuliah/tugas/:id/delete`, async (req, res, next) => {
    let id_tugas = req.params.id
    try {
        let tugasDetail = await Model_Tugas.getTugasById(id_tugas)
        let id_jadwal = tugasDetail.id_jadwal
        let jadwalDetail = await Model_Jadwal.getId(id_jadwal)
        let dosen = await Model_Dosen.getByIdUser(req.session.userId)
        
        if(jadwalDetail.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)
    
        let pathFileLama = path.join(__dirname, `../public/${tugasDetail.file_tugas}`)
        fs.unlinkSync(pathFileLama)
    
        await Model_Tugas.deleteTugas(id_tugas)
        res.redirect(`/dosen/kuliah/tugas/${id_jadwal}`)
    } catch (error) {
        console.log(error)
        res.redirect(`/dosen/kuliah/tugas/${id_jadwal}`)
    }
})

router.get(`/kuliah/materi/:id`, async (req, res, next) => {
    let id_jadwal = req.params.id
    let data_materi = await Model_Materi.getMateriByJadwal(id_jadwal)
    let jadwalDetail = await Model_Jadwal.getId(id_jadwal)
    let dosen = await Model_Dosen.getByIdUser(req.session.userId)
        
    if(jadwalDetail.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)

    let temp = []
    let nama_file = []

    for(i = 0; i < data_materi.length; i++){
        [temp[i],nama_file[i]] = data_materi[i].file_materi.split(` - `)
        data_materi[i].tanggal_upload = data_materi[i].tanggal_upload.toLocaleDateString(`en-CA`)
    }
    
    res.render(`dosen/upload_materi/upload_materi_dosen`, {data_materi, jadwalDetail, nama_file})
})

router.get(`/kuliah/materi/:id/create`, async (req, res, next) => {
    let id_jadwal = req.params.id
    let jadwalDetail = await Model_Jadwal.getId(id_jadwal)
    let dosen = await Model_Dosen.getByIdUser(req.session.userId)
    
    if(jadwalDetail.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)

    res.render(`dosen/form-materi/formmateri`,{jadwalDetail})
})

router.post(`/kuliah/materi/:id/store`, upload.single(`file_materi`), async (req, res, next) => {
    let id_jadwal = req.params.id
    try {
        let {judul_materi} = req.body
        let file_materi = `/materi/${req.file.filename}`
        let jadwalDetail = await Model_Jadwal.getId(id_jadwal)
        let dosen = await Model_Dosen.getByIdUser(req.session.userId)

        if(jadwalDetail.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)

        let waktuSekarang = new Date()
        let tahunSekarang = waktuSekarang.getFullYear()
        let bulanSekarang = String(waktuSekarang.getMonth() + 1).padStart(2, `0`)
        let hariSekarang = String(waktuSekarang.getDate()).padStart(2, `0`)
        let tanggal_upload = `${tahunSekarang}-${bulanSekarang}-${hariSekarang}`

        let jam = String(waktuSekarang.getHours()).padStart(2, `0`)
        let menit = String(waktuSekarang.getMinutes()).padStart(2, `0`)
        let detik = String(waktuSekarang.getSeconds()).padStart(2, `0`)
        let waktu_upload = `${jam}:${menit}:${detik}`
        
        let namaHari = [`minggu`,`senin`,`selasa`,`rabu`,`kamis`,`jumat`,`sabtu`,`minggu`]
        let hari = namaHari[waktuSekarang.getDay()]

        let data = {
            id_jadwal,
            judul_materi,
            file_materi,
            tanggal_upload,
            hari,
            waktu_upload
        }
        await Model_Materi.addMateri(data)

        console.log(data)
        
        res.redirect(`/dosen/kuliah/materi/${id_jadwal}`)
    } catch (error) {
        console.log(error)
        res.redirect(`/dosen/kuliah/materi/${id_jadwal}/create`)
    }
})

router.get(`/kuliah/materi/:id/edit`, async (req, res, next) => {
    let id_materi = req.params.id
    let materiDetail = await Model_Materi.getMateriById(id_materi)
    let jadwalDetail = await Model_Jadwal.getId(materiDetail.id_jadwal)
    let dosen = await Model_Dosen.getByIdUser(req.session.userId)

    if(jadwalDetail.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)
    
    res.render(`dosen/form-edit-materi/formeditmateri`, {jadwalDetail, materiDetail})
})

router.post(`/kuliah/materi/:id/update`, upload.single(`file_materi`), async (req, res, next) => {
    let id_materi = req.params.id
    try {
        let {judul_materi} = req.body
        let materiDetail = await Model_Materi.getMateriById(id_materi)
        let jadwalDetail = await Model_Jadwal.getId(materiDetail.id_jadwal)
        let dosen = await Model_Dosen.getByIdUser(req.session.userId)

        if(jadwalDetail.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)
        
        let file_materi = ``
        file_materi = (req.file) ? `/materi/${req.file.filename}` : materiDetail.file_materi 
    
        if(req.file) {
            let pathFileLama = path.join(__dirname, `../public/${materiDetail.file_materi}`)
            fs.unlinkSync(pathFileLama)
        }
        data = {
            judul_materi,
            file_materi
        }
        await Model_Materi.updateMateri(id_materi, data)
        res.redirect(`/dosen/kuliah/materi/${materiDetail.id_jadwal}`)
    } catch (error) {
        console.log(error)
        res.redirect(`/dosen/kuliah/materi/${materiDetail.id_jadwal}`)
    }
})

router.get(`/kuliah/materi/:id/delete`, async (req, res, next) => {
    let id_materi = req.params.id
    try {
        let materiDetail = await Model_Materi.getMateriById(id_materi) 
        let id_jadwal = materiDetail.id_jadwal
        let jadwalDetail = await Model_Jadwal.getId(id_jadwal)
        let dosen = await Model_Dosen.getByIdUser(req.session.userId)

        if(jadwalDetail.id_dosen !== dosen.id_dosen) return res.redirect(`/login`)
        
        let pathFileLama = path.join(__dirname, `../public/${materiDetail.file_materi}`)
        fs.unlinkSync(pathFileLama)
    
        await Model_Materi.deleteMateri(id_materi)
        res.redirect(`/dosen/kuliah/materi/${id_jadwal}`)
    } catch (error) {
        console.log(error)
        res.redirect(`/dosen/kuliah/materi/${id_jadwal}`)
    }
})


module.exports = router;
