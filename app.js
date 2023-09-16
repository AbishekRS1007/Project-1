const express=require("express");
const bodyparser = require("body-parser");
const db = require("mysql");
const cors = require("cors");
const router = express.Router();

const app = express();

app.use(cors());
app.use(bodyparser.json());

const data = db.createConnection({
    host:'localhost',
    user:'root',
    password:'#Abishek001',
    database:'login',
    port:3306
});

data.connect(err=>{
    if (err){console.log(err,'err');}
    else{
    console.log("Server connected to the dataBase");
}
})

app.get('/users', (req,res)=>{
    // console.log(" Get data from database ");

    let qr = "select * from login_users";
    data.query(qr, (err,result)=>{
        if(err){ 
            console.log(err, "error getting data from database");
        }
        if(result.length>0){
            res.send({
                message: "All user datas",
                data:result
            });
        }
    })
} );

app.get('/users/:Id', (req,res)=>{
    // console.log(" Get single data from database ");
    let userId= req.params.Id;
    let qr = "select * from login_users where id=?";
    data.query(qr,[userId] , (err,result)=>{
        if(err){ 
            console.log(err, "error getting data from database");
        }
        if(result.length>0){
            res.send({
                message: "single user data",
                data:result
            });
        }
    })
} )

// Insert data to database

app.post('/users', (req, res)=>{
    // console.log("Insert data to the database")

    console.log(req.body, 'Insert data');

    let Name=req.body.name;
    let Email=req.body.email;
    let domain_name=req.body.domain_name;
    let Password=req.body.password;

    let qur = 'INSERT INTO login_users (name,Email,domain_name,password) values( ?, ?, ?, ? )';

    data.query(qur, [Name, Email, domain_name, Password], (err, result)=>{
        if (err){
            console.log(err);
        }
        console.log(result,"result");
        res.send({
            message:"Data Inserted successfully"
        });
    });
});

// Update data in database

app.put('/users/:id', (req,res)=>{
    console.log(req.body, 'update data');

    let getid = req.params.id
    let name=req.body.name;
    let email=req.body.email;
    let domain_name=req.body.domain_name;
    let password=req.body.password;

    let qr='UPDATE login_users set name=?, email=?, domain_name=?, password=? where id= ?'

    data.query(qr, [name, email, domain_name, password, getid], (err, result)=>{
        if(err){
            console.log(err, "update failed");
        }
        res.send({
            message:'data Updated Successfully'
        });
    })
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    const query = 'SELECT * FROM login_users WHERE email = ? AND password = ?';
    data.query(query, [email, password], (err, results) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Database error' });
      } else if (results.length === 1) {
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.json({ success: false, message: 'Login failed' });
      }
    });
  });

app.use(express.static('FrontEnd'));


app.listen(5000 , ()=>{ 
    console.log("Server started at port 5000");
})