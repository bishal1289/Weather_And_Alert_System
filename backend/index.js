const express = require('express');

//mongodb
const conn = require('./DB/conn');
const cors = require("cors"); 


//routes 
const alertroute = require('./routes/alertRoutes')
const approuter =require('./routes/appRoutes')

const app = express();


//feacting data

const { startWeatherDataFetching } = require('./services/weatherService');

app.use(cors({
    credentials: true,
    origin: true
  })); 
app.use(express.json());

require('dotenv').config();
const cookie = require('cookie-parser');
const { create } = require('./modal/alert');


app.use('/api/alert' , alertroute )
app.use('/api/weather' , approuter)
app.use(cookie())

app.get('/' ,(req,res)=>{
    res.send("Hello this main route");
})

// these id the url help
// api/alert/create post  http://localhost:3001/api/alert/create    sample body=>" 
//  {
//     "city": "Bangalore",
//     "condition": "Weather Condition",
//     "threshold": 1,
//     "message": "Clouds",
//     "email": "satvik1315.be21@chitkarauniversity.edu"
//   }"
//  api/alert/   get   http://localhost:3001/api/alert/
// api/alert/del/:id  http://localhost:3001/api/alert/del/66a3ddc6cde63c583b552336

// api/weather/    http://localhost:3001/api/weather/
// api/weather/report/:date/:city http://localhost:3001/api/weather/report/2024-07-26/Delhi
// api/weather/report/:date/ http://localhost:3001/api/weather/report/2024-07-26/




//data ... 

conn();

startWeatherDataFetching();

app.listen(3001, (err)=>{
    if(err)console.log(err);
    else console.log("Server is working")
})
