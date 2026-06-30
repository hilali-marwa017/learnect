// src/pages/public/Home.jsx
import {useState,useEffect} from 'react'
import {useNavigate,Link} from 'react-router-dom'
import api from '../../api/axios'

// ── Composants séparés ────────────────────────────────────────────────────────

function HeroBadge({text}){
    return(
        <div style={{
            display:'inline-flex',alignItems:'center',gap:6,
            border:'1px solid #E2E8F0',
            background:'white',
            color:'#374151',
            padding:'5px 14px',
            borderRadius:20,
            fontSize:'0.78rem',
            fontWeight:500,
            marginBottom:'1.5rem',
        }}>
            <span style={{
                width:8,height:8,borderRadius:'50%',
                background:'#10B981',display:'inline-block',
            }}/>
            {text}
        </div>
    )
}

function SearchBox({search,setSearch,ville,setVille,onSubmit}){
    return(
        <form onSubmit={onSubmit} style={{width:'100%',maxWidth:640}}>
            <div style={{
                background:'white',
                borderRadius:16,
                border:'1px solid #E2E8F0',
                display:'flex',
                alignItems:'center',
                padding:'5px 5px 5px 16px',
                boxShadow:'0 4px 24px rgba(0,0,0,0.06)',
            }}>
                <div style={{display:'flex',alignItems:'center',gap:8,flex:1}}>
                    <span style={{color:'#94A3B8',fontSize:'0.9rem'}}>📚</span>
                    <input
                        style={{
                            border:'none',outline:'none',
                            fontSize:'0.88rem',color:'#0F172A',
                            background:'transparent',flex:1,
                            padding:'8px 0',
                        }}
                        placeholder="Quelle matière ? (ex: Mathématiques)"
                        value={search}
                        onChange={e=>setSearch(e.target.value)}
                    />
                </div>
                <div style={{width:1,height:28,background:'#E2E8F0',margin:'0 8px'}}/>
                <div style={{display:'flex',alignItems:'center',gap:8,flex:1}}>
                    <span style={{color:'#94A3B8',fontSize:'0.9rem'}}>📍</span>
                    <select
                        style={{
                            border:'none',outline:'none',
                            fontSize:'0.88rem',color:'#6B7280',
                            background:'transparent',flex:1,
                            padding:'8px 4px',cursor:'pointer',
                        }}
                        value={ville}
                        onChange={e=>setVille(e.target.value)}
                    >
                        <option value="">Adresse ou ville</option>
                        {['Casablanca','Rabat','Fès','Marrakech','Tanger','Agadir','Meknès','Oujda'].map(v=>(
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" style={{
                    background:'#10B981',
                    color:'white',border:'none',
                    padding:'11px 24px',
                    borderRadius:12,
                    fontWeight:600,
                    fontSize:'0.88rem',
                    cursor:'pointer',
                    whiteSpace:'nowrap',
                    flexShrink:0,
                }}>
                    Rechercher
                </button>
            </div>
        </form>
    )
}

function MatiereTag({label,icon,onClick}){
    return(
        <button
            onClick={onClick}
            style={{
                display:'flex',alignItems:'center',gap:6,
                background:'white',
                border:'1px solid #E2E8F0',
                borderRadius:20,
                padding:'6px 14px',
                fontSize:'0.82rem',
                fontWeight:500,
                color:'#374151',
                cursor:'pointer',
                whiteSpace:'nowrap',
                transition:'all 0.2s',
            }}
        >
            <span>{icon}</span>
            {label}
        </button>
    )
}

function TeacherCard({prof,onClick}){
    const [fav,setFav] = useState(false)
    return(
        <div style={{
            background:'white',
            borderRadius:16,
            border:'1px solid #E2E8F0',
            padding:'1.2rem',
            transition:'all 0.2s',
            cursor:'pointer',
        }}
        onClick={onClick}
        >
            {/* Header */}
            <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:'0.8rem'}}>
                <div style={{position:'relative',flexShrink:0}}>
                    {prof.user?.photo?(
                        <img
                            src={`http://localhost:8000/storage/${prof.user.photo}`}
                            alt={prof.user?.prenom}
                            style={{width:52,height:52,borderRadius:'50%',objectFit:'cover'}}
                        />
                    ):(
                        <div style={{
                            width:52,height:52,borderRadius:'50%',
                            background:'linear-gradient(135deg,#D1FAE5,#A7F3D0)',
                            display:'flex',alignItems:'center',
                            justifyContent:'center',fontSize:'1.4rem',
                        }}>
                            👨‍🏫
                        </div>
                    )}
                    {prof.estVerifie&&(
                        <div style={{
                            position:'absolute',bottom:-2,right:-2,
                            background:'#10B981',color:'white',
                            width:16,height:16,borderRadius:'50%',
                            display:'flex',alignItems:'center',
                            justifyContent:'center',fontSize:'0.6rem',
                        }}>
                            ✓
                        </div>
                    )}
                </div>
                <div style={{flex:1}}>
                    <div style={{fontWeight:700,color:'#0F172A',fontSize:'0.95rem'}}>
                        {prof.user?.prenom} {prof.user?.nom}
                    </div>
                    <div style={{
                        display:'flex',alignItems:'center',gap:4,
                        color:'#6B7280',fontSize:'0.78rem',marginTop:2,
                    }}>
                        📍 {prof.user?.ville}
                    </div>
                    <div style={{
                        color:'#F59E0B',fontSize:'0.8rem',
                        fontWeight:700,marginTop:3,
                    }}>
                        ★ {prof.noteMoyenne>0?prof.noteMoyenne:'5.0'}
                    </div>
                </div>
                <div style={{
                    fontWeight:800,color:'#0F172A',
                    fontSize:'0.95rem',textAlign:'right',
                }}>
                    {prof.tarifHeure}<br/>
                    <span style={{fontSize:'0.72rem',fontWeight:500,color:'#6B7280'}}>DH/h</span>
                </div>
            </div>

            {/* Diplôme badge */}
            {prof.diplome&&(
                <div style={{
                    display:'flex',alignItems:'center',gap:6,
                    background:'#F0FDF4',
                    border:'1px solid #D1FAE5',
                    borderRadius:6,
                    padding:'5px 10px',
                    marginBottom:'0.7rem',
                }}>
                    <span style={{color:'#10B981',fontSize:'0.7rem',fontWeight:700}}>
                        🎓 DIPLÔME ACADÉMIQUE
                    </span>
                </div>
            )}

            {/* Description */}
            <p style={{
                color:'#6B7280',fontSize:'0.82rem',
                lineHeight:1.6,marginBottom:'1rem',
                overflow:'hidden',
                display:'-webkit-box',
                WebkitLineClamp:3,
                WebkitBoxOrient:'vertical',
            }}>
                {prof.description_profil || 'Enseignant expérimenté et passionné par la transmission des savoirs.'}
            </p>

            {/* Actions */}
            <div style={{display:'flex',gap:8}}>
                <button
                    onClick={e=>{e.stopPropagation();}}
                    style={{
                        flex:1,
                        background:'#F0FDF4',
                        color:'#10B981',
                        border:'1px solid #D1FAE5',
                        borderRadius:8,padding:'8px',
                        fontSize:'0.78rem',fontWeight:700,
                        cursor:'pointer',
                    }}
                >
                    🎁 1ER COURS OFFERT
                </button>
                <button
                    onClick={e=>{e.stopPropagation();onClick()}}
                    style={{
                        flex:1,
                        background:'white',
                        color:'#374151',
                        border:'1px solid #E2E8F0',
                        borderRadius:8,padding:'8px',
                        fontSize:'0.78rem',fontWeight:600,
                        cursor:'pointer',
                    }}
                >
                    Contacter →
                </button>
            </div>
        </div>
    )
}

