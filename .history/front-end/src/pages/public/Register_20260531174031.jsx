  // src/pages/public/Register.jsx
  import {useState} from 'react'
  import {Link,useNavigate,useSearchParams} from 'react-router-dom'
  import api from '../../api/axios'

  function Register(){
      const navigate       = useNavigate()
      const [searchParams] = useSearchParams()
      const role           = searchParams.get('role') || 'etudiant'

      const [form,setForm] = useState({
          nom:'',prenom:'',
          email:'',password:'',
          password_confirmation:'',
          ville:'',role:role,
      })
      const [files,setFiles]           = useState({cin_recto:null,cin_verso:null,diplome:null})
      const [error,setError]           = useState('')
      const [loading,setLoading]       = useState(false)
      const [showPass,setShowPass]     = useState(false)
      const [showPass2,setShowPass2]   = useState(false)
      const [success,setSuccess]       = useState(false)

      function handleChange(e){
          setForm({...form,[e.target.name]:e.target.value})
      }

      function handleFile(e){
          setFiles({...files,[e.target.name]:e.target.files[0]})
      }

      async function handleSubmit(e){
          e.preventDefault()
          setLoading(true)
          setError('')

          if(form.password !== form.password_confirmation){
              setError('Les mots de passe ne correspondent pas !')
              setLoading(false)
              return
          }

          try{
              const data = new FormData()
              data.append('nom',form.nom)
              data.append('prenom',form.prenom)
              data.append('email',form.email)
              data.append('password',form.password)
              data.append('password_confirmation',form.password_confirmation)
              data.append('ville',form.ville)
              data.append('role',form.role)

              if(role === 'enseignant'){
                  data.append('cin_recto',files.cin_recto)
                  data.append('cin_verso',files.cin_verso)
                  data.append('diplome',files.diplome)
              }

              const res = await api.post('/register',data,{
                  headers:{'Content-Type':'multipart/form-data'}
              })

              localStorage.setItem('token',res.data.token)
              localStorage.setItem('user',JSON.stringify(res.data.user))

              if(role === 'enseignant'){
                  setSuccess(true)
              } else {
                  navigate('/dashboard')
              }

          }catch(err){
              setError(err.response?.data?.message || 'Erreur lors de l\'inscription')
          }
          setLoading(false)
      }

      // ── Page succès enseignant ──────────────────────────────────────────────
      if(success){
          return(
              <div style={{
                  minHeight:'100vh',background:'#F8FAFC',
                  display:'flex',alignItems:'center',
                  justifyContent:'center',padding:24,
              }}>
                  <div style={{
                      background:'white',borderRadius:20,
                      padding:'48px 40px',maxWidth:480,width:'100%',
                      textAlign:'center',
                      boxShadow:'0 4px 24px rgba(0,0,0,0.06)',
                      border:'1px solid #E2E8F0',
                  }}>
                      <div style={{
                          width:72,height:72,
                          background:'#F0FDF4',
                          borderRadius:'50%',
                          display:'flex',alignItems:'center',
                          justifyContent:'center',
                          margin:'0 auto 20px',
                          border:'2px solid #BBF7D0',
                      }}>
                          <i className="bi bi-check-circle-fill"
                              style={{fontSize:'2rem',color:'#10B981'}}/>
                      </div>
                      <h2 style={{
                          fontFamily:"'Space Grotesk',sans-serif",
                          fontWeight:800,fontSize:'1.4rem',
                          color:'#0F172A',marginBottom:8,
                      }}>
                          Dossier envoyé ! 🎉
                      </h2>
                      <p style={{color:'#6B7280',fontSize:'0.9rem',lineHeight:1.7,marginBottom:24}}>
                          Votre dossier est en cours de vérification par notre équipe.
                          Vous recevrez une confirmation dès que votre profil sera validé.
                      </p>
                      <div style={{
                          background:'#F0FDF4',border:'1px solid #BBF7D0',
                          borderRadius:12,padding:'14px 18px',
                          marginBottom:24,textAlign:'left',
                      }}>
                          {[
                              'CIN recto & verso vérifiés ✓',
                              'Diplôme authentifié ✓',
                              'Profil activé par admin ✓',
                          ].map(item=>(
                              <div key={item} style={{
                                  display:'flex',alignItems:'center',gap:8,
                                  marginBottom:6,fontSize:'0.85rem',color:'#059669',
                                  fontWeight:500,
                              }}>
                                  <i className="bi bi-check2"/>
                                  {item}
                              </div>
                          ))}
                      </div>
                      <Link to="/login" style={{
                          display:'block',
                          background:'#10B981',color:'white',
                          padding:'12px',borderRadius:10,
                          fontWeight:700,textDecoration:'none',
                          fontSize:'0.95rem',
                      }}>
                          Se connecter
                      </Link>
                      <Link to="/" style={{
                          display:'block',marginTop:12,
                          color:'#94A3B8',fontSize:'0.82rem',
                          textDecoration:'none',
                      }}>
                          ← Retour à l'accueil
                      </Link>
                  </div>
              </div>
          )
      }

      // ── Formulaire principal ────────────────────────────────────────────────
      return(
          <div style={{
              minHeight:'100vh',
              background:'#F8FAFC',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              padding:'32px 16px',
          }}>
              <div style={{width:'100%',maxWidth:500}}>

                  {/* Logo */}
                  <div style={{textAlign:'center',marginBottom:24}}>
                      <Link to="/" style={{textDecoration:'none'}}>
                          <div style={{
                              display:'inline-flex',alignItems:'center',
                              gap:8,marginBottom:8,
                          }}>
                              <div style={{
                                  width:40,height:40,background:'#10B981',
                                  borderRadius:10,display:'flex',
                                  alignItems:'center',justifyContent:'center',
                                  color:'white',fontWeight:900,fontSize:'1.1rem',
                                  fontFamily:"'Space Grotesk',sans-serif",
                              }}>L</div>
                              <span style={{
                                  fontFamily:"'Space Grotesk',sans-serif",
                                  fontWeight:800,fontSize:'1.2rem',color:'#0F172A',
                              }}>
                                  Learnect<span style={{color:'#10B981'}}>.ma</span>
                              </span>
                          </div>
                      </Link>

                      {/* Badge rôle */}
                      <div style={{
                          display:'inline-flex',alignItems:'center',gap:6,
                          background: role==='enseignant' ? '#F0FDF4' : '#EFF6FF',
                          border:`1.5px solid ${role==='enseignant'?'#BBF7D0':'#BFDBFE'}`,
                          borderRadius:20,padding:'5px 14px',
                          fontSize:'0.78rem',fontWeight:700,
                          color: role==='enseignant' ? '#059669' : '#2563EB',
                          marginBottom:6,
                      }}>
                          <i className={`bi ${role==='enseignant'?'bi-person-workspace':'bi-mortarboard'}`}/>
                          {role==='enseignant' ? 'Inscription Enseignant' : 'Inscription Étudiant'}
                      </div>

                      <h1 style={{
                          fontFamily:"'Space Grotesk',sans-serif",
                          fontSize:'1.5rem',fontWeight:800,
                          color:'#0F172A',marginBottom:4,
                      }}>
                          {role==='enseignant' ? '👨‍🏫 Devenir Enseignant' : '🎓 Créer un compte'}
                      </h1>
                      <p style={{color:'#6B7280',fontSize:'0.85rem',margin:0}}>
                          {role==='enseignant'
                              ? 'Partagez vos connaissances sur Learnect'
                              : 'Trouvez votre prof idéal dès aujourd\'hui'}
                      </p>
                  </div>

                  {/* Card */}
                  <div style={{
                      background:'white',
                      borderRadius:16,
                      border:'1px solid #E2E8F0',
                      padding:'28px 32px',
                      boxShadow:'0 4px 24px rgba(0,0,0,0.05)',
                  }}>

                      {/* Erreur */}
                      {error&&(
                          <div style={{
                              background:'#FEF2F2',border:'1px solid #FECACA',
                              borderRadius:8,padding:'10px 14px',
                              marginBottom:20,color:'#DC2626',
                              fontSize:'0.85rem',fontWeight:500,
                              display:'flex',alignItems:'center',gap:8,
                          }}>
                              <i className="bi bi-exclamation-triangle-fill"/>
                              {error}
                          </div>
                      )}

                      <form onSubmit={handleSubmit}>

                          {/* Nom + Prénom */}
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
                              <div>
                                  <label style={L}>
                                      <i className="bi bi-person" style={{color:'#10B981',marginRight:4}}/>
                                      Nom
                                  </label>
                                  <input
                                      name="nom" value={form.nom}
                                      onChange={handleChange}
                                      placeholder="Hilali" required
                                      style={I}
                                      onFocus={e=>e.target.style.borderColor='#10B981'}
                                      onBlur={e=>e.target.style.borderColor='#E2E8F0'}
                                  />
                              </div>
                              <div>
                                  <label style={L}>
                                      <i className="bi bi-person" style={{color:'#10B981',marginRight:4}}/>
                                      Prénom
                                  </label>
                                  <input
                                      name="prenom" value={form.prenom}
                                      onChange={handleChange}
                                      placeholder="Marwa" required
                                      style={I}
                                      onFocus={e=>e.target.style.borderColor='#10B981'}
                                      onBlur={e=>e.target.style.borderColor='#E2E8F0'}
                                  />
                              </div>
                          </div>

                          {/* Email */}
                          <div style={{marginBottom:14}}>
                              <label style={L}>
                                  <i className="bi bi-envelope" style={{color:'#10B981',marginRight:4}}/>
                                  Email
                              </label>
                              <input
                                  type="email" name="email" value={form.email}
                                  onChange={handleChange}
                                  placeholder="votre@email.com" required
                                  style={I}
                                  onFocus={e=>e.target.style.borderColor='#10B981'}
                                  onBlur={e=>e.target.style.borderColor='#E2E8F0'}
                              />
                          </div>

                          {/* Ville */}
                          <div style={{marginBottom:14}}>
                              <label style={L}>
                                  <i className="bi bi-geo-alt" style={{color:'#10B981',marginRight:4}}/>
                                  Ville
                              </label>
                              <select
                                  name="ville" value={form.ville}
                                  onChange={handleChange} required style={I}
                              >
                                  <option value="">Choisir une ville</option>
                                  {['Casablanca','Rabat','Fès','Marrakech','Tanger','Agadir','Meknès','Oujda'].map(v=>(
                                      <option key={v} value={v}>{v}</option>
                                  ))}
                              </select>
                          </div>

                          {/* Password */}
                          <div style={{marginBottom:14}}>
                              <label style={L}>
                                  <i className="bi bi-lock" style={{color:'#10B981',marginRight:4}}/>
                                  Mot de passe
                              </label>
                              <div style={{position:'relative'}}>
                                  <input
                                      type={showPass?'text':'password'}
                                      name="password" value={form.password}
                                      onChange={handleChange}
                                      placeholder="Min. 8 caractères" required
                                      style={{...I,paddingRight:42}}
                                      onFocus={e=>e.target.style.borderColor='#10B981'}
                                      onBlur={e=>e.target.style.borderColor='#E2E8F0'}
                                  />
                                  <button type="button"
                                      onClick={()=>setShowPass(!showPass)}
                                      style={{
                                          position:'absolute',right:12,
                                          top:'50%',transform:'translateY(-50%)',
                                          background:'none',border:'none',
                                          cursor:'pointer',color:'#94A3B8',
                                          padding:0,fontSize:'1rem',
                                      }}>
                                      <i className={`bi ${showPass?'bi-eye-slash':'bi-eye'}`}/>
                                  </button>
                              </div>
                          </div>

                          {/* Confirmer password */}
                          <div style={{marginBottom:20}}>
                              <label style={L}>
                                  <i className="bi bi-lock-fill" style={{color:'#10B981',marginRight:4}}/>
                                  Confirmer le mot de passe
                              </label>
                              <div style={{position:'relative'}}>
                                  <input
                                      type={showPass2?'text':'password'}
                                      name="password_confirmation"
                                      value={form.password_confirmation}
                                      onChange={handleChange}
                                      placeholder="••••••••" required
                                      style={{...I,paddingRight:42}}
                                      onFocus={e=>e.target.style.borderColor='#10B981'}
                                      onBlur={e=>e.target.style.borderColor='#E2E8F0'}
                                  />
                                  <button type="button"
                                      onClick={()=>setShowPass2(!showPass2)}
                                      style={{
                                          position:'absolute',right:12,
                                          top:'50%',transform:'translateY(-50%)',
                                          background:'none',border:'none',
                                          cursor:'pointer',color:'#94A3B8',
                                          padding:0,fontSize:'1rem',
                                      }}>
                                      <i className={`bi ${showPass2?'bi-eye-slash':'bi-eye'}`}/>
                                  </button>
                              </div>
                          </div>

                          {/* Documents enseignant */}
                          {role==='enseignant'&&(
                              <div style={{
                                  background:'#F0FDF4',
                                  border:'1.5px solid #BBF7D0',
                                  borderRadius:12,padding:'16px 18px',
                                  marginBottom:20,
                              }}>
                                  <div style={{
                                      display:'flex',alignItems:'center',gap:8,
                                      marginBottom:14,
                                  }}>
                                      <i className="bi bi-shield-check"
                                          style={{color:'#10B981',fontSize:'1.1rem'}}/>
                                      <span style={{
                                          fontWeight:700,color:'#059669',
                                          fontSize:'0.88rem',
                                      }}>
                                          Documents obligatoires pour validation
                                      </span>
                                  </div>

                                  {/* CIN Recto */}
                                  <div style={{marginBottom:12}}>
                                      <label style={L}>
                                          <i className="bi bi-credit-card" style={{color:'#10B981',marginRight:4}}/>
                                          CIN Recto
                                          <span style={{color:'#DC2626',marginLeft:2}}>*</span>
                                      </label>
                                      <div style={{
                                          border:'1.5px dashed #BBF7D0',
                                          borderRadius:8,padding:'10px 14px',
                                          background:'white',
                                          display:'flex',alignItems:'center',gap:8,
                                      }}>
                                          <i className="bi bi-image" style={{color:'#10B981'}}/>
                                          <input
                                              type="file" name="cin_recto"
                                              accept="image/*"
                                              onChange={handleFile} required
                                              style={{
                                                  border:'none',outline:'none',
                                                  fontSize:'0.82rem',flex:1,
                                                  background:'transparent',
                                              }}
                                          />
                                      </div>
                                      <small style={{color:'#6B7280',fontSize:'0.72rem'}}>
                                          Format : JPG ou PNG — Max 2MB
                                      </small>
                                  </div>

                                  {/* CIN Verso */}
                                  <div style={{marginBottom:12}}>
                                      <label style={L}>
                                          <i className="bi bi-credit-card-2-back" style={{color:'#10B981',marginRight:4}}/>
                                          CIN Verso
                                          <span style={{color:'#DC2626',marginLeft:2}}>*</span>
                                      </label>
                                      <div style={{
                                          border:'1.5px dashed #BBF7D0',
                                          borderRadius:8,padding:'10px 14px',
                                          background:'white',
                                          display:'flex',alignItems:'center',gap:8,
                                      }}>
                                          <i className="bi bi-image" style={{color:'#10B981'}}/>
                                          <input
                                              type="file" name="cin_verso"
                                              accept="image/*"
                                              onChange={handleFile} required
                                              style={{
                                                  border:'none',outline:'none',
                                                  fontSize:'0.82rem',flex:1,
                                                  background:'transparent',
                                              }}
                                          />
                                      </div>
                                      <small style={{color:'#6B7280',fontSize:'0.72rem'}}>
                                          Format : JPG ou PNG — Max 2MB
                                      </small>
                                  </div>

                                  {/* Diplôme */}
                                  <div>
                                      <label style={L}>
                                          <i className="bi bi-file-earmark-pdf" style={{color:'#DC2626',marginRight:4}}/>
                                          Diplôme
                                          <span style={{color:'#DC2626',marginLeft:2}}>*</span>
                                      </label>
                                      <div style={{
                                          border:'1.5px dashed #FECACA',
                                          borderRadius:8,padding:'10px 14px',
                                          background:'white',
                                          display:'flex',alignItems:'center',gap:8,
                                      }}>
                                          <i className="bi bi-file-pdf" style={{color:'#DC2626'}}/>
                                          <input
                                              type="file" name="diplome"
                                              accept=".pdf"
                                              onChange={handleFile} required
                                              style={{
                                                  border:'none',outline:'none',
                                                  fontSize:'0.82rem',flex:1,
                                                  background:'transparent',
                                              }}
                                          />
                                      </div>
                                      <small style={{color:'#6B7280',fontSize:'0.72rem'}}>
                                          Format : PDF uniquement — Max 5MB
                                      </small>
                                  </div>

                                  {/* Info validation */}
                                  <div style={{
                                      marginTop:12,
                                      display:'flex',alignItems:'flex-start',gap:8,
                                      background:'white',borderRadius:8,
                                      padding:'10px 12px',
                                      border:'1px solid #E2E8F0',
                                  }}>
                                      <i className="bi bi-info-circle"
                                          style={{color:'#6B7280',flexShrink:0,marginTop:2}}/>
                                      <small style={{color:'#6B7280',fontSize:'0.78rem',lineHeight:1.6}}>
                                          Votre profil sera vérifié manuellement par notre équipe
                                          sous <strong>24h</strong>. Vous serez notifié par email dès validation.
                                      </small>
                                  </div>
                              </div>
                          )}

                          {/* Submit */}
                          <button
                              type="submit"
                              disabled={loading}
                              style={{
                                  width:'100%',
                                  background: loading ? '#6EE7B7' : '#10B981',
                                  color:'white',border:'none',
                                  padding:'13px',borderRadius:10,
                                  fontWeight:700,fontSize:'0.95rem',
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  display:'flex',alignItems:'center',
                                  justifyContent:'center',gap:8,
                                  transition:'background 0.2s',
                              }}
                          >
                              {loading ? (
                                  <>
                                      <span className="spinner-border spinner-border-sm"/>
                                      Envoi en cours...
                                  </>
                              ) : (
                                  <>
                                      <i className={`bi ${role==='enseignant'?'bi-send-check':'bi-person-plus'}`}/>
                                      {role==='enseignant'
                                          ? 'Soumettre ma candidature'
                                          : 'Créer mon compte gratuitement'}
                                  </>
                              )}
                          </button>
                      </form>

                      {/* Divider */}
                      <div style={{
                          display:'flex',alignItems:'center',gap:12,
                          margin:'20px 0',
                      }}>
                          <div style={{flex:1,height:1,background:'#F1F5F9'}}/>
                          <span style={{color:'#94A3B8',fontSize:'0.78rem'}}>ou</span>
                          <div style={{flex:1,height:1,background:'#F1F5F9'}}/>
                      </div>

                      {/* Lien login */}
                      <p style={{textAlign:'center',fontSize:'0.85rem',color:'#6B7280',margin:0}}>
                          Déjà un compte ?{' '}
                          <Link to="/login" style={{
                              color:'#10B981',fontWeight:700,textDecoration:'none',
                          }}>
                              <i className="bi bi-box-arrow-in-right" style={{marginRight:4}}/>
                              Se connecter
                          </Link>
                      </p>
                  </div>

                  {/* Retour accueil */}
                  <p style={{textAlign:'center',marginTop:16,margin:0}}>
                      <Link to="/" style={{
                          color:'#94A3B8',fontSize:'0.8rem',
                          textDecoration:'none',
                          display:'inline-flex',alignItems:'center',gap:4,
                      }}>
                          <i className="bi bi-arrow-left"/>
                          Retour à l'accueil
                      </Link>
                  </p>
              </div>
          </div>
      )
  }

  // Styles réutilisables
  const L = {
      display:'block',
      fontSize:'0.82rem',
      fontWeight:600,
      color:'#374151',
      marginBottom:5,
  }

  const I = {
      width:'100%',
      border:'1.5px solid #E2E8F0',
      borderRadius:8,
      padding:'10px 12px',
      fontSize:'0.88rem',
      outline:'none',
      color:'#0F172A',
      background:'white',
      transition:'border 0.2s',
  }

  export default Register