import React from 'react';

function PremiumModal({ message, onClose }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.icon}>⭐</div>
        <h2 style={styles.title}>Limite gratuite atteinte</h2>
        <p style={styles.message}>{message}</p>
        <div style={styles.btns}>
          <button style={styles.cancelBtn} onClick={onClose}>Plus tard</button>
          <button style={styles.premiumBtn} onClick={() => (window.location.href = '/premium')}>
            🚀 Voir les plans Premium
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' },
  icon: { fontSize: '48px', marginBottom: '12px' },
  title: { color: '#1B5E20', marginBottom: '12px', fontSize: '20px' },
  message: { color: '#555', marginBottom: '24px', fontSize: '14px', lineHeight: '1.5' },
  btns: { display: 'flex', gap: '12px', justifyContent: 'center' },
  cancelBtn: { padding: '10px 20px', background: '#f5f5f5', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  premiumBtn: { padding: '10px 20px', background: '#F9A825', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
};

export default PremiumModal;