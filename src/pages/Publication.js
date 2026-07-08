import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PremiumModal from '../components/PremiumModal';

const culturesParCategorie = [
  { categorie: 'Céréales', options: [
    { value: 'mais', label: 'Maïs', emoji: '🌽' },
    { value: 'mil', label: 'Mil', emoji: '🌾' },
    { value: 'sorgho', label: 'Sorgho', emoji: '🌾' },
    { value: 'riz', label: 'Riz', emoji: '🍚' },
  ]},
  { categorie: 'Légumineuses', options: [
    { value: 'arachide', label: 'Arachide', emoji: '🥜' },
    { value: 'niebe', label: 'Niébé', emoji: '🫘' },
    { value: 'soja', label: 'Soja', emoji: '🌿' },
  ]},
  { categorie: 'Légumes', options: [
    { value: 'tomate', label: 'Tomate', emoji: '🍅' },
    { value: 'oignon', label: 'Oignon', emoji: '🧅' },
    { value: 'gombo', label: 'Gombo', emoji: '🥒' },
    { value: 'aubergine', label: 'Aubergine', emoji: '🍆' },
    { value: 'piment', label: 'Piment', emoji: '🌶️' },
    { value: 'pasteque', label: 'Pastèque', emoji: '🍉' },
  ]},
  { categorie: 'Fruits', options: [
    { value: 'mangue', label: 'Mangue', emoji: '🥭' },
    { value: 'banane', label: 'Banane', emoji: '🍌' },
    { value: 'papaye', label: 'Papaye', emoji: '🍈' },
    { value: 'citron', label: 'Citron', emoji: '🍋' },
    { value: 'orange', label: 'Orange', emoji: '🍊' },
  ]},
  { categorie: 'Tubercules', options: [
    { value: 'manioc', label: 'Manioc', emoji: '🥔' },
    { value: 'patate_douce', label: 'Patate douce', emoji: '🍠' },
    { value: 'igname', label: 'Igname', emoji: '🌰' },
  ]},
];

const culturesLabels = {};
const culturesEmojis = {};
culturesParCategorie.forEach(cat => {
  cat.options.forEach(opt => {
    culturesLabels[opt.value] = opt.label;
    culturesEmojis[opt.value] = opt.emoji;
  });
});

