class Stack {
    constructor() {
        this.items = [];
    }

    add(element) {
        this.items.push(element);
    }

    remove() {
        if (this.items.length != 0) {
            return this.items.pop();
        }
        else {
            return null;
        }
    }

    peek() {
        if (this.items.length != 0) {
            return this.items[this.items.length - 1];
        }
        else {
            return null;
        }
    }
}

let equation = "";
let equationDisplay = document.querySelector(".equation");
let resultDisplay = document.querySelector(".result");
const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const operators = ["+", "-", "*", "/", "%", "^"];
let pressedEqualTo = false;
let finalResult = 0;


// Allows only number keys and '+', '-', '*', '/', '.', '%', '^'
function validateKeyPress(key) {
    if (nums.indexOf(key) != -1 || operators.indexOf(key) != -1 || key === "(" || key === ")") {
        display(key);
        return true;
    }
    else if (key === "Backspace") {
        del();
        return true;
    }
    else if (key === "=" || key === "Enter") {
        let res = evaluate();
        pressedEqualTo = true;
        return true;
    }
    else
        return false;
}

//Checks whether the last entered number already has a decimal point or not
function hasDecimalPoint() {
    for (let i = equation.length - 1; i >= 0; i--) {
        if (operators.indexOf(equation[i]) != -1)
            return false;

        else if (equation[i] === ".")
            return true;
    }
}

// Converts signs like * and / to × and ÷ respectively to display the equation
function convertOperatorToSymbol(text) {
    if (text === "*")
        return "×";
    else if (text === "/")
        return "÷";
    else
        return text;
}

// Displays the currently typed equation
function display(text) {
    let lastCharacter = equation.charAt(equation.length - 1);

    if ((equation.length === 0 || lastCharacter === "(") && (text === "+" || text === "*" || text === "/" || text === "%" || text === "^")) {
        // To allow only '-' and '.' at the beginning of the equation
        return;
    }
    else if (operators.indexOf(lastCharacter) != -1 && operators.indexOf(text) != -1) {
        // To avoid scenario like for e.g. 2+/3
        return;
    }
    else if (hasDecimalPoint() === true && text === ".") {
        // To allow only one decimal point in a number
        return;
    }
    else if (nums.indexOf(text) != -1 && lastCharacter === ")") {
        // To avoid scenario like 4+(3-1)8, i.e. numbers shouldn't appear just after closing bracket.
        return;
    }
    else if (text === "(") {
        if (operators.indexOf(lastCharacter) != -1 || lastCharacter === "(" || !lastCharacter) {
            // To allow opening brackets either at the beginning or just after opening bracket or just after an operator
            equation += text;
            equationDisplay.innerText += text;
        }
        else if(pressedEqualTo) {
            // Resetting the equation if equal to was pressed
            equation = text;
            equationDisplay.innerText = text;
            resultDisplay.innerText = "0";
            finalResult = 0;
            pressedEqualTo = false;
        }
        else
            return;
    }
    else if (text === ")") {
        let a = countBrackets(equation);
        if ((nums.indexOf(lastCharacter) != -1 || text === ")") && (operators.indexOf(lastCharacter) === -1) && ((a[0] > a[1]))) {
            // To allow closing brackets only after a number or a closing bracket is occured and number of opening brackets should be more than closing brackets
            equation += text;
            equationDisplay.innerText += text;
        }
        else
            return;
    }
    else if (operators.indexOf(text) != -1) {
        // Condition when operator usage is valid
        if (pressedEqualTo) {
            // To replace the old equation with the last result (finalResult) after equal to is pressed
            if (resultDisplay.innerText === "Undefined") {
                // If result is undefined and operator is - or . then reset the equation and final result
                if(text === "-" || text === ".") {
                    equation = text;
                    equationDisplay.innerText = text;
                    resultDisplay.innerText = "0";
                    finalResult = 0;
                }
                else
                    return;
            }
            else {
                equation = finalResult + text;
                equationDisplay.innerText = finalResult + convertOperatorToSymbol(text);
            }
            pressedEqualTo = false; // Resetting variable after the functionality of pressing equal to is finished
        }
        else {
            // Condition when equal to was not pressed, simply continue appending the operators or numbers with the equation
            equation += text;
            equationDisplay.innerText += convertOperatorToSymbol(text);
        }
    }
    else {
        // Condition when a number was entered
        if(pressedEqualTo) {
            // To replace the old equation with the newly typed number after equal to is pressed
            equation = text;
            equationDisplay.innerText = text;
            resultDisplay.innerText = "0";
            finalResult = 0;
            pressedEqualTo = false; // Resetting variable after the functionality of pressing equal to is finished
        }
        else {
            equation += text;
            equationDisplay.innerText += convertOperatorToSymbol(text);
        }
    }
}

// Scrolls the equation automatically on each valid keydown or on clicking buttons
function autoScroll() {
    setTimeout(() => {
        if (equationDisplay.scrollLeft !== equationDisplay.scrollWidth) {
            equationDisplay.scrollTo(equationDisplay.scrollLeft + 20, 0);
        }
    }, 10)
}

//For clearing the display
function erase() {
    equation = "";
    equationDisplay.innerText = equation;
    resultDisplay.innerText = "0";
    pressedEqualTo = false;
    finalResult = 0;
}

