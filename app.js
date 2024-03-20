//Basic Server SetUp
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

//graphql
const { createHandler } = require("graphql-http/lib/use/express");
const schema = require('./schema/schema')

//ruru server
const { ruruHTML } = require("ruru/server")

//bodyparser
const bodyparser=require('body-parser')

//database
const sequelize = require('./config/db')
const UserModel = require('./models/User');
const BookModel = require('./models/Book');

//Association
UserModel.hasMany(BookModel)

//middleware
const authenticate = require('./middleware/authenticate')

app.use(bodyparser.json())
app.use(authenticate)

app.all(
  "/graphql",
  createHandler({
    schema,
    context:(req)=>({
        user:req.raw.user,
        token:req.raw.token,
    })})
)

app.get("/", (_req, res) => {
  res.type("html")
  res.end(ruruHTML({ endpoint: "/graphql" }))
})

app.listen(port ,async ()=>{
    try {
        await sequelize.sync()
        console.log('Sync with database successfull')
        console.log(`Listening on port ${port}`); 
    } catch (error) {
        console.log(`ERROR: error syncronizing with database: ${error}`);
    }
})
