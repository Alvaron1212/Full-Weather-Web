/// HTML Data
const HumDis = document.getElementById('hum');
const WinSpeDis = document.getElementById('ws');
const WinDirDis = document.getElementById('wd');
const WeatherDis = document.getElementById('weather-display');
const TempDis = document.getElementById('temp-display');
const WeaTextDis = document.getElementById('weatherT-display');

const InType = document.getElementById('loc-input');
const UnitInput = document.getElementById('unit-input');
const AddresInput = document.getElementById('Ad-input');
const LatInput = document.getElementById('Lat-Input');
const LonInput = document.getElementById('Lon-input');

const AddresDis = document.getElementById('AD-Displayer');
const LonLanDis = document.getElementById('LL-Displayer');
const AutoDis = document.getElementById('A-Displayer');

const Button = document.getElementById('special-button');

// Global Data

const Unit = {
  T: '°C',
  H: '%',
  WS: 'Km/H',
  WD: '°',
  P: 'hPa'
};

let Weather;

/// Fun

function WeatherConvert(val) {
  if ([0, 1, 2, 3].includes(val)) return { text: "Clear Sky", icon: "☀️" };
  
  if ([45, 48].includes(val)) return { text: "Fog", icon: "🌫️" };
  
  if ([51, 53, 55].includes(val)) return { text: "Drizzle", icon: "🌦️" }
  ;
  if ([56, 57].includes(val)) return { text: "Freezing Drizzle", icon: "🌧️" };
  
  if ([61, 63, 65].includes(val)) return { text: "Rain", icon: "🌧️" };
  
  if ([66, 67].includes(val)) return { text: "Freezing Rain", icon: "🌧️" };
  
  if ([71, 73, 75].includes(val)) return { text: "Snow", icon: "❄️" };
  
  if ([77].includes(val)) return { text: "Snow Grains", icon: "❄️" };
  
  if ([80, 81, 82].includes(val)) return { text: "Rain Showers", icon: "🌦️" };
  
  if ([85, 86].includes(val)) return { text: "Snow Showers", icon: "❄️" };
  
  if ([95, 96, 99].includes(val)) return { text: "Thunderstorm", icon: "⛈️" };
  
  return { text: "Unknown", icon: "?" };
}

InType.addEventListener('change', () => {
  AddresDis.className = 'hide';
  LonLanDis.className = 'hide';
  AutoDis.className = 'hide';
  
  if (InType.value === 'A') {
    AutoDis.className = 'show'
  } else if (InType.value === 'AD') {
    AddresDis.className = 'show'
  } else  if (InType.value === 'LL') {
    LonLanDis.className = 'show'
  };
});

UnitInput.addEventListener('change', () => {
  UpdateDisplay();
});

Button.addEventListener('click', () => {
  Main();
  UpdateDisplay();
});

function UpdateDisplay() {
  if (!Weather) {
    return
  };
  
  TempDis.textContent = `${Math.round(UnitConvert(Weather.Temperature))}${Unit.T}`;
};

function UnitConvert(temp) {
  if (UnitInput.value === 'R') {
    Unit.T = '°R';
    return temp = 4 / 5 * temp
  } else if (UnitInput.value === 'F') {
    Unit.T = '°F';
    return temp = (9 / 5 * temp) + 32
  } else if (UnitInput.value === 'K') {
    Unit.T = '°K';
    return temp = temp + 273
  };
  
  Unit.T = '°C';
  return temp;
};

async function Main() {
  try {
    
    // First Dis
    Button.disabled = true;
    WeatherDis.textContent = ''
    TempDis.textContent = 'Please Wait...';
    WeaTextDis.textContent = 'Loading...';
    HumDis.value = '...';
    WinDirDis.value ='...';
    WinSpeDis.value = '...';
    
    // Location
    let Location;
    
    if (InType.value === 'A') {
      let res = await fetch('https://ipapi.co/json/');
      let data = await res.json();
      
      Location = {
        Lat: data.latitude,
        Lon: data.longitude
      };
    } else if (InType.value === 'AD') {
      let res = await fetch(`https://nominatim.openstreetmap.org/search?q=${AddresInput.value}&format=json`);
      let data = await res.json();
      
      Location = {
        Lat: data[0].lat,
        Lon: data[0].lon
      };
    } else if (InType.value === 'LL') {
      Location = {
        Lat: LatInput.value,
        Lon: LonInput.value
      };
    };
    
    // Weather
    let WeaRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${Location.Lat}&longitude=${Location.Lon}&hourly=weather_code&current=temperature_2m,surface_pressure,wind_speed_10m,wind_direction_10m,relative_humidity_2m&timezone=auto`);
    let WeaData = await WeaRes.json();
    
    Weather = {
      Temperature: WeaData.current.temperature_2m,
      WindSpeed: WeaData.current.wind_speed_10m,
      WindDirection: WeaData.current.wind_direction_10m,
      Humidty: WeaData.current.relative_humidity_2m,
      WeatherCode: WeaData.hourly.weather_code[0]
    };
    
    HumDis.value = `${Weather.Humidty}${Unit.H}`;
    WinSpeDis.value = `${Weather.WindSpeed}${Unit.WS}`;
    WinDirDis.value = `${Weather.WindDirection}${Unit.WD}`;
    TempDis.textContent = `${Math.round(UnitConvert(Weather.Temperature))}${Unit.T}`
    
    const WeatherInfo = WeatherConvert(Weather.WeatherCode);
    
    WeatherDis.textContent = WeatherInfo.icon;
    WeaTextDis.textContent = WeatherInfo.text;
  } catch(err) {
    console.log(err);
    WeatherDis.textContent = 'Error!'
    WeaTextDis.textContent = 'Please try again or wait a while!'
    TempDis.textContent = ''
  } finally {
    Button.disabled = false
  }
}

Main();