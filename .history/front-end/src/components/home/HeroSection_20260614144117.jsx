{showSubjectDrop && !loading && getFilteredSubjects().length > 0 && (
  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: isDark ? '#1a1a1c' : '#ffffff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`, borderRadius: '16px', zIndex: 200, maxHeight: '300px', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
    {getFilteredSubjects().map((s, i) => (
      <div key={i} onMouseDown={() => onSelectSubject(s.name)} style={{ padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: isDark ? '#ffffff' : '#07090d' }} onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#2a2a2a' : '#f5f5f5'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {getIcon(s.category)} <span>{s.name}</span>
        </div>
        <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontFamily: 'monospace' }}>{s.category}</span>
      </div>
    ))}
  </div>
)}