import React, { useState } from 'react';
import api from '../services/api';
import PremiumModal from '../components/PremiumModal';
import colors from '../colors';

function Diagnostic() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultat, setResultat] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [premiumModal, setPremiumModal] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResultat(null);
      setErreur('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;
    setChargement(true);
    setErreur('');
    setResultat(null);

    try {
      const formData = new FormData();
      formData.append('image', image);

      const res = await api.post('/diagnostic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResultat(res.data);
    } catch (err) {
      if (err.response?.data?.erreur === 'limite_atteinte') {
        setPremiumModal(err.response.data.message);
      } else {
        setErreur(err.response?.data?.erreur || 'Erreur lors de l\'analyse');
      }
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerPattern} />
        <button style={styles.backBtn} onClick={() => window.location.href = '/dashboard'}>
          <IconArrowLeft /> Retour
        </button>
        <h1 style={styles.title}>Détection de maladies</h1>
        <p style={styles.subtitle}>Prenez une photo de votre plante pour obtenir un diagnostic IA</p>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            <div style={styles.uploadZone} onClick={() => document.getElementById('fileInput').click()}>
              {preview ? (
                <img src={preview} alt="Aperçu" style={styles.preview} />
              ) : (
                <div style={styles.uploadPlaceholder}>
                  <div style={styles.uploadIcon}><IconCamera /></div>
                  <p style={styles.uploadText}>Cliquez pour choisir une photo</p>
                  <p style={styles.uploadSubtext}>JPG, PNG — max 5 MB</p>
                </div>
              )}
            </div>

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />

            {image && (
              <p style={styles.fileName}><IconPaperclip /> {image.name}</p>
            )}

            {erreur && <div style={styles.erreur}>{erreur}</div>}

            <button
              style={{
                ...styles.button,
                opacity: (!image || chargement) ? 0.6 : 1,
                cursor: (!image || chargement) ? 'not-allowed' : 'pointer'
              }}
              type="submit"
              disabled={!image || chargement}
            >
              {chargement ? 'Analyse en cours...' : 'Analyser la photo'}
            </button>
          </form>
        </div>

        {resultat && (
          <div style={{
            ...styles.resultatCard,
            borderTop: `4px solid ${resultat.saine ? colors.vert : colors.terre}`
          }}>
            <div style={{...styles.resultatIcon, color: resultat.saine ? colors.vert : colors.terre}}>
              {resultat.saine ? <IconCheck /> : <IconAlert />}
            </div>
            <h2 style={{
              ...styles.resultatTitle,
              color: resultat.saine ? colors.vert : colors.terre
            }}>
              {resultat.saine ? 'Plante en bonne santé !' : 'Maladie détectée'}
            </h2>

            {!resultat.saine && (
              <div style={styles.maladieBox}>
                <div style={styles.maladieNom}>{resultat.maladie}</div>
                <div style={styles.confiance}>
                  Confiance : <strong>{resultat.confiance}%</strong>
                </div>
              </div>
            )}

            <div style={styles.recommandationBox}>
              <h3 style={styles.recommandationTitle}>Recommandation</h3>
              <p style={styles.recommandationText}>{resultat.recommandation}</p>
            </div>

            <button
              style={styles.newBtn}
              onClick={() => { setImage(null); setPreview(null); setResultat(null); }}
            >
              Analyser une autre photo
            </button>
          </div>
        )}
      </div>

      {premiumModal && (
        <PremiumModal message={premiumModal} onClose={() => setPremiumModal(null)} />
      )}
    </div>
  );
}

// --- Icônes ligne ---
const iconProps = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
function IconArrowLeft() { return <svg {...iconProps}><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>; }
function IconCamera() { return <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }
function IconPaperclip() { return <svg {...iconProps}><path d="M21 11.5V17a5 5 0 0 1-10 0V7a3 3 0 0 1 6 0v9"/></svg>; }
function IconCheck() { return <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>; }
function IconAlert() { return <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l10 18H2z"/><path d="M12 10v4"/><path d="M12 17.5v.01"/></svg>; }



const styles = {
  container: { minHeight: '100vh', background: colors.sable, fontFamily: "'Work Sans', sans-serif" },
  header: { position: 'relative', overflow: 'hidden', background: colors.indigo, padding: '28px 32px', color: '#fff' },
  headerPattern: {
    position: 'absolute', inset: 0, opacity: 0.1,
    backgroundImage: `repeating-linear-gradient(115deg, ${colors.ocre} 0px, ${colors.ocre} 2px, transparent 2px, transparent 26px)`,
  },
  backBtn: { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', marginBottom: '14px', fontSize: '13px', fontFamily: "'Work Sans', sans-serif" },
  title: { position: 'relative', margin: '0 0 6px', fontFamily: "'Fraunces', serif", fontSize: '26px', fontWeight: '600' },
  subtitle: { position: 'relative', margin: 0, opacity: 0.8, fontSize: '14px' },
  content: { maxWidth: '600px', margin: '32px auto', padding: '0 24px' },
  card: { background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' },
  uploadZone: { border: `2px dashed #ddd6c4`, borderRadius: '12px', padding: '40px', textAlign: 'center', cursor: 'pointer', marginBottom: '16px', background: colors.sable },
  uploadPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  uploadIcon: { color: colors.ocre, marginBottom: '14px' },
  uploadText: { color: colors.encre, fontWeight: '600', marginBottom: '4px' },
  uploadSubtext: { color: '#999', fontSize: '13px' },
  preview: { maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', objectFit: 'contain' },
  fileName: { display: 'flex', alignItems: 'center', gap: '6px', color: '#767066', fontSize: '13px', marginBottom: '16px' },
  erreur: { background: '#f7e9e6', color: colors.terre, padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  button: { width: '100%', padding: '14px', background: colors.indigo, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', fontFamily: "'Work Sans', sans-serif" },
  resultatCard: { background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' },
  resultatIcon: { marginBottom: '12px', display: 'flex', justifyContent: 'center' },
  resultatTitle: { fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: '600', marginBottom: '20px' },
  maladieBox: { background: '#f7e9e6', borderRadius: '10px', padding: '16px', marginBottom: '20px' },
  maladieNom: { fontSize: '20px', fontWeight: '700', color: colors.terre, marginBottom: '8px' },
  confiance: { color: '#767066', fontSize: '14px' },
  recommandationBox: { background: '#eef4ec', borderRadius: '10px', padding: '16px', marginBottom: '20px', textAlign: 'left' },
  recommandationTitle: { color: colors.vert, marginBottom: '8px', fontSize: '15px', fontFamily: "'Fraunces', serif", fontWeight: '600' },
  recommandationText: { color: '#444', fontSize: '14px', lineHeight: '1.6' },
  newBtn: { background: colors.sable, color: colors.encre, border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontSize: '14px', fontFamily: "'Work Sans', sans-serif" },
};

export default Diagnostic;