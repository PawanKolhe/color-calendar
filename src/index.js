export class Calendar {

  constructor({ 
    id = '#calendar',
    startWeekday = 0,
    weekdayType = 'short',
    monthDisplayType = 'long',
    color = '#3F51B5',
    fontFamily1 = '"Work Sans", sans-serif',
    fontFamily2 = 'Comfortaa, sans-serif',
    dropShadow = true,
    border = true,
    theme = 'default',
  } = {}) {
    this.monthDisplayType = monthDisplayType;
    this.DAYS_TO_DISPLAY = 42;
    switch(weekdayType) {
      case 'long':
        this.WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        break;
      case 'long-lower':
        this.WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        break;
      default:
        this.WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    }
    this.id = id;
    this.START_WEEKDAY = startWeekday;  // 0 (Sun), 1 (Mon), 2 (Tues), 3 (Wed), 4 (Thurs), 5 (Fri), 6 (Sat)

    this.theme = theme;
    this.color = color;
    this.fontFamily1 = fontFamily1;
    this.fontFamily2 = fontFamily2;
    this.dropShadow = dropShadow;
    this.border = border;

    this.today = new Date();
    this.currentDate = new Date();

    this.clearCalendarDays();
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
      <div class="calendar default ${this.theme}">
        <div class="calendar__header">
          <div class="calendar__arrow calendar__arrow-prev"><div class="calendar__arrow-inner"></div></div>
          <div class="calendar__month"></div>
          <div class="calendar__arrow calendar__arrow-next"><div class="calendar__arrow-inner"></div></div>
        </div>
        <div class="calendar__body">
          <div class="calendar__weekdays"></div>
          <div class="calendar__days"></div>
        </div>
      </div>
    `;

    /** Configure calendar style preferences */
    // let root = document.documentElement;
    let root = document.querySelector(`${this.id} .calendar`);
    root.style.setProperty('--cal-color-primary', this.color);
    root.style.setProperty('--cal-font-family-1', this.fontFamily1);
    root.style.setProperty('--cal-font-family-2', this.fontFamily2);
    if(!this.dropShadow) {
      root.style.setProperty('--cal-drop-shadow', 'none');
    }
    if(!this.border) {
      root.style.setProperty('--cal-border', 'none');
    }

    this.calendarMonthYear = document.querySelector(`${this.id} .calendar__month`);
    this.calendarWeekdays = document.querySelector(`${this.id} .calendar__weekdays`);
    this.calendarDays = document.querySelector(`${this.id} .calendar__days`);
    this.prevButton = document.querySelector(`${this.id} .calendar__arrow-prev .calendar__arrow-inner`);
    this.nextButton = document.querySelector(`${this.id} .calendar__arrow-next .calendar__arrow-inner`);
    this.prevButton.addEventListener('click', this.handlePrevMonthButtonClick.bind(this));
    this.nextButton.addEventListener('click', this.handleNextMonthButtonClick.bind(this));
  }

  /** Clear day values */
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

  resetCurrentDate() {
    this.updateCurrentDate(0);
  }

  /**
   *  0 - Reset to today month
   * -1 - Go to previous month
   *  1 - Go to next month
   * @param {number} offset - Months to go backward or forward
   */
  updateCurrentDate(offset) {
    this.currentDate = new Date(this.currentDate.getFullYear(), offset === 0 ? this.today.getMonth() : this.currentDate.getMonth() + offset, 1);
    this.updateCalendar();
  }

  /** Update Month and Year HTML */
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

  /** Compute the day values in current month, and previous month number of days */
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

  /** Render days */
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
