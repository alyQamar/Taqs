let date = new Date();
let newDate = date.toDateString();

const API_KEY = '75cad9f1db86a3c289892c67eaa91749';
const serverUrl = 'http://localhost:5000';
const err = document.getElementById('error');

const getWeatherData = async function (zip) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      throw new Error(`Error: ${data.message}`);
    }

    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const postData = async function (url = '', info = {}) {
  const newResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(info),
  });

  try {
    const savedData = await newResponse.json();
    console.log('saved done😊 :');
    console.log(savedData);
    return savedData;
  } catch (error) {
    console.log(error);
  }
};
const updateWeather = async function () {
  const newResponse = await fetch(serverUrl + '/all');
  try {
    const savedData = await newResponse.json();

    document.getElementById('date').innerHTML = savedData.newDate;
    document.getElementById('city').innerHTML = savedData.city;
    document.getElementById('temperature').innerHTML =
      savedData.temperature + '&degC';
    document.getElementById('description').innerHTML = savedData.description;
    document.getElementById('status').innerHTML = savedData.feelings;
  } catch (error) {
    console.log(error);
  }
};

const generateData = function () {
  const zip = document.getElementById('zip').value;
  const feelings = document.getElementById('feelings').value;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},
  &appid=${API_KEY}&units=metric`;

  getWeatherData(zip).then(data => {
    if (data) {
      const {
        main: { temp },
        name: city,
        weather: [{ description }],
      } = data;

      const info = {
        newDate,
        city,
        temperature: Math.round(temp),
        description,
        feelings,
      };

      postData(serverUrl + '/add', info);

      updateWeather();
    }
  });
};

document.getElementById('generate').addEventListener('click', generateData);
