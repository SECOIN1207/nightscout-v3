export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return res.status(500).json({ error: 'Missing GOOGLE_MAPS_API_KEY' });

  const { query = '', type = 'bar', radius = '12000', keyword = '' } = req.query;
  if (!query.trim()) return res.status(400).json({ error: 'Missing query' });

  try {
    // 1) Geocode ZIP / city / address
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&components=country:US|administrative_area:NJ&key=${key}`;
    const geoResp = await fetch(geoUrl);
    const geoJson = await geoResp.json();
    if (!geoJson.results?.length) {
      return res.status(404).json({ error: 'Location not found', query });
    }

    const loc = geoJson.results[0].geometry.location;
    const originLabel = geoJson.results[0].formatted_address;

    // 2) Search nearby nightlife venues
    const textQuery = `${type} near ${originLabel}${keyword ? ` ${keyword}` : ''}`;
    const placesResp = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': [
          'places.id',
          'places.displayName',
          'places.formattedAddress',
          'places.location',
          'places.rating',
          'places.userRatingCount',
          'places.priceLevel',
          'places.primaryType',
          'places.primaryTypeDisplayName',
          'places.businessStatus',
          'places.websiteUri',
          'places.nationalPhoneNumber',
          'places.googleMapsUri',
          'places.regularOpeningHours.weekdayDescriptions',
          'places.photos.name',
          'places.types'
        ].join(','),
      },
      body: JSON.stringify({
        textQuery,
        maxResultCount: 12,
        locationBias: {
          circle: {
            center: { latitude: loc.lat, longitude: loc.lng },
            radius: Number(radius),
          },
        },
      }),
    });

    const placesJson = await placesResp.json();
    const places = placesJson.places || [];

    const mapped = places.map((p) => ({
      id: p.id,
      name: p.displayName?.text || 'Unknown venue',
      address: p.formattedAddress || '',
      lat: p.location?.latitude,
      lng: p.location?.longitude,
      rating: p.rating ?? null,
      userRatingCount: p.userRatingCount ?? null,
      priceLevel: p.priceLevel || null,
      priceLabel: priceLabel(p.priceLevel),
      type: p.primaryTypeDisplayName?.text || p.primaryType || '',
      businessStatus: p.businessStatus || '',
      website: p.websiteUri || '',
      phone: p.nationalPhoneNumber || '',
      mapsUrl: p.googleMapsUri || mapsDirUrl(query, p.formattedAddress),
      hours: p.regularOpeningHours?.weekdayDescriptions || [],
      photoName: p.photos?.[0]?.name || null,
      types: p.types || [],
      distanceMiles: miles(loc.lat, loc.lng, p.location?.latitude, p.location?.longitude),
      // placeholders for future layers
      drinksLayer: null,
      menuLayer: null,
      crowdAgeEstimate: null,
      singlesScore: null,
    })).sort((a, b) => (a.distanceMiles ?? 999) - (b.distanceMiles ?? 999));

    return res.status(200).json({
      sourceQuery: query,
      normalizedLocation: originLabel,
      type,
      keyword,
      count: mapped.length,
      venues: mapped,
      notes: [
        'Live place search is powered by Google Geocoding + Places Text Search.',
        'Drink prices, full menus, and crowd-age estimates require extra data layers beyond Places API.',
      ],
    });
  } catch (err) {
    return res.status(500).json({ error: 'Search failed', details: err.message });
  }
}

function priceLabel(level) {
  switch (level) {
    case 'PRICE_LEVEL_FREE': return 'Free';
    case 'PRICE_LEVEL_INEXPENSIVE': return '$';
    case 'PRICE_LEVEL_MODERATE': return '$$';
    case 'PRICE_LEVEL_EXPENSIVE': return '$$$';
    case 'PRICE_LEVEL_VERY_EXPENSIVE': return '$$$$';
    default: return null;
  }
}

function mapsDirUrl(origin, destination) {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination || '')}`;
}

function miles(lat1, lon1, lat2, lon2) {
  if ([lat1, lon1, lat2, lon2].some((v) => typeof v !== 'number')) return null;
  const R = 3958.8;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) * 10) / 10;
}
