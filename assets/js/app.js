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

// Auth
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

// CRUD
function agregarLibro() {
  let nombre = document.getElementById("nombre").value;
  let imagen = document.getElementById("imagen").value;

  db.collection("libros").add({
    nombre,
    imagen,
    userId: auth.currentUser.uid
  }).then(cargarLibros);
}

function cargarLibros() {
  let contenedor = document.getElementById("biblioteca");
  contenedor.innerHTML = "";

  db.collection("libros")
    .where("userId", "==", auth.currentUser.uid)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let libro = doc.data();
        contenedor.innerHTML += `
          <div class="libro">
            <img src="${libro.imagen}" width="100"><br>
            ${libro.nombre}
          </div>
        `;
      });
    });
}


let todosLibros = [];

function cargarLibros() {
  db.collection("libros")
    .where("userId", "==", auth.currentUser.uid)
    .get()
    .then(snapshot => {
      todosLibros = [];
      snapshot.forEach(doc => {
        todosLibros.push(doc.data());
      });
      mostrarLibros(todosLibros);
    });
}

function mostrarLibros(lista) {
  let contenedor = document.getElementById("biblioteca");
  contenedor.innerHTML = "";

  lista.forEach(libro => {
    contenedor.innerHTML += `
      <div class="libro">
        <img src="${libro.imagen || 'https://via.placeholder.com/150'}">
        <p>${libro.nombre}</p>
      </div>
    `;
  });
}

function filtrar() {
  let texto = document.getElementById("buscador").value.toLowerCase();
  let filtrados = todosLibros.filter(l =>
    l.nombre.toLowerCase().includes(texto)
  );
  mostrarLibros(filtrados);
}

function abrirForm() {
  document.getElementById("modal").style.display = "block";
}

function cerrarForm() {
  document.getElementById("modal").style.display = "none";
}
