var mysql = require('mysql');
var express = require('express');
var cors = require('cors');
var app = express();
var moment = require('moment');

//解析post请求的链接// 创建 application/x-www-form-urlencoded 编码解析
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//链接数据库
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'books'
});
connection.connect();

//get的返回体
var getResult = {
    "status": "200",
    "message": "success",
}

var login = false

//用户数据
app.get('/api/users', function (req, res) {
    var sqlUsers = 'select * from users where userId = ' + '"'+req.query.userId +'"'+ ' and ' + 'password = ' +'"'+req.query.password+'"';
    console.log(sqlUsers)
    connection.query(sqlUsers, (error, results, fields) => {
        // if (error) throw error
        res.status(200)
        console.log(results)
        if(results == '' || results == undefined ){
            console.log('没有')
            res.json('flase')
        }else {
            console.log('有')
            res.json('true')
        }
    });
});

//接口获取所有数据
app.get('/api/getBooks', function (req, res) {
    var sqlGet = 'select * from booktotal';
    connection.query(sqlGet, (error, results, fields) => {
        if (error) throw error
        getResult.results = results
        res.status(200)
        res.json(getResult)
    });
});

app.get('/api/search', function (req, res) {
    var sqlSearch = 'select * from booktotal where name= '+'"'+req.query.name + '"';
    console.log(sqlSearch)
    connection.query(sqlSearch, (error, results, fields) => {
        if (error) throw error
        getResult.results = results
        res.status(200)
        res.json(getResult)
    });
});

//管理的接口
app.get('/api/getUserLog', function (req, res) {
    var sqlGetMange = 'select * from bookmanage';
    connection.query(sqlGetMange, (error, results, fields) => {
        if (error) throw error;
        for(var i =0 ; i<results.length ;i++ ){
            results[i].outTime = moment(results[i].outTime).format('YYYY-MM-DD HH:mm:ss');
            results[i].returnTime = moment(results[i].returnTime).format('YYYY-MM-DD HH:mm:ss');
            if(results[i].outTime == results[i].returnTime){
                console.log(results[i].returnTime)
                console.log(results[i].outTime)
                results[i].returnTime = '无归还记录'
            }
        }

        for(var j =results.length-1 ; j>=0;j-- ){
            if(results[j].outTotal == results[j].returnNumber){
                results.splice(j,1);
                console.log(results)
            }
        }
        res.json(results);
    });
});

//记录的接口
app.get('/api/getLog', function (req, res) {
    var result = [];
    var temp = [];
    var sqlGetMange = 'select * from bookmanage';
    connection.query(sqlGetMange, (error, results, fields) => {
        if (error) throw error;
        for(var i =0 ; i<results.length ;i++ ){
            results[i].outTime = moment(results[i].outTime).format('YYYY-MM-DD HH:mm:ss');
            results[i].returnTime = moment(results[i].returnTime).format('YYYY-MM-DD HH:mm:ss');
        }

        for(var j =results.length-1 ; j>=0;j-- ){
            if(results[j].outTotal == results[j].returnNumber){
                temp = results.splice(j,1);
                result = result.concat(temp);
                result = result.reverse();
            }
        }
        res.json(result);
    });
});

//需要权限的操作
app.all('*',function(req,res,next){
    var sqlUsersRoot = 'select * from users'
    connection.query(sqlUsersRoot, function(error, results, fields){
        // if (error) throw error
        console.log(req.body.userId)
        console.log(results.userId)
        console.log(results)
        for(var i = 0 ; i<results.length ;i++){
            if((req.query.userId === results[i].userId && req.query.password === results[i].password) || (req.body.userId === results[i].userId && req.body.password === results[i].password)){
                login = true
                console.log('222')
            }else{
                login = false
            }
            if(!login){
                console.log('失败执行')
                return  res.json('失败，不下去');
            }
            next();
        }
    });
})



//管理的接口
app.post('/api/addBook', function (req, res) {
    var sqlAddBook = 'insert into booktotal values(',
    sqlAddBook = sqlAddBook +'null'+ ','+'"'+req.body.name+'"' + ',' + '"'+req.body.author+'"' +','+req.body.barCode+','+'"'+req.body.publishingHouse+'"'+','+req.body.number+')'
    console.log(sqlAddBook)
    connection.query(sqlAddBook, (error, results, fields) => {
        if (error) throw error
        res.json('ok')
    });
});

app.post('/api/update', function (req, res) {
    var sqlAddBook = 'update booktotal set name =' +'"'+req.body.name+'"'+',author=' +'"'+ req.body.author +'"' +',barCode='+req.body.barCode+',publishingHouse='+'"'+req.body.publishingHouse+'"' +',number='+req.body.number + ' where id = '+req.body.id
    console.log(sqlAddBook)
    connection.query(sqlAddBook, (error, results, fields) => {
        if (error) throw error
        res.json('ok')
    });
});

app.delete('/api/delete', function (req, res) {
    var sqlDel = 'delete from booktotal where id='+req.query.id
    console.log(sqlDel)
    connection.query(sqlDel, (error, results, fields) => {
        if (error) throw error
        res.json('ok')
    });
})




app.post('/api/addManage', function (req, res) {
    console.log(req.body)
    var sqlManageBook = 'insert into bookmanage values(',
    sqlManageBook = sqlManageBook +'null'+ ','+'"'+req.body.userName+'"' + ',' + '"'+req.body.bookName+'"' +','+'"'+req.body.author+'"'+','+'now()'+','+'now()'+','+req.body.number+','+0+')'
    console.log(sqlManageBook)
    connection.query(sqlManageBook, (error, results, fields) => {
        if (error) throw error
        res.json('ok')
    });
});

app.post('/api/updateManage', function (req, res) {
    console.log(req.query)
    var updateManage = 'update bookmanage set returnNumber =' +req.query.item+' ,returnTime='+ 'now()' +' where id = '+req.query.id
    console.log(updateManage)
    connection.query(updateManage, (error, results, fields) => {
        if (error) throw error
        res.json('ok')
    });
});


app.delete('/api/logDelete', function (req, res) {
    var sqlDelLog = 'delete from bookmanage where id='+req.query.id
    console.log(sqlDelLog)
    connection.query(sqlDelLog, (error, results, fields) => {
        if (error) throw error
        res.json('ok')
    });
})

app.listen(18080, function () {
    console.log('http://localhost:18080')
})