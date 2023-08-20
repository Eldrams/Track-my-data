const renderList = document.getElementById('list')
const form = document.getElementById('form')
const dataCapture = document.getElementById('dataCaptures')
const salaryBoost = document.getElementById('salaryBoosts')
const callCurrent = document.getElementById('callCurrent')
const decrementDc = document.getElementById('decrementDc')
const decrementSb = document.getElementById('decrementSb')
const decrementC = document.getElementById('decrementC')
const incrementDc = document.getElementById('incrementDc')
const incrementSb = document.getElementById('incrementSb')
const incrementC = document.getElementById('incrementC')
const submitKpi = document.getElementById('submitKpi')
const resetStats = document.getElementById('resetStats')
const BtnSelector = document.getElementsByClassName('wrap') //accessing div buttons for score tracking
const listBtn = document.getElementsByClassName('list')//access list buttons from template literal
const appear = document.getElementsByClassName('appear')//added class to html, hides button until submit event is done
const addLead = document.getElementById('addLead')
const logOut = document.getElementById('logOut')
const firstName = document.getElementById('firstName') // used multiple times, made global
const lastName = document.getElementById('lastName')
const bussinessName = document.getElementById('bussinessName')
const email = document.getElementById('email')
const telephone = document.getElementById('number')
const notes = document.getElementById('notes')
const callBack = document.getElementById('callBack') 
const thresholdsConfig = { //Styles and score threshholds, used for updating DOM conditionally
    dataCapture: [
      { score: 60, color: "#FFD700" },
      { score: 50, color: "green" },
      { score: 40, color: "orange" },
    ],
    salaryBoost: [
      { score: 20, color: "#FFD700" },
      { score: 15, color: "green" },
      { score: 10, color: "orange" },
    ],
    callCurrent: [
      { score: 92, color: "#FFD700" },
      { score: 60, color: "green" },
      { score: 40, color: "orange" },
    ],
  };
let dcScore = 0
let sbScore = 0
let cCurrent = 0
let leadsArray = [] //I could feasibly remove this and everything work
//I think the app working while offline is important however, even if it is at limited capacity

import {getLeads, addLeads, deleteLead, auth, signOutUser, deleteUser, deleteData} from './firebase.js' //all imports required for firebase

// ************** Fetch requests and ID creation ************** \\

async function userLogged(){
    if (await auth.currentUser === null){
        alert("You are not currently signed in, if you wish to use this service please create one if you only wish to test this service go to the login page and use the test account" )
        window.location.replace("./login/login.html")
    }
} 


function createId(){
  return Math.random() * 1000000000 // creates random number to be used as id
}

// Function to get background image using unsplash API
function getBackground(){
fetch("https://api.unsplash.com/photos/random?client_id=vX0G1CIva3BADMISl-QLDPJCT7ICU4IYkoeQJnvqKJY&orientation=landscape&query=electric cars", {method: "GET", headers: {
    "Content-Type": "application/json",
    "Accept-Version": "v1"
  },})
    .then(res => res.json())
    .then(data => {
        document.body.style.backgroundImage = `url("${data.urls.full}")`
    })
    .catch(err => console.log("There was an issue loading your background", err.message))
}


async function retrieveLeads(){
    const firebaseLeads = await getLeads() //retrieving the returned array, I have to await getLeads()
    const uid = await getLeads(auth.currentUser.uid)// before i am able to pass the uid
    leadsArray = [...uid] //Spreads the data from getLeads() to leads array
    let appendNewArray = uid.map(data => { //iterates over leads on start
    const {firstName, lastName, bussinessName, callBack, email, uuid, notes, telephone} = data 
    // destructured for the sake of tidiness and readability
    document.getElementById('savedDataContainer').innerHTML += //Append to DOM
    `
        <div id="nameContainer">
                <h1>${firstName} ${lastName}</h1>
                <h1>${bussinessName}</h1> 
                <h1 style="font-weight: 700">CB: ${callBack}</h1>
            </div>
            <div class="contactInfo" id="contactInfo">
                <h3>${email}</h3>
                <h3>No. ${telephone}</h3>
                <button data-edit="${uuid}" class="editLead"><i data-edit="${uuid}" class="fa-solid fa-pen-to-square"></i></button>
                <button data-remove="${uuid}" class="deleteLead"><i data-remove="${uuid}" class="fa-solid fa-delete-left"></i></button>
            </div>
            <div id="comments"> 
                <p>${notes}</p>
        </div>
        <div class="spacer"></div>
        `

    })
    render()
    return appendNewArray //returned so that i can call while page is loading
} 

