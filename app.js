var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require(`express-session`);
var flash = require(`express-flash`);

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var adminjurusanRouter = require('./routes/admin/jurusan');
var adminkelasRouter = require('./routes/admin/kelas');
var adminmatakuliahRouter = require('./routes/admin/matakuliah');
var adminruanganRouter = require('./routes/admin/ruangan');
var adminjadwalRouter = require('./routes/admin/jadwal');
var adminuserRouter = require('./routes/admin/user');
var adminmahasiswaRouter = require('./routes/admin/mahasiswa');
var admindosenRouter = require('./routes/admin/dosen');
var mahasiswaRouter = require(`./routes/mahasiswa`)
var dosenRouter = require(`./routes/dosen`)

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'rahasia',
  resave: false,
  saveUninitialized: true,
  cookie: {
     secure: false, 
     maxAge: 600000000,
    }
}))
app.use(flash());

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/admin/jurusan', adminjurusanRouter);
app.use('/admin/kelas', adminkelasRouter);
app.use('/admin/matakuliah', adminmatakuliahRouter);
app.use('/admin/ruangan', adminruanganRouter);
app.use('/admin/jadwal', adminjadwalRouter);
app.use('/admin/user', adminuserRouter);
app.use('/admin/mahasiswa', adminmahasiswaRouter);
app.use('/admin/dosen', admindosenRouter);
app.use('/mahasiswa', mahasiswaRouter);
app.use('/dosen', dosenRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
