const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/Laptop', (err,database) => {
if(err) return console.log(err)
db=database.db('Laptop')
app.listen(4000,() => {
console.log('Listening at port number 4000')
})
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
db.collection('users').find().toArray((err,result) => {
if(err) return console.log(err)
res.render('home.ejs',{data:result})
})
})

	app.get('/create',(req,res)=>{
res.render('add2.ejs');
})
	app.get('/salesdetails',(req,res)=>{
	db.collection('users').find().toArray((err,result)=>{
if(err) return console.log(err)
res.render('salesdetails.ejs',{data:result})
})
})

	app.get('/updateproduct',(req,res)=>{
res.render('update1.ejs');
})

app.get('/deleteproduct',(req,res)=>{
res.render('delete2.ejs');
})


	app.post('/AddData',(req,res)=>{
db.collection('users').save(req.body,(err,result)=>{
if(err) return console.log(err)
res.redirect('/')
})
})


app.post('/update',(req,res)=>{
db.collection('users').find().toArray((err,result)=> {
if(err) return console.log(err)
for(var i=0;i<result.length;i++)
{
if(result[i].modelno==req.body.modelno)
{
s=result[i].quantity
break
}
}
db.collection('users').findOneAndUpdate({modelno:req.body.modelno},{
$set:{quantity: parseInt(s)+parseInt(req.body.quantity)}},{sort:{_id:-1}},
(err,result)=>{
if(err) return console.log(err)
console.log(req.body.modelno+'updated')
res.redirect('/')
})
})
})


app.post('/delete',(req,res)=>{
db.collection('users').findOneAndDelete({modelno:req.body.modelno},(err,result)=>{
if(err)
return console.log(err)
res.redirect('/')
})
})

