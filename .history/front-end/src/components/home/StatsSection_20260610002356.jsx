function StatsSection() {
  const stats = [
    { num: '500+', label: 'Profs vérifiés', icon: 'bi-person-check' },
    { num: '2 000+', label: 'Cours donnés', icon: 'bi-book' },
    { num: '4.9★', label: 'Note moyenne', icon: 'bi-star-fill' },
    { num: '10+', label: 'Villes couvertes', icon: 'bi-geo-alt' }
  ];

  return (
    <section style={{ background: 'white', padding: '2.5rem 0', borderBottom: '1px solid #F1F5F9' }}>
      <div className="container">
        <div className="row g-3">
          {stats.map(function(s, i) {
            return (
              <div key={i} className="col-6 col-md-3">
                <div style={{ textAlign: 'center', padding: '1rem', borderRadius: 12 }}>
                  <i className={`bi ${s.icon}`} style={{ fontSize: '1.6rem', color: '#0d6efd', marginBottom: 8, display: 'block' }} />
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{s.num}</div>
                  <div style={{ color: '#6B7280', fontSize: '0.8rem', marginTop: 4 }}>{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;