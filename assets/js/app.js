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

// =====================
// 🔐 AUTENTICACIÓN
// =====================

function registrar() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .catch(e => alert(e.message));
}

function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .catch(e => alert(e.message));
}

function logout() {
  auth.signOut();
}

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("app").style.display = "block";
    cargarLibros();
  } else {
    document.getElementById("auth").style.display = "block";
    document.getElementById("app").style.display = "none";
  }
});

// =====================
// 📚 VARIABLES
// =====================

let todosLibros = [];
let editandoId = null;

// =====================
// 📥 CARGAR LIBROS
// =====================

function cargarLibros() {
  db.collection("libros")
    .where("userId", "==", auth.currentUser.uid)
    .get()
    .then(snapshot => {
      todosLibros = [];

      snapshot.forEach(doc => {
        let data = doc.data();
        data.id = doc.id;
        todosLibros.push(data);
      });

      mostrarLibros(todosLibros);
    });
}

// =====================
// 🎨 MOSTRAR LIBROS
// =====================

function mostrarLibros(lista) {
  let contenedor = document.getElementById("biblioteca");
  contenedor.innerHTML = "";

  lista.forEach(libro => {
    contenedor.innerHTML += `
      <div class="libro">
        <img src="${libro.imagen || 'https://via.placeholder.com/150'}">
        <h4>${libro.nombre}</h4>
        <p>${libro.descripcion || ""}</p>
        <small>${libro.estado}</small>
        <br>
        <button onclick="editarLibro('${libro.id}')">✏️</button>
        <button onclick="eliminarLibro('${libro.id}')">❌</button>
      </div>
    `;
  });
}

// =====================
// ➕ CREAR / EDITAR
// =====================

function guardarLibro() {
  let nombre = document.getElementById("nombre").value;
  let imagen = document.getElementById("imagen").value;
  let descripcion = document.getElementById("descripcion").value;
  let estado = document.getElementById("estado").value;

  let data = {
    nombre,
    imagen,
    descripcion,
    estado,
    userId: auth.currentUser.uid
  };

  if (editandoId) {
    db.collection("libros").doc(editandoId).update(data)
      .then(() => {
        editandoId = null;
        cerrarForm();
        cargarLibros();
      });
  } else {
    db.collection("libros").add(data)
      .then(() => {
        cerrarForm();
        cargarLibros();
      });
  }
}

// =====================
// ✏️ EDITAR
// =====================

function editarLibro(id) {
  let libro = todosLibros.find(l => l.id === id);

  document.getElementById("nombre").value = libro.nombre;
  document.getElementById("imagen").value = libro.imagen;
  document.getElementById("descripcion").value = libro.descripcion;
  document.getElementById("estado").value = libro.estado;

  editandoId = id;

  document.getElementById("tituloForm").innerText = "Editar libro";
  abrirForm();
}

// =====================
// ❌ ELIMINAR
// =====================

function eliminarLibro(id) {
  if (!confirm("¿Eliminar este libro?")) return;

  db.collection("libros").doc(id).delete()
    .then(cargarLibros);
}

// =====================
// 🔍 BUSCAR
// =====================

function filtrar() {
  let texto = document.getElementById("buscador").value.toLowerCase();

  let filtrados = todosLibros.filter(l =>
    l.nombre.toLowerCase().includes(texto)
  );

  mostrarLibros(filtrados);
}


// ✅ FILTROS

function filtrarEstado(estado) {
  if (estado === "todos") {
    mostrarLibros(todosLibros);
    return;
  }

  let filtrados = todosLibros.filter(l => l.estado === estado);
  mostrarLibros(filtrados);
}

function filtrarFavoritos() {
  let filtrados = todosLibros.filter(l => l.favorito);
  mostrarLibros(filtrados);
}
  


// =====================
// 🪟 MODAL
// =====================

function abrirForm() {
  document.getElementById("modal").style.display = "block";
}

function cerrarForm() {
  document.getElementById("modal").style.display = "none";

  document.getElementById("nombre").value = "";
  document.getElementById("imagen").value = "";
  document.getElementById("descripcion").value = "";

  editandoId = null;

  document.getElementById("tituloForm").innerText = "Agregar libro";
}



