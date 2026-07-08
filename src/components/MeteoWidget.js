import React, { useState, useEffect } from 'react';

function MeteoWidget() {
  const [meteo, setMeteo] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    // Coordonnées de Dakar par défaut
    fetch('https://api.open-meteo.com/v1/forecast?latitude=14.6937&longitude=-17.4441&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&timezone=Africa%2FAbidjan')
      .then(res => res.json())
      .then(data => {
        setMeteo(data.current);
        setChargement(false);
      })
      .catch(() => setChargement(false));
  }, []);

  const getMeteoIcon = (code) => {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 49) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌦️';
    if (code <= 99) return '⛈️';
    return '🌤️';
  };

  const getMeteoDesc = (code) => {
    if (code === 0) return 'Ciel dégagé';
    if (code <= 3) return 'Partiellement nuageux';
    if (code <= 49) return 'Brouillard';
    if (code <= 67) return 'Pluie';
    if (code <= 77) return 'Neige';
    if (code <= 82) return 'Averses';
    if (code <= 99) return 'Orage';
    return 'Variable';
  };

  if (chargement) return (
    <div style={styles.widget}>
      <div style={styles.loading}>⏳ Météo en cours...</div>
    </div>
  );

  if (!meteo) return null;

  return (
    <div style={styles.widget}>
      <div style={styles.location}>📍 Dakar, Sénégal</div>
      <div style={styles.main}>
        <span style={styles.icon}>{getMeteoIcon(meteo.weather_code)}</span>
        <div style={styles.temp}>{Math.round(meteo.temperature_2m)}°C</div>
      </div>
      <div style={styles.desc}>{getMeteoDesc(meteo.weather_code)}</div>
      <div style={styles.details}>
        <div style={styles.detail}>
          <span style={styles.detailIcon}>💧</span>
          <span>{meteo.relative_humidity_2m}%</span>
        </div>
        <div style={styles.detail}>
          <span style={styles.detailIcon}>💨</span>
          <span>{Math.round(meteo.wind_speed_10m)} km/h</span>
        </div>
        <div style={styles.detail}>
          <span style={styles.detailIcon}>🌧️</span>
          <span>{meteo.precipitation} mm</span>
        </div>
      </div>
      <div style={styles.conseil}>
        {meteo.precipitation > 5
          ? '⚠️ Pluies prévues — évitez les traitements foliaires'
          : meteo.temperature_2m > 38
          ? '⚠️ Forte chaleur — arrosez tôt le matin'
          : '✅ Conditions favorables pour les travaux agricoles'}
      </div>
    </div>
  );
}

const colors = {
  indigo: '#1E3A5F',
  ocre: '#D4A24C',
  sable: '#F7F3E9',
  vert: '#2D5F2E',
  encre: '#1A1A1A',
};

const styles = {
  widget: { background: `linear-gradient(135deg, ${colors.indigo} 0%, #2a4a7f 100%)`, borderRadius: '16px', padding: '20px', color: 'white', fontFamily: "'Work Sans', sans-serif" },
  loading: { textAlign: 'center', padding: '20px', opacity: 0.7, fontSize: '14px' },
  location: { fontSize: '12px', opacity: 0.7, marginBottom: '12px', letterSpacing: '0.5px' },
  main: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' },
  icon: { fontSize: '40px' },
  temp: { fontSize: '42px', fontWeight: '700', fontFamily: "'Fraunces', serif" },
  desc: { fontSize: '14px', opacity: 0.85, marginBottom: '16px' },
  details: { display: 'flex', gap: '16px', marginBottom: '14px' },
  detail: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', opacity: 0.9 },
  detailIcon: { fontSize: '14px' },
  conseil: { background: 'rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', lineHeight: '1.5' },
};

export default MeteoWidget;