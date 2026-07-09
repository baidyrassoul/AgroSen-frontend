import React, { useState, useEffect } from 'react';
import api from '../services/api';
import colors from '../colors';

const culturesEmojis = {
  mais: '🌽', mil: '🌾', sorgho: '🌾', riz: '🍚',
  arachide: '🥜', niebe: '🫘', soja: '🌿',
  tomate: '🍅', oignon: '🧅', gombo: '🥒',
  aubergine: '🍆', piment: '🌶️', pasteque: '🍉',
  mangue: '🥭', banane: '🍌', papaye: '🍈',
  citron: '🍋', orange: '🍊',
  manioc: '🥔', patate_douce: '🍠', igname: '🌰',
};

const culturesLabels = {
  mais: 'Maïs', mil: 'Mil', sorgho: 'Sorgho', riz: 'Riz',
  arachide: 'Arachide', niebe: 'Niébé', soja: 'Soja',
  tomate: 'Tomate', oignon: 'Oignon', gombo: 'Gombo',
  aubergine: 'Aubergine', piment: 'Piment', pasteque: 'Pastèque',
  mangue: 'Mangue', banane: 'Banane', papaye: 'Papaye',
  citron: 'Citron', orange: 'Orange',
  manioc: 'Manioc', patate_douce: 'Patate douce', igname: 'Igname',
};

