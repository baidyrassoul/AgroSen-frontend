import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PremiumModal from '../components/PremiumModal';
import colors from '../colors';

const culturesLabels = {
  mais: 'Maïs', mil: 'Mil', sorgho: 'Sorgho', riz: 'Riz',
  arachide: 'Arachide', niebe: 'Niébé', soja: 'Soja',
  tomate: 'Tomate', oignon: 'Oignon', gombo: 'Gombo',
  aubergine: 'Aubergine', piment: 'Piment', pasteque: 'Pastèque',
  mangue: 'Mangue', banane: 'Banane', papaye: 'Papaye',
  citron: 'Citron', orange: 'Orange',
  manioc: 'Manioc', patate_douce: 'Patate douce', igname: 'Igname'
};

function Parcelles() {
  const [parcelles, setParcelles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editParcelle, setEditParcelle] = useState(null);
  const [form, setForm] = useState({
    nom_parcelle: '',
    superficie_ha: '',
    type_culture: 'mais',
    type_sol: 'argilo_sableux',
    localisation: ''
  });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [premiumModal, setPremiumModal] = useState(null);

  useEffect(() => {
    chargerParcelles();
  }, []);

  const chargerParcelles = async () => {
    try {
      const res = await api.get('/parcelles');
      setParcelles(res.data.parcelles);
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
      if (editParcelle) {
        await api.put(`/parcelles/${editParcelle.id}`, form);
        setSucces('Parcelle modifiée avec succès !');
      } else {
        await api.post('/parcelles', form);
        setSucces('Parcelle ajoutée avec succès !');
      }
      setShowForm(false);
      setEditParcelle(null);
      setForm({ nom_parcelle: '', superficie_ha: '', type_culture: 'mais', type_sol: 'argilo_sableux', localisation: '' });
      chargerParcelles();
    } catch (err) {
      if (err.response?.data?.erreur === 'limite_atteinte') {
        setPremiumModal(err.response.data.message);
      } else {
        setErreur(err.response?.data?.erreur || 'Erreur lors de l\'opération');
      }
    } finally {
      setChargement(false);
    }
  };

  const handleEdit = (parcelle) => {
    setEditParcelle(parcelle);
    setForm({
      nom_parcelle: parcelle.nom_parcelle,
      superficie_ha: parcelle.superficie_ha,
      type_culture: parcelle.type_culture,
      type_sol: parcelle.type_sol,
      localisation: parcelle.localisation || ''
    });
    setShowForm(true);
    setSucces('');
    setErreur('');
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm('Supprimer cette parcelle ?')) return;
    try {
      await api.delete(`/parcelles/${id}`);
      setSucces('Parcelle supprimée.');
      chargerParcelles();
    } catch (err) {
      setErreur('Erreur lors de la suppression');
    }
  };

  const handleNouveauForm = () => {
    setEditParcelle(null);
    setForm({ nom_parcelle: '', superficie_ha: '', type_culture: 'mais', type_sol: 'argilo_sableux', localisation: '' });
    setShowForm(true);
    setSucces('');
    setErreur('');
  };

  const selectCulture = (name, value, onChange) => (
    <select name={name} value={value} onChange={onChange} style={styles.select}>
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
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerPattern} />
        <button style={styles.backBtn} onClick={() => window.location.href = '/dashboard'}>
          <IconArrowLeft /> Retour
        </button>
        <h1 style={styles.title}>Mes parcelles</h1>
        <p style={styles.subtitle}>Gérez vos champs agricoles</p>
      </div>

      <div style={styles.content}>
        {succes && <div style={styles.succes}>{succes}</div>}
        {erreur && <div style={styles.erreur}>{erreur}</div>}

        <button style={styles.addBtn} onClick={handleNouveauForm}>
          <IconPlus /> Ajouter une parcelle
        </button>

        {showForm && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              {editParcelle ? 'Modifier la parcelle' : 'Nouvelle parcelle'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.field}>
                <label style={styles.label}>Nom de la parcelle</label>
                <input style={styles.input} type="text" name="nom_parcelle" placeholder="Ex: Champ Nord" value={form.nom_parcelle} onChange={handleChange} required />
              </div>
              <div style={styles.row}>
                <div style={{...styles.field, flex: 1}}>
                  <label style={styles.label}>Superficie (ha)</label>
                  <input style={styles.input} type="number" name="superficie_ha" placeholder="Ex: 2.5" value={form.superficie_ha} onChange={handleChange} min="0.1" step="0.1" required />
                </div>
                <div style={{...styles.field, flex: 1}}>
                  <label style={styles.label}>Localisation</label>
                  <input style={styles.input} type="text" name="localisation" placeholder="Ex: Thiès" value={form.localisation} onChange={handleChange} />
                </div>
              </div>
              <div style={styles.row}>
                <div style={{...styles.field, flex: 1}}>
                  <label style={styles.label}>Type de culture</label>
                  {selectCulture('type_culture', form.type_culture, handleChange)}
                </div>
                <div style={{...styles.field, flex: 1}}>
                  <label style={styles.label}>Type de sol</label>
                  <select name="type_sol" value={form.type_sol} onChange={handleChange} style={styles.select}>
                    <option value="sableux">🏜️ Sableux</option>
                    <option value="argilo_sableux">🌱 Argilo-sableux</option>
                    <option value="argileux">🪨 Argileux</option>
                  </select>
                </div>
              </div>
              <div style={styles.formBtns}>
                <button style={styles.cancelBtn} type="button" onClick={() => setShowForm(false)}>Annuler</button>
                <button style={styles.submitBtn} type="submit" disabled={chargement}>
                  {chargement ? '...' : (editParcelle ? 'Modifier' : 'Ajouter')}
                </button>
              </div>
            </form>
          </div>
        )}

        {parcelles.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}><IconField /></div>
            <p>Aucune parcelle enregistrée.</p>
            <p style={styles.emptySubtext}>Cliquez sur "Ajouter une parcelle" pour commencer.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {parcelles.map(p => (
              <div key={p.id} style={styles.parcelleCard}>
                <div style={styles.parcelleIconTop}>🌱</div>
                <h3 style={styles.parcelleName}>{p.nom_parcelle}</h3>
                <div style={styles.parcelleInfos}>
                  <div style={styles.infoRow}>
                    <span>Superficie</span>
                    <strong style={styles.infoValue}>{p.superficie_ha} ha</strong>
                  </div>
                  <div style={styles.infoRow}>
                    <span>Culture</span>
                    <strong>{culturesLabels[p.type_culture] || p.type_culture}</strong>
                  </div>
                  <div style={styles.infoRow}>
                    <span>Sol</span>
                    <strong>{p.type_sol.replace('_', '-')}</strong>
                  </div>
                  {p.localisation && (
                    <div style={styles.infoRow}>
                      <span>Lieu</span>
                      <strong>{p.localisation}</strong>
                    </div>
                  )}
                </div>
                <div style={styles.parcelleBtns}>
                  <button style={styles.editBtn} onClick={() => handleEdit(p)}>Modifier</button>
                  <button style={styles.deleteBtn} onClick={() => handleSupprimer(p.id)}>Supprimer</button>
                </div>
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
function IconPlus() { return <svg {...iconProps}><path d="M12 5v14"/><path d="M5 12h14"/></svg>; }
function IconField() { return <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h18"/><path d="M5 20V10l3-3 3 3v10"/><path d="M13 20v-7l3-3 3 3v7"/></svg>; }



const styles = {
  container: { minHeight: '100vh', background: colors.sable, fontFamily: "'Work Sans', sans-serif" },
  header: { position: 'relative', overflow: 'hidden', background: colors.indigo, padding: '28px 32px', color: '#fff' },
  headerPattern: { position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: `repeating-linear-gradient(115deg, ${colors.ocre} 0px, ${colors.ocre} 2px, transparent 2px, transparent 26px)` },
  backBtn: { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', marginBottom: '14px', fontSize: '13px', fontFamily: "'Work Sans', sans-serif" },
  title: { position: 'relative', margin: '0 0 6px', fontFamily: "'Fraunces', serif", fontSize: '26px', fontWeight: '600' },
  subtitle: { position: 'relative', margin: 0, opacity: 0.8, fontSize: '14px' },
  content: { maxWidth: '900px', margin: '32px auto', padding: '0 24px' },
  succes: { background: '#eef4ec', color: colors.vert, padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  erreur: { background: '#f7e9e6', color: colors.terre, padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  addBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: colors.indigo, color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '24px', fontFamily: "'Work Sans', sans-serif" },
  card: { background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' },
  cardTitle: { color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: '600', marginBottom: '20px' },
  field: { marginBottom: '16px' },
  row: { display: 'flex', gap: '16px' },
  label: { display: 'block', color: colors.encre, fontWeight: '600', marginBottom: '6px', fontSize: '14px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #ddd6c4', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', fontFamily: "'Work Sans', sans-serif" },
  select: { width: '100%', padding: '11px 14px', border: '1.5px solid #ddd6c4', borderRadius: '8px', fontSize: '14px', background: 'white', boxSizing: 'border-box', fontFamily: "'Work Sans', sans-serif" },
  formBtns: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
  cancelBtn: { padding: '10px 20px', background: colors.sable, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontFamily: "'Work Sans', sans-serif" },
  submitBtn: { padding: '10px 24px', background: colors.indigo, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', fontFamily: "'Work Sans', sans-serif" },
  empty: { textAlign: 'center', padding: '60px', color: '#767066', background: 'white', borderRadius: '16px' },
  emptyIcon: { color: colors.ocre, display: 'flex', justifyContent: 'center', marginBottom: '16px' },
  emptySubtext: { fontSize: '13px', color: '#999' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' },
  parcelleCard: { background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' },
  parcelleIconTop: { fontSize: '32px', marginBottom: '12px' },
  parcelleName: { color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: '600', marginBottom: '16px' },
  parcelleInfos: { background: colors.sable, borderRadius: '8px', padding: '12px', marginBottom: '16px', textAlign: 'left' },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '13px', borderBottom: '1px solid #ece6d6', color: '#6b6558' },
  infoValue: { fontFamily: "'JetBrains Mono', monospace" },
  parcelleBtns: { display: 'flex', gap: '8px' },
  editBtn: { flex: 1, padding: '8px', background: '#eef4ec', color: colors.vert, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: "'Work Sans', sans-serif" },
  deleteBtn: { flex: 1, padding: '8px', background: '#f7e9e6', color: colors.terre, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: "'Work Sans', sans-serif" },
};

export default Parcelles;