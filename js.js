// =========================================================================
// 1. THE BRAIN (GLOBAL MEMORY BOXES)
// =========================================================================
let num1 = 0;          // Box 1: Holds our first ingredient
let sign = '';         // Box 2: Holds our cooking method (+, -, *, /)
let num2 = 0;          // Box 3: Holds our second ingredient
let currentInput = ''; // The temporary bowl where typed digits pool together
let isFinalResult = false;
// =========================================================================
// 2. THE KITCHEN APPLIANCES (MATH FUNCTIONS)
// =========================================================================
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(c, a, b) {
    if(c === '+') {
        return add(a, b);
    } else if(c === '-') {
        return subtract(a, b);
    } else if(c === '*') {
        return multiply(a, b);
    } else if(c === '/') {
        return divide(a, b);
    }
}

// =========================================================================
// 3. THE DOM INTERFACE (THE CALCULATOR BUTTONS & DISPLAY SCREEN)
// =========================================================================
const display = document.querySelector('#display');
const btnContainer = document.querySelector('#btn-container');

// =========================================================================
// 4. THE EVENT CONTROLLER (THE ENGINE ROOM)
// =========================================================================

function handleDigit(digit){

    // DOOR 1: USER CLICKS A DIGIT (0-9)
    
        // Collect digits into the temporary bowl and show them on screen
          
        if(isFinalResult === true) {
            currentInput = '';
            num1 = 0;
            num2 = 0;
            sign =  '';
            display.value = '';
            isFinalResult = false;
        } 
    currentInput += digit;
        if(sign === '') {
            display.value = currentInput;
        } else {
            display.value = Number(num1) + sign + currentInput;
        }
    }
      
function handledots() {
    
             if(isFinalResult === true) {
            currentInput = '';
            num1 = 0;
            num2 = 0;
            sign =  '';
            display.value = '';
            isFinalResult = false;
        } 
        if(!currentInput.includes('.')) {
            currentInput += '.';
            display.value = num1 + sign + currentInput;
        }
        }

        

function handleoperators(operator) {
    
        if(isFinalResult === true) {
            isFinalResult = false; 
        }
        // Check if we ALREADY have an active cooking method stored
        if (sign !== '') {
           
            // Check the temporary bowl. If it holds a typed number, we can chain-calculate!
            if (currentInput !== '') {
                num2 = Number(currentInput); 
                
                // CRIME CHECK: Block division by zero before it ruins the total
                if (num2 === 0 && sign === '/') {
                    display.value = 'error';
                    // Reset all variables immediately to clear the state
                    currentInput = ''; num1 = 0; num2 = 0; sign = '';
                    return; // Abort the whole function right here
                } else {
                    // Safe! Run the operation and store the total inside num1
                    const finall = operate(sign, num1, num2);
                   num1 = finall; 
                }
            } 
            // If currentInput was empty (''), they hit consecutive operators (e.g., 2 + *).
            // The math block above gets skipped completely. No ghost calculations!
        }
        else {
            // No previous method found. This is the very first operator click.
            // Move our typed value out of the temporary bowl and lock it into num1.
           if(currentInput !== '') {
            num1 = Number(currentInput);
            
        }}

        // GLOBAL OPERATOR REFRESH:
        // Set the active sign to the button that was just clicked.
        sign = operator;
        
        // Rebuild the screen directly using the ground-truth values in memory.
        // This overwrites consecutive clicks instantly (turning "2+" into "2*").
        display.value =  num1 + sign; 
        
        // Empty the temporary bowl so the next number clicked starts completely fresh.
        currentInput = '';
        
    } 

function handleequalsign() {
     
        // Only fire if the user provided an active operator and typed a second number
        if (currentInput !== '' && sign !== '') {
            num2 = Number(currentInput);
            
            // CRIME CHECK: Block final division by zero
            if (num2 === 0 && sign === '/') {
                display.value = 'error';
                currentInput = ''; num1 = 0; num2 = 0; sign = '';
            } else {
                // Compute the final result and render it to the user
                const final = operate(sign, num1, num2);
                display.value = final;
                
                // Set the result as num1 in case they want to immediately hit an operator next
                num1 = final;
                sign = '';    // Clear the sign variable since this specific calculation is finished
                currentInput = '';
                isFinalResult = true;
            }
        }
    } 

function handleclear() {
    
        // Completely sweep the kitchen. Reinitialize all state data to factory default.
        currentInput = '';
        num1 = 0;
        num2 = 0;
        sign = '';
        display.value = '';
    } 

function backspace() {
    
        if(isFinalResult === true) {
            return;
        }
        else if(currentInput !== '') {
            currentInput = currentInput.slice(0, -1);
            display.value =  num1 + sign + currentInput ;
        } else if (currentInput === '' && sign !== '') {
            sign = '';
            currentInput = String(num1);
            num1 = 0;
            display.value =  currentInput + sign;
        }
    } 

    btnContainer.addEventListener('click', (event) => {
    const target = event.target;

    // 1. Digits (0-9)
    if (target.classList.contains('digit')) {
        handleDigit(target.textContent); // Passes the raw string like "5"
    } 
    // 2. Decimal Point (.)
    else if (target.classList.contains('dot')) {
        handledots();
    }
    // 3. Operators (+, -, *, /)
    else if (target.classList.contains('operator')) {
        handleoperators(target.textContent); // Passes the raw operator symbol
    }
    // 4. Equals (=)
    else if (target.classList.contains('equal-sign')) {
        handleequalsign();
    }
    // 5. Clear (C)
    else if (target.classList.contains('clear')) {
        handleclear();
    }
    // 6. Backspace
    else if (target.classList.contains('backSpace')) {
        backspace();
    }
});

window.addEventListener('keydown', (event) => {
    const key = event.key;

    // 1. Match Digits (0-9)
    if (key >= '0' && key <= '9') {
        event.preventDefault(); // Prevents default browser shortcut glitches
        handleDigit(key);       // Passes the typed number string
    } 
    
    // 2. Match Decimals / Dots (.)
    else if (key === '.') {
        event.preventDefault();
        handledots();
    }
    
    // 3. Match Operators (+, -, *, /)
    else if (key === '+' || key === '-' || key === '*' || key === '/') {
        event.preventDefault();
        handleoperators(key);   // Passes the typed math operator
    }
    
    // 4. Match Equal Sign (= or Enter Key)
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleequalsign();
    }
    
    // 5. Match Clear (Escape / Esc Key)
    else if (key === 'Escape') {
        event.preventDefault();
        handleclear();
    }
    
    // 6. Match Backspace
    else if (key === 'Backspace') {
        event.preventDefault(); // Stops the browser from navigating to the previous page
        backspace();
    }
});