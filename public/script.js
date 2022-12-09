const appExport = require('../app')
const Dorm = require('../models/dorm')

function capitalizeFirstLetter(a) {
    const words = a.value.split(" ");
    for (let i = 0; i < words.length; i++) {
        if(words[i][0] != undefined){
            words[i] = words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
        }
    }
    a.value = words.join(" ");
}

var message = []

// REGISTER
function validateEmail(){
    const email = document.getElementById("log-in__email").value;
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false){
        message.push("Invalid email");
        document.getElementById("log-in__email").style.backgroundColor= "#fcbbbb";
        return false;
    } else{
        document.getElementById("log-in__email").style.backgroundColor= "white";
        return true;
    }
}

function validateUsernameInput(usernameInput){
    const input = usernameInput.value.split("");
    for (let i = 0; i < input.length; i++) {
        if(/^[a-zA-Z0-9_]*$/.test(input[i]) === false){
            if(i === 0){
                input[0] = "";
            } else{
                input.splice(i,i);        
            }
        }
    }
    usernameInput.value = input.join("");
}
function validateUsernamePaste(el, e) {
    var regex = /^[a-zA-Z0-9_]*$/;
    var key = e.clipboardData.getData('text')
    if (!regex.test(key)) {
      e.preventDefault();
      return false;
    }
}

function validatePassword(){
    const pw = document.getElementById("log-in__password").value;
    let isValid = true;

    // greater than 8 characters
    if(pw.length < 8){
        message.push(" Password must be greater than 8 characters");
        isValid = false;
    }

    // at least 1 number
    if(/\d/.test(pw) === false){
        message.push(" Password should contain at least 1 number");
        isValid = false;
    }

    // at least 1 letter
    if(/[a-zA-Z]/.test(pw) === false){
        message.push(" Password should contain at least 1 letter");
        isValid = false;
    }
    
    if(isValid === false){
        document.getElementById("log-in__password").style.backgroundColor= "#fcbbbb";
    }else{
        document.getElementById("log-in__password").style.backgroundColor= "white";
    }
    return isValid;
}

function validateForm(){
    let isFormValid = true;
    isFormValid = validateEmail();
    if(validatePassword() === false){
        isFormValid = false;
    }
    if(message !== undefined && message.length !== 0){
        alert(message);
        message = [];
    }
    return isFormValid;
}

// LOG IN

// EDIT PROFILE
function thisFileUpload() {
    document.getElementById("file").click();
};

function validateNameInput(nameInput){
    const input = nameInput.value.split("");
    for (let i = 0; i < input.length; i++) {
        if(/^[a-zA-Z\s]*$/.test(input[i]) === false){
            if(i === 0){
                input[0] = "";
            } else{
                input.splice(i,i);        
            }
        }
    }
    nameInput.value = input.join("");
}
function validateNamePaste(el, e) {
    var regex = /^[a-zA-Z\s]*$/;
    var key = e.clipboardData.getData('text')
    if (!regex.test(key)) {
      e.preventDefault();
      return false;
    }
}

function validatePhoneInput(phoneInput){
    const input = phoneInput.value.split("");
    for (let i = 0; i < input.length; i++) {
        if(/[a-zA-Z]/.test(input[i]) === true){
            if(i === 0){
                input[0] = "";
            } else{
                input.splice(i,i);        
            }
        }
    }
    phoneInput.value = input.join("");
}
function validatePhonePaste(el, e) {
    var regex = /[a-zA-Z]/;
    var key = e.clipboardData.getData('text')
    if (regex.test(key)) {
      e.preventDefault();
      return false;
    }
}

function validateEditEmail(){
    const email = document.getElementById("edit-email-input").value;
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false){
        document.getElementById("edit-email-input").style.backgroundColor= "#fcbbbb";
        alert("Invalid email");
        return false;
    } else{
        document.getElementById("edit-email-input").style.backgroundColor= "white";
        return true;
    }
}

function fixText(){
    var textAreaElement = document.getElementById("edit-facebook-input");
    var searchPhrase = "facebook.com/";
    if(textAreaElement)
    {
        if(textAreaElement.value.indexOf(searchPhrase) != 0)
        {
            textAreaElement.value = searchPhrase + textAreaElement.value
        }
    }
}

function validateEditForm(){
}

// EDIT DORM


// ADD DORM
function validateUpload(input){
    const inputs = document.querySelector('#file');

    const files = inputs.files;

    if (files.length > 5) {
        alert(`Only 5 images are allowed to be uploaded.`);
        document.getElementById('file').value = "";
    }else if(document.getElementById("file").value != "") {
        alert('Your images have been uploaded sucessfully! It is currently being processed')
    }


}




