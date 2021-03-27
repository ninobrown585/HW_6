$(document).ready(function(){
    
    var searchHistoryZone = $("#the-past");
    var fiveDayZone = $("#five-day");
    var searchValueInput = $('#Thee-Search');
    var searchForm = $("#mySearch");
    var WeatherZone = $("#current-weather")
    var apiKey = '250170e71f5020acdde2e8bfe0470ffe'
    var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?';
    var forecastUrl2 = "https://api.openweathermap.org/data/2.5/forecast?";
    var iconBaseUrl = 'https://openweathermap.org/img/w/';
    var uvIndexUrl2 = 'https://api.openweathermap.org/data/2.5/onecall?';
    var searchHistory = [];

    searchForm.submit(function( event ) {
        event.preventDefault();
        console.log(event);
        var formValues = $(this).serializeArray();
        var city = formValues[0].value;
        var searchTermDiv = $('<button type="button class="btn btn-primary the-past">');
        searchTermDiv.click(function(event){
            event.preventDefault();
            var value = $(this).text();
            CurrentCityWeather(value);
            searchForFiveDay(value);
        });
        searchHistory.push(city);
        localStorage.setItem('searchHistory' , JSON.stringify(searchHistory));
        searchTermDiv.text(city);
        searchHistoryZone.append(searchTermDiv);

        console.log(formValues, city);
        CurrentCityWeather(city);
        searchForFiveDay(city);
        searchValueInput.val('');
        
    });
    function CurrentCityWeather(city) {

        WeatherZone.html('');
          var fullUrl =weatherUrl + "q=" + city + "&appid=" + apiKey;

          console.log(city);
          fetch(fullUrl).then(function(response) {
              return response.json();
          }) 
          .then(function (data){
              console.log(data);
              var cityName = data.name;
              var temp = data.main.temp;
              var humidity = data.main.humidity;
              var weather = data.weather;
              var iconUrl = iconBaseUrl + weather[0].icon + '.png';
              var wind = data.wind;
              console.log(temp, humidity, weather, wind);
              var cityNameDiv = $("<div class='city'>");
              var tempDiv = $("<div class='temp'>");
              var humidityDiv = $("<div class='humidity'>");
              var weatherImg = $("<img class='icon'/>");
              var windDiv = $("<div class='wind-name'>");
              cityNameDiv.text(cityName);
              weatherImg.attr('src',iconUrl)
              tempDiv.text("Temperature: " + temp);
              humidityDiv.text("Humidity: " + humidity + "%");
              windDiv.text("Wind Speed: " + wind.speed + "MPH");
              

              WeatherZone.append(cityNameDiv);
              WeatherZone.append(weatherImg);
              WeatherZone.append(tempDiv);
              WeatherZone.append(humidityDiv);
              
              WeatherZone.append(windDiv);


          });

    }
    function searchForFiveDay(city) {
        fiveDayZone.html('');
        var forecastUrl =forecastUrl2 + "q=" + city + "&appid=" + apiKey;
        fetch(forecastUrl).then(function(response) {
                return response.json();
        }) .then(function(data) {
            console.log("Five Day Forecast: " + data)
            var coords = data.city.coord;
            getUVIndex(coords.lat, coords.lon)
            for(var i=0; i < data.list.length; i++) {
                var isThreeOClock = data.list[i].dt_txt.search('15:00:00');
                if (isThreeOClock > -1) {
                    
                    var forecast = data.list[i];
                    var temp = forecast.main.temp;
                    var humidity = forecast.main.humidity;
                    var weather = forecast.weather;
                    var iconUrl = iconBaseUrl + weather[0].icon + '.png';
                    var wind = forecast.wind;
                    var day = moment(forecast.dt_txt).format("dddd, MMMM Do");
                    console.log(forecast, humidity, weather, wind, day);
                    var rowDiv = $("<div class'col-2'>")
                    var dayDiv = $("<div class='day-name'>");
                    var tempDiv = $("<div class='temp-name'>");
                    var humidityDiv = $("<div class='humidity-name'/>");
                    var weatherImg = $("<img class='icon-name'>");
                    var windDiv = $("<div class='wind-name'>");
                    weatherImg.attr('src',iconUrl);
                    dayDiv.text(day);

                    tempDiv.text("Temperature: " + temp);
                    humidityDiv.text("Humidity: " + humidity + "%");
                    windDiv.text("Wind Speed: " + wind.speed + "MPH");
                    rowDiv.append(dayDiv);
                    rowDiv.append(weatherImg);
                    rowDiv.append(tempDiv);
                    rowDiv.append(humidityDiv);
                    rowDiv.append(windDiv);
                    fiveDayZone.append(rowDiv);

                }
            }
        });

    }
    function getUVIndex (lat, lon) {
        
        var finalUrl =uvIndexUrl2 + 'lat=' + lat + '&lon=' + lon + '&exclude=hourly,daily&appid=' + apiKey;
        fetch(finalUrl).then(function(response) {
        
            return response.json();
        }).then(function(data) {
            console.log('UV DATA ', data);
            var uvIndex = data.current.uvi;
            var uvIndexDiv = $("<div class='uv-index-div'>");
            var uvIndexSpan = $("<span> class='uv-index-number' >");
            uvIndexSpan.text(uvIndex);
            uvIndexDiv.text('Uv Index: ' + uvIndex);
            uvIndexDiv.append(uvIndexDiv);
            WeatherZone.append(uvIndexDiv);
        });
    
    }
    function grabHistory() {
        if (localStorage.getItem('searchHistory')) {
            searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
            for(var i =0; i < searchHistory.length; i++) {
                var searchTermDiv = $('<button type="button class="btn the-past">');
                searchTermDiv.click(function(event){
                    event.preventDefault();
                    var value = $(this).text();
                    CurrentCityWeather(value);
                    searchForFiveDay(value);
                });
                searchTermDiv.text(searchHistory[i]);
                searchHistoryZone.append(searchTermDiv);
            }
        }

    }
    grabHistory();

}); 













