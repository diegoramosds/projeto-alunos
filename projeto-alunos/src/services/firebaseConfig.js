import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Adicione essa linha para importar o Storage

// Configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBhPyRPdmLNgkw-JAPHI4z2fgduxGA1kt0',
  authDomain: 'alunos-1f7df.firebaseapp.com',
  projectId: 'alunos-1f7df',
  storageBucket: 'alunos-1f7df.appspot.com', // Certifique-se de que o storageBucket está correto
  messagingSenderId: '397799024677',
  appId: '1:397799024677:web:82dab87e6bf81b1e7377cc',
  measurementId: 'G-CREVE444TM',
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Inicializando outros serviços
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Adicione essa linha para inicializar o Storage

export { app, analytics, auth, db, storage }; // Não esqueça de exportar o storage