function Historique() {
  const [diagnostics, setDiagnostics] = useState([]);
  const [estimations, setEstimations] = useState([]);
  const [onglet, setOnglet] = useState('diagnostics');
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    chargerHistorique();
  }, []);

  const chargerHistorique = async () => {
    try {
      const [resDiag, resEst] = await Promise.all([
        api.get('/diagnostic/historique'),
        api.get('/rendement/historique')
      ]);
      setDiagnostics(resDiag.data.diagnostics);
      setEstimations(resEst.data.estimations);
    } catch (err) {
      console.error(err);
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
        <h1 style={styles.title}>Historique</h1>
        <p style={styles.subtitle}>Consultez vos diagnostics et estimations passés</p>
      </div>

      <div style={styles.content}>
        <div style={styles.tabs}>
          <button
            style={{...styles.tab, ...(onglet === 'diagnostics' ? styles.tabActive : {})}}
            onClick={() => setOnglet('diagnostics')}
          >
            <IconMicroscope /> Diagnostics ({diagnostics.length})
          </button>
          <button
            style={{...styles.tab, ...(onglet === 'estimations' ? styles.tabActive : {})}}
            onClick={() => setOnglet('estimations')}
          >
            <IconChart /> Estimations ({estimations.length})
          </button>
        </div>

        {chargement ? (
          <div style={styles.loading}>Chargement...</div>
        ) : onglet === 'diagnostics' ? (
          diagnostics.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}><IconMicroscope size={44} /></div>
              <p>Aucun diagnostic effectué pour le moment.</p>
            </div>
          ) : (
            <div style={styles.liste}>
              {diagnostics.map(d => {
                const sain = d.maladie_detectee === 'Aucune maladie détectée';
                return (
                  <div key={d.id} style={{
                    ...styles.item,
                    borderLeft: `4px solid ${sain ? colors.vert : colors.terre}`
                  }}>
                    <div style={styles.itemHeader}>
                      <span style={{...styles.itemIcon, color: sain ? colors.vert : colors.terre}}>
                        {sain ? <IconCheck /> : <IconAlert />}
                      </span>
                      <div style={styles.itemInfo}>
                        <strong style={{color: sain ? colors.vert : colors.terre, fontFamily: "'Fraunces', serif"}}>
                          {d.maladie_detectee}
                        </strong>
                        <span style={styles.itemDate}>{new Date(d.date_diagnostic).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {d.confiance > 0 && (
                        <span style={styles.badgeTerre}>{d.confiance}%</span>
                      )}
                    </div>
                    {d.recommandation && (
                      <p style={styles.itemReco}>{d.recommandation}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : (
          estimations.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}><IconChart size={44} /></div>
              <p>Aucune estimation effectuée pour le moment.</p>
            </div>
          ) : (
            <div style={styles.liste}>
              {estimations.map(e => (
                <div key={e.id} style={{...styles.item, borderLeft: `4px solid ${colors.vert}`}}>
                  <div style={styles.itemHeader}>
                    <span style={{...styles.itemIcon, color: colors.ocre, fontSize: '24px'}}>
                      {culturesEmojis[e.culture] || '🌱'}
                    </span>
                    <div style={styles.itemInfo}>
                      <strong style={{color: colors.vert, fontFamily: "'Fraunces', serif"}}>
                        {culturesLabels[e.culture] || e.culture} — {e.superficie_ha} ha
                      </strong>
                      <span style={styles.itemDate}>{new Date(e.date_estimation).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <span style={styles.badgeVert}>
                      {e.rendement_estime_kg} kg
                    </span>
                  </div>
                  <p style={styles.itemReco}>
                    Sol {e.type_sol.replace('_', '-')} • Pluviométrie {e.pluviometrie} • <span style={{fontFamily: "'JetBrains Mono', monospace"}}>{Math.round(e.rendement_estime_kg / 1000 * 100) / 100} tonnes</span>
                  </p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

// --- Icônes ligne ---
const iconProps = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
function IconArrowLeft() { return <svg {...iconProps} width={18} height={18}><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>; }
function IconMicroscope({ size = 16 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h12"/><path d="M9 18v-4a3 3 0 0 1 3-3v0"/><circle cx="12" cy="7" r="3"/><path d="M15 7h3"/></svg>; }
function IconChart({ size = 16 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 15l3-4 3 2 5-7"/></svg>; }
function IconCheck() { return <svg {...iconProps}><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>; }
function IconAlert() { return <svg {...iconProps}><path d="M12 3l10 18H2z"/><path d="M12 10v4"/><path d="M12 17.5v.01"/></svg>; }
function IconCorn() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c3 0 5 4 5 9s-2 11-5 11-5-6-5-11 2-9 5-9z"/><path d="M9 7h6M8.5 11h7M8.5 15h7"/></svg>; }
function IconPeanut() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3c-3 0-5 3-5 6 0 2 1 3 2 4-1 1-2 2-2 4 0 3 2 6 5 6s5-2 5-5c0-1-.3-2-1-3 1-1 2-2 2-4 0-3-2-6-5-6-.4 0-.7 0-1 .1"/></svg>; }



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
  content: { maxWidth: '800px', margin: '32px auto', padding: '0 24px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
  tab: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'white', border: '1.5px solid #ddd6c4', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#767066', fontFamily: "'Work Sans', sans-serif" },
  tabActive: { background: colors.indigo, color: 'white', border: `1.5px solid ${colors.indigo}` },
  loading: { textAlign: 'center', padding: '60px', color: '#767066' },
  empty: { textAlign: 'center', padding: '60px', color: '#767066', background: 'white', borderRadius: '16px' },
  emptyIcon: { color: colors.ocre, display: 'flex', justifyContent: 'center', marginBottom: '16px' },
  liste: { display: 'flex', flexDirection: 'column', gap: '12px' },
  item: { background: 'white', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  itemHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
  itemIcon: { display: 'flex' },
  itemInfo: { flex: 1, display: 'flex', flexDirection: 'column' },
  itemDate: { fontSize: '12px', color: '#999', marginTop: '2px' },
  badgeTerre: { background: '#f7e9e6', color: colors.terre, padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', fontFamily: "'JetBrains Mono', monospace" },
  badgeVert: { background: '#eef4ec', color: colors.vert, padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', fontFamily: "'JetBrains Mono', monospace" },
  itemReco: { color: '#767066', fontSize: '13px', lineHeight: '1.5', margin: 0, paddingLeft: '30px' },
};

export default Historique;