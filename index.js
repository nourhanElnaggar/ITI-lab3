const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const userRouter = require('./routers/usersRouter')
const {logRequest} = require('./generalHelpers')
const { v4: uuidv4 } = require("uuid");

app.use(bodyParser.json())
/*
Fork the project 
git clone {url}
npm i


Create server with the following end points 
POST /users with uuid, unique username 
PATCH /users/id 
GET /users with age filter 
Create Error handler 
POST /users/login /sucess 200 , error:403
GET /users/id   200,   eror:404
DELETE users/id  200,    error:404
complete middleware for validating user
Create Route For users 

Bonus
Edit patch end point to handle the sent data only
If age is not sent return all users


git add .
git commit -m "message"
git push
*/

app.post("/users", validateUser, async (req, res, next) => {
  try {
      const { username, age, password } = req.body;
      const data = await fs.promises
          .readFile("./user.json", { encoding: "utf8" })
          .then((data) => JSON.parse(data));
      const id = uuidv4();
      data.push({ id, username, age, password });
      await fs.promises.writeFile("./user.json", JSON.stringify(data), {
          encoding: "utf8",
      });

      res.send({ id, message: "sucess" });
  } catch (error) {
      next({ status: 500, internalMessage: error.message });
  }
});

app.patch("/users/:userId", validateUser, async (req, res, next) => {

});


app.get('/users', async (req,res,next)=>{
  try {
  const age = Number(req.query.age)
  const users = await fs.promises
  .readFile("./user.json", { encoding: "utf8" })
  .then((data) => JSON.parse(data));
  const filteredUsers = users.filter(user=>user.age===age)
  res.send(filteredUsers)
  } catch (error) {
  next({ status: 500, internalMessage: error.message });
  }

})

app.use(logRequest)

app.use((err,req,res,next)=>{

})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})