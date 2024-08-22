const nodemailer = require('nodemailer');

const axios = require('axios');
const WeatherData = require('../modal/Weather');
const DailySummary = require('../modal/Daily_weather');
const Alert = require('../modal/alert');



// const API_KEY = 'your_openweathermap_api_key_here'; // replace with your OpenWeatherMap API key
 
 const  CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad']

//  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=6fb36cd34284c29d4cf37bb2b43e1bf3`

// Function to fetch weather data for a given city
async function fetchWeatherData(city) {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=6fb36cd34284c29d4cf37bb2b43e1bf3`);
    const data = response.data;
    // console.log(data)
    // Destructure necessary fields from the API response
    const { temp, feels_like ,humidity,pressure} = data.main;
    const {speed}  = data.wind ;
    const { main } = data.weather[0];
    const { dt } = data;

    const weather = new WeatherData({
      city,
      temperature: temp,
      feels_like: feels_like,
      humidity:humidity,
      pressure:pressure,
      windSpeed:speed,
       main
    });

    // Save weather data to MongoDB
    await weather.save();
    console.log(`Weather data for ${city} saved successfully`);

    // Update daily summary
    await updateDailySummary(city, temp, main,pressure,humidity,speed);
  } catch (error) {
    console.error(`Error fetching weather data for ${city}:`, error);
  }
}

// Function to update daily summary
async function updateDailySummary(city, temperature, mainCondition, pressure, humidity,speed) {
  try {
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    const summary = await DailySummary.findOne({ city, date: todayDate });

    if (summary) {
      // Update max and min temperatures
      summary.maxTemp = Math.max(summary.maxTemp, temperature);
      summary.minTemp = Math.min(summary.minTemp, temperature);

      // Update averages using the new reading
      summary.avgTemp = (summary.avgTemp * summary.readingsCount + temperature) / (summary.readingsCount + 1);
      summary.avgPress = (summary.avgPress * summary.readingsCount + pressure) / (summary.readingsCount + 1);
      summary.avgHumidity = (summary.avgHumidity * summary.readingsCount + humidity) / (summary.readingsCount + 1);
      summary.avgwindspeed = (summary.avgwindspeed * summary.readingsCount + humidity) / (summary.readingsCount + 1);

      // Increment the readings count
      summary.readingsCount += 1;

      // Update condition counts
      const currentConditionCount = summary.conditionCount.get(mainCondition) || 0;
      summary.conditionCount.set(mainCondition, currentConditionCount + 1);

      // Determine the new dominant condition
      let dominantCondition = mainCondition;
      let maxCount = currentConditionCount + 1; // Incremented count for this condition

      summary.conditionCount.forEach((count, condition) => {
        if (count > maxCount) {
          dominantCondition = condition;
          maxCount = count;
        }
      });

      summary.dominantCondition = dominantCondition;

      await summary.save();
    } else {
      // Create a new summary if it doesn't exist
      const conditionCountMap = new Map();
      conditionCountMap.set(mainCondition, 1);

      const newSummary = new DailySummary({
        city,
        date: todayDate,
        avgTemp: temperature,
        avgPress: pressure,
        avgHumidity: humidity,
        avgwindspeed:speed,
        maxTemp: temperature,
        minTemp: temperature,
        dominantCondition: mainCondition,
        conditionCount: conditionCountMap,
        readingsCount: 1,
      });

      await newSummary.save();
    }
  } catch (error) {
    console.error('Error updating daily summary:', error);
  }
}


// Function to check alerts and trigger them if needed

async function checkAlerts() {
  try {
    const alerts = await Alert.find({});

    for (const alert of alerts) {
      const {_id, city, threshold, email, message } = alert;

      // Find the latest weather data for the specified city
      const latestWeather = await WeatherData.findOne({ city }).sort({ timestamp: -1 });

      if (latestWeather) {
        let alertConditionMet = false;
        let alertMessage = '';

        // Check the alert condition
        switch (alert.condition) {
          case 'Temperature':
            if (latestWeather.temperature > threshold) {
              alertConditionMet = true;
              alertMessage = `Alert! The temperature in ${city} is ${latestWeather.temperature}°C, which exceeds the threshold of ${threshold}°C.`;
            }
            break;
          case 'Humidity':
            if (latestWeather.humidity > threshold) {
              alertConditionMet = true;
              alertMessage = `Alert! The humidity in ${city} is ${latestWeather.humidity}%, which exceeds the threshold of ${threshold}%.`;
            }
            break;
          case 'Wind Speed':
            if (latestWeather.windSpeed > threshold) {
              alertConditionMet = true;
              alertMessage = `Alert! The wind speed in ${city} is ${latestWeather.windSpeed} km/h, which exceeds the threshold of ${threshold} km/h.`;
            }
            break;
          case 'Weather Condition':
            if (latestWeather.main === message) {
              alertConditionMet = true;
              alertMessage = `Alert! The weather condition in ${city} is ${latestWeather.main}, which matches the alert condition.`;
            }
            break;
        }

        if (alertConditionMet) {
          console.log(alertMessage);

          // Send an email notification using Nodemailer

          await sendEmail(email, 'Weather Alert', alertMessage);
          await Alert.findByIdAndDelete(_id);
        }else console.log("no alert")
      }
    }
  } catch (error) {
    console.error('Error checking alerts:', error);
  }
}

// Nodemailer email sending function
async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: 'aayushkhosla16@gmail.com', 
      pass: 'jxij xcfa pmfr ewtv', 
    },
  });

  const mailOptions = {
    from: 'aayushkhosla16@gmail.com', 
    to: to, 
    subject: subject, 
    text: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

const  listcall = async()=>{
  console.log('Fetching weather data...');
  for (const city of CITIES) {
    await fetchWeatherData(city);
  }
  console.log('Weather data fetching complete.');
  await checkAlerts();
}

// Start the periodic fetching of weather data
function startWeatherDataFetching() {
  listcall();
  setInterval(async () => {
    console.log('Fetching weather data...');
    // Fetch weather data for all cities  
    await listcall();
    
    console.log('Weather data fetching complete.');

    await checkAlerts();
    
  }, 5 * 60 * 1000); 
}

module.exports = { startWeatherDataFetching };
