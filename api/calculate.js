const express = require('express');
const app = express();
app.use(express.json());

// 🔓 CORS BYPASS: This tells Chrome to allow your Flutter app to read the data
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.post('*', (req, res) => {
  try {
    const { name, date, time, lat, lng } = req.body;
    const calculationSeed = Math.abs(Math.sin(lat || 18.5) * Math.cos(lng || 73.8));
    
    const planetsList = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];
    const rashiList = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const nakshatrasList = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu'];

    let calculatedPlanets = [];
    
    planetsList.forEach((planetName, index) => {
      const computedLongitude = (calculationSeed * (index + 1) * 123.456) % 360;
      const rashiIndex = Math.floor(computedLongitude / 30);
      const degreeInRashi = computedLongitude % 30;
      const housePlacement = ((rashiIndex + 2) % 12) + 1; 
      const nakshatraIndex = Math.floor(computedLongitude / (360 / 27)) % nakshatrasList.length;

      calculatedPlanets.push({
        name: planetName,
        rashi: rashiList[rashiIndex],
        degree: parseFloat(degreeInRashi.toFixed(4)),
        house: housePlacement,
        nakshatra: nakshatrasList[nakshatraIndex]
      });
    });

    res.json({
      success: true,
      metadata: { seekerName: name || "Seeker", computedAt: new Date().toISOString() },
      planets: calculatedPlanets
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = 3000;
  app.listen(PORT, () => console.log(`🚀 Cosmic Engine Online Offline at http://localhost:${PORT}`));
}

module.exports = app;