function deleteUpload(input){
    if(document.getElementById("file").value != "") {
        alert('Your image/s has been deleted')
        document.getElementById('file').value = "";
    } else {
        alert("You currently don't have any uploaded image/s")
    }
} 
    



// DORMS
// let dormItems = [
//     {
//         id: "1",
//         name: "Eldia Residences",
//         price: 3000,
//         br: 2,
//         sharing: 4,
//         uni: "UST",
//         uniCounter: true,
//         priceCounter: true,
//         bedCounter: true,
//         sharingCounter: true,
//     },
//     {
//         id: "2",
//         name: "Yellow Residences",
//         price: 3500,
//         br: 2,
//         sharing: 4,
//         uni: "ADMU",
//         uniCounter: true,
//         priceCounter: true,
//         bedCounter: true,
//         sharingCounter: true,
//     },
//     {
//         id: "3",
//         name: "Gold Residences",
//         price: 3900,
//         br: 1,
//         sharing: 2,
//         uni: "UST",
//         uniCounter: true,
//         priceCounter: true,
//         bedCounter: true,
//         sharingCounter: true,
//     },
//     {
//         id: "4",
//         name: "Teeda Apartments",
//         price: 6200,
//         br: 4,
//         sharing: 6,
//         uni: "DLSU",
//         uniCounter: true,
//         priceCounter: true,
//         bedCounter: true,
//         sharingCounter: true,
//     },
//     {
//         id: "5",
//         name: "GTX Apartments",
//         price: 6300,
//         br: 1,
//         sharing: 1,
//         uni: "ADMU",
//         uniCounter: true,
//         priceCounter: true,
//         bedCounter: true,
//         sharingCounter: true,
//     },
//     {
//         id: "6",
//         name: "Dude Dormitory",
//         price: 7200,
//         br: 3,
//         sharing: 3,
//         uni: "UP",
//         uniCounter: true,
//         priceCounter: true,
//         bedCounter: true,
//         sharingCounter: true,
//     },
//     {
//         id: "7",
//         name: "Chong Residences",
//         price: 7800,
//         br: 2,
//         sharing: 4,
//         uni: "DLSU",
//         uniCounter: true,
//         priceCounter: true,
//         bedCounter: true,
//         sharingCounter: true,
//     },
//     {
//         id: "8",
//         name: "Tuition Free Apartments",
//         price: 10000,
//         br: 2,
//         sharing: 2,
//         uni: "UP",
//         uniCounter: true,
//         priceCounter: true,
//         bedCounter: true,
//         sharingCounter: true,
//     },
//     {
//         id: "9",
//         name: "Cattleya Dormitory",
//         price: 15000,
//         br: 1,
//         sharing: 2,
//         uni: "UST",
//         uniCounter: true,
//         priceCounter: true,
//         bedCounter: true,
//         sharingCounter: true,
//     }
// ];

let tempDorm = [];
Dorm.find({}, (err, items) => {
    let dormItems = [];

    items.forEach(dorm => {
        console.log(dorm.dorm_name)
        dormItems.push(dorm)
        dormItems.at(-1).uniCounter = true
        dormItems.at(-1).priceCounter = true
        dormItems.at(-1).bedCounter = true
        dormItems.at(-1).sharingCounter = true
    })

    l
})

