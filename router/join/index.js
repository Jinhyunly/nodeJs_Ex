var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
//DATABASE SETTING
var connection = mysql.createConnection({
  host : 'localhost',
  port : 3306,
  user : /*user*/,
  password : /*password*/,
  database : /*database Name*/
})

connection.connect()

//Router !!
router.get('/', function(req,res){
  var msg;
  var errMsg = req.flash('error')
  if(errMsg) msg = errMsg;
  res.render('join.ejs',{'message' : msg});
  //console.log('get join url')
  //res.sendFile(path.join(__dirname,'../../public/join.html'))
  //res.render('join.ejs');
})

passport.serializeUser(function(user, done){
  //console.log('passport session save : ', user.id);
  done(null, user);
})

passport.deserializeUser(function(id, done){
  console.log('passport session get id(email) : ', id.email);
  done(null, id.email);
})

passport.use('local-join', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, email, password, done){
    var query = connection.query('select * from user where email=?',[email], function(err, rows){
      if(err) return done(err);

      if(rows.length){
        console.log('existed user')
        return done(null, false, {message : 'your email is already used'}) // 오류발생 시
      }else{
        var sql = {email: email, pw : password};
        var query = connection.query('insert into user set ?', sql, function(err, rows){
          if(err) throw err
          return done(null, {'email':email, 'id': rows.insertId}); //false 가 아니라 객체 정보를 전달 passport.serializeUser 로 정보전달 매개변수 user로 정보가 전달됨
        })
      }
    })
  }
));

router.post('/', passport.authenticate('local-join', {
    successRedirect : '/main',
    failureRedirect : '/join',
    failureFlash : true })
  )

// router.post('/', function(req,res){
//   var body = req.body;
//   var email = body.email;
//   var name = body.name;
//   var passwd = body.password;
//
//   var sql = {email : email, name : name, pw : passwd};
//   var query = connection.query('insert into user set ?', sql , function(err,rows){
//     if(err) { throw err;}
//     //console.log("ok db insert : ", rows.insertId, name);
//     res.render('welcome.ejs', {'name' : name, 'id' : rows.insertId}) //client로 응답값을 넘겨준다
//   });
// })

module.exports = router;
