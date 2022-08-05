import express, {Application, Request, Response} from "express";
import dayjs from 'dayjs'
const bcrypt = require("bcrypt");
var router = express.Router();
var database =  require("./database") 


router.post('/register', async function(req, res, next) {
  const firstName : string = req.body.firstName;
  const lastName : string = req.body.lastName;
  const userName : string = req.body.userName;
  const phoneNum : string = req.body.phoneNumber; //req.body.phoneNum; smh 
  const role: string = req.body.role;
  const password : string = req.body.password;
  const hashedPass : string = bcrypt.hashSync(password,10);
  var q : string = `INSERT INTO users (firstname, lastname, username, password, phone_num, role)
    VALUES ('${firstName}', '${lastName}', '${userName}', '${hashedPass}', '${phoneNum}','${role}');`

  try{
    await database.query(q)
    let result = await logIn(req.body);
    if(result){
      return res.json(result);
    }
    else{
     return res.status(400).json({"error": "something" });
    }
  }catch(err){
    console.log("DATABASE EERROR", err)
  }
});


async function logIn(body:any) {
  var userName = body.userName;
  var q = `SELECT id, firstname, lastname, username, password,
     phone_num, role FROM users WHERE username = '${userName}'`;
  try {
    var { rows, rowCount } = await database.query(q);
    if (rowCount == 0) {
      return null;
    }
    var verified = bcrypt.compareSync(body.password, rows[0]["password"]);
  } catch (error) {
    console.log(error);
  }
  if (verified) {
    return rows[0];
  } else {
    return null;
  }
}

router.post('/modify/:id', async function(req, res, next) {
  const id = req.params.id;
  const firstName : string = req.body.firstName;
  const lastName : string = req.body.lastName;
  const userName : string = req.body.userName;
  const phoneNum : string = req.body.phoneNumber;
  const pass : string = req.body.password;
  const hashedPass : string = bcrypt.hashSync(pass,10);



  const query : string = `UPDATE users SET firstname = '${firstName}',  lastname ='${lastName}',
       username ='${userName}', password ='${hashedPass}', phone_num = '${phoneNum}' WHERE id =${id};`

  try {
       await database.query(query);
     try{
      const info = `SELECT * FROM users WHERE id = ${id}`
      const {rows} = await database.query(info)
      if(rows[0]){
        console.log("modify user",rows[0])
        return res.json(rows[0])
      }else{
        return res.status(400).json({"error": "something" });
       }
     }catch(err){
      console.log("DATABASE EERROR", err)
     }
  } catch (error) {
    console.log("DATABASE EERROR", error)
  }
  
})


router.post('/login', async function(req, res, next) {
  var check = req.body.check;
  console.log(check,"this is check")
  try {
    let value = await logIn(req.body);
    if(value){
      return res.json(value);
    } else{
      return res.status(400).json({"error": "something" });
     }
  } catch (error) {
    console.log(error);
  }
});



router.get('/profile/:id', async function(req, res, next) {
 var id = req.params.id

  let query = `SELECT * FROM users WHERE id =${id}`;
  try {
    var { rows} = await database.query(query);
    res.send(rows[0])
  } catch (error) {
    console.log(error);
  }
});
router.get('/user', async function(req, res, next) {
 
   let query = `SELECT id, firstname, lastname, role, username, phone_num FROM users`;
 
   try {
     var { rows} = await database.query(query);
     res.send(rows)
   } catch (error) {
     console.log(error);
   }
 });
 
 router.get("/user/:id", async function (req, res, next) {
  const id = req.params.id;
  console.log("id", id);
  const query = ` DELETE FROM users WHERE id = ${id}`;
  try {
      await database.query(query);
      return res.status(200).json({ "done": "something user delete" });
  } catch (error) {
      console.log("DATABASE EERROR", error)
  }
});

router.post("/modify-user/:id", async function (req, res, next) {
  const id = req.params.id;
  console.log(id, "user modify id  ");
  const firstName: string = req.body.firstName;
  const lastName: string = req.body.lastName;
  const phoneNumber: string = req.body.phoneNumber;
  const username= req.body.userName
  const role = req.body.role
  
  console.log(req.body, "req body ");

  const qq = `UPDATE users SET firstname = '${firstName}', lastname = '${lastName}',
           phone_num = '${phoneNumber}', role = '${role}',username = '${username}'
            WHERE id = ${id}`;
  try {
      await database.query(qq);
      return res.status(200).json({ "done": "something modify user" });
  } catch (err) {
      console.log("DATABASE ERROR", err)
  }
});


module.exports = router;
