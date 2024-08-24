const keyboard = document.querySelector(".keyboard");
let primaryOperand = "";
let secondaryOperand = "";
let operator = "";
let currentInput = "primary";

const add = (primary, second) => {
    return primary + second;
}

const subtract = (primary, second) => {
    return primary - second;
} 

const multiply = (primary, second) => {
    return primary * second;
}

const divide = (primary, second) => {
    return primary / second;
}

const operatorTable = {
    "plus" : add,
    "minus" : subtract,
    "multiply" : multiply,
    "divide" : divide
}

function operate(){
    return operatorTable(operator)(primaryOperand, secondaryOperand);
}


keyboard.addEventListener("click", (event) => {
    if(event.target.classList.contains("key")){
        console.log(event.target.id);
    }
} );

function processKey(keytype, keyId){
    switch (keytype){
        case "number":
            processNumberKey(keyId);
            break;
    }
}

function processNumberKey(number){
    switch (currentInput){
        case "primary":
            primaryOperand += number;
            break;
        case "secondaryOperand":
            secondaryOperand += number;
            break;
    }
}
