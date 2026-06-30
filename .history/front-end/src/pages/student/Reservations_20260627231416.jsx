// ❌ Avant (erreur)
<a
  href={'https://wa.me/' + whatsappNum}
  target="_blank"
  rel="noopener noreferrer"
  style={{...}}
>
  <Phone size={14} /> WhatsApp Prof
</a>

// ✅ Après (corrigé)
<a
  href={'https://wa.me/' + whatsappNum}
  target="_blank"
  rel="noopener noreferrer"
  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: '#25d366', color: '#fff', fontSize: '0.75rem', fontWeight: 800, textDecoration: 'none', fontFamily: 'monospace' }}
>
  <Phone size={14} /> WhatsApp Prof
</a>