import { useState,useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import api from '../api/axios';

const MATIERES_SUGGEST=[
{nom:'Mathématiques',cat:'Soutien'},
{nom:'Physique-Chimie',cat:'Soutien'},
{nom:'Anglais',cat:'Langues'},
{nom:'Français',cat:'Langues'},
{nom:'Arabe',cat:'Langues'},
{nom:'Informatique',cat:'Sciences'},
];

const VILLES_SUGGEST=[
{label:'Casablanca'},
{label:'Marrakech'},
{label:'Rabat'},
{label:'Tanger'},
];

function Home(){

const navigate=useNavigate();

const[matiereInput,setMatiereInput]=useState('');
const[villeInput,setVilleInput]=useState('');
const[showMatieres,setShowMatieres]=useState(false);
const[showVilles,setShowVilles]=useState(false);
const[teachers,setTeachers]=useState([]);
const[loading,setLoading]=useState(true);

// filtre autocomplete matieres
const filteredMatieres=MATIERES_SUGGEST.filter(m=>
m.nom.toLowerCase().includes(matiereInput.toLowerCase())
);

// filtre autocomplete villes
const filteredVilles=VILLES_SUGGEST.filter(v=>
v.label.toLowerCase().includes(villeInput.toLowerCase())
);

// chargement enseignants depuis backend
useEffect(()=>{

async function loadTeachers(){

try{

const res=await api.get('/enseignants');

// on limite seulement 3 profs pour home
setTeachers(res.data.slice(0,3));

}catch(err){

console.log(err);
setTeachers([]);

}finally{

setLoading(false);

}

}

loadTeachers();

},[]);

// fonction recherche
function handleSearch(e){

e.preventDefault();

navigate(`/teachers?matiere=${matiereInput}&ville=${villeInput}`);

}

// selection matiere
function selectMatiere(nom){

setMatiereInput(nom);
setShowMatieres(false);

}

// selection ville
function selectVille(ville){

setVilleInput(ville.label);
setShowVilles(false);

}

// transformation données backend vers affichage
const displayTeachers=teachers.map(t=>({
id:t.utilisateur_id,
prenom:t.user?.prenom,
nom:t.user?.nom,
ville:t.user?.ville,
tarif:t.tarifHeure,
note:t.noteMoyenne,
diplome:t.diplome,
bio:t.description_profil,
photo:t.user?.photo,
}));

return(

<div style={{fontFamily:'Inter,sans-serif',background:'#f8fafc',minHeight:'100vh'}}>

{/* section hero */}
<section style={{
padding:'70px 20px',
background:'linear-gradient(180deg,#ecfdf5 0%,#fff 100%)',
textAlign:'center'
}}>

<h1 style={{
fontSize:'3rem',
fontWeight:'800',
color:'#0f172a',
marginBottom:'16px'
}}>
Trouvez le prof idéal au Maroc
</h1>

<p style={{
color:'#64748b',
maxWidth:'600px',
margin:'0 auto 40px',
lineHeight:'1.7'
}}>
Plateforme de cours particuliers avec enseignants vérifiés et réservation simple.
</p>

{/* formulaire recherche */}
<form
onSubmit={handleSearch}
style={{
background:'white',
maxWidth:'850px',
margin:'0 auto',
borderRadius:'50px',
padding:'10px',
display:'flex',
alignItems:'center',
gap:'10px',
boxShadow:'0 10px 30px rgba(0,0,0,0.08)'
}}
>

{/* input matiere */}
<div style={{flex:1,position:'relative'}}>

<input
type="text"
placeholder="Quelle matière ?"
value={matiereInput}
onChange={e=>{
setMatiereInput(e.target.value);
setShowMatieres(true);
}}
onFocus={()=>{
setShowMatieres(true);
setShowVilles(false);
}}
style={{
width:'100%',
border:'none',
outline:'none',
padding:'15px',
fontSize:'0.9rem'
}}
/>

{/* dropdown matieres */}
{showMatieres&&(
<div style={{
position:'absolute',
top:'55px',
left:'0',
right:'0',
background:'white',
borderRadius:'16px',
overflow:'hidden',
boxShadow:'0 8px 25px rgba(0,0,0,0.1)',
zIndex:'100'
}}>

{filteredMatieres.map((m,i)=>(

<div
key={i}
onMouseDown={()=>selectMatiere(m.nom)}
style={{
padding:'12px 16px',
cursor:'pointer',
borderBottom:'1px solid #f1f5f9'
}}
>

{m.nom}

</div>

))}

</div>
)}

</div>

{/* input ville */}
<div style={{flex:1,position:'relative'}}>

<input
type="text"
placeholder="Ville"
value={villeInput}
onChange={e=>{
setVilleInput(e.target.value);
setShowVilles(true);
}}
onFocus={()=>{
setShowVilles(true);
setShowMatieres(false);
}}
style={{
width:'100%',
border:'none',
outline:'none',
padding:'15px',
fontSize:'0.9rem'
}}
/>

{/* dropdown villes */}
{showVilles&&(
<div style={{
position:'absolute',
top:'55px',
left:'0',
right:'0',
background:'white',
borderRadius:'16px',
overflow:'hidden',
boxShadow:'0 8px 25px rgba(0,0,0,0.1)',
zIndex:'100'
}}>

{filteredVilles.map((v,i)=>(

<div
key={i}
onMouseDown={()=>selectVille(v)}
style={{
padding:'12px 16px',
cursor:'pointer',
borderBottom:'1px solid #f1f5f9'
}}
>

{v.label}

</div>

))}

</div>
)}

</div>

<button
type="submit"
style={{
background:'#059669',
color:'white',
border:'none',
padding:'15px 28px',
borderRadius:'50px',
fontWeight:'700',
cursor:'pointer'
}}
>
Rechercher
</button>

</form>

</section>

{/* section enseignants */}
<section style={{padding:'80px 20px'}}>

<div style={{
maxWidth:'1100px',
margin:'0 auto'
}}>

<div style={{
display:'flex',
justifyContent:'space-between',
alignItems:'center',
marginBottom:'40px'
}}>

<div>

<h2 style={{
fontSize:'2rem',
fontWeight:'800',
color:'#0f172a',
marginBottom:'8px'
}}>
Nos enseignants
</h2>

<p style={{
color:'#64748b'
}}>
Découvrez quelques enseignants disponibles.
</p>

</div>

<Link
to="/teachers"
style={{
color:'#059669',
fontWeight:'700',
textDecoration:'none'
}}
>
Voir plus →
</Link>

</div>

{/* affichage loading */}
{loading?(
<p style={{
textAlign:'center',
padding:'40px',
color:'#94a3b8'
}}>
Chargement...
</p>
):displayTeachers.length===0?(
<div style={{
background:'white',
padding:'60px 20px',
textAlign:'center',
borderRadius:'24px',
border:'1px dashed #cbd5e1'
}}>

<div style={{fontSize:'3rem',marginBottom:'16px'}}>
🎓
</div>

<h3 style={{
fontSize:'1.2rem',
fontWeight:'800',
marginBottom:'10px'
}}>
Aucun enseignant disponible
</h3>

<p style={{color:'#64748b'}}>
Les enseignants seront affichés ici après insertion des données.
</p>

</div>
):(

<div style={{
display:'grid',
gridTemplateColumns:'repeat(3,1fr)',
gap:'20px'
}}>

{displayTeachers.map((t,i)=>(

<TeacherCard key={i} t={t}/>

))}

</div>

)}

</div>

</section>

</div>

);

}

// composant card professeur
function TeacherCard({t}){

return(

<div style={{
background:'white',
borderRadius:'24px',
overflow:'hidden',
border:'1px solid #e2e8f0',
padding:'24px'
}}>

{/* header card */}
<div style={{
display:'flex',
alignItems:'center',
gap:'14px',
marginBottom:'16px'
}}>

<div style={{
width:'55px',
height:'55px',
borderRadius:'50%',
background:'#ecfdf5',
display:'flex',
alignItems:'center',
justifyContent:'center',
fontWeight:'800',
fontSize:'1.1rem',
color:'#059669'
}}>
{t.prenom?.[0]}
</div>

<div>

<h3 style={{
fontSize:'1rem',
fontWeight:'800',
color:'#0f172a',
marginBottom:'4px'
}}>
{t.prenom} {t.nom}
</h3>

<p style={{
fontSize:'0.8rem',
color:'#64748b'
}}>
📍 {t.ville}
</p>

</div>

</div>

{/* diplome */}
<div style={{
background:'#f0fdf4',
padding:'12px',
borderRadius:'14px',
marginBottom:'14px'
}}>

<p style={{
fontSize:'0.78rem',
fontWeight:'600',
color:'#1e293b'
}}>
🎓 {t.diplome}
</p>

</div>

{/* bio */}
<p style={{
fontSize:'0.8rem',
lineHeight:'1.7',
color:'#64748b',
marginBottom:'18px'
}}>
{t.bio}
</p>

{/* footer */}
<div style={{
display:'flex',
justifyContent:'space-between',
alignItems:'center'
}}>

<span style={{
fontWeight:'800',
color:'#059669'
}}>
{t.tarif} DH/h
</span>

<Link
to={`/teachers/${t.id}`}
style={{
background:'#059669',
color:'white',
padding:'10px 18px',
borderRadius:'50px',
textDecoration:'none',
fontSize:'0.8rem',
fontWeight:'700'
}}
>
Voir profil
</Link>

</div>

</div>

);

}

export default Home;