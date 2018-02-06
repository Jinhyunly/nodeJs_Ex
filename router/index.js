var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var main = require('./main/main') // 모듈을 불러오고
var email = require('./email/email') // 모듈을 불러오고
var join = require('./join/index')
var login = require('./login/index')
var logout = require('./logout/index')
var movie = require('./movie/index')

// root router
router.get('/', function(req,res){
  //console.log('indexjs / path loaded')
  res.sendFile(path.join(__dirname , "../public/main.html")) //__dirname 은 node에서 제공되는 식별자 최상위 디렉토리로 쭉 표현해준다
});

router.use('/main', main) //main에 대한 router는 이것을 써라..
router.use('/email', email) //email에 대한 router는 이것을 써라..
router.use('/join', join)
router.use('/login', login)
router.use('/logout', logout)
router.use('/movie', movie)

module.exports = router;
