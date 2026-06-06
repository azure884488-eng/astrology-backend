const express = require('express');
const app = express();
app.use(express.json());

app.post('/calculate-kundli', (req, res) => {
  try {
    const { name, date, time, lat, lng } = req.body;

    // Mathematical seed for local testing
    const calculationSeed = Math.abs(Math.sin(lat || 18.5) * Math.cos(lng || 73.8));

    const planetsList = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];
    const rashisList = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
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
        rashi: rashisList[rashiIndex],
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

const PORT = 3000;
app.listen(PORT, () => console.log(`Cosmic Engine Online on http://localhost:${PORT}`));