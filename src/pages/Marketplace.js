import React, { useState, useEffect, useMemo } from 'react';
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

const categoriesFiltres = [
  { label: 'Tout', value: 'toutes' },
  { label: '🌾 Céréales', value: 'cereales', cultures: ['mais', 'mil', 'sorgho', 'riz'] },
  { label: '🫘 Légumineuses', value: 'legumineuses', cultures: ['arachide', 'niebe', 'soja'] },
  { label: '🥬 Légumes', value: 'legumes', cultures: ['tomate', 'oignon', 'gombo', 'aubergine', 'piment', 'pasteque'] },
  { label: '🍎 Fruits', value: 'fruits', cultures: ['mangue', 'banane', 'papaye', 'citron', 'orange'] },
  { label: '🥔 Tubercules', value: 'tubercules', cultures: ['manioc', 'patate_douce', 'igname'] },
];

function Marketplace() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [publications, setPublications] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [recherche, setRecherche] = useState('');
  const [filtreCat, setFiltreCat] = useState('toutes');
  const [filtreRegion, setFiltreRegion] = useState('toutes');
  const [tri, setTri] = useState('recent');

  // Panier stocké dans localStorage pour partager avec page Panier
  const [panier, setPanier] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('panier') || '[]');
    } catch { return []; }
  });

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('panier', JSON.stringify(panier));
  }, [panier]);

  useEffect(() => { chargerPublications(); }, []);

  const chargerPublications = async () => {
    try {
      const res = await api.get('/publications');
      setPublications(res.data.publications);
    } catch (err) {
      console.error(err);
    } finally {
      setChargement(false);
    }
  };

  const ajouterAuPanier = (pub) => {
    const existe = panier.find(p => p.id === pub.id);
    if (!existe) {
      setPanier([...panier, {
        ...pub,
        nom: culturesLabels[pub.culture] || pub.culture,
        emoji: culturesEmojis[pub.culture] || '🌱',
        quantite_commandee: 1
      }]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const regions = useMemo(() => {
    const set = new Set(publications.map(p => p.region_agriculteur).filter(Boolean));
    return Array.from(set);
  }, [publications]);

  const publicationsFiltrees = useMemo(() => {
    let liste = [...publications];
    if (recherche.trim()) {
      const q = recherche.toLowerCase();
      liste = liste.filter(p =>
        (culturesLabels[p.culture] || p.culture).toLowerCase().includes(q) ||
        p.nom_agriculteur.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
    }
    if (filtreCat !== 'toutes') {
      const cat = categoriesFiltres.find(c => c.value === filtreCat);
      if (cat?.cultures) liste = liste.filter(p => cat.cultures.includes(p.culture));
    }
    if (filtreRegion !== 'toutes') liste = liste.filter(p => p.region_agriculteur === filtreRegion);
    if (tri === 'prix_asc') liste.sort((a, b) => a.prix_par_kg - b.prix_par_kg);
    else if (tri === 'prix_desc') liste.sort((a, b) => b.prix_par_kg - a.prix_par_kg);
    else liste.sort((a, b) => new Date(b.date_publication) - new Date(a.date_publication));
    return liste;
  }, [publications, recherche, filtreCat, filtreRegion, tri]);

  const initiale = (user.nom || 'U').charAt(0).toUpperCase();

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.navPattern} />
        <div style={styles.navBrand}>AgroSen <span style={styles.navBrandSub}>Marketplace</span></div>
        <div style={styles.navRight}>
          {/* Bouton panier avec badge */}
          <button style={styles.cartBtn} onClick={() => window.location.href = '/panier'}>
            🛒
            {panier.length > 0 && (
              <span style={styles.cartBadge}>{panier.length}</span>
            )}
          </button>
          <div style={styles.avatarWrap}>
            <button style={styles.avatarBtn} onClick={() => setMenuOuvert(!menuOuvert)}>{initiale}</button>
            {menuOuvert && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownName}>{user.nom || 'Utilisateur'}</div>
                <button style={styles.dropdownLogout} onClick={handleLogout}>Déconnexion</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div style={styles.hero}>
        <div style={styles.heroPattern} />
        <div style={styles.heroContent}>
          <p style={styles.eyebrow}>Marketplace</p>
          <h1 style={styles.title}>Produits disponibles</h1>
          <p style={styles.subtitle}>Achetez directement auprès des agriculteurs locaux</p>
          <div style={styles.searchWrap}>
            <IconSearch />
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Rechercher une culture, un agriculteur..."
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.filtersRow}>
          <div style={styles.pillGroup}>
            {categoriesFiltres.map(cat => (
              <button
                key={cat.value}
                style={{...styles.pill, ...(filtreCat === cat.value ? styles.pillActive : {})}}
                onClick={() => setFiltreCat(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div style={styles.selectGroup}>
            <select style={styles.filterSelect} value={filtreRegion} onChange={e => setFiltreRegion(e.target.value)}>
              <option value="toutes">Toutes les régions</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select style={styles.filterSelect} value={tri} onChange={e => setTri(e.target.value)}>
              <option value="recent">Plus récent</option>
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        <p style={styles.compteur}>
          {publicationsFiltrees.length} produit{publicationsFiltrees.length !== 1 ? 's' : ''} disponible{publicationsFiltrees.length !== 1 ? 's' : ''}
        </p>

        {chargement ? (
          <div style={styles.loading}>Chargement des produits...</div>
        ) : publicationsFiltrees.length === 0 ? (
          <div style={styles.empty}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>🌱</div>
            <p>Aucun produit ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {publicationsFiltrees.map(pub => {
              const dansLePanier = panier.find(p => p.id === pub.id);
              return (
                <div key={pub.id} style={styles.card}>
                  <div style={styles.cardBanner}>
                    <span style={styles.cardEmoji}>{culturesEmojis[pub.culture] || '🌱'}</span>
                  </div>
                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>{culturesLabels[pub.culture] || pub.culture}</h3>
                    <div style={styles.cardInfo}>
                      <div style={styles.infoRow}><span>Quantité</span><strong style={styles.mono}>{pub.quantite_kg} kg</strong></div>
                      <div style={styles.infoRow}><span>Prix</span><strong style={styles.mono}>{pub.prix_par_kg} FCFA/kg</strong></div>
                      <div style={styles.infoRow}><span>Récolte</span><strong>{pub.date_recolte}</strong></div>
                    </div>
                    {pub.description && <p style={styles.description}>{pub.description}</p>}
                    <div style={styles.farmerRow}>
                      <span style={styles.farmerAvatar}>{pub.nom_agriculteur.charAt(0).toUpperCase()}</span>
                      <span style={styles.farmerName}>{pub.nom_agriculteur}</span>
                      {pub.region_agriculteur && <span style={styles.farmerRegion}>📍 {pub.region_agriculteur}</span>}
                    </div>
                    <button
                      style={{
                        ...styles.addCartBtn,
                        background: dansLePanier ? '#2D5F2E' : '#1E3A5F',
                        opacity: dansLePanier ? 0.8 : 1
                      }}
                      onClick={() => dansLePanier ? window.location.href = '/panier' : ajouterAuPanier(pub)}
                    >
                      {dansLePanier ? '✅ Voir le panier' : '🛒 Ajouter au panier'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const ip = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
function IconSearch() { return <svg {...ip}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>; }

const styles = {
  container: { minHeight: '100vh', background: colors.sable, fontFamily: "'Work Sans', sans-serif" },
  navbar: { position: 'relative', overflow: 'visible', background: colors.vert, padding: '0 32px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(0,0,0,0.15)', zIndex: 5 },
  navPattern: { position: 'absolute', inset: 0, opacity: 0.12, overflow: 'hidden', backgroundImage: `repeating-linear-gradient(115deg, ${colors.ocre} 0px, ${colors.ocre} 2px, transparent 2px, transparent 26px)` },
  navBrand: { position: 'relative', color: colors.sable, fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: '600' },
  navBrandSub: { fontSize: '13px', fontFamily: "'Work Sans', sans-serif", fontWeight: '400', opacity: 0.75, marginLeft: '8px' },
  navRight: { position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' },
  cartBtn: { position: 'relative', background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '18px' },
  cartBadge: { position: 'absolute', top: '-6px', right: '-6px', background: colors.ocre, color: colors.encre, borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  avatarWrap: { position: 'relative' },
  avatarBtn: { width: '40px', height: '40px', borderRadius: '50%', background: colors.ocre, color: colors.encre, border: '2px solid rgba(255,255,255,0.4)', fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  dropdown: { position: 'absolute', top: '52px', right: 0, background: '#fff', borderRadius: '12px', padding: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.18)', minWidth: '160px', zIndex: 10 },
  dropdownName: { color: colors.encre, fontSize: '14px', fontWeight: '600', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' },
  dropdownLogout: { width: '100%', background: colors.sable, color: colors.terre, border: 'none', borderRadius: '8px', padding: '9px 12px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: "'Work Sans', sans-serif" },
  hero: { position: 'relative', overflow: 'hidden', background: colors.indigo, padding: '40px 32px 56px' },
  heroPattern: { position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: `repeating-linear-gradient(115deg, ${colors.ocre} 0px, ${colors.ocre} 2px, transparent 2px, transparent 26px)` },
  heroContent: { position: 'relative', maxWidth: '700px', margin: '0 auto', textAlign: 'center' },
  eyebrow: { color: colors.ocre, fontSize: '13px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' },
  title: { color: '#fff', fontFamily: "'Fraunces', serif", fontSize: '30px', fontWeight: '600', marginBottom: '6px' },
  subtitle: { color: 'rgba(255,255,255,0.75)', fontSize: '14px', marginBottom: '26px' },
  searchWrap: { display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', borderRadius: '12px', padding: '15px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', color: '#999', maxWidth: '520px', margin: '0 auto' },
  searchInput: { border: 'none', outline: 'none', flex: 1, fontSize: '15px', fontFamily: "'Work Sans', sans-serif", color: colors.encre },
  content: { maxWidth: '1100px', margin: '-28px auto 0', padding: '0 24px 64px', position: 'relative' },
  filtersRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', background: '#fff', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '18px' },
  pillGroup: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  pill: { padding: '8px 16px', borderRadius: '30px', border: '1.5px solid #e0dccf', background: '#fff', color: '#767066', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Work Sans', sans-serif" },
  pillActive: { background: colors.indigo, color: '#fff', border: `1.5px solid ${colors.indigo}` },
  selectGroup: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  filterSelect: { padding: '9px 14px', border: '1.5px solid #e0dccf', borderRadius: '10px', fontSize: '13px', background: '#fff', color: colors.encre, fontFamily: "'Work Sans', sans-serif" },
  compteur: { color: '#767066', fontSize: '13px', marginBottom: '20px', fontWeight: '500' },
  loading: { textAlign: 'center', padding: '60px', color: '#767066' },
  empty: { textAlign: 'center', padding: '60px', color: '#767066', background: '#fff', borderRadius: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '20px' },
  card: { background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  cardBanner: { background: `linear-gradient(135deg, ${colors.ocre}22, ${colors.vert}15)`, padding: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  cardEmoji: { fontSize: '56px' },
  cardBody: { padding: '20px' },
  cardTitle: { color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '17px', fontWeight: '600', marginBottom: '14px', textAlign: 'center' },
  cardInfo: { background: colors.sable, borderRadius: '8px', padding: '12px', marginBottom: '14px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '13px', borderBottom: '1px solid #ece6d6', color: '#6b6558' },
  mono: { fontFamily: "'JetBrains Mono', monospace", color: colors.encre },
  description: { color: '#767066', fontSize: '13px', marginBottom: '14px', lineHeight: '1.5' },
  farmerRow: { display: 'flex', alignItems: 'center', gap: '8px', background: colors.sable, borderRadius: '10px', padding: '10px 12px', marginBottom: '12px' },
  farmerAvatar: { width: '28px', height: '28px', borderRadius: '50%', background: colors.indigo, color: '#fff', fontSize: '12px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  farmerName: { flex: 1, fontSize: '13px', fontWeight: '600', color: colors.encre },
  farmerRegion: { fontSize: '11px', color: '#767066' },
  addCartBtn: { width: '100%', padding: '12px', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Work Sans', sans-serif" },
};

export default Marketplace;