// ************** KPI's and event listeners ************** \\

form.addEventListener('submit', async function (e){
    e.preventDefault() //prevent default submission action
    let leads = { //object template for leads array
        uuid: parseInt(createId()), //convert to integer
        firstName: firstName.value, // takes user input and adds to leadsArray
        lastName: lastName.value,   
        bussinessName: bussinessName.value,
        email: email.value,
        telephone: telephone.value,
        notes: notes.value,
        callBack: callBack.value.replace('T', ' Time: ') // removes the default T and replaces it with new string
    }
    leadsArray.unshift(leads) //adds to the begging of the array (most recent lead is at the top)
    form.reset()
    try {
        const uid = auth.currentUser.uid //finds current user 
        await addLeads(leads, uid) //pass the leads object and current user info
        
    } catch (err){
        alert("Database could not be reached:", err.message)// uh oh
    }
    render()
})

// ************** Event listeners ************** \\

submitKpi.addEventListener('click', submitKPIs)
resetStats.addEventListener('click', resetScores)
logOut.addEventListener('click', signOutUser) //signs out user
document.getElementById('deleteAccount').addEventListener('click', async () => {
    const user = auth.currentUser;

    if (user) {
      const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
      
      if (confirmed) {
        try {
          const uid = user.uid;
          await deleteData(uid);
          await deleteUser(user);
          window.location.reload()
        } catch (error) {
          console.error("Error deleting account:", error);
        }
      } else {
        console.log("Account deletion cancelled.");
      }
    } else {
      console.log("No user is currently signed in.");
    }
  });

function submitKPIs(){
    if (userInputDc.value.length == 0 || userInputSb.value.length == 0 || userInputC.value.length == 0){
        alert('Enter current scores')
    }else{
        dcScore += parseInt(userInputDc.value) // convert string input to integer
        sbScore += parseInt(userInputSb.value) 
        cCurrent += parseInt(userInputC.value)
        render() // updates page
    } 
}

function resetScores(){
    dcScore = 0
    sbScore = 0
    cCurrent = 0 //resets scores to 0
    render()
}

// ************** UI & Render ************** \\

// updates the color based on our commision bands
function getColorStyle(score, thresholds) {
    const style = {
      color: "black", //set an inital style
    };
  
    for (const threshold of thresholds) { //iterated through the threshhold config, to set the inline style based on scores
      if (score >= threshold.score) {
        style.color = threshold.color;
        break;
      }
    }
    return style;
  }

function render(){
    addLead.innerHTML = `Add Lead` //update dom
    for (let i of appear){  i.style.display = "block" } //Iterates through buttons and makes them visible
    const dcStyle = getColorStyle(dcScore, thresholdsConfig.dataCapture); //uses helper function to determine inline style
    const sbStyle = getColorStyle(sbScore, thresholdsConfig.salaryBoost);// this is based on threshhold config
    const ccStyle = getColorStyle(cCurrent, thresholdsConfig.callCurrent);
    dataCapture.innerHTML = `<h1 style="color: ${dcStyle.color}">Data Captures: ${dcScore} / 60</h1>`//set inline style 
    salaryBoost.innerHTML = `<h1 style="color: ${sbStyle.color}">Salary Boosts: ${sbScore} / 20</h1>`
    callCurrent.innerHTML = `<h1 style="color: ${ccStyle.color}">Calls Total: ${cCurrent} / 92</h1>`  
    enableDecrement() //has to take place in render so logic has updated score
    submitKpi.style.display = 'none' // hides submit button when KPIs are set
    renderList.innerHTML = '' //Clears list after each iteration (prevents duplicates)
    leadsArray.forEach(leads => { //iterates through leads array each time render is called
    const {firstName, lastName, bussinessName, callBack, email, uuid, notes, telephone} = leads
    //Destructured for the sake of tidiness and readability
        renderList.innerHTML += `
        <div id="nameContainer">
                <h1>${firstName} ${lastName}</h1>
                <h1>${bussinessName}</h1> 
                <h1 style="font-weight: 700" >CB: ${callBack}</h1>
            </div>
            <div class="contactInfo" id="contactInfo">
                <h3>${email}</h3>
                <h3>No. ${telephone}</h3>
                <button data-edit="${uuid}" class="editLead"><i data-edit="${uuid}" class="fa-solid fa-pen-to-square"></i></button>
                <button data-remove="${uuid}" class="deleteLead"><i data-remove="${uuid}" class="fa-solid fa-delete-left"></i></button>
            </div>
            <div id="comments"> 
                <p>${notes}</p>
        </div>
        <div class="spacer"></div>
        `
    })
}

