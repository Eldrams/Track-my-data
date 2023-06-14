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
const userScoreDc = document.getElementById('userScoreDc')
const userScoreSb = document.getElementById('userScoreSb')
const userScoreC = document.getElementById('userScoreC')
const submitKpi = document.getElementById('submitKpi')
const resetStats = document.getElementById('resetStats')
const BtnSelector = document.getElementsByClassName('wrap') //accessing div buttons for score tracking
const listBtn = document.getElementsByClassName('list')//access list buttons from template literal
const appear = document.getElementsByClassName('appear')//added class to html, hides button until submit event is done
const addLead = document.getElementById('addLead')
const firstName = document.getElementById('firstName') // used multiple times, made global
const lastName = document.getElementById('lastName')
const bussinessName = document.getElementById('bussinessName')
const email = document.getElementById('email')
const telephone = document.getElementById('number')
const notes = document.getElementById('notes')
const callBack = document.getElementById('callBack')
let dcScore = 0
let sbScore = 0
let cCurrent = 0
let leadsArray = []

function createId(){
  return  Math.random()* 1000000000 // creates random number to be used as id
}

function getBackground(){
fetch("https://api.unsplash.com/photos/random?client_id=vX0G1CIva3BADMISl-QLDPJCT7ICU4IYkoeQJnvqKJY&orientation=landscape&query=electric cars", {method: "GET", headers: {
    "Content-Type": "application/json",
    "Accept-Version": "v1"
  },})
    .then(res => res.json())
    .then(data => {
        document.body.style.backgroundImage = `url("${data.urls.full}")`
    })
    .catch(err => console.log("error"))
}
// getBackground() limited to 50 calls per hour


function saveLeads() {
    localStorage.setItem('data', JSON.stringify(leadsArray))
}

function retrieveLeads(){
    const savedData = localStorage.getItem('data') //GETs data from local storage
    const savedDataArray = JSON.parse(savedData) //converts data from JSON to data js can use
    leadsArray = [...savedDataArray] //Spreads the data from myData to leads array
    let appendNewArray = leadsArray.map(data => { //iterates over leads on start
    const {firstName, lastName, bussinessName, callBack, email, uuid, notes, telephone} = data 
    // destructured for the sake of tidiness and readability
    document.getElementById('savedDataContainer').innerHTML += //Append to DOM
    `
        <div id="nameContainer">
                <h1>${firstName} ${lastName}</h1>
                <h1>${bussinessName}</h1> 
                <h1>CB: ${callBack}</h1>
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

retrieveLeads() //Load once as page is initially rendered

form.addEventListener('submit', function (e){
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
    render()
})

submitKpi.addEventListener('click', ()=>{
    if (userInputDc.value.length == 0 || userInputSb.value.length == 0 || userInputC.value.length == 0){
        alert('Enter current scores')
    }else{
        dcScore += parseInt(userInputDc.value) // convert string input to integer
        sbScore += parseInt(userInputSb.value) 
        cCurrent += parseInt(userInputC.value)
        render() // updates page
    }
})

resetStats.addEventListener('click', () => {
    dcScore = 0
    sbScore = 0
    cCurrent = 0
    render()
})

function render(){
    saveLeads()
    addLead.innerHTML = `Add Lead` //update dom
    for (let i of appear){  i.style.display = "block" } //Iterates through buttons and makes them visible
    dataCapture.innerHTML = `<h1>Data Captures: ${dcScore} / 60</h1>` 
    salaryBoost.innerHTML = `<h1>Salary Boosts: ${sbScore} / 13</h1>`
    callCurrent.innerHTML = `<h1>Calls Total: ${cCurrent} / 92</h1>`  
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
                <h1>CB: ${callBack}</h1>
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

for (let i of listBtn){
    i.addEventListener('click', (e) =>{
        const itemRemove = e.target.getAttribute('data-remove')
        const itemId = parseInt(itemRemove)
        const removeIndex = leadsArray.map(item => item.uuid).indexOf(itemId)
        if (removeIndex > -1){
            leadsArray.splice(removeIndex, 1)
            render()
        }
        const itemEdit = e.target.getAttribute('data-edit')
        const wowzersEdit = parseInt(itemEdit)
        const editIndex = leadsArray.map(item => item.uuid).indexOf(wowzersEdit)
        console.log(editIndex)
        
        if (editIndex > -1) {
            document.querySelectorAll('button').disabled = true
            addLead.innerHTML = `Update Lead`
            firstName.value = `${leadsArray[editIndex].firstName}`, // Auto fills form with data that is being edited
            lastName.value = `${leadsArray[editIndex].lastName}`,
            bussinessName.value = `${leadsArray[editIndex].bussinessName}`,
            email.value = `${leadsArray[editIndex].email}`,
            telephone.value = `${leadsArray[editIndex].telephone}`,
            notes.value = `${leadsArray[editIndex].notes}`
            leadsArray.splice(editIndex, 1) // Removes item from array after edit
          }
    })
}
  
// increment and decrementing scores

for (let i of BtnSelector){ //iterating through button tags
    i.addEventListener('click', (e) => { //adding event listner to hold them all
        const btnId = e.target.getAttribute('id'); //finding the attribut of the click event
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

