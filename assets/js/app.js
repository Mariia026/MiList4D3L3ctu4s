// 🔴 REEMPLAZAR CON TU CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCAmvZgXrDDuOwrV-9S-YESMCHSxeQ1oeo",
  authDomain: "milist4d3l3ctu4s.firebaseapp.com",
  projectId: "milist4d3l3ctu4s",
  storageBucket: "milist4d3l3ctu4s.firebasestorage.app",
  messagingSenderId: "186844556335",
  appId: "1:186844556335:web:1205e5f87b54883b0b2ada",
  measurementId: "G-05L07HR5D9"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let todosLibros = [];
let editandoId = null;

function registrar(){
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, pass).catch(e=>alert(e.message));
}

function login(){
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, pass).catch(e=>alert(e.message));
}

function logout(){ auth.signOut(); }

auth.onAuthStateChanged(user=>{
  if(user){
    document.getElementById("auth").style.display="none";
    document.getElementById("app").style.display="block";
    cargarLibros();
  }else{
    document.getElementById("auth").style.display="block";
    document.getElementById("app").style.display="none";
  }
});

function cargarLibros(){
  db.collection("libros")
    .where("userId","==",auth.currentUser.uid)
    .get()
    .then(snap=>{
      todosLibros=[];
      snap.forEach(doc=>{
        let d=doc.data();
        d.id=doc.id;
        todosLibros.push(d);
      });
      mostrarLibros(todosLibros);
    });
}

function mostrarLibros(lista){
  let c=document.getElementById("biblioteca");
  c.innerHTML="";
  lista.forEach(l=>{
    c.innerHTML+=`
    <div class="libro">
      <img src="${l.imagen||'https://via.placeholder.com/150'}">
      <h4>${l.nombre}</h4>
      <p>${l.descripcion||""}</p>
      <small>${l.estado}</small><br>
      <button onclick="toggleFavorito('${l.id}')">${l.favorito?"⭐":"☆"}</button>
      <button onclick="editarLibro('${l.id}')">✏️</button>
      <button onclick="eliminarLibro('${l.id}')">❌</button>
    </div>`;
  });
}

function guardarLibro(){
  let data={
    nombre:document.getElementById("nombre").value,
    imagen:document.getElementById("imagen").value,
    descripcion:document.getElementById("descripcion").value,
    estado:document.getElementById("estado").value,
    favorito:false,
    userId:auth.currentUser.uid
  };

  if(editandoId){
    db.collection("libros").doc(editandoId).update(data).then(()=>{
      editandoId=null;
      cerrarForm();
      cargarLibros();
    });
  }else{
    db.collection("libros").add(data).then(()=>{
      cerrarForm();
      cargarLibros();
    });
  }
}

function editarLibro(id){
  let l=todosLibros.find(x=>x.id===id);
  document.getElementById("nombre").value=l.nombre;
  document.getElementById("imagen").value=l.imagen;
  document.getElementById("descripcion").value=l.descripcion;
  document.getElementById("estado").value=l.estado;
  editandoId=id;
  document.getElementById("tituloForm").innerText="Editar libro";
  abrirForm();
}

function eliminarLibro(id){
  if(!confirm("Eliminar?"))return;
  db.collection("libros").doc(id).delete().then(cargarLibros);
}

function toggleFavorito(id){
  let l=todosLibros.find(x=>x.id===id);
  db.collection("libros").doc(id).update({favorito:!l.favorito}).then(cargarLibros);
}

function filtrar(){
  let t=document.getElementById("buscador").value.toLowerCase();
  mostrarLibros(todosLibros.filter(l=>l.nombre.toLowerCase().includes(t)));
}

function filtrarEstado(e){
  if(e==="todos") return mostrarLibros(todosLibros);
  mostrarLibros(todosLibros.filter(l=>l.estado===e));
}

function filtrarFavoritos(){
  mostrarLibros(todosLibros.filter(l=>l.favorito));
}

function abrirForm(){ document.getElementById("modal").style.display="block"; }
function cerrarForm(){
  document.getElementById("modal").style.display="none";
  document.getElementById("nombre").value="";
  document.getElementById("imagen").value="";
  document.getElementById("descripcion").value="";
  editandoId=null;
  document.getElementById("tituloForm").innerText="Agregar libro";
}
