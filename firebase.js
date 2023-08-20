import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js'
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc, orderBy, query } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js'
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
export const auth = getAuth(app);

// **************** Helper function (Store current user) **************** \\

function uidProm(uid){
  return collection(db, `${uid}`); //upon login the UID of the user is passed to the function
}

// **************** Manipulate data **************** \\

export async function getLeads(uid) {
  const leadsSnapshot = await orderByDate(uid); //awaits orderByDate to recieve and order the data
  const leadsList = leadsSnapshot.docs.map(doc => ({
    ...doc.data() //iterates over it and gets passed to retrieveLeads
  }));
  return leadsList; // currently throws error when new sign up loads in as there is no Current collection
}

// uses firebase keywords to return the leads in order of callback times
function orderByDate(uid) {
  const q = query(uidProm(uid), orderBy('callBack', 'asc'));
  return getDocs(q); // Execute the query and return the sorted results
}

export async function deleteLead(itemId, uid){
  await deleteDoc(doc(db, `${uid}`, itemId.toString())) //ID in collection array has to be a string for firebase
  .catch(() => alert('unable to delete lead', err.message))
}

export async function addLeads(leads, uid){
  await setDoc(doc(db, `${uid}`, leads.uuid.toString()), leads) 
  .catch((err) => console.log('Unable to add new leads', err.message))
}

// **************** Login.js **************** \\

function redirect() {
  window.location.replace("../index.html") //redirects to the index.html page
} 

export function signUp(email, password){
  createUserWithEmailAndPassword(auth, email, password) //Import from /auth, saves the user info to my console
  .then((userInfo) => {
    document.getElementById('signedUp').innerHTML = "Signed up successfully" //provides user feedback
    const uid = userInfo.user.uid
    setTimeout(redirect, 1500) //time to read the message beforre redirect
    return uidProm(uid) // pass user to uidPromise
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
      setTimeout(redirect, 1500)
      return uidProm(uid) //the same minus savedata as the info is already on there account
  })
  .catch((err) =>  document.getElementById("loginError").innerHTML = `
  ${err.code === "auth/user-not-found" 
  ? "There is no account with these credentials" 
  : ""}
  ${(err.code === "auth/wrong-password" 
  ? "Password is incorrect, please try again" 
  : err.message)}`)
}


 export function signOutUser(){
  signOut(auth)
    .then(() => {
      setTimeout(window.location.replace("./login/login.html"), 1500) //signout and return to login page
    })
    .catch((err) => alert('There was a network error', err.message))
}

// **************** Delete data **************** \\

export async function deleteData(uid) {
  const userSnapshot = await getDocs(uidProm(uid));
  const userList = userSnapshot.docs.map(doc => ({
    ...doc.data()
  }));

  const deletePromises = userList.map(item => deleteLead(item.uuid, uid));
  await Promise.all(deletePromises);
}

export async function deleteUser(user) {
  try {
    await user.delete();
    console.log("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}
