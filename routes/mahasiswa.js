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
  if(data && data.level_users === "mahasiswa") return next()
    res.redirect(`/login`)
}

router.use(auth)

/* GET users listing. */
router.get('/beranda', async (req, res, next) => {
    let mahasiswa = await Model_Mahasiswa.getByIdUser(req.session.userId)
    let jadwal = await Model_Jadwal.getJadwalByMahasiswa(req.session.userId)
    console.log(mahasiswa)
    res.render(`mahasiswa/landing_page/pagelanding`,{mahasiswa, jadwal})
});

router.get('/matakuliah', async (req, res, next) => {
    let jadwal = await Model_Jadwal.getJadwalByMahasiswa(req.session.userId)
    res.render(`mahasiswa/matakuliah/matakuliah`, {jadwal})
});

router.get('/jadwal-online', async (req, res, next) => {
    let jadwal = await Model_Jadwal.getJadwalByMahasiswa(req.session.userId)
    res.render(`mahasiswa/jadwal-kuliah/jadwalkuliah`, {jadwal})
});

router.get(`/kuliah/detail/:id`, async (req, res, next) => {
    let id_jadwal = req.params.id
    let jadwalDetail = await Model_Jadwal.getId(id_jadwal)
    let jadwalMahasiswa = await Model_Mahasiswa.getByIdUser(req.session.userId)

    if(jadwalDetail.id_jurusan !== jadwalMahasiswa.id_jurusan && jadwalDetail.id_kelas !== jadwalMahasiswa.id_kelas) return res.redirect(`/login`)
        
        res.render(`mahasiswa/detail_matkul/detailmatkul`,{jadwalDetail})
    })
    
router.get(`/kuliah/presensi/:id`, async (req, res, next) => {
    let id_jadwal = req.params.id
    
    let jadwalDetail = await Model_Jadwal.getId(id_jadwal)
    let mahasiswa = await Model_Mahasiswa.getMahasiswaByJadwal(id_jadwal)
    let data_presensi = await Model_Presensi.getPresensiByJadwal(id_jadwal)
    let presensiSekarang = await Model_Presensi.getNowPresensiByJadwal(id_jadwal)
    let statusPresensi = ``
    let jadwalMahasiswa = await Model_Mahasiswa.getByIdUser(req.session.userId)
    
    if(jadwalDetail.id_jurusan !== jadwalMahasiswa.id_jurusan && jadwalDetail.id_kelas !== jadwalMahasiswa.id_kelas) return res.redirect(`/login`)
        
    if(presensiSekarang && presensiSekarang.status_presensi == `terbuka`){
        let historyPresensi = await Model_History_Presensi.getHistoryPresensi(presensiSekarang.id_presensi, req.session.userId)
        statusPresensi = historyPresensi.length > 0 ? `selesai` : "belum selesai"
    }else{
        statusPresensi = `selesai`
    }

    let jml_lk = mahasiswa.filter(m => m.jenis_kelamin === "L").length
    let jml_pr = mahasiswa.filter(m => m.jenis_kelamin === "P").length
    let jumlah = jml_lk + jml_pr

    data_presensi.forEach(data_presensi => {
        data_presensi.tanggal = data_presensi.tanggal.toLocaleDateString(`en-CA`)
    })
    
    if(presensiSekarang) presensiSekarang.tanggal = presensiSekarang.tanggal.toLocaleDateString(`en-CA`)
    
    res.render(`mahasiswa/presensi/presensi`,{
        jadwalDetail,
        mahasiswa,
        data_presensi,
        statusPresensi,
        presensiSekarang,
        jml_lk,
        jml_pr,
        jumlah
    })
})

router.post(`/presensi`, async (req, res, next) => {
    
    try {
        let {id_presensi, id_jadwal} = req.body
        
        let presensi = await Model_Presensi.getById(id_presensi)
        let historyPresensi = await Model_History_Presensi.getHistoryPresensi(id_presensi, req.session.userId)
        if(presensi.status_presensi === `tertutup` || !historyPresensi) return res.redirect(`//mahasiswa/kuliah/presensi/${id_jadwal}`)
            
        let waktuSekarang = new Date()
        let jam = String(waktuSekarang.getHours()).padStart(2, `0`)
        let menit = String(waktuSekarang.getMinutes()).padStart(2, `0`)
        let detik = String(waktuSekarang.getSeconds()).padStart(2, `0`)
        let waktu_presensi = `${jam}:${menit}:${detik}`
        
        let id = await Model_Mahasiswa.getByIdUser(req.session.userId)
        let id_mahasiswa = id.id_mahasiswa
        
        data = {
            id_presensi,
            waktu_presensi,
            id_mahasiswa
        }
        await Model_History_Presensi.addHistoryPresensi(data)
        
        res.redirect(`/mahasiswa/kuliah/presensi/${id_jadwal}`)
    } catch (error) {
        console.log(error)
        res.redirect(`/mahasiswa/kuliah/detail/${id_jadwal}`)
    }
})