function FeatureCard({icon,title,desc,highlight}){
    return(
        <div style={{
            background: highlight ? '#10B981' : 'white',
            borderRadius:16,
            padding:'1.8rem',
            border: highlight ? 'none' : '1px solid #E2E8F0',
            height:'100%',
        }}>
            <div style={{
                fontSize:'1.4rem',marginBottom:'0.8rem',
            }}>
                {icon}
            </div>
            <h3 style={{
                fontFamily:"'Space Grotesk',sans-serif",
                fontWeight:700,
                fontSize:'1rem',
                color: highlight ? 'white' : '#0F172A',
                marginBottom:'0.5rem',
            }}>
                {title}
            </h3>
            <p style={{
                fontSize:'0.85rem',
                color: highlight ? 'rgba(255,255,255,0.8)' : '#6B7280',
                lineHeight:1.7,
                margin:0,
            }}>
                {desc}
            </p>
            {highlight&&(
                <div style={{
                    marginTop:'1.5rem',
                    display:'flex',alignItems:'center',gap:6,
                    background:'rgba(255,255,255,0.15)',
                    padding:'8px 12px',borderRadius:8,
                    color:'white',fontSize:'0.78rem',fontWeight:600,
                }}>
                    💰 Rétribution directe garantie à 90%
                </div>
            )}
        </div>
    )
}

