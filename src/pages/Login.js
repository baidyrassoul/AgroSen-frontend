import React, { useState } from 'react';
import api from '../services/api';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ nom: '', email: '', mot_de_passe: '', role: 'agriculteur' });
  const [verificationEnCours, setVerificationEnCours] = useState(false);
  const [codeVerification, setCodeVerification] = useState('');
  const [emailVerification, setEmailVerification] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur('');
    try {
      if (isRegister) {
        await api.post('/auth/register', form);
        setIsRegister(false);
        setErreur('Compte créé ! Connectez-vous maintenant.');
        setVerificationEnCours(false);
        setCodeVerification('');
      } else {
        if (!verificationEnCours) {
          const res = await api.post('/auth/login', {
            email: form.email,
            mot_de_passe: form.mot_de_passe
          });

          if (res.data.verification_requise) {
            setVerificationEnCours(true);
            setEmailVerification(res.data.email || form.email);
            setErreur('Un code de vérification a été envoyé à votre adresse email.');
            return;
          }
        } else {
          const res = await api.post('/auth/login/verify', {
            email: emailVerification || form.email,
            code: codeVerification
          });
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.utilisateur));
          const role = res.data.utilisateur.role;
          window.location.href = role === 'client' ? '/marketplace' : '/dashboard';
        }
      }
    } catch (err) {
      setErreur(err.response?.data?.erreur || 'Une erreur est survenue');
    } finally {
      setChargement(false);
    }
  };

  const estSucces = erreur.includes('créé');

  return (
    <div style={styles.container}>
      {/* Panneau gauche — identité */}
      <div style={styles.leftPanel}>
        <div style={styles.leftPattern} />
        <div style={styles.leftContent}>
          <div style={styles.logoBadge}><img src="/logo.png" alt="AgroSen" style={styles.logoImg} /></div>
          <p style={styles.brandTagline}>
            Système d'aide aux producteurs agricoles sénégalais — détection de maladies, estimation du rendement, et vente directe.
          </p>
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <IconLeafSmall /> <span>Arachide & Maïs</span>
            </div>
            <div style={styles.statItem}>
              <IconChartSmall /> <span>Diagnostic IA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panneau droit — formulaire */}
      <div style={styles.rightPanel} className="login-right-panel">
        <div style={styles.card}>
          
          {/* Bloc d'introduction affiché uniquement sur Mobile */}
          <div className="mobile-intro-header">
            <div style={styles.logoBadge}><img src="/logo.png" alt="AgroSen" style={styles.logoImg} /></div>
            <p style={{...styles.brandTagline, color: colors.encre, opacity: 0.8, marginBottom: '20px'}}>
              Système d'aide aux producteurs agricoles sénégalais — détection de maladies, estimation du rendement, et vente directe.
            </p>
            <div style={{...styles.statsRow, marginBottom: '24px'}}>
              <div style={{...styles.statItem, border: '1px solid #e0dccf', color: colors.vert, background: '#fff'}}>
                <IconLeafSmall /> <span>Arachide & Maïs</span>
              </div>
              <div style={{...styles.statItem, border: '1px solid #e0dccf', color: colors.ocre, background: '#fff'}}>
                <IconChartSmall /> <span>Diagnostic IA</span>
              </div>
            </div>
          </div>

          <p style={styles.eyebrow}>{isRegister ? 'Nouveau compte' : 'Bon retour'}</p>
          <h2 style={styles.formTitle}>
            {isRegister ? 'Créer un compte' : 'Se connecter'}
          </h2>

          {erreur && (
            <div style={{
              ...styles.message,
              background: estSucces ? '#eef4ec' : '#f7e9e6',
              color: estSucces ? colors.vert : colors.terre,
            }}>
              {erreur}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <input
                style={styles.input}
                type="text"
                name="nom"
                placeholder="Votre nom complet"
                value={form.nom}
                onChange={handleChange}
                required
              />
            )}

            {isRegister && (
              <div style={styles.roleRow}>
                <button
                  type="button"
                  style={{...styles.roleBtn, ...(form.role === 'agriculteur' ? styles.roleBtnActive : {})}}
                  onClick={() => setForm({ ...form, role: 'agriculteur' })}
                >
                  <IconLeafSmall /> Agriculteur
                </button>
                <button
                  type="button"
                  style={{...styles.roleBtn, ...(form.role === 'client' ? styles.roleBtnActive : {})}}
                  onClick={() => setForm({ ...form, role: 'client' })}
                >
                  <IconCartSmall /> Client
                </button>
              </div>
            )}

            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Adresse email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              style={styles.input}
              type="password"
              name="mot_de_passe"
              placeholder="Mot de passe"
              value={form.mot_de_passe}
              onChange={handleChange}
              required
            />

            {!isRegister && verificationEnCours && (
              <>
                <div style={styles.verificationNotice}>
                  Nous avons envoyé un code à {emailVerification || form.email}. Saisissez-le pour terminer la connexion.
                </div>
                <input
                  style={styles.input}
                  type="text"
                  inputMode="numeric"
                  name="codeVerification"
                  placeholder="Code reçu par email"
                  value={codeVerification}
                  onChange={(e) => setCodeVerification(e.target.value)}
                  required
                />
              </>
            )}

            <button style={styles.button} type="submit" disabled={chargement}>
              {chargement ? 'Chargement...' : (isRegister ? "S'inscrire" : (verificationEnCours ? 'Vérifier le code' : 'Se connecter'))}
            </button>

            {!isRegister && verificationEnCours && (
              <button
                type="button"
                style={{ ...styles.button, marginTop: '10px', background: '#6b7280' }}
                onClick={() => {
                  setVerificationEnCours(false);
                  setCodeVerification('');
                  setErreur('');
                }}
              >
                Modifier l'adresse ou le mot de passe
              </button>
            )}
          </form>

          <p style={styles.toggle}>
            {isRegister ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
            <span
              style={styles.link}
              onClick={() => { setIsRegister(!isRegister); setErreur(''); }}
            >
              {isRegister ? 'Se connecter' : "S'inscrire"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}


const smallIconProps = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
function IconLeafSmall() { return <svg {...smallIconProps}><path d="M11 20A7 7 0 0 1 4 13c0-5 4-10 11-10 0 7-2 11-4 13a7 7 0 0 1-4 4z"/><path d="M8 17c3-3 6-8 7-13"/></svg>; }
function IconChartSmall() { return <svg {...smallIconProps}><path d="M3 3v18h18"/><path d="M7 15l3-4 3 2 5-7"/></svg>; }
function IconCartSmall() { return <svg {...smallIconProps}><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6"/></svg>; }

const colors = {
  vert: '#2D5F2E',
  ocre: '#D4A24C',
  indigo: '#1E3A5F',
  sable: '#F7F3E9',
  terre: '#8B4A3B',
  encre: '#1A1A1A',
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', fontFamily: "'Work Sans', sans-serif" },

  leftPanel: { position: 'relative', overflow: 'hidden', flex: '1 1 45%', background: colors.indigo, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' },
  leftPattern: {
    position: 'absolute', inset: 0, opacity: 0.1,
    backgroundImage: `repeating-linear-gradient(115deg, ${colors.ocre} 0px, ${colors.ocre} 2px, transparent 2px, transparent 26px)`,
  },
  leftContent: { position: 'relative', maxWidth: '420px', color: colors.sable },
  
  brandIcon: { color: colors.ocre, marginBottom: '20px' },
logoBadge: { display: 'inline-block', background: '#fff', borderRadius: '16px', padding: '12px', marginBottom: '20px' },
logoImg: { width: '64px', height: '64px', display: 'block' },
  brandTitle: { fontFamily: "'Fraunces', serif", fontSize: '36px', fontWeight: '600', margin: '0 0 16px' },
  brandTagline: { fontSize: '15px', lineHeight: '1.7', color: 'rgba(247,243,233,0.8)', marginBottom: '32px' },
  statsRow: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  statItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: colors.ocre, background: 'rgba(255,255,255,0.08)', padding: '8px 14px', borderRadius: '20px' },

  rightPanel: { flex: '1 1 55%', background: colors.sable, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' },
  card: { width: '100%', maxWidth: '380px' },
  eyebrow: { color: colors.terre, fontSize: '13px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' },
  formTitle: { color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '26px', fontWeight: '600', marginBottom: '24px' },
  message: { padding: '11px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' },
  verificationNotice: { marginBottom: '12px', padding: '10px 12px', borderRadius: '8px', background: '#eef4ec', color: colors.vert, fontSize: '13px', lineHeight: '1.5' },

  roleRow: { display: 'flex', gap: '10px', marginBottom: '12px' },
  roleBtn: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '11px', borderRadius: '8px', border: `1.5px solid #e0dccf`, background: '#fff',
    color: '#767066', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Work Sans', sans-serif",
  },
  roleBtnActive: { border: `1.5px solid ${colors.vert}`, background: '#eef4ec', color: colors.vert },

  input: {
    width: '100%', padding: '12px 16px', marginBottom: '12px',
    border: '1.5px solid #e0dccf', borderRadius: '8px', fontSize: '14px',
    boxSizing: 'border-box', outline: 'none', fontFamily: "'Work Sans', sans-serif", background: '#fff',
  },
  button: {
    width: '100%', padding: '13px', background: colors.indigo, color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
    cursor: 'pointer', marginTop: '4px', fontFamily: "'Work Sans', sans-serif",
  },
  toggle: { marginTop: '22px', color: '#767066', fontSize: '14px', textAlign: 'center' },
  link: { color: colors.vert, cursor: 'pointer', fontWeight: '600' },
};

export default Login;