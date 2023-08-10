import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js'
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js'


const firebaseConfig = {
  apiKey: "AIzaSyD9eRoBoSVbnpwNC2TPJJtRbr9WXDUDlsQ",
  authDomain: "trackmydata-33ed2.firebaseapp.com",
  projectId: "trackmydata-33ed2",
  storageBucket: "trackmydata-33ed2.appspot.com",
  messagingSenderId: "295677355177",
  appId: "1:295677355177:web:be32c0672157ed6d9e35b8",
  measurementId: "G-C0885KD20L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const leadsCollection = collection(db, "leadsArray");



export async function getLeads() {
  const leadsSnapshot = await getDocs(leadsCollection); //accesses leadsArray collection
  const leadsList = leadsSnapshot.docs.map(doc => ({ //maps over leadsSnpshot array and spreads it
    ...doc.data()
  }));
  return leadsList; //returned for later use
}

export async function deleteLead(itemId){
  await deleteDoc(doc(db, "leadsArray", itemId.toString())) //ID in leadsArray has to be a string for firebase
  // .then(() => console.log("successfully deleted lead"))
  .catch(() => console.log('unable to delete lead', err.message))
}

export async function addLeads(leads){
  await setDoc(doc(db, "leadsArray", leads.uuid.toString()), leads) //ID in leadsArray has to be a string for firebase
  // .then(() => console.log("successfully added lead"))
  .catch((err) => console.log('Unable to add new leads', err.message))
}