function FaqItem({question,answer}){
    const [open,setOpen] = useState(false)
    return(
        <div style={{
            background:'white',
            borderRadius:12,
            border:'1px solid #E2E8F0',
            marginBottom:'0.8rem',
            overflow:'hidden',
        }}>
            <button
                onClick={()=>setOpen(!open)}
                style={{
                    width:'100%',
                    display:'flex',
                    justifyContent:'space-between',
                    alignItems:'center',
                    padding:'1.1rem 1.3rem',
                    background:'none',border:'none',
                    cursor:'pointer',textAlign:'left',
                }}
            >
                <span style={{fontWeight:600,color:'#0F172A',fontSize:'0.92rem'}}>
                    {question}
                </span>
                <span style={{
                    color:'#10B981',fontSize:'0.8rem',
                    fontWeight:700,flexShrink:0,marginLeft:12,
                }}>
                    {open ? '▲' : '▼'}
                </span>
            </button>
            {open&&(
                <div style={{
                    padding:'0 1.3rem 1.1rem',
                    color:'#6B7280',fontSize:'0.87rem',
                    lineHeight:1.7,
                    borderTop:'1px solid #F1F5F9',
                    paddingTop:'0.8rem',
                    marginTop:0,
                }}>
                    {answer}
                </div>
            )}
        </div>
    )
}

// ── Page principale ────────────────────────────────────────────────────────────

