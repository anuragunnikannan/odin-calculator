class Stack {
    constructor() {
        this.items = [];
    }

    add(element) {
        this.items.push(element);
    }

    remove() {
        if(this.items.length != 0) {
            return this.items.pop();
        }
        else {
            return null;
        }
    }

    peek() {
        if(this.items.length != 0) {
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
    }
}

//Checks whether the last entered number already has a decimal point or not
function hasDecimalPoint() {
    for(let i = equation.length - 1; i >= 0; i--) {
        if(operators.indexOf(equation[i]) != -1) {
            return false;
        }
        else if(equation[i] === ".") {
            return true;
        }
    }
}

//Displays the currently typed equation and converts signs like × and ÷ to * and / respectively for calculation.
function display(text) {
    let c = equation.charAt(equation.length - 1);
    if (operators.indexOf(c) != -1 && operators.indexOf(text) != -1) {
        return;
    }
    else if(hasDecimalPoint() == true && text === ".") {
        return;
    }
    else if (operators.indexOf(text) != -1) {
        equation += text;
        if (text === "*")
            d.innerText += "×";
        else if (text === "/")
            d.innerText += "÷";
        else
            d.innerText += text;
    }
    else {
        equation += text;
        d.innerText += text;
    }
}

//For clearing the display
function erase() {
    equation = "";
    d.innerText = equation;
    document.querySelector(".result").innerText = "0";
}

//For deleting character by character
function del() {
    equation = equation.substring(0, equation.length - 1);
    d.innerText = d.innerText.substring(0, d.innerText.length - 1);
}

//For getting operator precedence
function getPrecedence(operator) {
    if(operator === "+" || operator === "-")
        return 1;
    else if(operator === "*" || operator === "/")
        return 2;
}

//For computing the expression
function operate(exp1, exp2, op) {
    switch(op) {
        case "-":
            return exp1 - exp2;
        case "+":
            return exp1 + exp2;
        case "*":
            return exp1 * exp2;
        case "/":
            if(exp2 != 0)
                return exp1 / exp2;
            else {
                document.querySelector(".result").innerText = "∞";
                return null;
            }
    }
}

//For converting the expression shown on the display to postfix expression for calculation
function convertToPostfix() {
    let postfix = [];
    let opstack = new Stack();
    let temp = "";
    for(ch in equation) {
        if(nums.indexOf(equation[ch]) != -1) {
            temp += equation[ch];
        }
        else if(operators.indexOf(equation[ch]) != -1) {
            postfix.push(+temp);
            temp = "";
            if(opstack.peek() == null) {
                opstack.add(equation[ch]);
            }
            else {
                let lastOperatorPrecedence = getPrecedence(opstack.peek());
                let currentOperatorPrecedence = getPrecedence(equation[ch]);
                if(currentOperatorPrecedence > lastOperatorPrecedence) {
                    opstack.add(equation[ch]);
                }
                else {
                    while(currentOperatorPrecedence <= lastOperatorPrecedence) {
                        let op = opstack.remove();
                        postfix.push(op);
                        let lastOperator = opstack.peek();
                        if(lastOperator != null) {
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
    while(opstack.items.length != 0) {
        let op = opstack.remove();
        postfix.push(op);
    }
    console.log(postfix);
    return postfix;
}

//Evaluates the above converted postfix expression
function evaluate() {
    let postfix = convertToPostfix();
    let resultStack = new Stack();
    let res = 0;
    for(let i in postfix) {
        if(Number.isInteger(postfix[i]) || operators.indexOf(postfix[i]) == -1) {
            resultStack.add(postfix[i]);
        }
        else {
            let expr2 = resultStack.remove();
            let expr1 = resultStack.remove();
            res = operate(expr1, expr2, postfix[i]);
            if(res == null)
                return;
            resultStack.add(res);
        }
    }
    res = Math.round(res * 1000000) / 1000000; //Rounding off to 6 decimal places
    if(res != null)
        document.querySelector(".result").innerText = res;
}

let numberButtons = document.querySelectorAll("[data-number]");
let operatorButtons = document.querySelectorAll("[data-operator]");
numberButtons.forEach((number) => number.addEventListener("click", () => display(number.getAttribute("data-number"))));
operatorButtons.forEach((operator) => operator.addEventListener("click", () => display(operator.getAttribute("data-operator"))));
document.querySelector(".equalto").addEventListener("click", evaluate);

window.addEventListener("keydown", (e) => validateKeyPress(e.key));