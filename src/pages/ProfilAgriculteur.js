import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

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

function ProfilAgriculteur() {
  const { id } = useParams();
  const [agriculteur, setAgriculteur] = useState(null);
  const [publications, setPublications] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const chargerProfil = useCallback(async () => {
    try {
      const res = await api.get(`/publications/agriculteur/${id}`);
      setAgriculteur(res.data.agriculteur);
      setPublications(res.data.publications);
    } catch (err) {
      setErreur('Impossible de charger ce profil.');
    } finally {
      setChargement(false);
    }
  }, [id]);

  useEffect(() => {
    chargerProfil();
  }, [chargerProfil]);
 

  const dateInscription = agriculteur?.date_inscription
    ? new Date(agriculteur.date_inscription).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })
    : '';

  const lienWhatsapp = agriculteur?.telephone
    ? 'https://wa.me/' + agriculteur.telephone.replace(/[^0-9]/g, '')
    : null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerPattern} />
        <button style={styles.backBtn} onClick={() => window.location.href = '/marketplace'}>
          <IconArrowLeft /> Retour à la marketplace
        </button>
      </div>

      <div style={styles.content}>
        {chargement ? (
          <div style={styles.loading}>Chargement du profil...</div>
        ) : erreur ? (
          <div style={styles.empty}>{erreur}</div>
        ) : (
          <>
            <div style={styles.profileCard}>
              <div style={styles.avatar}>{agriculteur.nom.charAt(0).toUpperCase()}</div>
              <h1 style={styles.nom}>{agriculteur.nom}</h1>
              <p style={styles.membreDepuis}>Membre depuis {dateInscription}</p>

              <div style={styles.coordonnees}>
                <div style={styles.coordItem}>
                  <span style={styles.coordIcon}><IconPhone /></span>
                  <div>
                    <div style={styles.coordLabel}>Téléphone</div>
                    <div style={styles.coordValue}>{agriculteur.telephone || 'Non renseigné'}</div>
                  </div>
                </div>
                <div style={styles.coordItem}>
                  <span style={styles.coordIcon}><IconMapPin /></span>
                  <div>
                    <div style={styles.coordLabel}>Région</div>
                    <div style={styles.coordValue}>{agriculteur.region || 'Non renseignée'}</div>
                  </div>
                </div>
              </div>

              {lienWhatsapp && (
                <a href={lienWhatsapp} target="_blank" rel="noopener noreferrer" style={styles.whatsappBtn}><IconMessage /> Contacter sur WhatsApp</a>
              )}
            </div>

            <h2 style={styles.sectionTitle}>
              Annonces actives ({publications.length})
            </h2>

            {publications.length === 0 ? (
              <div style={styles.empty}>Cet agriculteur n'a aucune annonce active pour le moment.</div>
            ) : (
              <div style={styles.grid}>
                {publications.map(pub => (
                  <div key={pub.id} style={styles.pubCard}>
                    <div style={styles.pubIcon}>
                      <span style={{fontSize: '36px'}}>{culturesEmojis[pub.culture] || '🌱'}</span>
                    </div>
                    <h3 style={styles.pubTitle}>{culturesLabels[pub.culture] || pub.culture}</h3>
                    <div style={styles.pubInfo}>
                      <div style={styles.infoRow}><span>Quantité</span><strong style={styles.mono}>{pub.quantite_kg} kg</strong></div>
                      <div style={styles.infoRow}><span>Prix</span><strong style={styles.mono}>{pub.prix_par_kg} FCFA/kg</strong></div>
                      <div style={styles.infoRow}><span>Récolte</span><strong>{pub.date_recolte}</strong></div>
                    </div>
                    {pub.description && <p style={styles.pubDesc}>{pub.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const ip = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
function IconArrowLeft() { return <svg {...ip}><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>; }
function IconPhone() { return <svg {...ip}><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/></svg>; }
function IconMapPin() { return <svg {...ip}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function IconMessage() { return <svg {...ip}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>; }
function IconCorn() { return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c3 0 5 4 5 9s-2 11-5 11-5-6-5-11 2-9 5-9z"/><path d="M9 7h6M8.5 11h7M8.5 15h7"/></svg>; }
function IconPeanut() { return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3c-3 0-5 3-5 6 0 2 1 3 2 4-1 1-2 2-2 4 0 3 2 6 5 6s5-2 5-5c0-1-.3-2-1-3 1-1 2-2 2-4 0-3-2-6-5-6-.4 0-.7 0-1 .1"/></svg>; }

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
  header: { position: 'relative', overflow: 'hidden', background: colors.indigo, padding: '20px 32px' },
  headerPattern: { position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: `repeating-linear-gradient(115deg, ${colors.ocre} 0px, ${colors.ocre} 2px, transparent 2px, transparent 26px)` },
  backBtn: { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontFamily: "'Work Sans', sans-serif" },

  content: { maxWidth: '800px', margin: '0 auto', padding: '32px 24px 64px' },
  loading: { textAlign: 'center', padding: '60px', color: '#767066' },
  empty: { textAlign: 'center', padding: '40px', color: '#767066', background: '#fff', borderRadius: '16px' },

  profileCard: { background: '#fff', borderRadius: '20px', padding: '36px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '36px' },
  avatar: { width: '76px', height: '76px', borderRadius: '50%', background: colors.ocre, color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '30px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  nom: { color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: '600', marginBottom: '4px' },
  membreDepuis: { color: '#999', fontSize: '13px', marginBottom: '28px' },

  coordonnees: { display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '24px', flexWrap: 'wrap' },
  coordItem: { display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' },
  coordIcon: { color: colors.vert },
  coordLabel: { fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' },
  coordValue: { fontSize: '14px', color: colors.encre, fontWeight: '600' },

  whatsappBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: colors.vert, color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', fontFamily: "'Work Sans', sans-serif" },

  sectionTitle: { color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '19px', fontWeight: '600', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px' },
  pubCard: { background: '#fff', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center' },
  pubIcon: { color: colors.ocre, display: 'flex', justifyContent: 'center', marginBottom: '8px' },
  pubTitle: { color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '15px', fontWeight: '600', marginBottom: '12px' },
  pubInfo: { background: colors.sable, borderRadius: '8px', padding: '10px', marginBottom: '10px', textAlign: 'left' },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '12px', color: '#6b6558' },
  mono: { fontFamily: "'JetBrains Mono', monospace", color: colors.encre },
  pubDesc: { color: '#767066', fontSize: '12px', textAlign: 'left', lineHeight: '1.5' },
};

export default ProfilAgriculteur;