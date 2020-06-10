const express = require("express"); //fetch express module
const app = express();
const https = require("https"); // fetch  native https nodeJS module
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended : true}));

// To respond to GET request at root of server
app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html'); // send the html file to the client browser
});

// To respond to POST request at root of server
app.post('/',function(req,res){
  // The url is the API call to fetch the weather of the city entered in the browser from OpenWeatherMap
    const city = req.body.cityName; //parsing city name entered by user from the POST request
    const apiKey = ''; // OpenWeatherMap API Authentication
    const unit = 'metric';
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=' + unit + '&appid=' + apiKey;
  // get() function below makes a GET request from your express server to the weather station server
    https.get(url,function(response){
          //console.log(response); // response object contains all the data returned by the external weather server after the GET request made
          console.log(response.statusCode); // log only the status code -> 200 means OK
          response.on('data',function(data){ /*https function on() takes argument 'data' and calls the callback function in its argument to
          process the weather data (excluding http header and other http data) received by the GET call*/
            //console.log(data); //this data is in HEX format
            const weatherData = JSON.parse(data); // HEX to readable text conversion
            //console.log(weatherData);
            const temp = weatherData.main.temp; // retrieve temperature
            console.log(temp);
            const feelsLike = weatherData.main.feels_like;
            console.log(feelsLike);
            const weatherDescription = weatherData.weather[0].description;
            console.log(weatherDescription);
            const icon = weatherData.weather[0].icon;
            imageURL = 'http://openweathermap.org/img/wn/' + icon + '@2x.png'; // URL structure obtained from OpenWeatherMap
            console.log(imageURL);
            res.write('<p>The weather outside is ' + weatherDescription + ' </p>');
            res.write("<h1>The temperature in "+ city + " is " + temp + " degree Celcius</h1>");
            res.write('<h3>Feels like ' + feelsLike + ' degree Celcius</h3>');
            res.write('<img src="' + imageURL + '">')
            res.send();
            /*
            As multiple send() methods cannot be written for a given get(), to send multiple data the write() function is used. After writing
            all the data, we can finally send them to the client browser using send().
            */
          });
    });

    //res.send('Server up and running'); //cannot have more than one send() method in a given get() method.
})


app.listen(3000,function(){
  console.log('Server started at port 3000');
});



/*
When parsing through complex JSON code, it might be difficult to figure out the exact path of the data you want. In this case JSON
code is simple , so to retrieve data like temperature , the path is main.temp - but in real life the paths will be much more complex.
To solve this complexity, use the JSON Viewer Awesome Chrome extension. If you view the JSON using that extension , you can simply
press on "copy path" of the any of the data fields you want , and then paste the path in your JS code.
*/
