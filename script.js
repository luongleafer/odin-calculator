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

function getFloatingPointPrecision(operand){
    if(operand.includes(".")){
        return operand.length - operand.indexOf(".") -1;
    }
    else {
        return 0;
    }
}

function getResultPrecision(){
    let primaryPrecision = getFloatingPointPrecision(operands.primary);
    let secondaryPrecision = getFloatingPointPrecision(operands.secondary);
    let resultPrecision = 100; // yes, a "magic" number, the maximum value we can pass to toFixed();
    switch (operator){
        case "plus":
        case "minus":
            resultPrecision = Math.max(primaryPrecision,secondaryPrecision);
            break;
        case "multiply":
            resultPrecision = primaryPrecision + secondaryPrecision;
    }
    resultPrecision = Math.min(resultPrecision,100);
    return resultPrecision;
}

function operate(){
    const resultPrecision = getResultPrecision();
    const result = operatorTable[operator](Number(operands.primary), Number(operands.secondary));
    operands["secondary"] = "";
    currentOperandType = "primary";
    currentOperand = result.toFixed(resultPrecision);
    currentOperand = currentOperand.substring(0, 15);
    operands["primary"] = currentOperand;
    display(currentOperand);
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
