import React, { useState } from 'react';
import colors from '../colors';

function Panier({ panier, setPanier }) {
  const [etape, setEtape] = useState('panier'); // panier → paiement → confirmation
  const [methodePaiement, setMethodePaiement] = useState('wave');
  const [telephone, setTelephone] = useState('');
  

  const total = panier.reduce((sum, item) => sum + (item.prix_par_kg * item.quantite_commandee), 0);

  const supprimerItem = (id) => {
    setPanier(panier.filter(item => item.id !== id));
  };

  const modifierQuantite = (id, delta) => {
    setPanier(panier.map(item => {
      if (item.id !== id) return item;
      const newQty = Math.max(1, Math.min(item.quantite_kg, item.quantite_commandee + delta));
      return { ...item, quantite_commandee: newQty };
    }));
  };

  const handlePayer = () => {
    if (!telephone) {
      alert('Veuillez entrer votre numéro de téléphone');
      return;
    }
    setEtape('confirmation');
  };

  if (panier.length === 0 && etape === 'panier') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => window.location.href = '/marketplace'}>← Retour</button>
          <h1 style={styles.title}>🛒 Mon panier</h1>
        </div>
        <div style={styles.empty}>
          <div style={{fontSize: '64px', marginBottom: '16px'}}>🛒</div>
          <p style={{fontSize: '18px', fontWeight: '600', color: '#333'}}>Votre panier est vide</p>
          <p style={{color: '#767066', marginBottom: '24px'}}>Ajoutez des produits depuis la marketplace</p>
          <button style={styles.shopBtn} onClick={() => window.location.href = '/marketplace'}>
            Voir les produits
          </button>
        </div>
      </div>
    );
  }

  if (etape === 'confirmation') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>✅ Commande confirmée !</h1>
        </div>
        <div style={styles.confirmBox}>
          <div style={{fontSize: '64px', marginBottom: '16px'}}>🎉</div>
          <h2 style={styles.confirmTitle}>Merci pour votre commande !</h2>
          <p style={styles.confirmText}>
            Votre commande a été enregistrée. Les agriculteurs vous contacteront sous 24h au <strong>{telephone}</strong> pour finaliser le paiement via {methodePaiement === 'wave' ? 'Wave' : 'Orange Money'}.
          </p>
          <div style={styles.confirmDetails}>
            <div style={styles.confirmRow}>
              <span>💰 Total à payer</span>
              <strong style={styles.confirmTotal}>{total.toLocaleString()} FCFA</strong>
            </div>
            <div style={styles.confirmRow}>
              <span>📱 Via</span>
              <strong>{methodePaiement === 'wave' ? '📘 Wave' : '🟠 Orange Money'}</strong>
            </div>
            <div style={styles.confirmRow}>
              <span>📞 Votre numéro</span>
              <strong>{telephone}</strong>
            </div>
          </div>
          <button style={styles.shopBtn} onClick={() => {
            setPanier([]);
            window.location.href = '/marketplace';
          }}>
            Retour à la marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => window.location.href = '/marketplace'}>← Retour</button>
        <h1 style={styles.title}>🛒 Mon panier ({panier.length} article{panier.length > 1 ? 's' : ''})</h1>
      </div>

      <div style={styles.content}>
        <div style={styles.leftCol}>
          {panier.map(item => (
            <div key={item.id} style={styles.cartItem}>
              <div style={styles.itemEmoji}>{item.emoji}</div>
              <div style={styles.itemInfo}>
                <h3 style={styles.itemName}>{item.nom}</h3>
                <p style={styles.itemAgri}>👨‍🌾 {item.nom_agriculteur}</p>
                <p style={styles.itemPrice}>{item.prix_par_kg} FCFA/kg</p>
              </div>
              <div style={styles.itemQty}>
                <button style={styles.qtyBtn} onClick={() => modifierQuantite(item.id, -1)}>−</button>
                <span style={styles.qtyNum}>{item.quantite_commandee} kg</span>
                <button style={styles.qtyBtn} onClick={() => modifierQuantite(item.id, 1)}>+</button>
              </div>
              <div style={styles.itemTotal}>
                {(item.prix_par_kg * item.quantite_commandee).toLocaleString()} FCFA
              </div>
              <button style={styles.removeBtn} onClick={() => supprimerItem(item.id)}>✕</button>
            </div>
          ))}
        </div>

        <div style={styles.rightCol}>
          <div style={styles.summaryCard}>
            <h2 style={styles.summaryTitle}>Récapitulatif</h2>
            {panier.map(item => (
              <div key={item.id} style={styles.summaryRow}>
                <span>{item.emoji} {item.nom} × {item.quantite_commandee} kg</span>
                <span>{(item.prix_par_kg * item.quantite_commandee).toLocaleString()} FCFA</span>
              </div>
            ))}
            <div style={styles.summaryTotal}>
              <span>Total</span>
              <strong style={styles.totalAmount}>{total.toLocaleString()} FCFA</strong>
            </div>
          </div>

          <div style={styles.paymentCard}>
            <h2 style={styles.summaryTitle}>Mode de paiement</h2>
            <div style={styles.payOptions}>
              <div
                style={{...styles.payOption, ...(methodePaiement === 'wave' ? styles.payOptionActive : {})}}
                onClick={() => setMethodePaiement('wave')}
              >
                <span style={styles.payIcon}>📘</span>
                <div>
                  <div style={styles.payName}>Wave</div>
                  <div style={styles.payDesc}>Paiement mobile rapide</div>
                </div>
                {methodePaiement === 'wave' && <span style={styles.payCheck}>✓</span>}
              </div>
              <div
                style={{...styles.payOption, ...(methodePaiement === 'orange' ? styles.payOptionActive : {})}}
                onClick={() => setMethodePaiement('orange')}
              >
                <span style={styles.payIcon}>🟠</span>
                <div>
                  <div style={styles.payName}>Orange Money</div>
                  <div style={styles.payDesc}>Paiement mobile Orange</div>
                </div>
                {methodePaiement === 'orange' && <span style={styles.payCheck}>✓</span>}
              </div>
            </div>

            <div style={styles.phoneField}>
              <label style={styles.phoneLabel}>Votre numéro de téléphone</label>
              <input
                style={styles.phoneInput}
                type="tel"
                placeholder="Ex: 77 123 45 67"
                value={telephone}
                onChange={e => setTelephone(e.target.value)}
              />
            </div>

            <button style={styles.payBtn} onClick={handlePayer}>
              💳 Confirmer la commande — {total.toLocaleString()} FCFA
            </button>
            <p style={styles.payNote}>
              ⚡ Les agriculteurs vous contacteront sous 24h pour finaliser le paiement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



