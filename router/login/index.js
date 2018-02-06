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
  res.render('login.ejs',{'message' : msg});
})

passport.serializeUser(function(user, done){ //session 저장
  console.log('passport session save : ', user.id);
  done(null, user.id);
})

passport.deserializeUser(function(id, done){
  console.log('passport session get id : ', id);
  done(null, id);
})

passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, email, password, done){
    var query = connection.query('select * from user where email=? and pw=?',[email, password], function(err, rows){
      if(err) return done(err);

      if(rows.length){
        return done(null,{'email':email, 'id': rows[0].UID}) // serializeUser로 넘어간다
      }else{
          return done(null, false, {'message' : 'Incorrect email or password'}); //메세지 정보 info 로 들어가게 된다
        }
      })
    }
  ));

router.post('/', function(req, res, next){
  passport.authenticate('local-login', function(err, user, info){
    if(err) res.status(500).json(err);
    if(!user) return res.status(401).json(info.message);

    req.logIn(user, function(err){ //정상적인 경우 serializeUser가 처리 자연스럽게 될 수 있도록
      if(err) { return next(err); }
      return res.json(user);
    });
  })(req, res, next); // authenticate()에서 반환 하는 메소드에 추가로 붙여줘야한다
})

module.exports = router;
