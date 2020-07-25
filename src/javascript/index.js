import 'normalize.css';
import '../sass/styles.scss';

/**=================== INITIALIZE ===================**/

const START_WEEKDAY = 2;  // Sun-0, Mon-1, Tue-2, Wed-3, Thu-4, Fri-5, Sat-6
const DAYS_TO_DISPLAY = 42;
const today = new Date();

let daysInPrevMonth = [];
let daysInCurrentMonth = [];
let daysInNextMonth = [];

/**=================== GENERATE DAYS ===================**/

let currentDate = new Date();

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

// console.log(firstDayPrevMonth, numOfDaysPrevMonth, daysInPrevMonth);
// console.log(firstDayCurrentMonth, numOfDaysCurrentMonth, daysInCurrentMonth);
// console.log(firstDayNextMonth, numOfDaysNextMonth, daysInNextMonth);

/**=================== RENDER WEEKDAYS ===================**/

const calendarWeekdays = document.querySelector('.calendar__weekdays');

const WEEKDAYS_1_CHAR = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

for(let i = 0; i < 7; i++) {
  calendarWeekdays.innerHTML += `
    <div class="calendar__weekday">${WEEKDAYS_1_CHAR[(i + START_WEEKDAY) % 7]}</div>
  `;
}

/**=================== RENDER DAYS ===================**/

const calendarDays = document.querySelector('.calendar__days');

let insertCount = 0;

// Weekday Offset calculation
let dayOffset;
if(firstDayCurrentMonth < START_WEEKDAY) {
  dayOffset =  7 + (firstDayCurrentMonth - START_WEEKDAY);
} else {
  dayOffset = firstDayCurrentMonth - START_WEEKDAY;
}

// Prev Month
for(let i = 0; i < dayOffset; i++) {
  calendarDays.innerHTML += `
    <div class="calendar_day calendar_day-other">${daysInPrevMonth[daysInPrevMonth.length - dayOffset + i].day}</div>
  `;
  insertCount++;
}

// Current Month
daysInCurrentMonth.forEach(day => {
  calendarDays.innerHTML += `
    <div class="calendar_day ${day.day == today.getDate() ? 'calendar_day-today' : ''}">${day.day}</div>
  `;
  insertCount++;
});

// Next Month
for(let i = 0; i < DAYS_TO_DISPLAY - insertCount; i++) {
  calendarDays.innerHTML += `
    <div class="calendar_day calendar_day-other">${daysInNextMonth[i].day}</div>
  `;
}
