var express = require('express');
var router = express.Router();
const Model_Users = require(`../model/Model_Users`)

/* GET home page. */
router.get('/',async function(req, res, next) {
  let data = await Model_Users.getAll()
  res.render('index', { data });
});

router.get(`/login`, async (req, res, next) => {
  res.render(`auth/login`)
})

router.post(`/log`, async (req, res, next) => {
  try {
    let {email, password} = req.body
    
    let data = await Model_Users.getEmail(email)
    if(data.password !== password){
      return res.redirect(`/login`)
    }
    
    req.session.userId = data.id_users
    console.log(req.session)

    if(data.level_users === "admin") return res.redirect(`/admin/beranda`)
    if(data.level_users === "dosen") return res.redirect(`/dosen/beranda`)
    if(data.level_users === "mahasiswa") return res.redirect(`/mahasiswa/beranda`)
  } catch (error) {
    console.log(error)
    res.redirect(`/`)
  }
})

router.get(`/register`, async (req, res, next) => {
  res.render(`auth/register`)
})

router.post(`/save`, async (req, res, next) => {
  try {
    let {email, password, level_users} = req.body
    console.log(level_users)
    let data = await Model_Users.getEmail(email)

    if(data) return res.redirect(`/register`)

    if(level_users === "admin") return res.redirect(`/register`)

    await Model_Users.storeData([email, password, level_users])

    res.redirect(`/login`)
  } catch (error) {
    console.log(error)
    res.redirect(`/register`)
  }
})

router.get(`/logout`, async (req, res, next) => {
  req.session.destroy(err => {
    if(err) return res.redirect(`/mahasiswa/beranda`)
      res.redirect(`/login`)
  })
})

module.exports = router;
