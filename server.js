require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name || "Visitor";

  // Getting the client IP address
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    // Get location based on IP address (using ipinfo.io)
    const locationResponse = await axios.get(
      `https://ipinfo.io/${clientIp}?token=${process.env.IPINFO_TOKEN}`
    );
    const locationData = locationResponse.data;
    const city = locationData.city || "unknown location";

    // Get weather information for the city (using OpenWeatherMap API)
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`
    );
    const weatherData = weatherResponse.data;
    const temperature = weatherData.main.temp;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving information" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
