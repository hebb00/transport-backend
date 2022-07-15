import express, {Application, Request, Response} from "express";
import dayjs from 'dayjs'
const bcrypt = require("bcrypt");
var router = express.Router();
var database =  require("./database") 


router.post('/register', async function(req, res, next) {
  const firstName : string = req.body.firstName;
  const lasttName : string = req.body.lastName;
  const userName : string = req.body.userName;
  const phoneNum : string = req.body.phoneNumber; //req.body.phoneNum; smh sorryy
  const password : string = req.body.password;
  const hashedPass : string = bcrypt.hashSync(password,10);
  const created_on : any = dayjs().format()

  console.log(req.body,hashedPass,created_on)
  var q : string = `INSERT INTO users (firstname, lastname, username, password, created_on, phone_num)
    VALUES ('${firstName}', '${lasttName}', '${userName}', '${hashedPass}', '${created_on}', '${phoneNum}');`

  try{
    await database.query(q)
    let result = await logIn(req.body)
    if(result){
      console.log(result)
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
  var q = `SELECT id, firstname, lastname, username, password, phone_num FROM users WHERE username = '${userName}'`;
  rows = [];
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



router.post('/login', async function(req, res, next) {
  try {
    let value = await logIn(req.body);
    if(value){
      console.log("it works",value);
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
  console.log("it works");

  try {
    var { rows} = await database.query(query);
    res.send(rows)
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