function Home(){
    const navigate             = useNavigate()
    const [search,setSearch]   = useState('')
    const [ville,setVille]     = useState('')
    const [matieres,setMatieres]       = useState([])
    const [enseignants,setEnseignants] = useState([])
    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        async function load(){
            try{
                const [m,e] = await Promise.all([
                    api.get('/matieres'),
                    api.get('/enseignants'),
                ])
                setMatieres(m.data.slice(0,6))
                setEnseignants(e.data.slice(0,3))
            }catch(err){console.log(err)}
            finally{setLoading(false)}
        }
        load()
    },[])

    function handleSearch(e){
        e.preventDefault()
        navigate(`/teachers?search=${search}&ville=${ville}`)
    }

    const MATIERE_ICONS = {
        'Soutien scolaire':'📚',
        'Mathématiques':'√x',
        'Coaching Sportif':'🏃',
        'Langues':'🌍',
        'Musique':'🎵',
        'Arts & Dessin':'🎨',
        'Informatique':'💻',
        'Anglais':'🇬🇧',
        'Français':'🇫🇷',
        'Arabe':'ع',
    }

    const FAQS = [
        {
            question:'Comment fonctionne la commission de 10% sur Learnect ?',
            answer:"Contrairement aux plateformes traditionnelles qui prélèvent des marges opaques de 30%, Learnect applique une commission fixe de 10%. Si un cours est tarifé à 100 DH, l'enseignant reçoit exactement 90 DH nets.",
        },
        {
            question:'Les diplômes et justificatifs des enseignants sont-ils réellement authentiques ?',
            answer:"Oui. Chaque enseignant soumet son CIN recto/verso et son diplôme en PDF. Notre équipe vérifie manuellement chaque dossier avant activation du profil.",
        },
        {
            question:'Qu\'est-ce que l\'offre promotionnelle "Premier cours offert" ?',
            answer:"Aucun risque : le premier cours de 30 minutes est proposé à 0 DH lors de la réservation initiale, facilitant la prise de contact sans aucun frais.",
        },
        {
            question:'Puis-je simuler l\'ensemble des interactions du soutien scolaire ?',
            answer:"Oui ! Vous pouvez basculer entre la perspective d'un Étudiant, d'un Enseignant et d'un Admin pour tester toutes les fonctionnalités.",
        },
    ]

    return(
        <div style={{background:'#F8FAFC'}}>

            {/* ══ HERO ══════════════════════════════════════ */}
            <section style={{
                background:'linear-gradient(180deg,#F0FDF4 0%,#F8FAFC 100%)',
                padding:'5rem 0 4rem',
                textAlign:'center',
            }}>
                <div className="container">

                    <HeroBadge text="Soutien Scolaire Particulier au Maroc • 100% Direct & Transparent"/>

                    <h1 style={{
                        fontFamily:"'Space Grotesk',sans-serif",
                        fontSize:'clamp(2.2rem,5vw,3.5rem)',
                        fontWeight:800,
                        color:'#0F172A',
                        lineHeight:1.15,
                        letterSpacing:'-1px',
                        marginBottom:'0.6rem',
                    }}>
                        Le cours particulier qui<br/>vous ressemble.
                    </h1>

                    <h2 style={{
                        fontFamily:"'Space Grotesk',sans-serif",
                        fontSize:'clamp(1.8rem,4vw,2.8rem)',
                        fontWeight:800,
                        color:'#10B981',
                        marginBottom:'1.2rem',
                    }}>
                        Trouvez le prof idéal.
                    </h2>

                    <p style={{
                        color:'#6B7280',
                        fontSize:'0.95rem',
                        maxWidth:480,
                        margin:'0 auto 2.5rem',
                        lineHeight:1.7,
                    }}>
                        Rejoignez Learnect : Des cours d'accompagnement d'exception certifiés,
                        sans frais de dossier. <strong>10% de commission unique</strong> pour le professeur,
                        1er cours offert pour l'élève.
                    </p>

                    {/* Search */}
                    <div style={{
                        display:'flex',justifyContent:'center',
                        marginBottom:'1.5rem',
                    }}>
                        <SearchBox
                            search={search}
                            setSearch={setSearch}
                            ville={ville}
                            setVille={setVille}
                            onSubmit={handleSearch}
                        />
                    </div>

                    {/* Matières rapides */}
                    <div style={{
                        display:'flex',
                        alignItems:'center',
                        gap:8,
                        justifyContent:'center',
                        flexWrap:'wrap',
                    }}>
                        <span style={{color:'#94A3B8',fontSize:'0.78rem',fontWeight:500}}>
                            RACCOURCIS :
                        </span>
                        {matieres.map(m=>(
                            <MatiereTag
                                key={m.id_matiere}
                                label={m.nom}
                                icon={MATIERE_ICONS[m.nom]||'📚'}
                                onClick={()=>navigate(`/teachers?search=${m.nom}`)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ POURQUOI LEARNECT ═══════════════════════════ */}
            <section style={{padding:'5rem 0',background:'white'}}>
                <div className="container">
                    <div className="text-center mb-5">
                        <div style={{
                            color:'#10B981',fontSize:'0.75rem',
                            fontWeight:700,letterSpacing:2,
                            textTransform:'uppercase',marginBottom:'0.5rem',
                        }}>
                            MODÈLE ÉTHIQUE & TRANSPARENT
                        </div>
                        <h2 style={{
                            fontFamily:"'Space Grotesk',sans-serif",
                            fontSize:'1.8rem',fontWeight:800,
                            color:'#0F172A',letterSpacing:'-0.5px',
                        }}>
                            Qu'est-ce qui rend Learnect différent ?
                        </h2>
                        <p style={{color:'#6B7280',fontSize:'0.9rem',marginTop:'0.5rem'}}>
                            Une charte basée sur la transparence des prix et l'excellence académique des tuteurs au Maroc.
                        </p>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-5">
                            <FeatureCard
                                highlight={true}
                                icon="💰"
                                title="Pas de frais cachés ou de prélèvements opaques de 30%"
                                desc="La sécurité est notre priorité. L'administrateur vérifie rigoureusement chaque diplôme supérieur, agrégation et pièces d'identité des professeurs avant mise en ligne."
                            />
                        </div>
                        <div className="col-md-7">
                            <div className="row g-3 h-100">
                                <div className="col-6">
                                    <FeatureCard
                                        icon="🎓"
                                        title="Diplômes validés à la main"
                                        desc="La sécurité est notre priorité. L'administrateur vérifie rigoureusement chaque diplôme supérieur, agrégation et pièces d'identité."
                                    />
                                </div>
                                <div className="col-6">
                                    <FeatureCard
                                        icon="🎁"
                                        title="1er cours offert pour l'orienter"
                                        desc="Aucun risque : le premier niveau d'essai avec l'enseignant de votre choix est proposé à 0 DH lors de la réservation initiale."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ PROFS EN VEDETTE ════════════════════════════ */}
            <section style={{padding:'5rem 0',background:'#F8FAFC'}}>
                <div className="container">
                    <div style={{
                        display:'flex',
                        justifyContent:'space-between',
                        alignItems:'flex-end',
                        marginBottom:'2rem',
                        flexWrap:'wrap',
                        gap:8,
                    }}>
                        <div>
                            <div style={{
                                color:'#10B981',fontSize:'0.75rem',
                                fontWeight:700,letterSpacing:2,
                                textTransform:'uppercase',marginBottom:'0.3rem',
                            }}>
                                À L'AFFICHE CE MOIS-CI
                            </div>
                            <h2 style={{
                                fontFamily:"'Space Grotesk',sans-serif",
                                fontSize:'1.6rem',fontWeight:800,
                                color:'#0F172A',margin:0,
                            }}>
                                Rencontrez nos super-enseignants
                            </h2>
                            <p style={{color:'#6B7280',fontSize:'0.85rem',marginTop:4,marginBottom:0}}>
                                Enseignants chevronnés, agrégés ou issus de grandes écoles d'Ingénieurs
                            </p>
                        </div>
                        <Link to="/teachers" style={{
                            color:'#10B981',fontWeight:700,
                            textDecoration:'none',fontSize:'0.88rem',
                            display:'flex',alignItems:'center',gap:4,
                        }}>
                            Parcourir tout l'annuaire scolaire →
                        </Link>
                    </div>

                    {loading?(
                        <div className="text-center py-5">
                            <div style={{
                                width:36,height:36,
                                border:'3px solid #D1FAE5',
                                borderTopColor:'#10B981',
                                borderRadius:'50%',
                                animation:'spin 0.8s linear infinite',
                                margin:'0 auto',
                            }}/>
                        </div>
                    ):enseignants.length===0?(
                        <div style={{textAlign:'center',padding:'3rem',color:'#6B7280'}}>
                            <div style={{fontSize:'2.5rem',marginBottom:'0.8rem'}}>👨‍🏫</div>
                            <p style={{marginBottom:'1rem',fontSize:'0.9rem'}}>
                                Aucun enseignant disponible pour le moment
                            </p>
                            <Link to="/register?role=enseignant" style={{
                                background:'#10B981',color:'white',
                                padding:'9px 20px',borderRadius:8,
                                textDecoration:'none',fontWeight:600,
                                fontSize:'0.88rem',
                            }}>
                                Devenir le premier enseignant →
                            </Link>
                        </div>
                    ):(
                        <div className="row g-4">
                            {enseignants.map(prof=>(
                                <div key={prof.utilisateur_id} className="col-md-4">
                                    <TeacherCard
                                        prof={prof}
                                        onClick={()=>navigate(`/teachers/${prof.utilisateur_id}`)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ══ FAQ ═════════════════════════════════════════ */}
            <section style={{padding:'5rem 0',background:'white'}}>
                <div className="container" style={{maxWidth:720}}>
                    <div className="text-center mb-5">
                        <div style={{
                            color:'#10B981',fontSize:'0.75rem',
                            fontWeight:700,letterSpacing:2,
                            textTransform:'uppercase',marginBottom:'0.5rem',
                        }}>
                            UNE QUESTION ?
                        </div>
                        <h2 style={{
                            fontFamily:"'Space Grotesk',sans-serif",
                            fontSize:'1.8rem',fontWeight:800,
                            color:'#0F172A',letterSpacing:'-0.5px',
                        }}>
                            Foire Aux Questions Learnect
                        </h2>
                        <p style={{color:'#6B7280',fontSize:'0.88rem',marginTop:'0.5rem'}}>
                            Tout savoir sur le tchat de cours particuliers, l'agenda libre, et la politique tarifaire.
                        </p>
                    </div>

                    {FAQS.map((faq,i)=>(
                        <FaqItem key={i} question={faq.question} answer={faq.answer}/>
                    ))}
                </div>
            </section>

            {/* ══ CTA FINAL ════════════════════════════════ */}
            <section style={{
                background:'#0F172A',
                padding:'5rem 0',
                textAlign:'center',
            }}>
                <div className="container">
                    <div style={{
                        color:'#10B981',fontSize:'2rem',
                        marginBottom:'1rem',
                    }}>
                        👤
                    </div>
                    <h2 style={{
                        fontFamily:"'Space Grotesk',sans-serif",
                        fontSize:'2rem',fontWeight:800,
                        color:'white',letterSpacing:'-0.5px',
                        marginBottom:'0.8rem',
                    }}>
                        Démarrez l'expérience dès aujourd'hui
                    </h2>
                    <p style={{
                        color:'rgba(255,255,255,0.6)',
                        fontSize:'0.9rem',maxWidth:500,
                        margin:'0 auto 2rem',lineHeight:1.7,
                    }}>
                        Trouvez les meilleurs tuteurs de Maroc certifiés à votre école.
                        Espace la messagerie intégrée, réservez des créneaux dans l'agenda
                        et commencez l'apprentissage !
                    </p>
                    <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
                        <Link to="/teachers" style={{
                            background:'#10B981',
                            color:'white',padding:'12px 28px',
                            borderRadius:10,fontWeight:700,
                            textDecoration:'none',fontSize:'0.9rem',
                        }}>
                            → Parcourir les tuteurs (Now)
                        </Link>
                        <Link to="/register?role=enseignant" style={{
                            background:'rgba(255,255,255,0.08)',
                            color:'white',padding:'12px 28px',
                            borderRadius:10,fontWeight:600,
                            textDecoration:'none',fontSize:'0.9rem',
                            border:'1px solid rgba(255,255,255,0.15)',
                        }}>
                            🎓 S'inscrire comme Enseignant
                        </Link>
                    </div>
                </div>
            </section>

            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    )
}

export default Home