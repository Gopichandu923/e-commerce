export const reverseGeocode = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  const apiKey = process.env.MAPPLS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const url = `https://search.mappls.com/search/address/rev-geocode?lat=${latitude}&lng=${longitude}&access_token=${apiKey}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: "Mappls API Error", details: text });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error("Reverse Geocode API Error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch" });
  }
};