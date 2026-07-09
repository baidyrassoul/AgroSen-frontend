import React, { useState } from 'react';
import api from '../services/api';
import colors from '../colors';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [mode, setMode] = useState('email');
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', mot_de_passe: '', role: 'agriculteur' });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const [ecranVerification, setEcranVerification] = useState(null);
  const [codeSaisi, setCodeSaisi] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur('');

    if (isRegister) {
      if (mode === 'email' && !form.email) {
        setErreur('Veuillez entrer une adresse email');
        setChargement(false);
        return;
      }
      if (mode === 'telephone' && !form.telephone) {
        setErreur('Veuillez entrer un numéro de téléphone');
        setChargement(false);
        return;
      }
    }

    try {
      if (isRegister) {
        const payload = { nom: form.nom, mot_de_passe: form.mot_de_passe, role: form.role };
        if (mode === 'email') {
          payload.email = form.email;
        } else {
          payload.telephone = form.telephone;
        }
        const res = await api.post('/auth/register', payload);
        const utilisateurId = res.data.utilisateur_id;
        setEcranVerification({
          id: utilisateurId,
          moyen: res.data.moyen_verification,
          email: payload.email || '',
          telephone: payload.telephone || '',
        });
      } else {
        const payload = { mot_de_passe: form.mot_de_passe };
        if (mode === 'email') {
          payload.email = form.email;
        } else {
          payload.telephone = form.telephone;
        }
        const res = await api.post('/auth/login', payload);
        const role = res.data.utilisateur.role;
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.utilisateur));
        window.location.href = role === 'client' ? '/marketplace' : '/dashboard';
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.erreur === 'compte_non_verifie') {
        setEcranVerification({
          id: data.utilisateur_id,
          moyen: data.moyen_verification,
          email: form.email,
          telephone: form.telephone,
        });
      } else {
        setErreur(data?.erreur || 'Une erreur est survenue');
      }
    } finally {
      setChargement(false);
    }
  };

  const handleVerifierCode = async () => {
    if (!codeSaisi) return;
    setChargement(true);
    try {
      const payload = { code: codeSaisi };
      if (ecranVerification.moyen === 'email') {
        payload.email = ecranVerification.email;
      } else {
        payload.telephone = ecranVerification.telephone;
      }
      await api.post('/auth/verify', payload);
      setEcranVerification(null);
      setCodeSaisi('');
      try {
        const loginPayload = { mot_de_passe: form.mot_de_passe };
        if (ecranVerification.moyen === 'email') {
          loginPayload.email = ecranVerification.email;
        } else {
          loginPayload.telephone = ecranVerification.telephone;
        }
        const loginRes = await api.post('/auth/login', loginPayload);
        localStorage.setItem('token', loginRes.data.token);
        localStorage.setItem('user', JSON.stringify(loginRes.data.utilisateur));
        const role = loginRes.data.utilisateur.role;
        window.location.href = role === 'client' ? '/marketplace' : '/dashboard';
      } catch (e) {
        setErreur('Vérifié ! Connectez-vous maintenant.');
        setIsRegister(false);
      }
    } catch (err) {
      setErreur(err.response?.data?.erreur || 'Code invalide');
    } finally {
      setChargement(false);
    }
  };

  const estSucces = erreur.includes('créé') || erreur.includes('Connectez');

  if (ecranVerification) {
    const label = ecranVerification.moyen === 'email' ? 'email' : 'téléphone';
    const valeur = ecranVerification.moyen === 'email' ? ecranVerification.email : ecranVerification.telephone;
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.logoWrap}>
            <img src="/logo.png" alt="AgroSen" style={s.logo} />
          </div>
          <p style={s.eyebrow}>Vérification</p>
          <h2 style={s.title}>Code de vérification</h2>
          <p style={s.desc}>
            Un code a été envoyé à votre {label}<br />
            <strong>{valeur}</strong>
          </p>
          <input
            style={s.input}
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Entrez le code à 6 chiffres"
            value={codeSaisi}
            onChange={(e) => setCodeSaisi(e.target.value.replace(/\D/g, ''))}
            autoFocus
          />
          <button style={s.btnPrimary} onClick={handleVerifierCode} disabled={chargement || codeSaisi.length < 6}>
            {chargement ? 'Vérification...' : 'Vérifier'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoWrap}>
          <img src="/logo.png" alt="AgroSen" style={s.logo} />
        </div>

        <p style={s.eyebrow}>{isRegister ? 'Nouveau compte' : 'Bon retour'}</p>
        <h2 style={s.title}>
          {isRegister ? 'Créer un compte' : 'Se connecter'}
        </h2>

        {erreur && (
          <div style={{
            ...s.msg,
            background: estSucces ? '#eef4ec' : '#f7e9e6',
            color: estSucces ? colors.vert : colors.terre,
          }}>
            {erreur}
          </div>
        )}

        <div style={s.toggleRow}>
          <button
            type="button"
            style={{ ...s.toggleBtn, ...(mode === 'email' ? s.toggleBtnActive : {}) }}
            onClick={() => setMode('email')}
          >
            Email
          </button>
          <button
            type="button"
            style={{ ...s.toggleBtn, ...(mode === 'telephone' ? s.toggleBtnActive : {}) }}
            onClick={() => setMode('telephone')}
          >
            Téléphone
          </button>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          {isRegister && (
            <input
              style={s.input}
              type="text"
              name="nom"
              placeholder="Nom complet"
              value={form.nom}
              onChange={handleChange}
              required
            />
          )}

          {isRegister && (
            <div style={s.roleRow}>
              <button
                type="button"
                style={{ ...s.roleBtn, ...(form.role === 'agriculteur' ? s.roleBtnActive : {}) }}
                onClick={() => setForm({ ...form, role: 'agriculteur' })}
              >
                <IconLeafSmall /> Agriculteur
              </button>
              <button
                type="button"
                style={{ ...s.roleBtn, ...(form.role === 'client' ? s.roleBtnActive : {}) }}
                onClick={() => setForm({ ...form, role: 'client' })}
              >
                <IconCartSmall /> Client
              </button>
            </div>
          )}

          {mode === 'email' ? (
            <input
              style={s.input}
              type="email"
              name="email"
              placeholder="Adresse email"
              value={form.email}
              onChange={handleChange}
              required
            />
          ) : (
            <input
              style={s.input}
              type="tel"
              name="telephone"
              placeholder="Numéro de téléphone"
              value={form.telephone}
              onChange={handleChange}
              required
            />
          )}

          <input
            style={s.input}
            type="password"
            name="mot_de_passe"
            placeholder="Mot de passe"
            value={form.mot_de_passe}
            onChange={handleChange}
            required
          />

          <button style={s.btnPrimary} type="submit" disabled={chargement}>
            {chargement ? 'Chargement...' : (isRegister ? "S'inscrire" : 'Se connecter')}
          </button>
        </form>

        <button
          style={s.btnSecondary}
          onClick={() => { setIsRegister(!isRegister); setErreur(''); }}
        >
          {isRegister ? 'Se connecter' : 'Créer un compte'}
        </button>

        {!isRegister && (
          <p style={s.toggle}>
            Pas encore de compte ?{' '}
            <span
              style={s.link}
              onClick={() => { setIsRegister(true); setErreur(''); }}
            >
              S'inscrire
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

const ic = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
function IconLeafSmall() { return <svg {...ic}><path d="M11 20A7 7 0 0 1 4 13c0-5 4-10 11-10 0 7-2 11-4 13a7 7 0 0 1-4 4z"/><path d="M8 17c3-3 6-8 7-13"/></svg>; }
function IconCartSmall() { return <svg {...ic}><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6"/></svg>; }

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${colors.foret} 0%, #0d2b1d 100%)`,
    fontFamily: "'Work Sans', sans-serif",
    padding: '24px',
  },

  card: {
    width: '100%',
    maxWidth: '400px',
    background: '#fff',
    borderRadius: '16px',
    padding: '40px 32px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },

  logoWrap: {
    textAlign: 'center',
    marginBottom: '8px',
  },
  logo: {
    width: '56px',
    height: '56px',
  },

  eyebrow: {
    textAlign: 'center',
    color: colors.terre,
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  title: {
    textAlign: 'center',
    color: colors.encre,
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '24px',
  },
  desc: {
    textAlign: 'center',
    color: '#555',
    fontSize: '14px',
    marginBottom: '24px',
    lineHeight: 1.6,
  },

  msg: {
    padding: '11px 14px',
    borderRadius: '10px',
    marginBottom: '16px',
    fontSize: '14px',
    textAlign: 'center',
  },

  toggleRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  toggleBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    border: '1.5px solid #e0dccf',
    background: '#f9f8f4',
    color: '#767066',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Work Sans', sans-serif",
    textAlign: 'center',
    transition: 'all 0.15s',
  },
  toggleBtnActive: {
    border: `1.5px solid ${colors.vert}`,
    background: '#eef4ec',
    color: colors.vert,
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
  },

  roleRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  roleBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px',
    borderRadius: '10px',
    border: '1.5px solid #e0dccf',
    background: '#f9f8f4',
    color: '#767066',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Work Sans', sans-serif",
    transition: 'all 0.15s',
  },
  roleBtnActive: {
    border: `1.5px solid ${colors.vert}`,
    background: '#eef4ec',
    color: colors.vert,
  },

  input: {
    width: '100%',
    padding: '14px 16px',
    marginBottom: '12px',
    border: '1.5px solid #ddd',
    borderRadius: '12px',
    fontSize: '15px',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: "'Work Sans', sans-serif",
    background: '#fafafa',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },

  btnPrimary: {
    width: '100%',
    padding: '14px',
    background: colors.foret,
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
    fontFamily: "'Work Sans', sans-serif",
    transition: 'background 0.15s',
  },

  btnSecondary: {
    width: '100%',
    padding: '13px',
    background: 'transparent',
    color: colors.vert,
    border: `1.5px solid ${colors.vert}`,
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    fontFamily: "'Work Sans', sans-serif",
    transition: 'all 0.15s',
  },

  toggle: {
    marginTop: '20px',
    color: '#767066',
    fontSize: '14px',
    textAlign: 'center',
  },
  link: {
    color: colors.vert,
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default Login;
