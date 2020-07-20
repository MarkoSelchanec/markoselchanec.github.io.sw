const body = document.getElementsByTagName("body")[0];

const peopleBtn = document.getElementById("people");
const shipsBtn = document.getElementById("ships");

const tableContainer = document.getElementsByClassName("table-container")[0];
const table = document.getElementById("tbl");

const navContainer = document.getElementsByClassName("navigation-container")[0];
const rightBtn = document.getElementById("right-btn");
const leftBtn = document.getElementById("left-btn");

let people = "https://swapi.dev/api/people";
let ships = "https://swapi.dev/api/starships";

let peopleActive = false;
let shipsActive = false;
let count = 2;

const peopleKeys = ["Name" , "Height", "Mass", "Gender", "Birth Year", "Appearances"];
const shipKeys = ["Name", "Model", "Manufacturer", "Cost", "Capacity", "Class"]

function generateTableHead(tbl, keys) {
    let thead = tbl.createTHead();
    let row = thead.insertRow();
    for (const key of keys) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(tbl, array) {
    let tbody = tbl.createTBody();
    for (let key of array) {
      let row = tbody.insertRow();
      for (k in key) {
        if(k === "name" || 
            k === "height" || 
            k === "mass" || 
            k === "gender" || 
            k === "birth_year" ||
            k === "model" ||
            k === "manufacturer" ||
            k === "cost_in_credits" ||
            k === "passengers" || 
            k === "starship_class") {
            let cell = row.insertCell();
            let text = document.createTextNode(key[k]);
            cell.appendChild(text);
        }
        if (k === "films" && key.hasOwnProperty("gender")) {
            let cell = row.insertCell();
            let text = document.createTextNode(key[k].length);
            cell.appendChild(text);
        }
      }
    }
}

let jsondata = [];

function getData(link) {
    fetch(link)
        .then((response) => response.json())
        .then((json) => {
            jsondata = [];
            jsondata.push(json); 
            console.log(json.results[0])
            generateTable(table, json.results)
        })
}

function genericSetUp(e) {
    e.preventDefault();
    tbl.classList.add("border");
    tbl.innerHTML = ""
    tableContainer.classList.remove("absolute");
    navContainer.classList.remove("absolute")
    rightBtn.classList.remove("hidden")
    body.classList.add("height")
}

peopleBtn.addEventListener("click", (e) => {
    genericSetUp(e)
    generateTableHead(table, peopleKeys);
    getData(people)
    peopleActive = true;
    shipsActive = false;
    leftBtn.classList.add("hidden")
    count = 1;
})

shipsBtn.addEventListener("click", (e) => {
    genericSetUp(e)
    generateTableHead(table, shipKeys);
    getData(ships)
    peopleActive = false;
    shipsActive = true;
    leftBtn.classList.add("hidden")
    count = 1;
})

rightBtn.addEventListener("click", (e) => {
    genericSetUp(e)
    count++
    leftBtn.classList.remove("hidden")
    if(peopleActive) {
        generateTableHead(table, peopleKeys);
        getData(people + `/?page=${count}`)
        if(count === Math.ceil(jsondata[0].count / 10)) rightBtn.classList.add("hidden")
    }
    if(shipsActive) {
        generateTableHead(table, shipKeys);    
        getData(ships + `/?page=${count}`)
        if(count === Math.ceil(jsondata[0].count / 10)) rightBtn.classList.add("hidden")
    } 
})


leftBtn.addEventListener("click", (e) => {
    genericSetUp(e)
    count--
    if(peopleActive) {
        generateTableHead(table, peopleKeys);
        getData(people + `/?page=${count}`)
        if(count === 1) leftBtn.classList.add("hidden")
    }
    if(shipsActive) {
        generateTableHead(table, shipKeys);    
        getData(ships + `/?page=${count}`)
        if(count === 1) leftBtn.classList.add("hidden")
    }
    
})

console.log("https://swapi.dev/api/people/?search=l")
console.log("http://swapi.dev/api/planets/3/")
