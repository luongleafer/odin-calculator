const keyboard = document.querySelector(".keyboard");
const screen = document.querySelector(".screen");
let primaryOperand = "";
let secondaryOperand = "";
let currentOperand = "";
let operator = "";
let currentOperandType = "primary";
let isResultDisplayed = false;
let operands = {
    "primary" : "",
    "secondary" : ""
}

const add = (primary, secondary) => {
    return primary + secondary;
}

const subtract = (primary, secondary) => {
    return primary - secondary;
} 

const multiply = (primary, secondary) => {
    return primary * secondary;
}

const divide = (primary, secondary) => {
    return primary / secondary;
}

const operatorTable = {
    "plus" : add,
    "minus" : subtract,
    "multiply" : multiply,
    "divide" : divide
}

function operate(){
    const result = operatorTable[operator](Number(operands.primary), Number(operands.secondary));
    console.log(`operated, result: ${result}`);
    operands["primary"] = result;
    operands["secondary"] = "";
    currentOperandType = "primary";
    currentOperand = String(result);
    display(result);
}



keyboard.addEventListener("click", (event) => {
    if(event.target.classList.contains("key")){
        processKey(event.target.classList[1],event.target.id);
    }
} );

function processKey(keytype, keyId){
    switch (keytype){
        case "number":
            processNumberKey(keyId);
            break;
        case "modifier":
            processModifier(keyId);
            break;
        case "operator":
            processOperator(keyId);
            break;
        case "control":
            currentOperand = "";
            operands["primary"] = "";
            operands["secondary"] = "";
            operator = "";
            display("0");
            break;
    }
}

function processNumberKey(number){
    if(isResultDisplayed){
        currentOperandType = "primary";
        isResultDisplayed = false;
        currentOperand = "";
    }
    currentOperand += number;
    operands[currentOperandType] = currentOperand;
    display(operands[currentOperandType]);
}

function processModifier(modifier){
    switch (modifier){
        case "floating-point":
            if(!currentOperand.includes(".")){
                currentOperand += ".";
            }
            break;
        case "delete":
            currentOperand = currentOperand.substring(0, currentOperand.length-1);
            break;
        case "percent":
            currentOperand += "%";
            break;
        case "negative":
            if(currentOperand.startsWith("-")){
                currentOperand = currentOperand.substring(1);
            }
            else{
                currentOperand = "-" + currentOperand;
            }
            break;
    }
    operands[currentOperandType] = currentOperand;
    display(currentOperand);
    isResultDisplayed = false;
}

function processOperator(op){
    if(op === "equal"){
        if(currentOperandType === "secondary"){
            operate();
            isResultDisplayed = true;
        }
    }
    else{
        /*
        if(currentOperandType === "primary"){
            operator = op;
            currentOperand = "";
            currentOperandType = "secondary"; 
        }
        else {
            operate();
            isResultDisplayed = false;
        }
        */
        if(currentOperandType === "secondary"){
            operate();
            isResultDisplayed = false;
        }
        operator = op;
        currentOperand = "";
        currentOperandType = "secondary"; 
        if(isResultDisplayed){
            isResultDisplayed = false;
        }
    }
}

function display(thing){
    if(String(thing).length === 0){
        thing = "0";
    }
    screen.innerText = String(thing);
}
