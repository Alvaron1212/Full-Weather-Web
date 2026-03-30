const TempDis = document.getElementById('temp');
const WindSpeeDis = document.getElementById('wind-s');
const WindDirDis = document.getElementById('wind-d');
const HumiDis = document.getElementById('humi');
const PresDis = document.getElementById('press');

async function GetData() {
	try {
		
		let Saved = localStorage.getItem('Location');
		let Location;
		
		if (Saved) {
			Location = JSON.parse(Saved)
		} else {
			let LocAPI = await fetch('https://ipapi.co/json/');
			let LocData = await LocAPI.json();
			
			Location = {
				Lon : LocData.longitude,
				Lan : LocData.latitude
			};
			
			localStorage.setItem('Location', JSON.stringify(Location));
		};
		
		let WeaAPI = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${Location.Lan}&longitude=${Location.Lon}&current=temperature_2m,surface_pressure,wind_speed_10m,wind_direction_10m,relative_humidity_2m&timezone=auto`);
		let WeaData = await WeaAPI.json();
		
		const Data = {
			Temperature : WeaData.current.temperature_2m,
			WindSpeed : WeaData.current.wind_speed_10m,
			WindDir : WeaData.current.wind_direction_10m,
			Humidty : WeaData.current.relative_humidity_2m,
			Press : WeaData.current.surface_pressure
		};
		
		const DataUnit = {
			T : WeaData.current_units.temperature_2m,
			WS : WeaData.current_units.wind_speed_10m,
			WD : WeaData.current_units.wind_direction_10m,
			H : WeaData.current_units.relative_humidity_2m,
			P : WeaData.current_units.surface_pressure
		};
		
		TempDis.textContent = `${Math.round(Data.Temperature)}${DataUnit.T}`;
		WindSpeeDis.textContent = `${Math.round(Data.WindSpeed)}${DataUnit.WS}`;
		WindDirDis.textContent = `${Data.WindDir}${DataUnit.WD}`;
		HumiDis.textContent = `${Data.Humidty}${DataUnit.H}`;
		PresDis.textContent = `${Math.round(Data.Press)}${DataUnit.P}`;
		
		console.log(WeaData);
		
	} catch(err) {
		console.log(err);
		TempDis.textContent = 'Error!'
		return;
	};
};

GetData();