// Dynamic elements
const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdown-form');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

// Global variables
let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

// Set values in milliseconds
const second = 1000;
const minute = second * 60;
const hour = minute * 60
const day = hour * 24;

// Set date input minimum to today
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// Populate Countdown / Complete UI
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;
    
        // Work out remaining time till countdown date
        const days = Math.floor(distance/day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);

        // Hide Input
        inputContainer.hidden = true;

        // If the countdown has ended, show complete, else show countdown
        if (distance < 0){
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        }else {
            // Populate Countdown
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
    
            // Show Countdown
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }
    }, second);
}

// Takes Values from form
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;

    // create object for local storage
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };

    // convert object to JSON string to save to local storage
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));

    // No version of current date, update DOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
}

// Reset All Values
function reset (){
    // Hide countdowns, show Input
    completeEl.hidden = true;
    countdownEl.hidden = true;
    inputContainer.hidden = false;
    
    // Stop the countdown
    clearInterval(countdownActive);

    // Reset countdown values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

// Populates previous countdown if present
function restorePrevCountdown() {
    if (localStorage.getItem('countdown')){
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Event listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On Load
restorePrevCountdown();