const styles = {
  container: { minHeight: '100vh', background: colors.sable, fontFamily: "'Work Sans', sans-serif" },
  header: { background: colors.indigo, padding: '24px 32px', color: 'white' },
  backBtn: { background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', marginBottom: '12px', fontSize: '13px', fontFamily: "'Work Sans', sans-serif" },
  title: { margin: 0, fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: '600' },
  empty: { textAlign: 'center', padding: '80px 24px' },
  shopBtn: { background: colors.indigo, color: 'white', border: 'none', borderRadius: '10px', padding: '14px 32px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Work Sans', sans-serif" },
  content: { maxWidth: '1100px', margin: '32px auto', padding: '0 24px', display: 'flex', gap: '24px', flexWrap: 'wrap' },
  leftCol: { flex: 2, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '12px' },
  rightCol: { flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '16px' },
  cartItem: { background: 'white', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  itemEmoji: { fontSize: '36px', flexShrink: 0 },
  itemInfo: { flex: 1 },
  itemName: { color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: '600', marginBottom: '4px' },
  itemAgri: { color: '#767066', fontSize: '12px', marginBottom: '2px' },
  itemPrice: { color: colors.indigo, fontSize: '13px', fontWeight: '600' },
  itemQty: { display: 'flex', alignItems: 'center', gap: '10px' },
  qtyBtn: { width: '30px', height: '30px', borderRadius: '50%', border: '1.5px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyNum: { fontSize: '14px', fontWeight: '600', minWidth: '50px', textAlign: 'center' },
  itemTotal: { fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: '600', color: colors.encre, minWidth: '100px', textAlign: 'right' },
  removeBtn: { background: '#f7e9e6', color: colors.terre, border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', fontSize: '12px' },
  summaryCard: { background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  summaryTitle: { color: colors.encre, fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: '600', marginBottom: '16px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#767066', padding: '6px 0', borderBottom: '1px solid #f0ebe0' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', marginTop: '8px' },
  totalAmount: { fontFamily: "'Fraunces', serif", fontSize: '20px', color: colors.indigo },
  paymentCard: { background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  payOptions: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' },
  payOption: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e0dccf', cursor: 'pointer' },
  payOptionActive: { border: `1.5px solid ${colors.indigo}`, background: '#f0f4f9' },
  payIcon: { fontSize: '24px' },
  payName: { fontSize: '14px', fontWeight: '600', color: colors.encre },
  payDesc: { fontSize: '12px', color: '#767066' },
  payCheck: { marginLeft: 'auto', color: colors.indigo, fontSize: '18px', fontWeight: '700' },
  phoneField: { marginBottom: '16px' },
  phoneLabel: { display: 'block', fontSize: '13px', fontWeight: '600', color: colors.encre, marginBottom: '8px' },
  phoneInput: { width: '100%', padding: '12px 14px', border: '1.5px solid #ddd6c4', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', fontFamily: "'Work Sans', sans-serif" },
  payBtn: { width: '100%', padding: '14px', background: colors.indigo, color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Work Sans', sans-serif", marginBottom: '10px' },
  payNote: { fontSize: '12px', color: '#767066', textAlign: 'center', lineHeight: '1.5' },
  confirmBox: { maxWidth: '500px', margin: '60px auto', background: 'white', borderRadius: '20px', padding: '40px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' },
  confirmTitle: { fontFamily: "'Fraunces', serif", fontSize: '24px', color: colors.encre, marginBottom: '16px' },
  confirmText: { color: '#767066', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' },
  confirmDetails: { background: colors.sable, borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'left' },
  confirmRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', borderBottom: '1px solid #ece6d6', color: '#6b6558' },
  confirmTotal: { fontFamily: "'Fraunces', serif", fontSize: '18px', color: colors.indigo },
};

export default Panier;