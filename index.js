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
let dcScore = 0
let sbScore = 0
let cCurrent = 0
let leadsArray = []

function getBackground(){
fetch("https://api.unsplash.com/photos/random?client_id=vX0G1CIva3BADMISl-QLDPJCT7ICU4IYkoeQJnvqKJY&orientation=landscape&query=electric cars", {method: "GET", headers: {
    "Content-Type": "application/json",
    "Accept-Version": "v1"
  },})
    .then(res => res.json())
    .then(data => {
        console.log(data)
        document.body.style.backgroundImage = `url("${data.urls.full}")`
    })
}


form.addEventListener('submit', function (e){
    e.preventDefault() //prevent default submission action
    let leads = { //object template for leads array
        firstName: document.getElementById('firstName').value, // takes user input and adds to leadsArray
        lastName: document.getElementById('lastName').value,
        bussinessName: document.getElementById('bussinessName').value,
        email: document.getElementById('email').value,
        telephone: document.getElementById('number').value,
        notes: document.getElementById('notes').value,
        callBack: document.getElementById('callBack').value.replace('T', ' Time: ') // removes the default T and replaces it with new string
    }
    leadsArray.unshift(leads) //adds to the begging of the array (most recent lead is at the top)
    console.log(leadsArray)
    form.reset()
    render()
})


submitKpi.addEventListener('click', ()=>{
    dcScore += parseInt(userScoreDc.value) // convert string input to integer
    sbScore += parseInt(userScoreSb.value) 
    cCurrent += parseInt(userScoreC.value)
    render() // updates page
})

resetStats.addEventListener('click', () => {
    window.location.reload(); // refresh page
})


function render(){
    dataCapture.innerHTML = `<h1>Data Captures: ${dcScore} / 60</h1>` // add a moving target for each band
    salaryBoost.innerHTML = `<h1>Salary Boosts: ${sbScore} / 13</h1>`
    callCurrent.innerHTML = `<h1>Calls Total: ${cCurrent} / 92</h1>`  
    enableDecrement() //has to take place in render so logic has updated score
    submitKpi.style.display = 'none' // hides submit button when KPIs are set
    renderList.innerHTML = '' //Clears list after each iteration (prevents duplicates)
    leadsArray.forEach(leads => { //iterates through array each time render is called
        renderList.innerHTML += `
        <div id="nameContainer">
                <h1>${leads.firstName} ${leads.lastName}</h1>
                <h1>${leads.bussinessName}</h1> 
                <h1>CB: ${leads.callBack}</h1>
            </div>
            <div id="contactInfo">
                <h3>${leads.email}</h3>
                <h3>No. ${leads.telephone}</h3>
                <button id="editLead"<i class="fa-solid fa-pen-to-square"></i></button>
                <button id="deleteLead"<i class="fa-solid fa-delete-left"></i></button>
            </div>
            <div id="comments"> 
                <p>${leads.notes}</p>
        </div>
        <div class="spacer"></div>
        `
    })
    document.getElementById('editLead').addEventListener('click', (e) =>{
        console.log('hi')
    }) 
    document.getElementById('deleteLead').addEventListener('click', (e) =>{
        console.log('hi 1')
        leadsArray.indexOf(leads.firstName.value)
    }) 
}
  
// increment and decrementing scores

decrementDc.addEventListener('click', () =>{
    dcScore-- 
    render()
})


decrementSb.addEventListener('click', () =>{
    sbScore--
    render()
})

decrementC.addEventListener('click', () =>{
    cCurrent--
    render()
})

incrementDc.addEventListener('click', () => {
    dcScore++
    render()
})

incrementSb.addEventListener('click', () => {
    sbScore++
    render()
})

incrementC.addEventListener('click', () => {
    cCurrent++
    render()
})

// prevents decrementing below 0
function enableDecrement(){
    if (dcScore === 0){
        decrementDc.disabled = true
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

// document.querySelectorAll('button').forEach(elem => elem.addEventListener('click', function (e){
//    console.log(e.target.id)
//    if (e.target.incrementDc){
//    dcScore += 1
//    render()
//    }else{

//    }
// }))

// dcScore = 0
    // dataCapture.innerHTML = `<li id="dataCaptures"><input id="userScoreDc" type="number"></li>`
    // salaryBoost.innerHTML = `<li id="salaryBoosts"><input id="userScoreSb" type="number"></li>`
    // callCurrent.innerHTML = `<li id="callCurrent"><input id="userScoreC" type="number"></li>`
    // submit.style.display = 'block'
    // render()