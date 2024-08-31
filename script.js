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
    resultPrecision = Math.min(resultPrecision,15);
    return resultPrecision;
}

function processPercent(operand){
    let percentIter = operand.length - 1;
    while(operand.charAt(percentIter) === "%"){
        percentIter--;
    }
    const number = Number(operand.substring(0,percentIter+1));
    return number / Math.pow(100,operand.length - 1 - percentIter);
}

function operate(){
    operands.primary = String(processPercent(operands.primary));
    operands.secondary = String(processPercent(operands.secondary));
    const resultPrecision = getResultPrecision();
    const result = operatorTable[operator](Number(operands.primary),Number(operands.secondary));

    operands["secondary"] = "";
    currentOperandType = "primary";
    
    if(isNaN(result) || !isFinite(result)){
        reset("ERROR. Press AC");
    }
    else{
        currentOperand = result.toFixed(resultPrecision);
        currentOperand = currentOperand.substring(0, 15);
        if(currentOperand.includes(".")){
        currentOperand =  currentOperand.replace(/\.?0*$/gm,'');
        }
        operands["primary"] = currentOperand;
        display(currentOperand);
    }
}



keyboard.addEventListener("click", (event) => {
    if(event.target.classList.contains("key")){
        processKey(event.target.classList[1],event.target.id);
    }
} );

document.addEventListener("keydown", (event) => {
    processPhysicalKeyboard(event.key);
})

function processPhysicalKeyboard(key){
    const mapping = {
        "+" : {type: "operator", id: "plus"},
        "-" : {type: "operator", id: "minus"},
        "*" : {type: "operator", id: "multiply"},
        "/" : {type: "operator", id: "divide"},
        "=" : {type: "operator", id: "equal"},
        "Enter" : {type: "operator", id: "equal"},
        "Backspace" : {type: "modifier", id: "delete"},
        "." : {type: "modifier", id: "floating-point"},
        "%" : {type: "modifier", id: "percent"},
    }
    if("0123456789".includes(key)){
        processKey("number",key);
    }
    else {
        if(mapping.hasOwnProperty(key)){
            const mappingResult = mapping[key];
            processKey(mappingResult.type,mappingResult.id);
        }
    }
}

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
            reset("0");            
            break;
    }
}

function processNumberKey(number){
    if(currentOperand.endsWith("%")) return; // you can't add digit after a percent symbol (%)
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
    highlightOperator(op);
}

function display(thing){
    if(String(thing).length === 0){
        thing = "0";
    }
    screen.innerText = String(thing);
}

function highlightOperator(op){
    const allOpDiv = document.querySelectorAll(".key.operator");
    allOpDiv.forEach((div) => div.style.backgroundColor = ""  );
    if(op === "" || op === "equal") return;
    const opDiv = document.querySelector(`.key.operator#${op}`);
    opDiv.style.backgroundColor = "orange";

    
}

function reset(msg){
    currentOperand = "";
    currentOperandType = "primary"
    operands["primary"] = "";
    operands["secondary"] = "";
    operator = "";
    display(msg);
    highlightOperator("");
}
