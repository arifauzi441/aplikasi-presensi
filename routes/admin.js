var express = require('express');
var router = express.Router();
const Model_Users = require(`../model/Model_Users`)
const adminDosenRouter = require(`./admin/dosen`)

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


module.exports = router;
