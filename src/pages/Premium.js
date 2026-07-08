import React, { useState } from 'react';

function Premium() {
  const [showPayment, setShowPayment] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [methode, setMethode] = useState('carte');
  const [paiementEnvoye, setPaiementEnvoye] = useState(false);
  const [formCarte, setFormCarte] = useState({ numero: '', expiration: '', cvv: '', nom: '' });
  const [formMobile, setFormMobile] = useState({ telephone: '' });

  const features = [
    { label: 'Diagnostics de maladies', gratuit: '5/mois', pro: 'Illimité', entreprise: 'Illimité' },
    { label: 'Estimations de rendement', gratuit: '3/mois', pro: 'Illimité', entreprise: 'Illimité' },
    { label: 'Parcelles', gratuit: '1 max', pro: 'Illimité', entreprise: 'Illimité' },
    { label: 'Publications récolte', gratuit: '2 max', pro: 'Illimité', entreprise: 'Illimité' },
    { label: 'Historique', gratuit: '30 jours', pro: 'Complet', entreprise: 'Complet' },
    { label: 'Rapport PDF automatique', gratuit: false, pro: true, entreprise: true },
    { label: 'Alertes maladies par SMS', gratuit: false, pro: true, entreprise: true },
    { label: 'Support prioritaire', gratuit: false, pro: '24h', entreprise: 'SLA garanti' },
    { label: 'Multi-utilisateurs', gratuit: false, pro: false, entreprise: true },
    { label: 'Tableau de bord analytique', gratuit: false, pro: false, entreprise: true },
    { label: 'API dédiée', gratuit: false, pro: false, entreprise: true },
    { label: 'Données météo temps réel', gratuit: false, pro: false, entreprise: true },
    { label: 'Intégration ISRA/ANCAR', gratuit: false, pro: false, entreprise: true },
  ];

  const renderCell = (val) => {
    if (val === true) return <span style={styles.cellYes}><IconCheck /></span>;
    if (val === false) return <span style={styles.cellNo}><IconMinus /></span>;
    return <span style={styles.cellText}>{val}</span>;
  };

  const handlePayer = (e) => {
    e.preventDefault();
    setPaiementEnvoye(true);
  };

  const fermerPayment = () => {
    setShowPayment(false);
    setPaiementEnvoye(false);
    setFormCarte({ numero: '', expiration: '', cvv: '', nom: '' });
    setFormMobile({ telephone: '' });
    setMethode('carte');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerPattern} />
        <button style={styles.backBtn} onClick={() => window.location.href = '/dashboard'}>
          <IconArrowLeft /> Retour
        </button>
        <h1 style={styles.title}>Passer en Premium</h1>
        <p style={styles.subtitle}>Débloquez toutes les fonctionnalités d'AgroSen</p>
      </div>

      <div style={styles.content}>

        {/* Table de comparaison */}
        <div style={styles.tableWrap}>
          <div style={styles.table}>

            {/* Ligne d'en-tête */}
            <div style={styles.rowHeader}>
              <div style={styles.cellLabelHeader}></div>
              <div style={styles.planHeaderCell}>
                <IconLeafSmall />
                <h3 style={styles.planName}>Gratuit</h3>
                <div style={styles.planPrice}>0 <span style={styles.planUnit}>FCFA/mois</span></div>
                <button style={styles.currentBtn} disabled>Plan actuel</button>
              </div>
              <div style={{...styles.planHeaderCell, ...styles.planHeaderPro}}>
                <div style={styles.recommendedBadge}>Recommandé</div>
                <IconStar />
                <h3 style={{...styles.planName, color: colors.ocre}}>Pro</h3>
                <div style={{...styles.planPrice, color: colors.ocre}}>2 500 <span style={styles.planUnit}>FCFA/mois</span></div>
                <button style={styles.proBtn} onClick={() => setShowPayment(true)}>S'abonner</button>
              </div>
              <div style={styles.planHeaderCell}>
                <IconBuilding />
                <h3 style={styles.planName}>Entreprise</h3>
                <div style={styles.planPrice}>Sur devis</div>
                <button style={styles.contactBtn} onClick={() => setShowContact(true)}>Nous contacter</button>
              </div>
            </div>

            {/* Lignes de fonctionnalités */}
            {features.map((f, i) => (
              <div key={i} style={{...styles.row, background: i % 2 === 0 ? '#fff' : colors.sable}}>
                <div style={styles.cellLabel}>{f.label}</div>
                <div style={styles.cell}>{renderCell(f.gratuit)}</div>
                <div style={{...styles.cell, ...styles.cellPro}}>{renderCell(f.pro)}</div>
                <div style={styles.cell}>{renderCell(f.entreprise)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal paiement */}
        {showPayment && (
          <div style={styles.modalOverlay} onClick={fermerPayment}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              {!paiementEnvoye ? (
                <>
                  <h2 style={styles.modalTitle}>S'abonner au plan Pro</h2>
                  <p style={styles.modalSubtitle}>2 500 FCFA / mois — annulable à tout moment</p>

                  <div style={styles.methodTabs}>
                    <button
                      style={{...styles.methodTab, ...(methode === 'carte' ? styles.methodTabActive : {})}}
                      onClick={() => setMethode('carte')}
                      type="button"
                    >
                      <IconCard /> Carte
                    </button>
                    <button
                      style={{...styles.methodTab, ...(methode === 'wave' ? styles.methodTabActive : {})}}
                      onClick={() => setMethode('wave')}
                      type="button"
                    >
                      <IconPhone /> Wave
                    </button>
                    <button
                      style={{...styles.methodTab, ...(methode === 'orange' ? styles.methodTabActive : {})}}
                      onClick={() => setMethode('orange')}
                      type="button"
                    >
                      <IconPhone /> Orange Money
                    </button>
                  </div>

                  <form onSubmit={handlePayer}>
                    {methode === 'carte' ? (
                      <>
                        <input
                          style={styles.input}
                          type="text"
                          placeholder="Nom sur la carte"
                          value={formCarte.nom}
                          onChange={e => setFormCarte({...formCarte, nom: e.target.value})}
                          required
                        />
                        <input
                          style={styles.input}
                          type="text"
                          placeholder="Numéro de carte"
                          maxLength={19}
                          value={formCarte.numero}
                          onChange={e => setFormCarte({...formCarte, numero: e.target.value})}
                          required
                        />
                        <div style={styles.row2col}>
                          <input
                            style={{...styles.input, flex: 1}}
                            type="text"
                            placeholder="MM/AA"
                            maxLength={5}
                            value={formCarte.expiration}
                            onChange={e => setFormCarte({...formCarte, expiration: e.target.value})}
                            required
                          />
                          <input
                            style={{...styles.input, flex: 1}}
                            type="text"
                            placeholder="CVV"
                            maxLength={3}
                            value={formCarte.cvv}
                            onChange={e => setFormCarte({...formCarte, cvv: e.target.value})}
                            required
                          />
                        </div>
                      </>
                    ) : (
                      <input
                        style={styles.input}
                        type="tel"
                        placeholder={`Numéro ${methode === 'wave' ? 'Wave' : 'Orange Money'} (+221...)`}
                        value={formMobile.telephone}
                        onChange={e => setFormMobile({...formMobile, telephone: e.target.value})}
                        required
                      />
                    )}

                    <button style={styles.payBtn} type="submit">
                      Payer 2 500 FCFA
                    </button>
                  </form>
                  <p style={styles.securityNote}>Paiement sécurisé — démonstration uniquement</p>
                </>
              ) : (
                <div style={styles.successBox}>
                  <div style={styles.successIcon}><IconCheckBig /></div>
                  <h2 style={styles.modalTitle}>Paiement en cours de traitement</h2>
                  <p style={styles.modalSubtitle}>Votre abonnement Pro sera activé sous 24h après confirmation.</p>
                  <button style={styles.payBtn} onClick={fermerPayment}>Fermer</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal contact entreprise */}
        {showContact && (
          <div style={styles.modalOverlay} onClick={() => setShowContact(false)}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h2 style={styles.modalTitle}>Plan Entreprise</h2>
              <p style={styles.modalSubtitle}>Contactez notre équipe pour un devis personnalisé</p>
              <div style={styles.contactBox}>
                <div style={styles.contactRow}><IconMail /> contact@agrosen.sn</div>
                <div style={styles.contactRow}><IconPhone /> +221 77 000 00 00</div>
              </div>
              <button style={styles.payBtn} onClick={() => setShowContact(false)}>Fermer</button>
            </div>
          </div>
        )}

        {/* Modèle économique */}
        <div style={styles.modelSection}>
          <h2 style={styles.modelTitle}>Notre modèle économique</h2>
          <div style={styles.modelGrid}>
            <div style={styles.modelCard}>
              <div style={styles.modelIcon}><IconLayers /></div>
              <h3 style={styles.modelCardTitle}>Freemium</h3>
              <p style={styles.modelCardDesc}>Version gratuite pour attirer les agriculteurs, version Pro pour les fonctionnalités avancées</p>
            </div>
            <div style={styles.modelCard}>
              <div style={styles.modelIcon}><IconHandshake /></div>
              <h3 style={styles.modelCardTitle}>Commission marketplace</h3>
              <p style={styles.modelCardDesc}>3-5% de commission sur chaque transaction entre agriculteurs et clients</p>
            </div>
            <div style={styles.modelCard}>
              <div style={styles.modelIcon}><IconMegaphone /></div>
              <h3 style={styles.modelCardTitle}>Publicité ciblée</h3>
              <p style={styles.modelCardDesc}>Vendeurs d'engrais, semences et équipements paient pour atteindre les agriculteurs</p>
            </div>
            <div style={styles.modelCard}>
              <div style={styles.modelIcon}><IconBuildingSmall /></div>
              <h3 style={styles.modelCardTitle}>Partenariats</h3>
              <p style={styles.modelCardDesc}>ISRA, ANCAR, ONG agricoles paient pour accéder aux données agrégées sur maladies et rendements</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Icônes ligne ---
const ip = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
function IconArrowLeft() { return <svg {...ip}><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>; }
function IconLeafSmall() { return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-10 11-10 0 7-2 11-4 13a7 7 0 0 1-4 4z"/><path d="M8 17c3-3 6-8 7-13"/></svg>; }
function IconStar() { return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7-5.4-4.7 7.1-.6z"/></svg>; }
function IconBuilding() { return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/></svg>; }
function IconBuildingSmall() { return <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/></svg>; }
function IconCheck() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>; }
function IconCheckBig() { return <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>; }
function IconMinus() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/></svg>; }
function IconCard() { return <svg {...ip} width={16} height={16}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>; }
function IconPhone() { return <svg {...ip} width={16} height={16}><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/></svg>; }
function IconMail() { return <svg {...ip}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 6 10-6"/></svg>; }
function IconLayers() { return <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/></svg>; }
function IconHandshake() { return <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12l3 3 7-7"/><path d="M2 12h4l3-3 3 3 3-3 3 3h4"/></svg>; }
function IconMegaphone() { return <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11v2a2 2 0 0 0 2 2h1l3 5v-9"/><path d="M9 9 19 5v14L9 15"/></svg>; }

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
  headerPattern: { position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: `repeating-linear-gradient(115deg, ${colors.ocre} 0px, ${colors.ocre} 2px, transparent 2px, transparent 26px)` },
  backBtn: { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', marginBottom: '14px', fontSize: '13px', fontFamily: "'Work Sans', sans-serif" },
  title: { position: 'relative', margin: '0 0 6px', fontFamily: "'Fraunces', serif", fontSize: '26px', fontWeight: '600' },
  subtitle: { position: 'relative', margin: 0, opacity: 0.8, fontSize: '14px' },
  content: { maxWidth: '1000px', margin: '32px auto', padding: '0 24px 64px' },

  tableWrap: { background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: '40px', overflowX: 'auto' },
  table: { minWidth: '700px' },
  rowHeader: { display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', borderBottom: `2px solid ${colors.sable}` },
  row: { display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr' },
  cellLabelHeader: { padding: '20px' },
  planHeaderCell: { textAlign: 'center', padding: '24px 16px', position: 'relative' },
  planHeaderPro: { background: colors.indigo, color: '#fff', borderRadius: '12px 12px 0 0' },
  recommendedBadge: { position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', background: colors.ocre, color: colors.encre, fontSize: '11px', fontWeight: '700', padding: '3px 12px', borderRadius: '0 0 8px 8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  planName: { fontFamily: "'Fraunces', serif", fontSize: '17px', fontWeight: '600', margin: '10px 0 6px', color: colors.encre },
  planPrice: { fontFamily: "'JetBrains Mono', monospace", fontSize: '20px', fontWeight: '600', color: colors.encre, marginBottom: '14px' },
  planUnit: { fontSize: '11px', fontWeight: '400', opacity: 0.7, fontFamily: "'Work Sans', sans-serif" },
  currentBtn: { width: '100%', padding: '9px', background: colors.sable, color: '#999', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'not-allowed', fontFamily: "'Work Sans', sans-serif" },
  proBtn: { width: '100%', padding: '9px', background: colors.ocre, color: colors.encre, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Work Sans', sans-serif" },
  contactBtn: { width: '100%', padding: '9px', background: '#eef4ec', color: colors.vert, border: `1.5px solid ${colors.vert}`, borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Work Sans', sans-serif" },

  cellLabel: { padding: '13px 20px', fontSize: '13px', color: colors.encre, display: 'flex', alignItems: 'center' },
  cell: { padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' },
  cellPro: { background: 'rgba(30,58,95,0.04)' },
  cellYes: { color: colors.vert },
  cellNo: { color: '#c9c2ac' },
  cellText: { color: colors.encre, fontWeight: '600', fontSize: '12px', textAlign: 'center' },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(26,26,26,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modalContent: { background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '420px', width: '100%' },
  modalTitle: { color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: '600', marginBottom: '6px' },
  modalSubtitle: { color: '#767066', marginBottom: '20px', fontSize: '13px' },

  methodTabs: { display: 'flex', gap: '8px', marginBottom: '18px' },
  methodTab: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 6px', borderRadius: '8px', border: `1.5px solid #e0dccf`, background: '#fff', color: '#767066', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Work Sans', sans-serif" },
  methodTabActive: { border: `1.5px solid ${colors.indigo}`, background: '#eef1f5', color: colors.indigo },

  input: { width: '100%', padding: '11px 14px', marginBottom: '12px', border: '1.5px solid #e0dccf', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', fontFamily: "'Work Sans', sans-serif" },
  row2col: { display: 'flex', gap: '12px' },
  payBtn: { width: '100%', padding: '13px', background: colors.indigo, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '4px', fontFamily: "'Work Sans', sans-serif" },
  securityNote: { textAlign: 'center', color: '#999', fontSize: '11px', marginTop: '12px' },

  successBox: { textAlign: 'center' },
  successIcon: { color: colors.vert, display: 'flex', justifyContent: 'center', marginBottom: '12px' },

  contactBox: { background: colors.sable, borderRadius: '10px', padding: '16px', marginBottom: '20px' },
  contactRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', fontSize: '14px', color: colors.encre },

  modelSection: { background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  modelTitle: { color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '19px', fontWeight: '600', marginBottom: '24px', textAlign: 'center' },
  modelGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
  modelCard: { textAlign: 'center', padding: '20px', background: colors.sable, borderRadius: '12px' },
  modelIcon: { color: colors.ocre, display: 'flex', justifyContent: 'center', marginBottom: '12px' },
  modelCardTitle: { color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '15px', fontWeight: '600', marginBottom: '8px' },
  modelCardDesc: { color: '#767066', fontSize: '13px', lineHeight: '1.5' },
};

export default Premium;