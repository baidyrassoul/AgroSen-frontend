import React, { useState } from 'react';
import api from '../services/api';
import PremiumModal from '../components/PremiumModal';

function Rendement() {
  const [form, setForm] = useState({
    culture: 'mais',
    superficie_ha: '',
    type_sol: 'argilo_sableux',
    pluviometrie: 'normale',
  });
  const [resultat, setResultat] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [premiumModal, setPremiumModal] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const culturesLabels = {
    mais: 'Maïs', mil: 'Mil', sorgho: 'Sorgho', riz: 'Riz',
    arachide: 'Arachide', niebe: 'Niébé', soja: 'Soja',
    tomate: 'Tomate', oignon: 'Oignon', gombo: 'Gombo',
    aubergine: 'Aubergine', piment: 'Piment', pasteque: 'Pastèque',
    mangue: 'Mangue', banane: 'Banane', papaye: 'Papaye',
    citron: 'Citron', orange: 'Orange',
    manioc: 'Manioc', patate_douce: 'Patate douce', igname: 'Igname'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur('');
    setResultat(null);
    try {
      const res = await api.post('/rendement', form);
      setResultat(res.data);
    } catch (err) {
      if (err.response?.data?.erreur === 'limite_atteinte') {
        setPremiumModal(err.response.data.message);
      } else {
        setErreur(err.response?.data?.erreur || 'Erreur lors du calcul');
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
        <h1 style={styles.title}>Estimation du rendement</h1>
        <p style={styles.subtitle}>Renseignez les informations de votre parcelle</p>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>

            <div style={styles.field}>
              <label style={styles.label}>Type de culture</label>
              <select name="culture" value={form.culture} onChange={handleChange} style={styles.select}>
                <optgroup label="🌾 Céréales">
                  <option value="mais">🌽 Maïs</option>
                  <option value="mil">🌾 Mil</option>
                  <option value="sorgho">🌾 Sorgho</option>
                  <option value="riz">🍚 Riz</option>
                </optgroup>
                <optgroup label="🫘 Légumineuses">
                  <option value="arachide">🥜 Arachide</option>
                  <option value="niebe">🫘 Niébé</option>
                  <option value="soja">🌿 Soja</option>
                </optgroup>
                <optgroup label="🥬 Légumes">
                  <option value="tomate">🍅 Tomate</option>
                  <option value="oignon">🧅 Oignon</option>
                  <option value="gombo">🥒 Gombo</option>
                  <option value="aubergine">🍆 Aubergine</option>
                  <option value="piment">🌶️ Piment</option>
                  <option value="pasteque">🍉 Pastèque</option>
                </optgroup>
                <optgroup label="🍎 Fruits">
                  <option value="mangue">🥭 Mangue</option>
                  <option value="banane">🍌 Banane</option>
                  <option value="papaye">🍈 Papaye</option>
                  <option value="citron">🍋 Citron</option>
                  <option value="orange">🍊 Orange</option>
                </optgroup>
                <optgroup label="🥔 Tubercules">
                  <option value="manioc">🥔 Manioc</option>
                  <option value="patate_douce">🍠 Patate douce</option>
                  <option value="igname">🌰 Igname</option>
                </optgroup>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Superficie (en hectares)</label>
              <input
                style={styles.input}
                type="number"
                name="superficie_ha"
                placeholder="Ex: 2.5"
                value={form.superficie_ha}
                onChange={handleChange}
                min="0.1"
                step="0.1"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Type de sol</label>
              <select name="type_sol" value={form.type_sol} onChange={handleChange} style={styles.select}>
                <option value="sableux">🏜️ Sableux</option>
                <option value="argilo_sableux">🌱 Argilo-sableux</option>
                <option value="argileux">🪨 Argileux</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Pluviométrie estimée</label>
              <select name="pluviometrie" value={form.pluviometrie} onChange={handleChange} style={styles.select}>
                <option value="faible">☀️ Faible (moins de 400mm)</option>
                <option value="normale">🌤️ Normale (400-800mm)</option>
                <option value="forte">🌧️ Forte (plus de 800mm)</option>
              </select>
            </div>

            {erreur && <div style={styles.erreur}>{erreur}</div>}

            <button style={styles.button} type="submit" disabled={chargement}>
              {chargement ? 'Calcul en cours...' : 'Calculer le rendement'}
            </button>
          </form>
        </div>

        {resultat && (
          <div style={styles.resultatCard}>
            <div style={styles.resultatIcon}><IconSprout /></div>
            <h2 style={styles.resultatTitle}>Résultat de l'estimation</h2>
            <div style={styles.resultatGrid}>
              <div style={styles.resultatItem}>
                <span style={styles.resultatValeur}>
                  {resultat.rendement_estime_kg?.toLocaleString()}
                </span>
                <span style={styles.resultatLabel}>kilogrammes</span>
              </div>
              <div style={styles.resultatSeparator}>≈</div>
              <div style={styles.resultatItem}>
                <span style={styles.resultatValeur}>
                  {resultat.rendement_estime_tonnes}
                </span>
                <span style={styles.resultatLabel}>tonnes</span>
              </div>
            </div>
            <p style={styles.resultatNote}>
              Estimation basée sur {form.superficie_ha} ha de {culturesLabels[form.culture] || form.culture},
              sol {form.type_sol.replace('_', '-')}, pluviométrie {form.pluviometrie}.
            </p>
            <button
              style={styles.newBtn}
              onClick={() => { setResultat(null); setForm({ culture: 'mais', superficie_ha: '', type_sol: 'argilo_sableux', pluviometrie: 'normale' }); }}
            >
              Nouvelle estimation
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

const iconProps = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
function IconArrowLeft() { return <svg {...iconProps}><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>; }
function IconSprout() { return <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-9"/><path d="M12 13c0-4-3-6-7-6 0 4 3 7 7 7z"/><path d="M12 11c0-4 3-6 7-6 0 4-3 7-7 7z"/></svg>; }

const colors = {
  vert: '#2D5F2E', ocre: '#D4A24C', indigo: '#1E3A5F',
  sable: '#F7F3E9', terre: '#8B4A3B', encre: '#1A1A1A',
};

const styles = {
  container: { minHeight: '100vh', background: colors.sable, fontFamily: "'Work Sans', sans-serif" },
  header: { position: 'relative', overflow: 'hidden', background: colors.indigo, padding: '28px 32px', color: '#fff' },
  headerPattern: { position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: `repeating-linear-gradient(115deg, ${colors.ocre} 0px, ${colors.ocre} 2px, transparent 2px, transparent 26px)` },
  backBtn: { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', marginBottom: '14px', fontSize: '13px', fontFamily: "'Work Sans', sans-serif" },
  title: { position: 'relative', margin: '0 0 6px', fontFamily: "'Fraunces', serif", fontSize: '26px', fontWeight: '600' },
  subtitle: { position: 'relative', margin: 0, opacity: 0.8, fontSize: '14px' },
  content: { maxWidth: '600px', margin: '32px auto', padding: '0 24px' },
  card: { background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' },
  field: { marginBottom: '20px' },
  label: { display: 'block', color: colors.encre, fontWeight: '600', marginBottom: '8px', fontSize: '14px' },
  input: { width: '100%', padding: '12px 16px', border: '1.5px solid #ddd6c4', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', fontFamily: "'Work Sans', sans-serif" },
  select: { width: '100%', padding: '12px 16px', border: '1.5px solid #ddd6c4', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', background: 'white', fontFamily: "'Work Sans', sans-serif" },
  erreur: { background: '#f7e9e6', color: colors.terre, padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  button: { width: '100%', padding: '14px', background: colors.indigo, color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Work Sans', sans-serif" },
  resultatCard: { background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' },
  resultatIcon: { color: colors.vert, marginBottom: '12px', display: 'flex', justifyContent: 'center' },
  resultatTitle: { color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: '600', marginBottom: '24px' },
  resultatGrid: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '20px' },
  resultatItem: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  resultatValeur: { fontFamily: "'JetBrains Mono', monospace", fontSize: '32px', fontWeight: '600', color: colors.vert },
  resultatLabel: { fontSize: '13px', color: '#767066', marginTop: '4px' },
  resultatSeparator: { fontSize: '24px', color: '#c9c2ac' },
  resultatNote: { color: '#767066', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' },
  newBtn: { background: colors.sable, color: colors.encre, border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontSize: '14px', fontFamily: "'Work Sans', sans-serif" },
};

export default Rendement;