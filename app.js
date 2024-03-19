//Basic Server SetUp
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//graphql
const { createHandler } = require("graphql-http/lib/use/express");
const schema = require('./schema/schema')

//database
const sequelize = require('./config/db')

app.all(
  "/graphql",
  createHandler({schema}
))

app.listen(port ,async ()=>{
    try {
        await sequelize.sync()
        console.log('Sync with database successfull')
        console.log(`Listening on port ${port}`); 
    } catch (error) {
        console.log(`ERROR: error syncronizing with database: ${error}`);
    }
})
