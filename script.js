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
            return this.items[0];
        }
        else {
            return null;
        }
    }
}

let equation = "";
let d = document.querySelector(".equation");
const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const operators = ["+", "-", "*", "/"];
let pressedEqualTo = false;
let finalResult = 0;

// Allows only number keys and '+', '-', '*', '/', '.'
function validateKeyPress(key) {
    if (nums.indexOf(key) != -1 || operators.indexOf(key) != -1) {
        display(key);
    }
    else if (key === "Backspace") {
        del();
    }
    else if (key === "=" || key === "Enter") {
        let res = evaluate();
        pressedEqualTo = true;
    }
}

//Checks whether the last entered number already has a decimal point or not
function hasDecimalPoint() {
    for (let i = equation.length - 1; i >= 0; i--) {
        if (operators.indexOf(equation[i]) != -1) {
            return false;
        }
        else if (equation[i] === ".") {
            return true;
        }
    }
}

function convertOperatorToSymbol(text) {
    if(text === "*")
        return "×";
    else if(text === "/")
        return "÷";
    else
        return text;
}

// Displays the currently typed equation and converts signs like × and ÷ to * and / respectively for calculation.
function display(text) {
    let lastCharacter = equation.charAt(equation.length - 1);

    if(equation.length == 0 && (text === "+" || text === "*" || text === "/")) {
        // To allow only '-' and '.' at the beginning of the equation
        return;
    }
    else if (operators.indexOf(lastCharacter) != -1 && operators.indexOf(text) != -1) {
        // To avoid scenario like for e.g. 2+/3
        return;
    }
    else if (hasDecimalPoint() == true && text === ".") {
        // To allow only one decimal point in a number
        return;
    }
    else if (operators.indexOf(text) != -1) {
        // Condition when operator usage is valid
        if (pressedEqualTo) {
            // To replace the old equation with the last result (finalResult) when equal to is pressed at least once
            if(document.querySelector(".result").innerText == "Undefined") {
                // If result has undefined, then reset the equation and final result
                equation = text;
                d.innerText = text;
                document.querySelector(".result").innerText = "0";
                finalResult = 0;
                pressedEqualTo = false;
            }
            equation = finalResult + text;
            d.innerText = finalResult + convertOperatorToSymbol(text);
        }
        else {
            // Condition when equal to was not pressed
            equation += text;
            d.innerText += convertOperatorToSymbol(text);
        }
    }
    else {
        // Condition when a number was entered
        if(document.querySelector(".result").innerText == "Undefined") {
            // If result has undefined, then reset the equation and final result
            equation = "";
            d.innerText = "";
            document.querySelector(".result").innerText = "0";
            finalResult = 0;
            pressedEqualTo = false;
        }
        equation += text;
        d.innerText += text;
    }
}

//For clearing the display
function erase() {
    equation = "";
    d.innerText = equation;
    document.querySelector(".result").innerText = "0";
    pressedEqualTo = false;
    finalResult = 0;
}

//For deleting character by character
function del() {
    equation = equation.substring(0, equation.length - 1);
    d.innerText = d.innerText.substring(0, d.innerText.length - 1);
    pressedEqualTo = false;
    finalResult = false;
}

//For getting operator precedence
function getPrecedence(operator) {
    if (operator === "+" || operator === "-")
        return 1;
    else if (operator === "*" || operator === "/")
        return 2;
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
                document.querySelector(".result").innerText = "Undefined";
                return null;
            }
    }
}

//For converting the expression shown on the display to postfix expression for calculation
function convertToPostfix() {
    let postfix = [];
    let opstack = new Stack();
    let temp = "";
    for (ch in equation) {
        if (nums.indexOf(equation[ch]) != -1) {
            temp += equation[ch];
        }
        else if (operators.indexOf(equation[ch]) != -1) {
            postfix.push(+temp);
            temp = "";
            if (opstack.peek() == null) {
                opstack.add(equation[ch]);
            }
            else {
                let lastOperatorPrecedence = getPrecedence(opstack.peek());
                let currentOperatorPrecedence = getPrecedence(equation[ch]);
                if (currentOperatorPrecedence > lastOperatorPrecedence) {
                    opstack.add(equation[ch]);
                }
                else {
                    while (currentOperatorPrecedence <= lastOperatorPrecedence) {
                        let op = opstack.remove();
                        postfix.push(op);
                        let lastOperator = opstack.peek();
                        if (lastOperator != null) {
                            lastOperatorPrecedence = getPrecedence(lastOperator);
                        }
                        else
                            break;
                    }
                    opstack.add(equation[ch]);
                }
            }
        }
    }
    postfix.push(+temp);
    while (opstack.items.length != 0) {
        let op = opstack.remove();
        postfix.push(op);
    }
    return postfix;
}

//Evaluates the above converted postfix expression
function evaluate() {
    let postfix = convertToPostfix();
    let resultStack = new Stack();
    for (let i in postfix) {
        if (Number.isInteger(postfix[i]) || operators.indexOf(postfix[i]) == -1) {
            resultStack.add(postfix[i]);
        }
        else {
            let expr2 = resultStack.remove();
            let expr1 = resultStack.remove();
            finalResult = operate(expr1, expr2, postfix[i]);
            if (finalResult == null)
                return;
            resultStack.add(finalResult);
        }
    }
    finalResult = Math.round(finalResult * 1000000) / 1000000; //Rounding off to 6 decimal places
    if (finalResult != null)
        document.querySelector(".result").innerText = finalResult;
}

let numberButtons = document.querySelectorAll("[data-number]");
let operatorButtons = document.querySelectorAll("[data-operator]");
numberButtons.forEach((number) => number.addEventListener("click", () => display(number.getAttribute("data-number"))));
operatorButtons.forEach((operator) => operator.addEventListener("click", () => display(operator.getAttribute("data-operator"))));
document.querySelector(".equalto").addEventListener("click", evaluate);

window.addEventListener("keydown", (e) => validateKeyPress(e.key));