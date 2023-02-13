// Get today date as string
let date = new Date();
let newDate = date.toDateString();

// Define constant variables
const API_KEY = '75cad9f1db86a3c289892c67eaa91749';
const serverUrl = 'http://localhost:5000';

// Get the error element from the DOM
const err = document.getElementById('error');

/**
 * getWeatherData is an async function that takes a zip code and returns
 * weather data for that location.
 *
 * @param {string} zip - The zip code of the location to get weather data for
 * @returns {object} data - The weather data for the location
 */
const getWeatherData = async function (zip) {
  try {
    // Build the URL for the API request
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${API_KEY}&units=metric`;

    // Make the API request
    const res = await fetch(url);
    const data = await res.json();

    // Check for errors
    if (data.cod !== 200) {
      throw new Error(`Error: ${data.message}`);
    }

    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

/**
 * postData is an async function that takes a URL and data and posts the data to that URL
 *
 * @param {string} url - The URL to post the data to
 * @param {object} info - The data to post to the URL
 * @returns {object} savedData - The data that was saved
 */
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
    console.log('Data saved successfully');
    console.log(savedData);
    return savedData;
  } catch (error) {
    console.log(error);
  }
};

// Function to reset the input fields
const resetInputs = function () {
  const inputs = document.getElementsByClassName('input');
  Array.from(inputs).forEach(input => (input.value = ''));
};

/**
 * updateWeather is an async function that updates the weather information on the page
 * by getting the saved data from the server.
 */
const updateWeather = async function () {
  const newResponse = await fetch(serverUrl + '/all');
  try {
    const savedData = await newResponse.json();

    // Update the elements on the page with the saved data
    document.getElementById('date').innerHTML = savedData.newDate;
    document.getElementById('city').innerHTML = savedData.city;
    document.getElementById('temperature').innerHTML =
      savedData.temperature + '&degC';
    document.getElementById('description').innerHTML = savedData.description;
    document.getElementById('status').innerHTML = savedData.feelings;
    resetInputs();
  } catch (error) {
    console.log(error);
  }
};

/**
 * generateData is a function that generates and saves weather data based on the zip code
 * entered by the user.
 */
const generateData = function () {
  // Get the values of the zip code and feelings input fields

  const zip = document.getElementById('zip').value;
  const feelings = document.getElementById('feelings').value;

  // Construct the API URL using the input zip code
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},
  &appid=${API_KEY}&units=metric`;

  // Call the getWeatherData function to retrieve the weather data
  getWeatherData(zip).then(data => {
    // If the data is successfully returned
    if (data) {
      // Destructure the data to get the desired values
      const {
        main: { temp },
        name: city,
        weather: [{ description }],
      } = data;

      // Create an object to store the weather information
      const info = {
        newDate,
        city,
        temperature: Math.round(temp),
        description,
        feelings,
      };

      // Call the postData function to send the weather information to the server
      postData(serverUrl + '/add', info);

      // Call the updateWeather function to update the UI
      updateWeather();
    }
  });
};

// Attach a click event listener to the generate button
document.getElementById('generate').addEventListener('click', generateData);