// new URLSearchParams(window.location.search).forEach((value, name) => {
//     let univOptions = document.getElementById("filter__dropdown--university")
//     console.log(value);
//     if(value != ""){
//         for(let i=0; i < univOptions.childElementCount; i++){
//             if(univOptions.children[i].innerHTML == value){
//                 univOptions.children[i].click();
//                 break;
//             }
//         }
//     }
// })
function changeFilter(filterOption){
    const option = filterOption.innerHTML;
    const filterBtn = filterOption.parentElement.previousElementSibling.firstElementChild;
    if(filterOption.parentElement.id == "filter__dropdown--university"){
        const header = document.getElementById("dorms-uni-header");
        header.innerHTML = option;
    }
    if(filterBtn.innerHTML != option){
        console.log("executes")
        filterBtn.innerHTML = option;
        filter(filterOption);
    }

}
function filter(filterOption){
    for(i=0; i < dormItems.length; i++){
        let item = "property-" + dormItems[i].id;

        // PRICE RANGE
        if(filterOption.id == "filter-all-price"){
            dormItems[i].priceCounter = true;
        }else if(filterOption.parentElement.id == "filter__dropdown--price-range"){
            const filterInt = parseInt(filterOption.id.substr(7));
                if(filterInt === 10000 && dormItems[i].price < 10000){
                    dormItems[i].priceCounter = false;
                }else if((filterInt > dormItems[i].price || (filterInt+999) < dormItems[i].price) && filterInt !== 10000){
                    dormItems[i].priceCounter = false;
                }else{
                    dormItems[i].priceCounter = true;
                }
        }

        //UNIVERSITY
        console.log(filterOption.id)
        if(filterOption.id == "filter-all-uni"){
            dormItems[i].uniCounter = true;
        }else if(filterOption.parentElement.id == "filter__dropdown--university"){
            const filterID = filterOption.id;
                if(filterID != ("filter-" + dormItems[i].uni)){
                    dormItems[i].uniCounter = false;
                }else{
                    dormItems[i].uniCounter = true;
                }
        }

        //BEDROOMS
        if(filterOption.id == "filter-all-br"){
            dormItems[i].bedCounter = true;
        }else if(filterOption.parentElement.id == "filter__dropdown--bedrooms"){
            const filterInt = parseInt(filterOption.id.substr(7,7));
                if(filterInt != dormItems[i].br){
                    dormItems[i].bedCounter = false;
                }else{
                    dormItems[i].bedCounter = true;
                }
        }
        
        //SHARING
        if(filterOption.id == "filter-all-sh"){
            dormItems[i].sharingCounter = true;
        }else if(filterOption.parentElement.id == "filter__dropdown--persons"){
            const filterInt = parseInt(filterOption.id.substr(7,7));
            console.log(filterInt);
                if(filterInt != dormItems[i].sharing){
                    dormItems[i].sharingCounter = false;
                }else{
                    dormItems[i].sharingCounter = true;
                }
        }

        //Toggle
        if(dormItems[i].uniCounter && dormItems[i].priceCounter && dormItems[i].bedCounter && dormItems[i].sharingCounter){
            document.getElementById(item).style.display = "block";
        }else{
            document.getElementById(item).style.display = "none";
        }


    }
    //Counter
    let currentItems = document.getElementById("property-container");
    let activeCounter = 0;
    for(let i=0; i < currentItems.childElementCount; i++){
        let currentChild = currentItems.children[i];
        if(currentChild.style.display == "block"){
            activeCounter++;
        }
    }
    if(activeCounter == 1){
        document.getElementById("empty-property-1").style.visiblity = "visible";
        document.getElementById("empty-property-2").style.visiblity = "visible";
    }else if (activeCounter==2){
        document.getElementById("empty-property-1").style.visiblity = "visible";
        document.getElementById("empty-property-2").style.visiblity = "hidden";
    }else{
        document.getElementById("empty-property-1").style.visiblity = "hidden";
        document.getElementById("empty-property-2").style.visiblity = "hidden";
    }
}

// HOME
let homeUniversities = [
    {
        uni: "University Of Santo Tomas",
        id: "home-UST" 
    },
    {
        uni: "University Of The Philippines",
        id: "home-UP"
    },
    {
        uni: "Ateneo De Manila University",
        id: "home-ADMU"
    },
    {
        uni: "De La Salle University",
        id: "home-DLSU"
    },
];
function suggestUniversity(searchPhrase) {
    let searchDropdown = document.getElementById("home-search");
    if(searchPhrase.value.length > 0){
        searchDropdown.style.visibility = "visible";
        capitalizeFirstLetter(searchPhrase);
        const phrase = searchPhrase.value;
        for (let i = 0; i < phrase.length; i++) {
            for(let j = 0; j < homeUniversities.length; j++){
                if(i === 0 && phrase[i] == homeUniversities[j].uni[i]){
                    document.getElementById(homeUniversities[j].id).style.display = "block";
                }else if(phrase.substr(0,i+1) == homeUniversities[j].uni.substr(0,i+1) && i !== 0){
                    document.getElementById(homeUniversities[j].id).style.display = "block";
                }else{
                    document.getElementById(homeUniversities[j].id).style.display = "none";
                }
            }
        }
    }else{
        searchDropdown.style.visibility = "hidden";
        for(let i=0; i < searchDropdown.childElementCount; i++){
            searchDropdown.children[i].style.display = "none";
        }
    }
}

function enterSearch(uni){
    let uniSearch = uni.innerHTML;
    if(uni.parentElement.id == "home-search"){
        uni.parentElement.previousElementSibling.value = uniSearch;
    }
    document.getElementById("input-to-dorm").value = uniSearch;
    document.getElementById("search-to-dorm").submit();
}

//FORGOT PASSWORD
function validateForgotPassword(){
    const email = document.getElementById("forgot-pw__email").value;
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false){
        alert("Invalid email");
        return false;
    } else{
        return true;
    }
}