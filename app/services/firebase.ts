import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbnHwoi2Vdj-sAru1p8o7N0IUCtt0GQ4k",
  authDomain: "inscricoes-congresso.firebaseapp.com",
  projectId: "inscricoes-congresso",
  storageBucket: "inscricoes-congresso.firebasestorage.app",
  messagingSenderId: "219856522978",
  appId: "1:219856522978:web:7169bb208337b5480118bb",
  measurementId: "G-PF8Y84854H",
};

// Inicializa apenas se não houver apps
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
