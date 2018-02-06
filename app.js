var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var router = require('./router/index')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')
var flash = require('connect-flash') //메세지를 쉽게 전달함

app.listen(3000, function(){ //비동기로 동작
  console.log("start! express server on port 3000!");
});

//미들웨어 정의
app.use(express.static('public')) //express static함수에 public이라는 디렉토리를 등록
app.use(bodyParser.json()) // request body 에 오는 데이터를 json형식으로 변환
app.use(bodyParser.urlencoded({extended:true})) // extended: true  -> url인코딩이 계속적용될지 1번만 적용할지 묻는것
app.set('view engine', 'ejs')

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(router)



  //console.log('end of server code...')