router.get(`/kuliah/materi/:id`, async (req, res, next) => {
    let id_jadwal  = req.params.id
    let jadwalDetail = await Model_Jadwal.getId(id_jadwal)
    let data_materi = await Model_Materi.getMateriByJadwal(id_jadwal)
    let jadwalMahasiswa = await Model_Mahasiswa.getByIdUser(req.session.userId)
    
    if(jadwalDetail.id_jurusan !== jadwalMahasiswa.id_jurusan && jadwalDetail.id_kelas !== jadwalMahasiswa.id_kelas) return res.redirect(`/login`)
    
    let temp = []
    let nama_file = []
    for(i = 0; i < data_materi.length; i++){
        [temp[i],nama_file[i]] = data_materi[i].file_materi.split(` - `)
        data_materi[i].tanggal_upload = data_materi[i].tanggal_upload.toLocaleDateString(`en-CA`)
    }
    
    res.render(`mahasiswa/materi_user/materi_user`, {data_materi, jadwalDetail, nama_file})
})

router.get(`/kuliah/tugas/:id`, async (req, res, next) => {
    let id_jadwal = req.params.id
    let data_tugas = await Model_Tugas.getTugasByJadwal(id_jadwal)
    let jadwalDetail = await Model_Jadwal.getId(id_jadwal)
    let jadwalMahasiswa = await Model_Mahasiswa.getByIdUser(req.session.userId)
    
    if(jadwalDetail.id_jurusan !== jadwalMahasiswa.id_jurusan && jadwalDetail.id_kelas !== jadwalMahasiswa.id_kelas) return res.redirect(`/login`)
        
        data_tugas.forEach(data_tugas => {
            data_tugas.tanggal_deadline = data_tugas.tanggal_deadline.toLocaleDateString(`en-CA`)
        })
        
        res.render(`mahasiswa/tugas_user/tugas_user`, {data_tugas, jadwalDetail})
    })
    
router.get(`/kuliah/tugas/detail/:id`, async (req, res, next) => {
    let id_tugas = req.params.id
    let mahasiswa = await Model_Mahasiswa.getByIdUser(req.session.userId)
    let tugasDetail = await Model_Tugas.getTugasById(id_tugas)
    let jadwalDetail = await Model_Jadwal.getId(tugasDetail.id_jadwal)
    let pengumpulan = await Model_Pengumpulan.getPengumpulanByTugas(id_tugas, mahasiswa.id_mahasiswa)
    let jadwalMahasiswa = await Model_Mahasiswa.getByIdUser(req.session.userId)

    console.log(pengumpulan)
    
    if(jadwalDetail.id_jurusan !== jadwalMahasiswa.id_jurusan && jadwalDetail.id_kelas !== jadwalMahasiswa.id_kelas) return res.redirect(`/login`)
    
    let [temp, file_name] = tugasDetail.file_tugas.split(` - `)
    tugasDetail.tanggal_deadline = tugasDetail.tanggal_deadline.toLocaleDateString(`en-CA`)

    let temp2 = ``
    let file_pengumpulan_name = ``
    if(pengumpulan){
        [temp2, file_pengumpulan_name] = pengumpulan.file_pengumpulan.split(` - `)
        pengumpulan.tanggal_pengumpulan = pengumpulan.tanggal_pengumpulan.toLocaleDateString(`en-CA`)
    }

    res.render(`mahasiswa/detail_tugas/detail_tugas`,{tugasDetail, pengumpulan, jadwalDetail, file_name, file_pengumpulan_name})
})

router.post(`/storepengumpulan/:id`, upload.single(`file_pengumpulan`), async (req, res, next) => {
    let {deskripsi} = req.body
    try {
        let file_pengumpulan = `/pengumpulan/${req.file.filename}`
        let id_tugas = req.params.id
        
        let mahasiswa = await Model_Mahasiswa.getByIdUser(req.session.userId)
        let id_mahasiswa = mahasiswa.id_mahasiswa

        let waktuSekarang = new Date()
        let jam = String(waktuSekarang.getHours()).padStart(2, `0`)
        let menit = String(waktuSekarang.getMinutes()).padStart(2, `0`)
        let detik = String(waktuSekarang.getSeconds()).padStart(2, `0`)
        let waktu_pengumpulan = `${jam}:${menit}:${detik}`

        let namaHari = [`minggu`,`senin`,`selasa`,`rabu`,`kamis`,`jumat`,`sabtu`]
        let hari_pengumpulan = namaHari[waktuSekarang.getDay()]

        let tahunSekarang = waktuSekarang.getFullYear()
        let bulanSekarang = String(waktuSekarang.getMonth() + 1).padStart(2, `0`)
        let hariSekarang = String(waktuSekarang.getDate()).padStart(2, `0`)
        let tanggal_pengumpulan = `${tahunSekarang}-${bulanSekarang}-${hariSekarang}`
    
        let data = {
            file_pengumpulan,
            id_tugas,
            id_mahasiswa,
            deskripsi,
            waktu_pengumpulan,
            hari_pengumpulan,
            tanggal_pengumpulan
        }
        await Model_Pengumpulan.addPengumpulan(data)
        
        res.redirect(`/mahasiswa/kuliah/tugas/detail/${id_tugas}`)
    } catch (error) {
        console.log(error)
        res.redirect(`/mahasiswa/kuliah/tugas/detail/${id_tugas}`)
    }
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

        data = {file_pengumpulan, deskripsi}
        await Model_Pengumpulan.updatePengumpulan(data, id_pengumpulan)
        res.redirect(`/mahasiswa/kuliah/tugas/detail/${dataPengumpulan.id_tugas}`)
    } catch (error) {
        console.log(error)
        res.redirect(`mahasiswa/kuliah/tugas/editPengumpulan`)   
    }
})


module.exports = router;
