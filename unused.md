<!-- Firebase.js -->

// import {set} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";



// function register(){
//   const email = undefined
//   const password = undefined

//   auth.createUser (email, password)
//   .then((res) => {
//     console.log(res.user)
//   })
//   .catch((err) => console.log(err.message))
// }

// function login(){
//   const email = undefined
//   const password = undefined

//   auth.signIn(email, password)
//   .then((res) => {
//     console.log(res.user)
//   })
//   .catch((err) => console.log(err.message))
// }

// function saveData(){
//   const email = undefined.value
//   const password = undefined.value

//   db.collection('users')
//   .add({
//     email,
//     password
//   })
//   .then(() =>{ 
//     console.log("Document written with id",)
//   })
//   .catch((err) => {
//     console.log(err.message)
//   })
// }

// function readData(){
//   db.collection('users')
//   .getDocs()
//   .then((data) => console.log(data.docs.maps((item) => ({
//     ...item.data(), 
//     id: item.id
//   }))
// ))
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

// function deleteData(){
//   db.collection("users").doc(enter id here).deleteData
//   .then(() => ('data deleted'))
//   .catch((err) => console.log(err.message))
// }

<!-- index.js -->


function sortDates(b){
    const a = new Date()
    const compare = Date.parse(b)
    return a - compare
}


// compare the month with local time
// then compare the day of everything month
// then compare the time the cb is set for

// the higher number comes last
// lower number first

// function orderByName(array, callbackTime) {
//     return array.sort(function (a, b, c) {
//         if (callbackTime)
//     });
// }

// var sortedByName = sortByProperty(myArray, "name");

// function parseCallBackDate(callBack) {
//     const dateAndTime = callBack
//     return new Date(dateAndTime);
//   }

//   console.log(parseCallBackDate())
//   // Sort the array based on the time difference
//   leadsArray.sort((leadA, leadB) => {
//     const callBackDateA = parseCallBackDate(leadA.callBack);
//     const callBackDateB = parseCallBackDate(leadB.callBack);
    
//     const currentTime = new Date();
    
//     const timeDifferenceA = Math.abs(callBackDateA - currentTime);
//     const timeDifferenceB = Math.abs(callBackDateB - currentTime);
    
//     return timeDifferenceA - timeDifferenceB;
//   });



async function retrieveLeads(){
    const firebaseLeads = await getLeads() //retrieving the returned array
    console.log(getLeads())
    leadsArray = [...firebaseLeads] //Spreads the data from myData to leads array
    const time = firebaseLeads.map(lead => lead.callBack)
    const newArray = sortDates(time)
    console.log(newArray)
    let appendNewArray = newArray.map(data => { //iterates over leads on start
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
    return appendNewArray //returned so that i can call when page is loaded
} 

