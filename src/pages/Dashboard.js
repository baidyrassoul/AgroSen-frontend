import React, { useState, useEffect } from 'react';
import MeteoWidget from '../components/MeteoWidget';
import api from '../services/api';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ diagnostics: 0, parcelles: 0, estimations: 0 });

  useEffect(() => {
    chargerStats();
  }, []);

  const chargerStats = async () => {
    try {
      const [diag, parc, est] = await Promise.all([
        api.get('/diagnostic/historique'),
        api.get('/parcelles'),
        api.get('/rendement/historique'),
      ]);
      setStats({
        diagnostics: diag.data.diagnostics?.length || 0,
        parcelles: parc.data.parcelles?.length || 0,
        estimations: est.data.estimations?.length || 0,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navItems = [
    { icon: '🔬', label: 'Détecter une maladie', path: '/diagnostic', color: '#2D5F2E' },
    { icon: '📊', label: 'Estimer le rendement', path: '/rendement', color: '#1E3A5F' },
    { icon: '🌍', label: 'Mes parcelles', path: '/parcelles', color: '#6B3F1E' },
    { icon: '📋', label: 'Historique', path: '/historique', color: '#4A1E6B' },
    { icon: '📢', label: 'Publier ma récolte', path: '/publication', color: '#1E5F5F' },
    { icon: '⭐', label: 'Premium', path: '/premium', color: '#8B6914' },
  ];

  return (
    <div style={styles.root}>

      {/* Topbar */}
      <header style={styles.topbar}>
        <div style={styles.topLeft}>
          <button style={styles.hamburger} onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div style={styles.navBrandWrap}>
  <span style={styles.logoBadgeSmall}><img src="/logo.png" alt="AgroSen" style={styles.logoImgSmall} /></span>
  <span style={styles.navBrand}>AgroSen</span>
</div>
        </div>
        <div style={styles.topRight}>
          <div style={styles.userChip}>
            <div style={styles.avatar}>{(user.nom || 'U').charAt(0).toUpperCase()}</div>
            <span style={styles.userName}>{user.nom}</span>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>Déconnexion</button>
        </div>
      </header>

      <div style={styles.body}>

        {/* Sidebar */}
        <aside style={styles.sidebar} className={sidebarOpen ? 'sidebar-open' : ''}>
          <nav style={styles.nav}>
            {navItems.map(item => (
              <button
                key={item.path}
                style={styles.navItem}
                onClick={() => window.location.href = item.path}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                <span style={styles.navLabel}>{item.label}</span>
              </button>
            ))}
          </nav>
          <button style={styles.navLogout} onClick={handleLogout}>
            <span>🚪</span>
            <span>Déconnexion</span>
          </button>
        </aside>

        {/* Overlay mobile */}
        {sidebarOpen && (
          <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <main style={styles.main}>

          {/* Welcome */}
          <div style={styles.welcomeSection}>
            <div>
              <h1 style={styles.welcomeTitle}>Bonjour, {user.nom} 👋</h1>
              <p style={styles.welcomeSub}>Que voulez-vous faire aujourd'hui ?</p>
            </div>
          </div>

          {/* Stats + Météo */}
          <div style={styles.topRow}>
            <div style={styles.statsRow}>
              <div style={styles.statCard}>
                <div style={styles.statNum}>{stats.diagnostics}</div>
                <div style={styles.statLabel}>Diagnostics</div>
                <div style={styles.statIcon}>🔬</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNum}>{stats.parcelles}</div>
                <div style={styles.statLabel}>Parcelles</div>
                <div style={styles.statIcon}>🌍</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNum}>{stats.estimations}</div>
                <div style={styles.statLabel}>Estimations</div>
                <div style={styles.statIcon}>📊</div>
              </div>
            </div>
            <div style={styles.meteoWrap}>
              <MeteoWidget />
            </div>
          </div>

          {/* Action cards */}
          <h2 style={styles.sectionTitle}>Actions rapides</h2>
          <div style={styles.grid}>
            {navItems.map(item => (
              <div
                key={item.path}
                style={styles.card}
                onClick={() => window.location.href = item.path}
              >
                <div style={{...styles.cardIconWrap, background: item.color + '18', color: item.color}}>
                  <span style={styles.cardIcon}>{item.icon}</span>
                </div>
                <div style={styles.cardLabel}>{item.label}</div>
                <div style={styles.cardArrow}>→</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

const colors = {
  vert: '#2D5F2E', ocre: '#D4A24C', indigo: '#1E3A5F',
  sable: '#F7F3E9', encre: '#1A1A1A',
};

const styles = {
  root: { minHeight: '100vh', background: colors.sable, fontFamily: "'Work Sans', sans-serif", display: 'flex', flexDirection: 'column' },

  // Topbar
  topbar: { height: '64px', background: colors.indigo, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)', position: 'sticky', top: 0, zIndex: 100 },
  topLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  hamburger: { background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '20px', width: '40px', height: '40px', borderRadius: '8px', cursor: 'pointer' },
  brand: { color: 'white', fontSize: '20px', fontFamily: "'Fraunces', serif", fontWeight: '600' },
  brandText: { marginLeft: '4px' },
  topRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  userChip: { display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '6px 12px 6px 6px' },
  avatar: { width: '28px', height: '28px', borderRadius: '50%', background: colors.ocre, color: colors.encre, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px' },
  userName: { color: 'white', fontSize: '13px', fontWeight: '500' },
  logoutBtn: { background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', fontFamily: "'Work Sans', sans-serif" },

  // Body layout
  body: { display: 'flex', flex: 1, position: 'relative' },

  // Sidebar
  sidebar: { width: '220px', background: 'white', borderRight: '1px solid #e8e2d4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 12px', position: 'sticky', top: '64px', height: 'calc(100vh - 64px)', overflowY: 'auto', flexShrink: 0 },
  sidebarOpen: { left: '0 !important' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: "'Work Sans', sans-serif", fontSize: '14px', color: colors.encre, transition: 'background 0.15s' },
  navIcon: { fontSize: '18px', width: '24px', textAlign: 'center' },
  navLabel: { fontWeight: '500' },
  navLogout: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', border: 'none', background: '#f7e9e6', cursor: 'pointer', width: '100%', fontFamily: "'Work Sans', sans-serif", fontSize: '14px', color: '#8B4A3B', fontWeight: '500' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 98 },

  // Main
  main: { flex: 1, padding: '32px 28px', overflowY: 'auto' },
  welcomeSection: { marginBottom: '28px' },
  welcomeTitle: { color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '28px', fontWeight: '600', marginBottom: '4px' },
  welcomeSub: { color: '#767066', fontSize: '15px' },

  // Top row stats + météo
  topRow: { display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' },
  statsRow: { display: 'flex', gap: '16px', flex: 1, flexWrap: 'wrap' },
  statCard: { background: 'white', borderRadius: '14px', padding: '20px', flex: 1, minWidth: '100px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden' },
  statNum: { fontFamily: "'Fraunces', serif", fontSize: '36px', fontWeight: '600', color: colors.indigo, lineHeight: 1 },
  statLabel: { fontSize: '13px', color: '#767066', marginTop: '6px', fontWeight: '500' },
  statIcon: { position: 'absolute', bottom: '12px', right: '14px', fontSize: '28px', opacity: 0.15 },
  meteoWrap: { width: '280px', flexShrink: 0 },

  // Action cards
  sectionTitle: { color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: '600', marginBottom: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' },
  card: { background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'transform 0.15s, box-shadow 0.15s' },
  cardIconWrap: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardIcon: { fontSize: '24px' },
  cardLabel: { color: colors.encre, fontSize: '14px', fontWeight: '600', flex: 1 },
  cardArrow: { color: '#aaa', fontSize: '16px', alignSelf: 'flex-end' },
  
  navBrandWrap: { position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' },
logoBadgeSmall: { background: '#fff', borderRadius: '8px', padding: '4px', display: 'flex' },
logoImgSmall: { width: '28px', height: '28px', display: 'block' },

};

export default Dashboard;