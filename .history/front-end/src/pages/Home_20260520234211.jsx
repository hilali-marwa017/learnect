// src/pages/public/Home.jsx
import {useState,useEffect} from 'react'
import {useNavigate,Link} from 'react-router-dom'
import api from '../../api/axios'

function Home(){
    const navigate = useNavigate()
    const [search,setSearch]           = useState('')
    const [ville,setVille]             = useState('')
    const [matieres,setMatieres]       = useState([])
    const [enseignants,setEnseignants] = useState([])
    const [loading,setLoading]         = useState(true)
    const [favorites,setFavorites]     = useState([])

    // Charger matieres + enseignants au montage
    useEffect(()=>{
        async function load(){
            try{
                const [m,e] = await Promise.all([
                    api.get('/matieres'),
                    api.get('/enseignants'),
                ])
                setMatieres(m.data.slice(0,7))
                setEnseignants(e.data.slice(0,6))
            }catch(err){
                console.log(err)
            }finally{
                setLoading(false)
            }
        }
        load()
    },[])

    function handleSearch(e){
        e.preventDefault()
        navigate(`/teachers?search=${search}&ville=${ville}`)
    }

    function toggleFav(id){
        setFavorites(prev=>
            prev.includes(id)
                ?prev.filter(f=>f!==id)
                :[...prev,id]
        )
    }

    // Icons pour les matieres
    const icons = {
        'Anglais':'🇬🇧',
        'Mathématiques':'√x',
        'Français':'🇫🇷',
        'Arabe':'ع',
        'Physique-Chimie':'⚗️',
        'Informatique':'💻',
        'SVT':'🌿',
        'Histoire-Géo':'🌍',
        'Philosophie':'💭',
        'Musique':'🎵',
    }

    return(
        <div>

            {/* ══ HERO ══════════════════════════════════════ */}
            <section style={{
                background:'linear-gradient(160deg,#FFF8F0 0%,#FFF0E0 40%,#FFE8D6 100%)',
                minHeight:'88vh',
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center',
                padding:'4rem 1rem 3rem',
                position:'relative',
                overflow:'hidden',
            }}>
                {/* Blobs décoratifs */}
                <div style={{
                    position:'absolute',top:-120,left:-120,
                    width:400,height:400,
                    background:'radial-gradient(circle,rgba(255,77,0,0.1) 0%,transparent 70%)',
                    borderRadius:'50%',
                    pointerEvents:'none',
                }}/>
                <div style={{
                    position:'absolute',bottom:-80,right:-80,
                    width:350,height:350,
                    background:'radial-gradient(circle,rgba(37,99,235,0.07) 0%,transparent 70%)',
                    borderRadius:'50%',
                    pointerEvents:'none',
                }}/>

                {/* Badge */}
                <div style={{
                    display:'inline-flex',alignItems:'center',gap:6,
                    background:'white',
                    border:'1.5px solid #FFD6B8',
                    color:'#FF4D00',
                    padding:'6px 16px',
                    borderRadius:20,
                    fontSize:'0.8rem',
                    fontWeight:700,
                    marginBottom:'1.5rem',
                    boxShadow:'0 2px 8px rgba(255,77,0,0.1)',
                }}>
                    ✨ La plateforme n°1 de cours particuliers au Maroc
                </div>

                {/* Titre principal */}
                <h1 style={{
                    fontSize:'clamp(2.4rem,6vw,4rem)',
                    fontWeight:900,
                    color:'#0F1B2D',
                    textAlign:'center',
                    lineHeight:1.1,
                    letterSpacing:'-2px',
                    marginBottom:'1rem',
                }}>
                    Trouvez le<br/>
                    <span style={{color:'#FF4D00'}}>professeur parfait</span>
                </h1>

                <p style={{
                    color:'#6B7280',
                    fontSize:'1.05rem',
                    textAlign:'center',
                    maxWidth:480,
                    marginBottom:'2.5rem',
                    lineHeight:1.7,
                }}>
                    Des milliers de profs vérifiés près de chez vous.
                    Premier cours 100% offert, sans engagement.
                </p>

                {/* Search box */}
                <form onSubmit={handleSearch} style={{width:'100%',maxWidth:660}}>
                    <div style={{
                        background:'white',
                        borderRadius:18,
                        padding:'5px 5px 5px 18px',
                        display:'flex',
                        alignItems:'center',
                        gap:6,
                        boxShadow:'0 8px 40px rgba(0,0,0,0.1)',
                        border:'1.5px solid #F0E8DE',
                    }}>
                        <span style={{fontSize:'1.1rem',flexShrink:0}}>🔍</span>
                        <input
                            style={{
                                border:'none',outline:'none',
                                fontSize:'0.95rem',color:'#0F1B2D',
                                background:'transparent',flex:1,
                                padding:'8px 0',
                            }}
                            placeholder='Essayer "Maths", "Anglais"...'
                            value={search}
                            onChange={e=>setSearch(e.target.value)}
                        />
                        <div style={{width:1,height:28,background:'#F0E8DE',flexShrink:0}}/>
                        <select
                            style={{
                                border:'none',outline:'none',
                                fontSize:'0.9rem',color:'#6B7280',
                                background:'transparent',
                                padding:'8px 8px',
                                minWidth:130,
                                cursor:'pointer',
                            }}
                            value={ville}
                            onChange={e=>setVille(e.target.value)}
                        >
                            <option value="">📍 Toutes les villes</option>
                            {['Casablanca','Rabat','Fès','Marrakech','Tanger','Agadir','Meknès','Oujda'].map(v=>(
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            style={{
                                background:'linear-gradient(135deg,#FF4D00,#FF7A00)',
                                color:'white',border:'none',
                                padding:'11px 26px',
                                borderRadius:13,
                                fontWeight:700,
                                fontSize:'0.9rem',
                                cursor:'pointer',
                                whiteSpace:'nowrap',
                                boxShadow:'0 4px 14px rgba(255,77,0,0.3)',
                                flexShrink:0,
                            }}
                        >
                            Rechercher
                        </button>
                    </div>
                </form>

                {/* Matières bar */}
                <div style={{
                    background:'white',
                    borderRadius:16,
                    padding:'14px 22px',
                    display:'flex',
                    alignItems:'center',
                    gap:28,
                    boxShadow:'0 4px 20px rgba(0,0,0,0.05)',
                    width:'100%',
                    maxWidth:660,
                    marginTop:'1.2rem',
                    overflowX:'auto',
                    border:'1.5px solid #F0E8DE',
                }}>
                    {matieres.map(m=>(
                        <div
                            key={m.id_matiere}
                            onClick={()=>navigate(`/teachers?search=${m.nom}`)}
                            style={{
                                display:'flex',
                                flexDirection:'column',
                                alignItems:'center',
                                gap:5,
                                cursor:'pointer',
                                flexShrink:0,
                                transition:'transform 0.2s',
                            }}
                        >
                            <div style={{
                                width:42,height:42,
                                background:'#FFF8F0',
                                borderRadius:10,
                                display:'flex',
                                alignItems:'center',
                                justifyContent:'center',
                                fontSize:'1.1rem',
                                border:'1.5px solid #F0E8DE',
                                fontWeight:700,
                                color:'#0F1B2D',
                            }}>
                                {icons[m.nom] || '📚'}
                            </div>
                            <span style={{fontSize:'0.72rem',fontWeight:600,color:'#374151',whiteSpace:'nowrap'}}>
                                {m.nom.length > 8 ? m.nom.slice(0,8)+'...' : m.nom}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div style={{
                    display:'flex',gap:'2.5rem',
                    marginTop:'2.5rem',
                    flexWrap:'wrap',
                    justifyContent:'center',
                }}>
                    {[
                        {num:'500+',label:'Profs vérifiés'},
                        {num:'2 000+',label:'Cours donnés'},
                        {num:'4.9★',label:'Note moyenne'},
                        {num:'10+',label:'Villes couvertes'},
                    ].map(s=>(
                        <div key={s.label} style={{textAlign:'center'}}>
                            <div style={{fontSize:'1.4rem',fontWeight:900,color:'#0F1B2D'}}>
                                {s.num}
                            </div>
                            <div style={{fontSize:'0.78rem',color:'#6B7280',marginTop:2}}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ PROFS EN VEDETTE ════════════════════════════ */}
            <section style={{padding:'5rem 0',background:'white'}}>
                <div className="container">
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <div>
                            <h2 style={{fontSize:'1.8rem',fontWeight:800,color:'#0F1B2D',letterSpacing:'-0.5px',marginBottom:4}}>
                                Nos meilleurs professeurs ⭐
                            </h2>
                            <p style={{color:'#6B7280',margin:0,fontSize:'0.95rem'}}>
                                Évalués et vérifiés par notre équipe
                            </p>
                        </div>
                        <Link to="/teachers" style={{
                            color:'#FF4D00',fontWeight:700,
                            textDecoration:'none',fontSize:'0.9rem',
                        }}>
                            Voir tous →
                        </Link>
                    </div>

                    {loading ?(
                        <div className="text-center py-5">
                            <div style={{
                                width:38,height:38,
                                border:'4px solid #FFE8D6',
                                borderTopColor:'#FF4D00',
                                borderRadius:'50%',
                                animation:'spin 0.8s linear infinite',
                                margin:'0 auto',
                            }}/>
                        </div>
                    ):enseignants.length===0?(
                        <div style={{textAlign:'center',padding:'4rem',color:'#6B7280'}}>
                            <div style={{fontSize:'3rem',marginBottom:'1rem'}}>👨‍🏫</div>
                            <p style={{marginBottom:'1rem'}}>Aucun professeur disponible pour le moment</p>
                            <Link to="/register?role=enseignant" style={{
                                background:'#FF4D00',color:'white',
                                padding:'10px 24px',borderRadius:10,
                                textDecoration:'none',fontWeight:700,fontSize:'0.9rem',
                            }}>
                                Devenir le premier prof →
                            </Link>
                        </div>
                    ):(
                        <div className="row g-4">
                            {enseignants.map(prof=>(
                                <div key={prof.utilisateur_id} className="col-lg-4 col-md-6">
                                    <TeacherCard
                                        prof={prof}
                                        isFav={favorites.includes(prof.utilisateur_id)}
                                        onToggleFav={()=>toggleFav(prof.utilisateur_id)}
                                        onClick={()=>navigate(`/teachers/${prof.utilisateur_id}`)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ══ COMMENT ÇA MARCHE ════════════════════════ */}
            <section style={{padding:'5rem 0',background:'#FFF8F0'}}>
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 style={{fontSize:'1.8rem',fontWeight:800,color:'#0F1B2D',letterSpacing:'-0.5px',marginBottom:6}}>
                            Comment ça marche ? 🎯
                        </h2>
                        <p style={{color:'#6B7280',fontSize:'0.95rem'}}>
                            Trouvez un prof en 3 étapes simples
                        </p>
                    </div>

                    <div className="row g-4">
                        {[
                            {num:'1',icon:'🔍',title:'Recherchez',desc:'Entrez votre matière et votre ville. Filtrez par tarif, note et type de cours.'},
                            {num:'2',icon:'📅',title:'Réservez',desc:'Choisissez un créneau disponible et confirmez votre réservation en quelques clics.'},
                            {num:'3',icon:'🎓',title:'Apprenez',desc:'Premier cours offert ! Payez uniquement si vous êtes satisfait du prof.'},
                        ].map(step=>(
                            <div key={step.num} className="col-md-4">
                                <div style={{
                                    background:'white',
                                    borderRadius:16,
                                    padding:'2rem 1.5rem',
                                    textAlign:'center',
                                    border:'1.5px solid #F0E8DE',
                                    height:'100%',
                                }}>
                                    <div style={{
                                        width:48,height:48,
                                        background:'linear-gradient(135deg,#FF4D00,#FF7A00)',
                                        color:'white',borderRadius:'50%',
                                        display:'flex',alignItems:'center',justifyContent:'center',
                                        fontWeight:900,fontSize:'1.2rem',
                                        margin:'0 auto 1rem',
                                    }}>
                                        {step.num}
                                    </div>
                                    <div style={{fontSize:'2rem',marginBottom:'0.8rem'}}>{step.icon}</div>
                                    <div style={{fontWeight:700,color:'#0F1B2D',marginBottom:'0.5rem'}}>{step.title}</div>
                                    <div style={{color:'#6B7280',fontSize:'0.9rem',lineHeight:1.6}}>{step.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mode demande */}
                    <div style={{
                        background:'white',
                        borderRadius:20,
                        padding:'2.5rem',
                        marginTop:'3rem',
                        border:'1.5px solid #F0E8DE',
                        display:'flex',
                        alignItems:'center',
                        gap:'2rem',
                        flexWrap:'wrap',
                    }}>
                        <div style={{fontSize:'2.5rem'}}>📢</div>
                        <div style={{flex:1,minWidth:200}}>
                            <h3 style={{fontWeight:800,color:'#0F1B2D',marginBottom:'0.4rem',fontSize:'1.1rem'}}>
                                Mode demande inversée
                            </h3>
                            <p style={{color:'#6B7280',margin:0,lineHeight:1.7,fontSize:'0.9rem'}}>
                                Publiez votre demande avec votre budget et recevez des offres
                                directement des profs disponibles. Comparez et choisissez !
                            </p>
                        </div>
                        <Link to="/register?role=etudiant" style={{
                            background:'#0F1B2D',color:'white',
                            padding:'11px 22px',borderRadius:12,
                            fontWeight:700,textDecoration:'none',
                            whiteSpace:'nowrap',fontSize:'0.9rem',
                        }}>
                            Publier ma demande →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══ AVANTAGES ════════════════════════════════ */}
            <section style={{padding:'5rem 0',background:'white'}}>
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 style={{fontSize:'1.8rem',fontWeight:800,color:'#0F1B2D',letterSpacing:'-0.5px'}}>
                            Pourquoi Learnect ? 💡
                        </h2>
                    </div>
                    <div className="row g-4">
                        {[
                            {icon:'✅',title:'Profs vérifiés',desc:'CIN + diplôme vérifiés manuellement par notre équipe.'},
                            {icon:'🎁',title:'Premier cours offert',desc:'30 minutes gratuites pour voir si le courant passe.'},
                            {icon:'💬',title:'Messagerie intégrée',desc:'Communiquez directement après confirmation.'},
                            {icon:'🔒',title:'Paiement sécurisé',desc:'Contact révélé uniquement après confirmation.'},
                            {icon:'⭐',title:'Avis authentiques',desc:'Seuls les vrais étudiants peuvent noter.'},
                            {icon:'📍',title:'Partout au Maroc',desc:'Présentiel ou webcam, dans 10+ villes.'},
                        ].map(av=>(
                            <div key={av.title} className="col-md-4 col-sm-6">
                                <div style={{
                                    padding:'1.5rem',
                                    borderRadius:14,
                                    border:'1.5px solid #F0E8DE',
                                    height:'100%',background:'white',
                                }}>
                                    <div style={{fontSize:'1.8rem',marginBottom:'0.7rem'}}>{av.icon}</div>
                                    <div style={{fontWeight:700,color:'#0F1B2D',marginBottom:'0.3rem',fontSize:'0.95rem'}}>
                                        {av.title}
                                    </div>
                                    <div style={{color:'#6B7280',fontSize:'0.85rem',lineHeight:1.6}}>{av.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ TEMOIGNAGES ══════════════════════════════ */}
            <section style={{padding:'5rem 0',background:'#FFF8F0'}}>
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 style={{fontSize:'1.8rem',fontWeight:800,color:'#0F1B2D',letterSpacing:'-0.5px'}}>
                            Ce que disent nos étudiants 💬
                        </h2>
                    </div>
                    <div className="row g-4">
                        {[
                            {name:'Fatima Z.',ville:'Fès',note:5,matiere:'Mathématiques',
                             text:'"Super prof de maths trouvé en 5 minutes. 16 au bac !"'},
                            {name:'Yassine B.',ville:'Casablanca',note:5,matiere:'Anglais',
                             text:'"3 offres reçues en 2 heures après ma demande. Excellent !"'},
                            {name:'Sara K.',ville:'Rabat',note:5,matiere:'Français',
                             text:'"Cours en webcam depuis chez moi. Simple et efficace !"'},
                        ].map(t=>(
                            <div key={t.name} className="col-md-4">
                                <div style={{
                                    background:'white',borderRadius:16,
                                    padding:'1.8rem',
                                    border:'1.5px solid #F0E8DE',height:'100%',
                                }}>
                                    <div style={{color:'#F59E0B',fontSize:'1rem',marginBottom:'0.8rem'}}>
                                        {'★'.repeat(t.note)}
                                    </div>
                                    <p style={{
                                        color:'#374151',fontSize:'0.95rem',
                                        lineHeight:1.7,marginBottom:'1.2rem',
                                        fontStyle:'italic',
                                    }}>
                                        {t.text}
                                    </p>
                                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                        <div>
                                            <div style={{fontWeight:700,color:'#0F1B2D',fontSize:'0.9rem'}}>{t.name}</div>
                                            <div style={{color:'#6B7280',fontSize:'0.8rem'}}>{t.ville}</div>
                                        </div>
                                        <span style={{
                                            background:'#FFF8F0',color:'#FF4D00',
                                            padding:'3px 10px',borderRadius:20,
                                            fontSize:'0.75rem',fontWeight:600,
                                            border:'1px solid #FFD6B8',
                                        }}>
                                            {t.matiere}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ CTA FINAL ════════════════════════════════ */}
            <section style={{
                background:'linear-gradient(135deg,#0F1B2D 0%,#1E3A5F 100%)',
                padding:'5rem 0',
                position:'relative',
                overflow:'hidden',
            }}>
                <div style={{
                    position:'absolute',top:-100,right:-100,
                    width:400,height:400,
                    background:'radial-gradient(circle,rgba(255,77,0,0.12) 0%,transparent 70%)',
                    borderRadius:'50%',
                    pointerEvents:'none',
                }}/>
                <div className="container text-center position-relative">
                    <h2 style={{
                        fontSize:'2rem',fontWeight:900,
                        color:'white',letterSpacing:'-0.5px',marginBottom:'0.8rem',
                    }}>
                        Prêt à commencer ? 🚀
                    </h2>
                    <p style={{color:'rgba(255,255,255,0.7)',fontSize:'1rem',marginBottom:'2rem'}}>
                        Rejoignez des milliers d'étudiants qui ont trouvé leur prof idéal
                    </p>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                        <Link to="/register?role=etudiant" style={{
                            background:'linear-gradient(135deg,#FF4D00,#FF7A00)',
                            color:'white',padding:'13px 30px',
                            borderRadius:12,fontWeight:700,
                            textDecoration:'none',fontSize:'0.95rem',
                            boxShadow:'0 4px 20px rgba(255,77,0,0.4)',
                        }}>
                            Trouver un prof maintenant
                        </Link>
                        <Link to="/register?role=enseignant" style={{
                            background:'transparent',color:'white',
                            border:'2px solid rgba(255,255,255,0.35)',
                            padding:'11px 30px',borderRadius:12,
                            fontWeight:700,textDecoration:'none',fontSize:'0.95rem',
                        }}>
                            Devenir enseignant
                        </Link>
                    </div>
                    <div style={{
                        display:'inline-flex',alignItems:'center',gap:8,
                        marginTop:'2rem',
                        background:'rgba(255,255,255,0.08)',
                        padding:'8px 20px',borderRadius:20,
                        color:'rgba(255,255,255,0.7)',fontSize:'0.83rem',
                    }}>
                        🎁 Premier cours 100% gratuit — Sans carte bancaire
                    </div>
                </div>
            </section>

            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    )
}

// ── Teacher Card — Composant séparé ──────────────────────────────────────────
function TeacherCard({prof,isFav,onToggleFav,onClick}){
    return(
        <div
            onClick={onClick}
            style={{
                borderRadius:20,
                overflow:'hidden',
                position:'relative',
                cursor:'pointer',
                height:320,
                transition:'all 0.3s',
                boxShadow:'0 4px 16px rgba(0,0,0,0.08)',
            }}
        >
            {/* Photo */}
            {prof.user?.photo?(
                <img
                    src={`http://localhost:8000/storage/${prof.user.photo}`}
                    alt={prof.user?.prenom}
                    style={{width:'100%',height:'100%',objectFit:'cover'}}
                />
            ):(
                <div style={{
                    width:'100%',height:'100%',
                    background:'linear-gradient(135deg,#FFE8D6,#FFD6B8)',
                    display:'flex',alignItems:'center',
                    justifyContent:'center',fontSize:'4rem',
                }}>
                    👨‍🏫
                </div>
            )}

            {/* Badge vérifié */}
            {prof.estVerifie&&(
                <div style={{
                    position:'absolute',top:12,left:12,
                    background:'rgba(16,185,129,0.9)',
                    color:'white',fontSize:'0.7rem',fontWeight:700,
                    padding:'3px 10px',borderRadius:20,
                    backdropFilter:'blur(4px)',
                }}>
                    ✓ Vérifié
                </div>
            )}

            {/* Cœur favoris */}
            <button
                onClick={e=>{e.stopPropagation();onToggleFav()}}
                style={{
                    position:'absolute',top:12,right:12,
                    background:'rgba(255,255,255,0.9)',
                    border:'none',width:36,height:36,
                    borderRadius:'50%',cursor:'pointer',
                    display:'flex',alignItems:'center',
                    justifyContent:'center',fontSize:'1rem',
                    backdropFilter:'blur(4px)',
                    transition:'transform 0.2s',
                }}
            >
                {isFav?'❤️':'🤍'}
            </button>

            {/* Overlay info */}
            <div style={{
                position:'absolute',bottom:0,left:0,right:0,
                background:'linear-gradient(to top,rgba(15,27,45,0.95) 0%,rgba(15,27,45,0.3) 60%,transparent 100%)',
                padding:'1.5rem',
            }}>
                <div style={{color:'white',fontWeight:800,fontSize:'1rem',marginBottom:2}}>
                    {prof.user?.prenom} {prof.user?.nom}
                </div>
                <div style={{color:'rgba(255,255,255,0.75)',fontSize:'0.78rem',marginBottom:'0.8rem'}}>
                    {prof.user?.ville}
                    {prof.cours_enligne&&' (face à face & webcam)'}
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                        <span style={{color:'#F59E0B',fontSize:'0.85rem'}}>
                            {'★'.repeat(Math.round(prof.noteMoyenne||5))}
                        </span>
                        <span style={{color:'rgba(255,255,255,0.6)',fontSize:'0.78rem',marginLeft:4}}>
                            {prof.noteMoyenne>0?prof.noteMoyenne:'5'}/5
                        </span>
                    </div>
                    <div style={{
                        background:'white',color:'#FF4D00',
                        fontWeight:800,fontSize:'0.82rem',
                        padding:'4px 10px',borderRadius:20,
                    }}>
                        {prof.tarifHeure} DH/h
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home