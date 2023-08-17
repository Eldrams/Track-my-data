import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js'
import { getFirestore, where, collection, getDocs, setDoc, doc, deleteDoc, orderBy, addDoc, query } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js'
import {signOut, connectAuthEmulator, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCustomToken} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
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
export const auth = getAuth(app)
const leadsCollection = collection(db, "leadsArray");
const usersCollection = collection(db, "users");

// Clean up time

//add a delete account perm button
//work on routing and checking if logged in 
//add logout button functionality
// fix order by callback date
// fix the issue of undefined data (check for it in this file)
// remove console.logs
// delete collections
// write up notes
//error handling


function uidProm(uid){
  return collection(db, `${uid}`)
}

export async function getLeads(uid) {
  const leadsSnapshot = await getDocs((uidProm(uid))); //accesses leadsArray collection
  const leadsList = leadsSnapshot.docs.map(doc => ({ //maps over leadsSnpshot array and spreads it
    ...doc.data()
  }));
  return leadsList; //returned for later use
}

// uses firebase keywords to return the leads in order of callback times
function orderByDate(){
  const q = query(collection(db, `${uidProm()}`), orderBy('callBack')); 
  return q
}

export async function deleteLead(itemId, uid){
  await deleteDoc(doc(db, `${uid}`, itemId.toString())) //ID in leadsArray has to be a string for firebase
  .then(() => console.log("successfully deleted lead"))
  .catch(() => console.log('unable to delete lead', err.message))
}

export async function addLeads(leads, uid){
  await setDoc(doc(db, `${uid}`, leads.uuid.toString()), leads) //ID in leadsArray has to be a string for firebase
  .then(() => console.log("successfully added lead"))
  .catch((err) => console.log('Unable to add new leads', err.message))
}

// **************** Login.js **************** \\

function redirect() {
  window.location.replace("../index.html") 
} 

export function signUp(email, password){
  createUserWithEmailAndPassword(auth, email, password)
  .then((userInfo) => {
    document.getElementById('signedUp').innerHTML = "signed up successfully"
    const uid = userInfo.user.uid
    saveData(email, password, uid)
    setTimeout(redirect, 1500)
    return uidProm(email)
  })
  .catch((err) => document.getElementById('signUpError').innerHTML = `
  ${err.code === "auth/email-already-in-use" 
  ? "This email is already in use" 
  : ""}
   ${(err.code === "auth/weak-password" 
  ? "This is a weak password, please try another (at least 6 characters)" 
  : err.code)}`)
}

export function login(email, password){
  signInWithEmailAndPassword(auth, email, password)
  .then((userInfo) => {
      document.getElementById("loginSuccess").innerHTML = 'Logging you in...'
      const uid = userInfo.user.uid
      console.log(auth.currentUser)
      setTimeout(redirect, 1500)
      return uidProm(uid)
  })
  .catch((err) =>  document.getElementById("loginError").innerHTML = `
  ${err.code === "auth/user-not-found" 
  ? "There is no account with these credentials" 
  : err.message}
  ${(err.code === "auth/wrong-password" 
  ? "Password is incorrect, please try again" 
  : err.code)}`)
}


 export function signOutUser(){
  signOut(auth)
    .then(() => {
      console.log('signed out')
      setTimeout(window.location.replace("./login/login.html"), 1500)

    })
    .catch((err) => console.log('There was a network error', err.message))
}

async function saveData(email, password, uid){
  await addDoc(collection(db, `${uid}`), {
    email: email,
    password: password,
    uid
  })
  .then((docRef) =>{ 
    console.log("complete", docRef.id)
  })
  .catch((err) => {
    console.log(err.message)
  })
}

// async function readData(email) {
//   const userSnapshot = await getDocs(uidProm(email)); //accesses usersCollection collection
//   const userList = userSnapshot.docs.map(doc => ({ //maps over collectionSnapshot array and spreads it
//     ...doc.data(),
//   }))
//   console.log(readData())
//   return userList //returned for later use
// }


// async function createCollection(){
//  const userList = await readData()
//  userList.forEach(item => item.email)
// }

// function updateData(){
//   db.collection('users').doc(enter iD here)
//   .update({
//     email: "somethinf",
//     password: "something1"
//   })
//   .then(() =>{
//     console.log("data updated")
//   })
// }
// async function deleteData(a){
//   await deleteDoc(doc(db, "users", `${a}`))
//   // console.log(findUser)
//   .then(() => ('data deleted'))
//   .catch((err) => console.log(err.message))
// }


