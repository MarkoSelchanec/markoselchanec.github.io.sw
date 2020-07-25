//#region Dom integration

const body = document.body;
const logoImg = document.getElementsByClassName("logo-image")[0];
 
const peopleBtn = document.getElementById("people");
const shipsBtn = document.getElementById("ships");

const tableContainer = document.getElementsByClassName("table-container")[0];
const table = document.getElementById("tbl");

/**
 * @type HTMLInputElement
*/
let searchName = document.getElementById("search-name");
/**
 * @type HTMLInputElement
*/
const searchContainer = document.getElementsByClassName("search-div")[0];

const navContainer = document.getElementsByClassName("navigation-container")[0];
const rightBtn = document.getElementById("right-btn");
const leftBtn = document.getElementById("left-btn");
let paginate = document.getElementById("paginate");
const loader = document.getElementById("loader");

//#endregion
//#region Variables

let people = "https://swapi.dev/api/people";
let ships = "https://swapi.dev/api/starships";

let peopleActive = false;
let shipsActive = false;
let arrayOrder = false;
let count = 2;

const peopleKeys = ["", "Name" , "Height", "Mass", "Birth Year", "Gender", "Appearances"];
const shipKeys = ["", "Name", "Model", "Manufacturer", "Cost", "Capacity", "Class"];

let peopleArray = [];
let shipsArray = [];

const keyArray = ["name", "height", "mass", "gender", "birth_year", "model", "manufacturer", "cost_in_credits", "passengers", "starship_class"];

//#endregion
//#region Table generation

const createArrayBody = (tbl) => {
    tableContainer.classList.add("height")
    return tbody = tbl.createTBody();
}

const loopThroughArrayAndPrint = (key, row) => {
    for (k in key) {
        if(keyArray.includes(k)) {
            let cell = row.insertCell();
            let text = document.createTextNode(key[k]);
            cell.appendChild(text);
        }
        if (k === "films" && key.hasOwnProperty("hair_color")) {
            let cell = row.insertCell();
            let text = document.createTextNode(key[k].length);
            cell.appendChild(text);
        }
    }
}

const generateTableHead = (tbl, keys) => {
    let thead = tbl.createTHead();
    let row = thead.insertRow();
    for (const key of keys) {
        let th = document.createElement("th");
        let a = document.createElement("a");
        let text = document.createTextNode(key);
        a.addEventListener("click", (e) => {
            genericSetUp(e);
            peopleActive ? sortTable(table, peopleArray, key, count) : sortTable(table, shipsArray, key, count);
        })
        a.classList.add("pointer");
        a.classList.add("unselectable")
        th.appendChild(a);
        a.appendChild(text);
        row.appendChild(th);
    };
};

const generateTable = (tbl, array, counter) => {
    createArrayBody(tbl);
    for (let key of array[counter]) {
        let row = tbody.insertRow();
        generateDeleteBtn(row, array, key, counter)
        loopThroughArrayAndPrint(key, row)
    }
}

const generateTableLight = (tbl, array, counter, arrToMod) => {
    createArrayBody(tbl);
    for (let key of array) {
        let row = tbody.insertRow();
        generateDeleteBtn(row, arrToMod, key, counter);
        loopThroughArrayAndPrint(key, row);
    }
}

const generateFullTable = (table, keys, array, counter) => {
    generateTableHead(table, keys);
    generateTable(table, array, counter)
}

const generateDeleteBtn = (row, array, key, counter) => {
    
    let del = row.insertCell();
    let btn = document.createElement("button");
    btn.innerText = "X";
    btn.style.color = "yellow";
    btn.style.background = "black";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    btn.style.width = "50px";
    btn.style.height = "50px";
    btn.addEventListener("click", () => {
        let tempArr = [];
        let tempI = 0;
        for (const ar of array) {
            tempArr[tempI] = []
            for (const a of ar) {
                if(a.name !== key.name) {
                    tempArr[tempI].push(a)
                }
            }
            tempI++;
        }
        peopleActive ? peopleArray = tempArr : shipsArray = tempArr
                      
        table.innerHTML = "";
        peopleActive ? generateTableHead(table, peopleKeys) : generateTableHead(table, shipKeys);
        generateTable(table, tempArr, counter);   
    })
    del.appendChild(btn)
}

//#endregion
//#region Sorting

const sortTable = (tbl, array, sortCriteria, counter) => {
    let tempCount = counter - 1
    switch (sortCriteria) {
        case "Name":
            sortArrayString("name", array, tempCount)
            break;
        case "Height":
            sortArrayInt("height", array, tempCount)
            break;
        case "Mass":
            sortArrayString("mass", array, tempCount)
            break;
        case "Birth Year":
            sortArrayString("birth_year", array, tempCount)
            break;
        case "Gender":
            sortArrayString("gender", array, tempCount)
            break;
        case "Model":
            sortArrayString("model", array, tempCount)
            break;
        case "Manufacturer":
            sortArrayString("manufacturer", array, tempCount)
            break;
        case "Cost":
            sortArrayInt("cost_in_credits", array, tempCount)
            break;
        case "Capacity":
            sortArrayInt("passengers", array, tempCount)
            break;
        case "Class":
            sortArrayString("starship_class", array, tempCount)
            break;
        case "Appearances":
            if(!arrayOrder) {
                array[tempCount].sort((a, b) => a.films.length - b.films.length)
                arrayOrder = true;
            } else {
                array[tempCount].sort((a, b) => b.films.length - a.films.length)
                arrayOrder = false;
            } 
            break;
        default:
            break;
    }
    peopleActive ? generateFullTable(tbl, peopleKeys, array, tempCount) : generateFullTable(tbl, shipKeys, array, tempCount);
}

