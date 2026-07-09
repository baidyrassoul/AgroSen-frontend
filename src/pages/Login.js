import React, { useState, useRef } from 'react';
import api from '../services/api';
import colors from '../colors';

function detecterType(valeur) {
  return valeur && valeur.includes('@') ? 'email' : 'telephone';
}

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ nom: '', identifiant: '', mot_de_passe: '', role: 'agriculteur' });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [ecranVerification, setEcranVerification] = useState(null);
  const [codeSaisi, setCodeSaisi] = useState('');

  const pwRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur('');

    const identifiant = form.identifiant.trim();
    if (!identifiant) {
      setErreur('Veuillez entrer un email ou un numéro de téléphone');
      setChargement(false);
      return;
    }

    if (isRegister && !form.nom.trim()) {
      setErreur('Veuillez entrer votre nom');
      setChargement(false);
      return;
    }

    const type = detecterType(identifiant);

    try {
      if (isRegister) {
        const payload = { nom: form.nom.trim(), mot_de_passe: form.mot_de_passe, role: form.role };
        if (type === 'email') {
          payload.email = identifiant;
        } else {
          payload.telephone = identifiant;
        }
        const res = await api.post('/auth/register', payload);
        setEcranVerification({
          id: res.data.utilisateur_id,
          moyen: res.data.moyen_verification,
          valeur: identifiant,
        });
      } else {
        const payload = { mot_de_passe: form.mot_de_passe };
        if (type === 'email') {
          payload.email = identifiant;
        } else {
          payload.telephone = identifiant;
        }
        const res = await api.post('/auth/login', payload);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.utilisateur));
        window.location.href = res.data.utilisateur.role === 'client' ? '/marketplace' : '/dashboard';
      }
    } catch (err) {
      setErreur(err.response?.data?.erreur || 'Une erreur est survenue');
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
        payload.email = ecranVerification.valeur;
      } else {
        payload.telephone = ecranVerification.valeur;
      }
      await api.post('/auth/verify', payload);
      setEcranVerification(null);
      setCodeSaisi('');
      try {
        const loginPayload = { mot_de_passe: form.mot_de_passe };
        if (ecranVerification.moyen === 'email') {
          loginPayload.email = ecranVerification.valeur;
        } else {
          loginPayload.telephone = ecranVerification.valeur;
        }
        const loginRes = await api.post('/auth/login', loginPayload);
        localStorage.setItem('token', loginRes.data.token);
        localStorage.setItem('user', JSON.stringify(loginRes.data.utilisateur));
        window.location.href = loginRes.data.utilisateur.role === 'client' ? '/marketplace' : '/dashboard';
      } catch {
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
  const typeDetecte = form.identifiant ? detecterType(form.identifiant) : null;
  const placeholder = isRegister
    ? 'Email ou numéro de téléphone'
    : 'Email ou numéro de téléphone';

  if (ecranVerification) {
    const label = ecranVerification.moyen === 'email' ? 'email' : 'téléphone';
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
            <strong>{ecranVerification.valeur}</strong>
          </p>
          <div style={s.codeRow}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <input
                key={i}
                style={{
                  ...s.codeBox,
                  borderColor: codeSaisi.length > i ? colors.vert : '#ddd',
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={codeSaisi[i] || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val) {
                    const newCode = codeSaisi + val;
                    setCodeSaisi(newCode.slice(0, 6));
                    if (i < 5) {
                      const next = document.getElementById(`code-${i + 1}`);
                      next?.focus();
                    }
                  } else {
                    setCodeSaisi(codeSaisi.slice(0, i));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !codeSaisi[i] && i > 0) {
                    const prev = document.getElementById(`code-${i - 1}`);
                    prev?.focus();
                    setCodeSaisi(codeSaisi.slice(0, i - 1));
                  }
                }}
                autoFocus={i === 0}
                id={`code-${i}`}
              />
            ))}
          </div>
          <p style={s.codeHint}>
            {codeSaisi.length < 6
              ? `Entrez les 6 chiffres reçus`
              : 'Appuyez sur Vérifier'}
          </p>
          <button
            style={s.btnPrimary}
            onClick={handleVerifierCode}
            disabled={chargement || codeSaisi.length < 6}
          >
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

        <form onSubmit={handleSubmit} style={s.form}>
          {isRegister && (
            <>
              <input
                style={s.input}
                type="text"
                name="nom"
                placeholder="Nom complet"
                value={form.nom}
                onChange={handleChange}
                autoFocus
                required
              />
              <div style={s.roleRow}>
                <button
                  type="button"
                  style={{ ...s.roleBtn, ...(form.role === 'agriculteur' ? s.roleBtnActive : {}) }}
                  onClick={() => setForm({ ...form, role: 'agriculteur' })}
                >
                  <LeafIcon /> Agriculteur
                </button>
                <button
                  type="button"
                  style={{ ...s.roleBtn, ...(form.role === 'client' ? s.roleBtnActive : {}) }}
                  onClick={() => setForm({ ...form, role: 'client' })}
                >
                  <CartIcon /> Client
                </button>
              </div>
            </>
          )}

          <div style={s.fieldGroup}>
            <input
              style={s.input}
              type={typeDetecte === 'email' ? 'email' : 'text'}
              name="identifiant"
              placeholder={placeholder}
              value={form.identifiant}
              onChange={handleChange}
              autoFocus={!isRegister}
              required
            />
            {typeDetecte && (
              <span style={s.fieldBadge}>
                {typeDetecte === 'email' ? '📧' : '📱'}
              </span>
            )}
          </div>

          <div style={s.fieldGroup}>
            <input
              ref={pwRef}
              style={s.input}
              type={showPassword ? 'text' : 'password'}
              name="mot_de_passe"
              placeholder="Mot de passe"
              value={form.mot_de_passe}
              onChange={handleChange}
              required
            />
            <span
              style={s.eyeBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <button style={s.btnPrimary} type="submit" disabled={chargement}>
            {chargement
              ? 'Chargement...'
              : isRegister ? "S'inscrire" : 'Se connecter'}
          </button>
        </form>

        <button
          style={s.btnSecondary}
          onClick={() => { setIsRegister(!isRegister); setErreur(''); setForm({ ...form, identifiant: '' }); }}
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
function LeafIcon() { return <svg {...ic}><path d="M11 20A7 7 0 0 1 4 13c0-5 4-10 11-10 0 7-2 11-4 13a7 7 0 0 1-4 4z"/><path d="M8 17c3-3 6-8 7-13"/></svg>; }
function CartIcon() { return <svg {...ic}><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6"/></svg>; }

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

  form: {
    display: 'flex',
    flexDirection: 'column',
  },

  fieldGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },

  fieldBadge: {
    position: 'absolute',
    right: '14px',
    fontSize: '16px',
    lineHeight: 1,
    pointerEvents: 'none',
  },

  eyeBtn: {
    position: 'absolute',
    right: '14px',
    fontSize: '18px',
    cursor: 'pointer',
    lineHeight: 1,
    padding: '4px',
    userSelect: 'none',
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

  codeRow: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '12px',
  },
  codeBox: {
    width: '44px',
    height: '52px',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: '600',
    fontFamily: "'JetBrains Mono', monospace",
    border: '2px solid #ddd',
    borderRadius: '10px',
    outline: 'none',
    background: '#fafafa',
    transition: 'border-color 0.15s',
  },
  codeHint: {
    textAlign: 'center',
    color: '#999',
    fontSize: '12px',
    marginBottom: '16px',
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
