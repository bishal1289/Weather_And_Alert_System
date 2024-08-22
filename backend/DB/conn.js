const mongoose = require('mongoose');

const conn = async()=>{
    try{
        await mongoose.connect('mongodb+srv://bishal:bishal9814@cluster0.gpvettn.mongodb.net/weather_project');
        console.log("DB connected ... ")
    }
    catch(err){ 
        console.error(err);
    }
}

module.exports = conn;