// ************** Buttons and functionality ************** \\

for (let i of listBtn){
    i.addEventListener('click', (e) =>{
        const itemRemove = e.target.getAttribute('data-remove')//finds DOM element based on attribute
        const itemId = parseInt(itemRemove) //solved a bug that would prevent me from finding the index by converting to an integer
        const removeIndex = leadsArray.map(item => item.uuid).indexOf(itemId) //maps over array and then finds the current index
        if (removeIndex > -1){
            leadsArray.splice(removeIndex, 1) //removes selected index
            const uid = auth.currentUser.uid //find user
            deleteLead(itemId, uid) //send info back to firebase
            render()
        }
        const itemEdit = e.target.getAttribute('data-edit')
        const editId = parseInt(itemEdit)
        const editIndex = leadsArray.map(item => item.uuid).indexOf(editId) //see above
        
        if (editIndex > -1) {
            document.querySelectorAll('button').disabled = true //disable buttons to prevent a bug when selected
            addLead.innerHTML = `Update Lead` // multiple times it deletes the first item in the array @ index -1
            firstName.value = `${leadsArray[editIndex].firstName}`, // Auto fills form with data that is being edited
            lastName.value = `${leadsArray[editIndex].lastName}`,
            bussinessName.value = `${leadsArray[editIndex].bussinessName}`,
            email.value = `${leadsArray[editIndex].email}`,
            telephone.value = `${leadsArray[editIndex].telephone}`,
            notes.value = `${leadsArray[editIndex].notes}`
            const uid = auth.currentUser.uid
            deleteLead(editId, uid) //Not a "true" edit function, slight ux issue, as cant cancel the edit 
            leadsArray.splice(editIndex, 1) // Removes item from array after edit
          }

    })
}

// ************** increment and decrementing scores ************** \\

for (let i of BtnSelector){ //iterating through button tags
    i.addEventListener('click', (e) => { //adding event listner to hold them all
        const btnId = e.target.getAttribute('id'); //finding the attribute of the click event
        if (btnId === decrementDc.id){
            dcScore-- 
            render()
        }else if (btnId === decrementSb.id){
            sbScore--
            render()
        }else if (btnId === decrementC.id){
            cCurrent--
            render()
        }else if (btnId == incrementDc.id){
            dcScore++
            render()
        }else if (btnId === incrementSb.id){
            sbScore++
            render()
        }else if (btnId === incrementC.id){
            cCurrent++
            render()
        }else { //To prevent a bug where clicking anywhere in the div would immediatly submit scores
            return
        }
    })
}

// prevents decrementing below 0
function enableDecrement(){
    if (dcScore === 0){
        decrementDc.disabled = true //html is set as disabled, toggles based on score
    }else if (dcScore >= 1){
        decrementDc.disabled = false
    }
    
    if (sbScore === 0){
        decrementSb.disabled = true
    }else if (sbScore >= 1){
        decrementSb.disabled = false
    }
    
    if (cCurrent === 0){
        decrementC.disabled = true
    }else if (cCurrent >= 1){
        decrementC.disabled = false
    }
}

getBackground() //limited to 50 calls per hour
retrieveLeads() //Load once as page is initially rendered
setTimeout(userLogged, 2000) // Waits for the aync functions to return then checks auth status