function Publication() {
  const [form, setForm] = useState({
    culture: 'mais',
    quantite_kg: '',
    prix_par_kg: '',
    date_recolte: '',
    description: ''
  });
  const [mesPublications, setMesPublications] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [premiumModal, setPremiumModal] = useState(null);

  useEffect(() => {
    chargerMesPublications();
  }, []);

  const chargerMesPublications = async () => {
    try {
      const res = await api.get('/publications/mes-publications');
      setMesPublications(res.data.publications);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur('');
    setSucces('');
    try {
      await api.post('/publications', form);
      setSucces('Récolte publiée avec succès ! Les clients peuvent maintenant la voir.');
      setForm({ culture: 'mais', quantite_kg: '', prix_par_kg: '', date_recolte: '', description: '' });
      chargerMesPublications();
    } catch (err) {
      if (err.response?.data?.erreur === 'limite_atteinte') {
        setPremiumModal(err.response.data.message);
      } else {
        setErreur(err.response?.data?.erreur || 'Erreur lors de la publication');
      }
    } finally {
      setChargement(false);
    }
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm('Supprimer cette publication ?')) return;
    try {
      await api.delete(`/publications/${id}`);
      chargerMesPublications();
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerPattern} />
        <button style={styles.backBtn} onClick={() => window.location.href = '/dashboard'}>
          <IconArrowLeft /> Retour
        </button>
        <h1 style={styles.title}>Publier ma récolte</h1>
        <p style={styles.subtitle}>Annoncez votre récolte et vendez directement aux clients</p>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Nouvelle publication</h2>
          {erreur && <div style={styles.erreur}>{erreur}</div>}
          {succes && <div style={styles.succes}>{succes}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Type de culture</label>
              <select name="culture" value={form.culture} onChange={handleChange} style={styles.select}>
                {culturesParCategorie.map(cat => (
                  <optgroup key={cat.categorie} label={cat.categorie}>
                    {cat.options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.emoji} {opt.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div style={styles.row}>
              <div style={{...styles.field, flex: 1}}>
                <label style={styles.label}>Quantité (kg)</label>
                <input style={styles.input} type="number" name="quantite_kg" placeholder="Ex: 500" value={form.quantite_kg} onChange={handleChange} min="1" required />
              </div>
              <div style={{...styles.field, flex: 1}}>
                <label style={styles.label}>Prix (FCFA/kg)</label>
                <input style={styles.input} type="number" name="prix_par_kg" placeholder="Ex: 250" value={form.prix_par_kg} onChange={handleChange} min="1" required />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Date de récolte prévue</label>
              <input style={styles.input} type="date" name="date_recolte" value={form.date_recolte} onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description (optionnel)</label>
              <textarea style={{...styles.input, height: '80px', resize: 'vertical'}} name="description" placeholder="Ex: Maïs bio, cultivé à Thiès, sans pesticides..." value={form.description} onChange={handleChange} />
            </div>
            <button style={styles.button} type="submit" disabled={chargement}>
              {chargement ? 'Publication...' : 'Publier ma récolte'}
            </button>
          </form>
        </div>

        {mesPublications.length > 0 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Mes publications actives</h2>
            {mesPublications.map(pub => (
              <div key={pub.id} style={styles.pubItem}>
                <div style={styles.pubInfo}>
                  <span style={styles.pubIconWrap}>{culturesEmojis[pub.culture] || '🌱'}</span>
                  <div>
                    <strong style={styles.pubName}>{culturesLabels[pub.culture] || pub.culture}</strong>
                    <div style={styles.pubDetail}>
                      <span style={styles.pubDetailMono}>{pub.quantite_kg} kg</span> • <span style={styles.pubDetailMono}>{pub.prix_par_kg} FCFA/kg</span> • Récolte le {pub.date_recolte}
                    </div>
                  </div>
                </div>
                <button style={styles.deleteBtn} onClick={() => handleSupprimer(pub.id)}><IconTrash /></button>
              </div>
            ))}
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
function IconTrash() { return <svg {...iconProps}><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>; }

const colors = {
  vert: '#2D5F2E',
  ocre: '#D4A24C',
  indigo: '#1E3A5F',
  sable: '#F7F3E9',
  terre: '#8B4A3B',
  encre: '#1A1A1A',
};

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
  content: { maxWidth: '650px', margin: '32px auto', padding: '0 24px' },
  card: { background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' },
  cardTitle: { color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: '600', marginBottom: '24px' },
  field: { marginBottom: '16px' },
  row: { display: 'flex', gap: '16px' },
  label: { display: 'block', color: colors.encre, fontWeight: '600', marginBottom: '6px', fontSize: '14px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #ddd6c4', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', fontFamily: "'Work Sans', sans-serif" },
  select: { width: '100%', padding: '11px 14px', border: '1.5px solid #ddd6c4', borderRadius: '8px', fontSize: '14px', background: 'white', fontFamily: "'Work Sans', sans-serif" },
  erreur: { background: '#f7e9e6', color: colors.terre, padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  succes: { background: '#eef4ec', color: colors.vert, padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  button: { width: '100%', padding: '13px', background: colors.indigo, color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Work Sans', sans-serif" },
  pubItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: colors.sable, borderRadius: '10px', marginBottom: '10px' },
  pubInfo: { display: 'flex', alignItems: 'center', gap: '14px' },
  pubIconWrap: { fontSize: '24px' },
  pubName: { color: colors.encre, fontFamily: "'Fraunces', serif", fontWeight: '600' },
  pubDetail: { fontSize: '12px', color: '#767066', marginTop: '3px' },
  pubDetailMono: { fontFamily: "'JetBrains Mono', monospace" },
  deleteBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7e9e6', color: colors.terre, border: 'none', borderRadius: '8px', padding: '9px 11px', cursor: 'pointer' },
};

export default Publication;