const sortArrayString = (sortyBy, array, counter) => {
    if(!arrayOrder) {
        array[counter].sort((a, b) => a[sortyBy].localeCompare(b[sortyBy]));
        arrayOrder = true;
    } else {
        array[counter].sort((a, b) => a[sortyBy].localeCompare(b[sortyBy])).reverse();
        arrayOrder = false;
    }  
}

const sortArrayInt = (sortyBy, array, counter) => {
    if(!arrayOrder) {
        array[counter].sort((a, b) => a[sortyBy] - b[sortyBy]);
        arrayOrder = true;
    } else {
        array[counter].sort((a, b) => b[sortyBy] - a[sortyBy]);
        arrayOrder = false;
    }  
}

//#endregion
//#region Helpers

const genericSetUp = (e) => {
    e.preventDefault();
    tbl.classList.add("border");
    tbl.innerHTML = "";
    tableContainer.classList.remove("absolute");
    tableContainer.classList.remove("hidden");
    navContainer.classList.remove("absolute");
    rightBtn.classList.remove("hidden");
    leftBtn.classList.remove("hidden");
    body.classList.add("height");
    searchName.classList.remove("hidden");
    searchContainer.classList.remove("absolute");
    if(count === 1) {
        leftBtn.classList.add("gray");
        rightBtn.classList.remove("gray");
    }
}

const pagination = (e) => {
    genericSetUp(e);
    paginate.innerText = 1;
}

//#endregion
//#region Buttons

const grayBtn = (button, condition) => {
    if(condition) {
        button.classList.add("gray");
    } else {
        button.classList.remove("gray");
    }
}

peopleBtn.addEventListener("click", (e) => {
    count = 1;
    pagination(e);
    generateFullTable(table, peopleKeys, peopleArray, 0);
    peopleActive = true;
    shipsActive = false;
})

shipsBtn.addEventListener("click", (e) => {
    count = 1;
    pagination(e);
    generateFullTable(table, shipKeys, shipsArray, 0);
    peopleActive = false;
    shipsActive = true;
})

rightBtn.addEventListener("click", (e) => {
    pagination(e);
    count++;
    leftBtn.classList.remove("hidden");
    if(peopleActive) {
        generateFullTable(table, peopleKeys, peopleArray, count - 1);
        grayBtn(rightBtn, count === peopleArray.length);
    }
    if(shipsActive) {
        generateTableHead(table, shipKeys);    
        generateTable(table, shipsArray, count - 1);
        grayBtn(rightBtn, count === shipsArray.length);
    } 
    grayBtn(leftBtn, count === 1);
    paginate.innerText = count;
})

leftBtn.addEventListener("click", (e) => {
    pagination(e);
    count--;

    if(peopleActive) {
        generateFullTable(table, peopleKeys, peopleArray, count - 1);
        grayBtn(rightBtn, count === peopleArray.length);
    }
    if(shipsActive) {
        generateFullTable(table, shipKeys, shipsArray, count - 1);
        grayBtn(rightBtn, count === shipsArray.length);
    }
    grayBtn(leftBtn, count === 1);
    paginate.innerText = count;
})

//#endregion
//#region Search

const returnToBase = () => {
    if(peopleActive) {
        generateFullTable(table, peopleKeys, peopleArray, count - 1);
        grayRightBtn(count === peopleArray.length);
    }
    if(shipsActive) {
        generateFullTable(table, shipKeys, shipsArray, count - 1);
        grayRightBtn(count === shipsArray.length);
    } 
}

searchName.addEventListener("keyup", function(e) {
    if(peopleActive) {
        let tempPpl = [];
        for (const arr of peopleArray) {
            for (const o of arr) {
                tempPpl.push(o)
            }
        }
        let tempArr = tempPpl.filter(e => e.name.toLowerCase().match(this.value.toLocaleLowerCase()));
        genericSetUp(e);
        generateTableHead(table, peopleKeys);
        generateTableLight(table, tempArr, count, peopleArray);
    } if (shipsActive) {
        let tempShips = [];
        for (const arr of shipsArray) {
            for (const o of arr) {
                tempShips.push(o)
            }
        }
        let tempArr = tempShips.filter(e => e.name.toLowerCase().match(this.value.toLocaleLowerCase()));
        genericSetUp(e);
        generateTableHead(table, shipKeys);
        generateTableLight(table, tempArr, count);
    }
    if(searchName.value.length === 0) {
        table.innerHTML = "";
        returnToBase()
    }
})

//#endregion
//#region localizeData

async function fillArr(link, array) {
    let a = 0;
    let b = 2;
    const res = await fetch(link);
    const data = await res.json();
    let arr = [];
    data.results.forEach(e => {
        arr.push(e)
    });
    array[a] = arr;
    while (array.length < data.count / 10) {
        const res2 = await fetch(link + `/?page=${b}`);
        console.log(link + `/?page=${b}`)
        const data2 = await res2.json();
        arr = [];
        data2.results.forEach(e => {
           arr.push(e)
        });
        a++;
        b++;
        array[a] = arr;
    }
};

fillArr(people, peopleArray)
fillArr(ships, shipsArray)
//#endregion


