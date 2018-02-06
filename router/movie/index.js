var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql');

//DATABASE SETTING
var connection = mysql.createConnection({
  host : 'localhost',
  port : 3306,
  user : /*user*/,
  password : /*password*/,
  database : /*database Name*/
})

connection.connect();

router.get('/list', function(req,res){
  res.render('movie.ejs');
})

//  1. /movie , get
router.get('/', function(req,res){
  var responseData = {};

  var query = connection.query('select title from movie', function(err,rows){
    if(err) throw err;
    if(rows.length){
      console.log(rows);
      responseData.result = 1; // 결과가 있으면 1
      responseData.data = rows;
    }else{
      responseData.result = 0;
    }
    res.json(responseData);
  })
})

// 2. /movie, post
router.post('/', function(req,res){
  var title = req.body.title;
  var type = req.body.type;
  var grade = req.body.grade;
  var actor = req.body.actor;

  var sql = {title, type, grade, actor}; //ES6 문법
  var query = connection.query('insert into movie set ?', sql, function(err, rows){
    if(err) throw err
    return res.json({'result': 1});
  })
})

// 3. /movie/:title , GET
router.get('/:title', function(req,res){
  var title = req.params.title;
  console.log("title => ",title);

  var responseData = {};

  var query = connection.query('select * from movie where title=?', [title] , function(err,rows){
    if(err) throw err;
    if(rows[0]){
      responseData.result = 1; // 결과가 있으면 1
      responseData.data = rows;
    }else{
      responseData.result = 0;
    }
    res.json(responseData);
  })
})

// 4. /movie/:title , DELETE(HTTP 메소드)
router.delete('/:title', function(req,res){
  var title = req.params.title;
  var responseData = {};

  var query = connection.query('delete from movie where title=?', [title] , function(err,rows){
    if(err) throw err;
    console.log("rows is ->", rows);
    if(rows.affectedRows > 0){
      responseData.result = 1; // 결과가 있으면 1
      responseData.data = title;
    }else{
      responseData.result = 0;
    }
    console.log(responseData);
    res.json(responseData);
  })
})

module.exports = router;
