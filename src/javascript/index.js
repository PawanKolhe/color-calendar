import 'normalize.css';
import '../sass/styles.scss';

/**=================== INITIALIZE ===================**/

const currentDate = new Date();
console.log('Today: ', currentDate);

let daysInPrevMonth = [];
let daysInCurrentMonth = [];
let daysInNextMonth = [];

/**=================== GENERATE DAYS ===================**/

// Previous Month
let firstDayPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).getDay();
let numOfDaysPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
for (let i = 0; i < numOfDaysPrevMonth; i++) {
  daysInPrevMonth.push({ day: i + 1, selected: false });
}

// Current Month
let firstDayCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
let numOfDaysCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
for (let i = 0; i < numOfDaysCurrentMonth; i++) {
  daysInCurrentMonth.push({ day: i + 1, selected: false });
}

// Next Month
let firstDayNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).getDay();
let numOfDaysNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
for (let i = 0; i < numOfDaysNextMonth; i++) {
  daysInNextMonth.push({ day: i + 1, selected: false });
}

console.log(firstDayPrevMonth, numOfDaysPrevMonth, daysInPrevMonth);
console.log(firstDayCurrentMonth, numOfDaysCurrentMonth, daysInCurrentMonth);
console.log(firstDayNextMonth, numOfDaysNextMonth, daysInNextMonth);

/**=================== RENDER ===================**/

const calendarDays = document.querySelector('.calendar__days');

/**
 * Current Month days
 */

let insertCount = 0;

// Prev Month
for(let i = 0; i < firstDayCurrentMonth; i++) {
  calendarDays.innerHTML += `
    <div class="calendar_day color-light">${daysInPrevMonth[daysInPrevMonth.length - firstDayCurrentMonth + i].day}</div>
  `;
  insertCount++;
}

// Current Month
daysInCurrentMonth.forEach(day => {
  calendarDays.innerHTML += `
    <div class="calendar_day">${day.day}</div>
  `;
  insertCount++;
});

// Next Month
for(let i = 0; i < 42 - insertCount; i++) {
  calendarDays.innerHTML += `
    <div class="calendar_day color-light">${daysInNextMonth[i].day}</div>
  `;
}
