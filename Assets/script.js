$(document).ready(function(){
    
    
    var apiKey = '250170e71f5020acdde2e8bfe0470ffe';
    var firstUrl = 'https://api.openweathermap.org/data/2.5/weather?';
    var secondUrl = "https://api.openweathermap.org/data/2.5/forecast?";
    var iconFromUrl = 'https://openweathermap.org/img/w/';
    var uvUrl = 'https://api.openweathermap.org/data/2.5/onecall?';
    var prevSearch = [];
    var historyContainer = $("#previous");
    var fiveDayContainer = $("#five-day");
    var searchValueInput = $('#search-value');
    var searchForm = $("#search-area");
    var weatherArea = $("#current-weather");

    searchForm.submit(function( event ) {
        event.preventDefault();
        console.log(event);
        var formValues = $(this).serializeArray();
        var city = formValues[0].value;
        var searchSection = $('<button type="button class="btn btn-primary past-search-term">');
        searchSection.click(function(event){
            event.preventDefault();
            var value = $(this).text();
            currentWeather(value);
            searchForFiveDay(value);
        });
        prevSearch.push(city);
        localStorage.setItem('prevSearch' , JSON.stringify(prevSearch));
        searchSection.text(city);
        historyContainer.append(searchSection);

        console.log(formValues, city);
        currentWeather(city);
        searchForFiveDay(city);
        searchValueInput.val('');
        
    });
    function currentWeather(city) {

          weatherArea.html('');
          var fullUrl = firstUrl + "q=" + city + "&appid=" + apiKey;

          console.log(city);
          fetch(fullUrl).then(function(response) {
              return response.json();
          }) 
          .then(function (data){
              console.log(data);
              var city = data.name;
              var temp = data.main.temp;
              var humidity = data.main.humidity;
              var weather = data.weather;
              var iconUrl = iconFromUrl + weather[0].icon + '.png';
              var wind = data.wind;
              console.log(temp, humidity, weather, wind);
              var citySection = $("<div class='city-name'>");
              var tempDiv = $("<div class='temp-name'>");
              var humiditySection = $("<div class='humidity'>");
              var weatherImg = $("<img class='iconAlias'/>");
              var windSection = $("<div class='windAlias'>");
              citySection.text(city);
              weatherImg.attr('src',iconUrl)
              tempDiv.text("Temperature: " + temp);
              humiditySection.text("Humidity: " + humidity + "%");
              windSection.text("Wind Speed: " + wind.speed + "MPH");
              

              weatherArea.append(citySection);
              weatherArea.append(weatherImg);
              weatherArea.append(tempDiv);
              weatherArea.append(humiditySection);
              
              weatherArea.append(windSection);


          });

    }
    function searchForFiveDay(city) {
        fiveDayContainer.html('');
        var forecastUrl = secondUrl + "q=" + city + "&appid=" + apiKey;
        fetch(forecastUrl).then(function(response) {
                return response.json();
        }) .then(function(data) {
            console.log("Five Day Forecast: " + data)
            var coords = data.city.coord;
            grabUV(coords.lat, coords.lon)
            for(var i=0; i < data.list.length; i++) {
                var isThreeOClock = data.list[i].dt_txt.search('15:00:00');
                if (isThreeOClock > -1) {
                    
                    var forecast = data.list[i];
                    var temp = forecast.main.temp;
                    var humidity = forecast.main.humidity;
                    var weather = forecast.weather;
                    var iconUrl = iconFromUrl + weather[0].icon + '.png';
                    var wind = forecast.wind;
                    var day = moment(forecast.dt_txt).format("dddd, MMMM Do");
                    console.log(forecast, humidity, weather, wind, day);
                    var rowDiv = $("<div class'col-2'>")
                    var dayDiv = $("<div class='day'>");
                    var tempDiv = $("<div class='temp-name'>");
                    var humiditySection = $("<div class='humidity'/>");
                    var weatherImg = $("<img class='iconAlias'>");
                    var windSection = $("<div class='windAlias'>");
                    weatherImg.attr('src',iconUrl);
                    dayDiv.text(day);

                    tempDiv.text("Temperature: " + temp);
                    humiditySection.text("Humidity: " + humidity + "%");
                    windSection.text("Wind Speed: " + wind.speed + "MPH");
                    rowDiv.append(dayDiv);
                    rowDiv.append(weatherImg);
                    rowDiv.append(tempDiv);
                    rowDiv.append(humiditySection);
                    rowDiv.append(windSection);
                    fiveDayContainer.append(rowDiv);

                }
            }
        });

    }
    function grabUV (lat, lon) {
        
        var myUvUrl = uvUrl + 'lat=' + lat + '&lon=' + lon + '&exclude=hourly,daily&appid=' + apiKey;
        fetch(myUvUrl).then(function(response) {
        
            return response.json();
        }).then(function(data) {
            console.log('UV DATA ', data);
            var uvIndex = data.current.uvi;
            var uvISection = $("<div class='uv-index-div'>");
            var uvSpan = $("<span> class='uv-index-number' >");
            uvSpan.text(uvIndex);
            uvISection.text('Uv Index: ' );
            uvISection.append(uvISection);
            weatherArea.append(uvISection);
        });
    
    }
    function find() {
        if (localStorage.getItem('prevSearch')) {
            prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
            for(var i =0; i < prevSearch.length; i++) {
                var searchSection = $('<button type="button class="btn past-search-term">');
                searchSection.click(function(event){
                    event.preventDefault();
                    var value = $(this).text();
                    currentWeather(value);
                    searchForFiveDay(value);
                });
                searchSection.text(prevSearch[i]);
                historyContainer.append(searchSection);
            }
        }

    }
    find();

});













