const loadEnseignants = async () => {
  try {
    const res = await api.get('/enseignants');
    console.log('DONNEES API:', res.data);  // AJOUTE CE LOG
    setEnseignants(res.data);
  } catch (err) {
    console.error('Erreur API:', err);
  } finally {
    setLoading(false);
  }
};