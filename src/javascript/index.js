import 'normalize.css';
import '../sass/styles.scss';

/**=================== INITIALIZE ===================**/

const START_WEEKDAY = 0;  // Sun-0, Mon-1, Tue-2, Wed-3, Thu-4, Fri-5, Sat-6
const DAYS_TO_DISPLAY = 42;
const today = new Date();

let daysIn_PrevMonth = [];
let daysIn_CurrentMonth = [];
let daysIn_NextMonth = [];

/**=================== GENERATE DAYS ===================**/

let currentDate = new Date();

// Previous Month
let firstDay_PrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).getDay();
let numOfDays_PrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
for (let i = 0; i < numOfDays_PrevMonth; i++) {
  daysIn_PrevMonth.push({ day: i + 1, selected: false });
}

// Current Month
let firstDay_CurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
let numOfDays_CurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
for (let i = 0; i < numOfDays_CurrentMonth; i++) {
  daysIn_CurrentMonth.push({ day: i + 1, selected: false });
}

// Next Month
let firstDay_NextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).getDay();
let numOfDays_NextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
for (let i = 0; i < numOfDays_NextMonth; i++) {
  daysIn_NextMonth.push({ day: i + 1, selected: false });
}

// console.log(firstDay_PrevMonth, numOfDays_PrevMonth, daysIn_PrevMonth);
// console.log(firstDay_CurrentMonth, numOfDays_CurrentMonth, daysIn_CurrentMonth);
// console.log(firstDay_NextMonth, numOfDays_NextMonth, daysIn_NextMonth);

/**=================== RENDER MONTH AND YEAR ===================**/

const calendarMonthYear = document.querySelector('.calendar__month');
calendarMonthYear.innerHTML = `
  ${new Intl.DateTimeFormat('default', {month: 'long'}).format(currentDate)} ${currentDate.getFullYear()}
`;

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
if(firstDay_CurrentMonth < START_WEEKDAY) {
  dayOffset =  7 + (firstDay_CurrentMonth - START_WEEKDAY);
} else {
  dayOffset = firstDay_CurrentMonth - START_WEEKDAY;
}

// Prev Month
for(let i = 0; i < dayOffset; i++) {
  calendarDays.innerHTML += `
    <div class="calendar_day calendar_day-other">${daysIn_PrevMonth[daysIn_PrevMonth.length - dayOffset + i].day}</div>
  `;
  insertCount++;
}

// Current Month
daysIn_CurrentMonth.forEach(day => {
  calendarDays.innerHTML += `
    <div class="calendar_day ${day.day == today.getDate() ? 'calendar_day-today' : ''}">${day.day}</div>
  `;
  insertCount++;
});

// Next Month
for(let i = 0; i < DAYS_TO_DISPLAY - insertCount; i++) {
  calendarDays.innerHTML += `
    <div class="calendar_day calendar_day-other">${daysIn_NextMonth[i].day}</div>
  `;
}