//For deleting character by character
function del() {
    equation = equation.substring(0, equation.length - 1);
    equationDisplay.innerText = equationDisplay.innerText.substring(0, equationDisplay.innerText.length - 1);
    pressedEqualTo = false;
    finalResult = false;
    if (equationDisplay.innerText.length === 0) {
        // To reset display when there is no equation
        resultDisplay.innerText = "0";
    }
}

//For getting operator precedence
function getPrecedence(operator) {
    if (operator === "+" || operator === "-")
        return 1;
    else if (operator === "*" || operator === "/" || operator === "%")
        return 2;
    else if (operator === "^")
        return 3;
}

//For computing the expression
function operate(exp1, exp2, op) {
    switch (op) {
        case "-":
            return exp1 - exp2;
        case "+":
            return exp1 + exp2;
        case "*":
            return exp1 * exp2;
        case "/":
            if (exp2 != 0)
                return exp1 / exp2;
            else {
                resultDisplay.innerText = "Undefined";
                return null;
            }
        case "%":
            if (exp2 != 0)
                return exp1 % exp2;
            else {
                resultDisplay.innerText = "Undefined";
                return null;
            }
        case "^":
            return Math.pow(exp1, exp2);
    }
}

// Counts number of opening and closing brackets
function countBrackets(te) {
    let openingBrackets = 0;
    let closingBrackets = 0;
    for (let ch in te) {
        if (te[ch] === "(")
            openingBrackets++;

        else if (te[ch] === ")")
            closingBrackets++;
    }
    return [openingBrackets, closingBrackets];
}

// Checks if there are equal number of opening and closing brackets or not. This function is executed when equal to is pressed, i.e. when evaluate() is called
function checkBalancedBrackets(te) {
    let res = countBrackets(te);
    if (res[0] != res[1])
        return false;

    return true;
}

//For converting the expression shown on the display to postfix expression for calculation
function convertToPostfix() {
    let te = "(" + equation + ")";
    let postfix = [];
    let opstack = new Stack();
    let temp = "";
    
    // If brackets are not balanced avoid converting to postfix
    if (!checkBalancedBrackets(te))
        return null;

    for (let ch in te) {
        if (nums.indexOf(te[ch]) != -1) {
            // To continue appending the numbers to the string
            temp += te[ch];
        }
        else if (te[ch] === "(") {
            if (temp.length != 0) {
                // To store the number inside postfix array
                postfix.push(+temp);
                temp = "";
            }
            opstack.add(te[ch]);    // Inserting opening bracket to the operator stack for detecting the end of expression later on
        }
        else if (te[ch] === ")") {
            if (temp.length != 0) {
                // To store the number inside postfix array
                postfix.push(+temp);
                temp = "";
            }

            // Insert all the operators into postfix array until opening bracket is found at the top of operator stack
            while (opstack.peek() != "(") {
                postfix.push(opstack.remove());
            }
            let z = opstack.remove();   // Removing the opening bracket from the operator stack that was added when it was found (Refer line 270)
        }
        else {
            // Condition when the character is an operator
            if (temp.length != 0) {
                // To store the number inside postfix array
                postfix.push(+temp);
                temp = "";
            }

            if(te[ch] === "-" && te[ch-1] === "(") {
                // To allow negative numbers after opening brackets in the equation
                temp += te[ch];
                continue;
                // Skipping remaining statements to take minus operator here as part of negative number. Otherwise minus will be considered as regular subtraction.
            }

            // Inserting all the operators to postfix array until the current operator has higher precedence than the the one in the top of the operator stack OR till opening bracket is found at the top of the operator stack
            while (opstack.items.length != 0 && opstack.peek() != "(" && getPrecedence(opstack.peek()) >= getPrecedence(te[ch])) {
                postfix.push(opstack.remove());
            }

            // After inserting higher precedence operators to postfix array, inserting current operator to operator stack
            opstack.add(te[ch]);
        }
    }
    return postfix;
}

// Evaluates the above converted postfix expression
function evaluate() {
    pressedEqualTo = true;
    let postfix = convertToPostfix();

    // When the equation is not valid
    if (postfix === null) {
        resultDisplay.innerText = "Error";
        return;
    }

    let resultStack = new Stack();
    for (let i in postfix) {
        // Checking whether the current element is either a number or a fraction
        let temp = postfix[i].toString();
        let t = temp[temp.length - 1];
        if (Number.isInteger(postfix[i]) || (postfix[i] % 1 != 0 && operators.indexOf(t) === -1)) {
            resultStack.add(postfix[i]);
        }
        else {
            let expr2 = resultStack.remove();
            let expr1 = resultStack.remove();
            finalResult = operate(expr1, expr2, postfix[i]);
            if (finalResult === null)
                return;
            resultStack.add(finalResult);
        }
    }
    finalResult = Math.round(finalResult * 1000000) / 1000000; //Rounding off to 6 decimal places
    if (finalResult != null)
        resultDisplay.innerText = finalResult;
}

let numberButtons = document.querySelectorAll("[data-number]");
let operatorButtons = document.querySelectorAll("[data-operator]");

numberButtons.forEach((number) => number.addEventListener("click", () => {
    display(number.getAttribute("data-number"));
    autoScroll();
}));

operatorButtons.forEach((operator) => operator.addEventListener("click", () => {
    display(operator.getAttribute("data-operator"));
    autoScroll();
}));

document.querySelector(".equalto").addEventListener("click", evaluate);

window.addEventListener("keydown", (e) => {
    let isValid = validateKeyPress(e.key);
    if (isValid) {
        autoScroll();
    }
});