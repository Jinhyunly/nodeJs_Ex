var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')

//main page 는 login이 될때만(즉 세션정보가 있을때만) 접근이 가능하게 하자.
router.get('/', function(req,res){
  console.log('main js loaded', req.user);
  var id = req.user; // join/index.js 에    done(null, id.email);
  if(!id) res.render('login.ejs');
  res.render('main.ejs',{'email' : id });
  //res.send("<h1>hi friends</h1>")
  //res.sendFile(path.join(__dirname, "../../public/main.html"))
  //__dirname 은 node에서 제공되는 식별자 최상위 디렉토리로 쭉 표현해준다
});

module.exports = router; //router 가 export 되서 다른 파일에서도 사용가능
