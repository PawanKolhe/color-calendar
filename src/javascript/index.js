import 'normalize.css';
import '../sass/styles.scss';
import '../sass/calendar.scss';

import '@iconscout/unicons/css/unicons.css'

class Calendar {

  constructor({ id = '#calendar', startWeekday = 0, weekdayType = 'short', monthDisplayType = 'long', color = '#3F51B5' }) {
    this.monthDisplayType = monthDisplayType;
    this.DAYS_TO_DISPLAY = 42;
    switch(weekdayType) {
      case 'long':
        this.WEEKDAYS = ['SUN', 'MON', 'THU', 'WED', 'TUE', 'FRI', 'SAT'];
      default:
        this.WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    }
    this.WEEKDAYS = weekdayType === 'short' ? 
      ['S', 'M', 'T', 'W', 'T', 'F', 'S'] : 
      ['SUN', 'MON', 'THU', 'WED', 'TUE', 'FRI', 'SAT'];
    this.id = id;
    this.START_WEEKDAY = startWeekday;  // 0 (Sun), 1 (Mon), 2 (Tues), 3 (Wed), 4 (Thurs), 5 (Fri), 6 (Sat)
    this.color = color;
    
    // Set calendar color
    let root = document.documentElement;
    root.style.setProperty('--calendar-color-primary', this.color);

    this.today = new Date();
    this.currentDate = new Date();

    this.daysIn_PrevMonth = [];
    this.daysIn_CurrentMonth = [];
    this.daysIn_NextMonth = [];

    this.resetCalendar();
  }

  resetCalendar() {
    this.initializeLayout();
    this.updateMonthYear();
    this.generateWeekdays();
    this.generateDays();
    this.renderDays();
  }
  
  initializeLayout() {
    this.calendar = document.querySelector(this.id);
    this.calendar.innerHTML = `
      <div class="calendar">
        <div class="calendar__header">
          <div class="calendar__arrow calendar__arrow-prev"><i class="uil uil-angle-left-b"></i></div>
          <div class="calendar__month"></div>
          <div class="calendar__arrow calendar__arrow-next"><i class="uil uil-angle-right-b"></i></div>
        </div>
        <div class="calendar__body">
          <div class="calendar__weekdays"></div>
          <div class="calendar__days"></div>
        </div>
      </div>
    `;
    this.calendarMonthYear = document.querySelector(`${this.id} .calendar__month`);
    this.calendarWeekdays = document.querySelector(`${this.id} .calendar__weekdays`);
    this.calendarDays = document.querySelector(`${this.id} .calendar__days`);
    this.prevButton = document.querySelector(`${this.id} .calendar__arrow-prev`);
    this.nextButton = document.querySelector(`${this.id} .calendar__arrow-next`);
    this.prevButton.addEventListener('click', this.handlePrevMonthButtonClick.bind(this));
    this.nextButton.addEventListener('click', this.handleNextMonthButtonClick.bind(this));
  }

  clearCalendarDays() {
    this.daysIn_PrevMonth = [];
    this.daysIn_CurrentMonth = [];
    this.daysIn_NextMonth = [];
  }

  updateCalendar() {
    this.clearCalendarDays();

    this.updateMonthYear();
    this.generateDays();
    this.renderDays();
  }

  handlePrevMonthButtonClick() {
    this.updateCurrentDate(-1);
  }

  handleNextMonthButtonClick() {
    this.updateCurrentDate(1);
  }

  updateCurrentDate(offset) {
    this.currentDate = new Date(this.currentDate.getFullYear(), offset === 0 ? this.today.getMonth() : this.currentDate.getMonth() + offset, 1);
    this.updateCalendar();
  }

  updateMonthYear() {
    this.calendarMonthYear.innerHTML = `
      ${new Intl.DateTimeFormat('default', {month: this.monthDisplayType}).format(this.currentDate)} ${this.currentDate.getFullYear()}
    `;
  }

  generateWeekdays() {
    this.calendarWeekdays.innerHTML = '';
    for(let i = 0; i < 7; i++) {
      this.calendarWeekdays.innerHTML += `
        <div class="calendar__weekday">${this.WEEKDAYS[(i + this.START_WEEKDAY) % 7]}</div>
      `;
    }
  }

  generateDays() {
    // Previous Month
    // this.firstDay_PrevMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1).getDay();
    this.numOfDays_PrevMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0).getDate();
    // for (let i = 0; i < this.numOfDays_PrevMonth; i++) {
    //   this.daysIn_PrevMonth.push({ day: i + 1, selected: false });
    // }

    // Current Month
    this.firstDay_CurrentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
    this.numOfDays_CurrentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
    for (let i = 0; i < this.numOfDays_CurrentMonth; i++) {
      this.daysIn_CurrentMonth.push({ day: i + 1, selected: false });
    }

    // Next Month
    // this.firstDay_NextMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1).getDay();
    // this.numOfDays_NextMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0).getDate();
    // for (let i = 0; i < this.numOfDays_NextMonth; i++) {
    //   this.daysIn_NextMonth.push({ day: i + 1, selected: false });
    // }
  }

  renderDays() {
    this.calendarDays.innerHTML = '';
    let insertCount = 0;

    // Weekday Offset calculation
    let dayOffset;
    if(this.firstDay_CurrentMonth < this.START_WEEKDAY) {
      dayOffset =  7 + this.firstDay_CurrentMonth - this.START_WEEKDAY;
    } else {
      dayOffset = this.firstDay_CurrentMonth - this.START_WEEKDAY;
    }

    // Prev Month (Light)
    for(let i = 0; i < dayOffset; i++) {
      this.calendarDays.innerHTML += `
        <div class="calendar__day calendar__day-other">${this.numOfDays_PrevMonth + 1 - dayOffset + i}</div>
      `;
      insertCount++;
    }

    // Current Month
    let isTodayMonth = this.today.getMonth() === this.currentDate.getMonth();
    this.daysIn_CurrentMonth.forEach(day => {
      this.calendarDays.innerHTML += `
        <div class="calendar__day${isTodayMonth && day.day === this.today.getDate() ? ' calendar__day-today' : ''}">${day.day}</div>
      `;
      insertCount++;
    });

    // Next Month (Light)
    for(let i = 0; i < this.DAYS_TO_DISPLAY - insertCount; i++) {
      this.calendarDays.innerHTML += `
        <div class="calendar__day calendar__day-other">${i + 1}</div>
      `;
    }
  }

}

const options = {
  id: '#calendar',
  startWeekday: 0,
  weekdayType: 'short',
  monthDisplayType: 'long',
  color: 'green'
}
new Calendar(options);
