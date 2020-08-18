export default class Calendar {
  constructor({
    id = "#calendar",
    weekdayType = "short",
    monthDisplayType = "long",
    eventsData = [],
    dayClicked = undefined,
    monthChanged = undefined,
    dateChanged = undefined,
    startWeekday = 0,
    theme = "basic",
    color = undefined,
    fontFamily1 = undefined,
    fontFamily2 = undefined,
    headerColor = undefined,
    headerBackgroundColor = undefined,
    dropShadow = true,
    border = true,
  } = {}) {
    this._calName = 'color-calendar';
    this.monthDisplayType = monthDisplayType;
    this.pickerType = null;
    this.DAYS_TO_DISPLAY = 42;
    switch (weekdayType) {
      case "long":
        this.WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        break;
      case "long-lower":
        this.WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        break;
      default:
        this.WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
    }
    this.id = id;
    this.START_WEEKDAY = startWeekday; // 0 (Sun), 1 (Mon), 2 (Tues), 3 (Wed), 4 (Thurs), 5 (Fri), 6 (Sat)
    this.eventsData = eventsData;
    this.eventDayMap = {};
    this.oldSelectedNode = null;
    this.filteredEventsThisMonth = null;
    this.dayClicked = dayClicked;
    this.monthChanged = monthChanged;
    this.dateChanged = dateChanged;

    this.theme = theme;
    this.color = color;
    this.fontFamily1 = fontFamily1;
    this.fontFamily2 = fontFamily2;
    this.dropShadow = dropShadow;
    this.border = border;
    this.headerColor = headerColor;
    this.headerBackgroundColor = headerBackgroundColor;

    this.today = new Date();
    this.currentDate = new Date();
    this.selectedDate = new Date();

    this.clearCalendarDays();
    this.resetCalendar();
  }

  resetCalendar() {
    this.initializeLayout();
    this.updateMonthYear();
    this.generateWeekdays();
    this.generateDays();
    this.selectDayInitial();
    this.renderDays();
    this.setOldSelectedNode();
  }

  initializeLayout() {
    this.calendar = document.querySelector(this.id);
    this.calendar.innerHTML = `
      <div class="${this._calName} ${this.theme}">
        <div class="calendar__header">
          <div class="calendar__arrow calendar__arrow-prev"><div class="calendar__arrow-inner"></div></div>
          <div class="calendar__monthyear"></div>
          <div class="calendar__arrow calendar__arrow-next"><div class="calendar__arrow-inner"></div></div>
        </div>
        <div class="calendar__body">
          <div class="calendar__weekdays"></div>
          <div class="calendar__days"></div>
          <div class="calendar__picker">
            <div class="calendar__picker-month">
              Month
            </div>
            <div class="calendar__picker-year">
              Year
            </div>
          </div>
        </div>
      </div>
    `;

    this.configureStylePreferences();

    this.calendarMonthYear = document.querySelector(`${this.id} .calendar__monthyear`);
    this.calendarWeekdays = document.querySelector(`${this.id} .calendar__weekdays`);
    this.calendarDays = document.querySelector(`${this.id} .calendar__days`);
    this.prevButton = document.querySelector(`${this.id} .calendar__arrow-prev .calendar__arrow-inner`);
    this.nextButton = document.querySelector(`${this.id} .calendar__arrow-next .calendar__arrow-inner`);
    this.pickerContainer = document.querySelector(`${this.id} .calendar__picker`);
    this.pickerMonthContainer = document.querySelector(`${this.id} .calendar__picker-month`);
    this.pickerYearContainer = document.querySelector(`${this.id} .calendar__picker-year`);
    this.togglePicker(false);
    this.monthyearDisplay = document.querySelector(`${this.id} .calendar__monthyear`);

    this.prevButton.addEventListener("click",
      this.handlePrevMonthButtonClick.bind(this)
    );
    this.nextButton.addEventListener("click",
      this.handleNextMonthButtonClick.bind(this)
    );
    this.monthyearDisplay.addEventListener("click",
      this.handleMonthYearDisplayClick.bind(this)
    );
    this.calendarDays.addEventListener("click",
      this.handleCalendarDayClick.bind(this)
    );
  }

  /** Configure calendar style preferences */
  configureStylePreferences() {
    // let root = document.documentElement;
    let root = document.querySelector(`${this.id} .${this._calName}`);
    if (this.color) {
      root.style.setProperty("--cal-color-primary", this.color);
    }
    if (this.fontFamily1) {
      root.style.setProperty("--cal-font-family-1", this.fontFamily1);
    }
    if (this.fontFamily2) {
      root.style.setProperty("--cal-font-family-2", this.fontFamily2);
    }
    if (!this.dropShadow) {
      root.style.setProperty("--cal-drop-shadow", "none");
    }
    if (!this.border) {
      root.style.setProperty("--cal-border", "none");
    }
    if(this.headerColor) {
      root.style.setProperty("--cal-header-color", this.headerColor);
    }
    if(this.headerBackgroundColor) {
      root.style.setProperty("--cal-header-background-color", this.headerBackgroundColor);
    }
  }

  /** Clear calendar day values */
  clearCalendarDays() {
    this.daysIn_PrevMonth = [];
    this.daysIn_CurrentMonth = [];
    this.daysIn_NextMonth = [];
  }

  updateCalendar(isMonthChanged) {
    if (isMonthChanged) {
      this.updateMonthYear();
      this.clearCalendarDays();
      this.generateDays();
      this.selectDayInitial();
    }
    this.renderDays();
    if (isMonthChanged) {
      this.setOldSelectedNode();
    }
  }

  setOldSelectedNode() {
    if(!this.oldSelectedNode) {
      let selectedNode;
      for(let i = 1; i < this.calendarDays.childNodes.length; i+=2) {
        let ele = this.calendarDays.childNodes[i];
        if(ele.classList && ele.classList.contains('calendar__day-active') && ele.innerText === this.currentDate.getDate().toString()){
          selectedNode = ele;
          break;
        }
      }
      this.oldSelectedNode = [selectedNode, parseInt(selectedNode.innerText)];
    }
  }

  selectDayInitial() {
    let isTodayMonth = this.today.getMonth() === this.currentDate.getMonth();
    let isTodayDay = this.today.getDate() === this.currentDate.getDate();
    if(isTodayMonth && isTodayDay) {
      this.daysIn_CurrentMonth[this.today.getDate() - 1].selected = true;
    } else {
      this.daysIn_CurrentMonth[0].selected = true;
    }
  }

  getEventsData() {
    return JSON.parse(JSON.stringify(this.eventsData));
  }

  /** Set new events data array */
  setEventsData(data) {
    this.eventsData = JSON.parse(JSON.stringify(data));
    this.updateCalendar();
    return this.eventsData;
  }

  /** Add events to existing events data array */
  addEventsData(newEvents) {
    const eventCount = this.eventsData.push(...newEvents);
    this.updateCalendar();
    return eventCount;
  }

  /** Invoked on month or year click */
  handleMonthYearDisplayClick(e) {
    console.log(e);
    // Filter out unwanted click events
    if (
      !(
        e.target.classList.contains("calendar__month") ||
        e.target.classList.contains("calendar__year")
      )
    ) {
      return;
    }

    // Set picker type
    if(e.target.classList.contains("calendar__month")) {
      this.pickerType = 'month';
      this.monthDisplay.style.opacity = '1';
      this.yearDisplay.style.opacity = '0.7';
      this.pickerMonthContainer.style.display = 'flex';
      this.pickerYearContainer.style.display = 'none';
    } else if(e.target.classList.contains("calendar__year")) {
      this.pickerType = 'year';
      this.monthDisplay.style.opacity = '0.7';
      this.yearDisplay.style.opacity = '1';
      this.pickerMonthContainer.style.display = 'none';
      this.pickerYearContainer.style.display = 'flex';
    }

    // Open picker
    this.togglePicker(true);
  }

  togglePicker(shouldOpen) {
    if(shouldOpen === true) {
      this.pickerContainer.style.visibility = 'visible';
      this.pickerContainer.style.opacity = '1';
    } else if(shouldOpen === false) {
      this.pickerContainer.style.visibility = 'hidden';
      this.pickerContainer.style.opacity = '0';
      if(this.monthDisplay && this.yearDisplay) {
        this.monthDisplay.style.opacity = '1';
        this.yearDisplay.style.opacity = '1';
      }
    } else {
      if(this.pickerContainer.style.visibility === 'hidden') {
        this.pickerContainer.style.visibility = 'visible';
        this.pickerContainer.style.opacity = '1';
      } else {
        this.pickerContainer.style.visibility = 'hidden';
        this.pickerContainer.style.opacity = '0';
        if(this.monthDisplay && this.yearDisplay) {
          this.monthDisplay.style.opacity = '1';
          this.yearDisplay.style.opacity = '1';
        }
      }
    }
  }

  /** Invoked on calendar day click */
  handleCalendarDayClick(e) {
    // Filter out unwanted click events
    if (
      !(
        e.target.classList.contains("calendar__day-box") ||
        e.target.classList.contains("calendar__day-text") ||
        e.target.classList.contains("calendar__day-box-today") ||
        e.target.classList.contains("calendar__day-bullet")
      ) ||
      e.target.parentElement.classList.contains("calendar__day-selected")
    ) {
      return;
    }

    // Error check for old selected node
    if (
      this.oldSelectedNode &&
      !this.oldSelectedNode[0].previousElementSibling
    ) {
      return;
    }

    // Find which day of the month is clicked
    let day;
    let dayNum;
    day = e.target.parentElement.innerText;
    dayNum = parseInt(day, 10);

    //Remove old day selection
    if (this.oldSelectedNode) {
      Object.assign(this.daysIn_CurrentMonth[this.oldSelectedNode[1] - 1], {
        selected: false,
      });
      this.rerenderSelectedDay(
        this.oldSelectedNode[0],
        this.oldSelectedNode[1]
      );
    }

    // Select clicked day
    if (day) {
      this.updateCurrentDate(0, dayNum);
      Object.assign(this.daysIn_CurrentMonth[dayNum - 1], { selected: true });
      this.rerenderSelectedDay(e.target.parentElement, dayNum, true);
      
      let filteredEventsThisDate = this.filteredEventsThisMonth.filter(
        (event) => {
          const start = new Date(event.start).getDate();
          const end = new Date(event.end).getDate();
          if (this.currentDate.getDate() >= start && this.currentDate.getDate() <= end) {
            return true;
          } else {
            return false;
          }
        }
      );

      // Invoke user provided dayClick callback
      if(this.dayClicked) {
        this.dayClicked(filteredEventsThisDate);
      }
    }
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
   *  0 - Do not change month
   * -1 - Go to previous month
   *  1 - Go to next month
   * @param {number} monthOffset - Months to go backward or forward
   * @param {number} [newDay] - Value of new day
   * @param {boolean} [resetToToday] - Whether to reset date to today
   */
  updateCurrentDate(monthOffset, newDay, resetToToday) {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      resetToToday
        ? this.today.getMonth()
        : this.currentDate.getMonth() + monthOffset,
      ((monthOffset !== 0) || !newDay) ? 1 : newDay
    );
    if(monthOffset !== 0) {
      this.updateCalendar(true);
      // Invoke user provided monthChanged callback
      if(this.monthChanged) {
        this.monthChanged(this.ISODateUTCToLocal(this.currentDate));
      }
    } else {
      // Invoke user provided dateChanged callback
      if(this.dateChanged) {
        this.dateChanged(this.ISODateUTCToLocal(this.currentDate));
      }
    }
  }

  /**
   * @param {Date} date - Date to use
   */
  ISODateUTCToLocal(date) {
    const tzoffset = (date).getTimezoneOffset() * 60000;
    let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    return localISOTime;
  }

  /** Update Month and Year HTML */
  updateMonthYear() {
    this.oldSelectedNode = null;
    this.calendarMonthYear.innerHTML = `
      <span class="calendar__month">${new Intl.DateTimeFormat("default", {
        month: this.monthDisplayType,
      }).format(this.currentDate)}</span>&nbsp;
      <span class="calendar__year">${this.currentDate.getFullYear()}</span>
    `;
    this.monthDisplay = document.querySelector(`${this.id} .calendar__month`);
    this.yearDisplay = document.querySelector(`${this.id} .calendar__year`);
  }

  generateWeekdays() {
    this.calendarWeekdays.innerHTML = "";
    for (let i = 0; i < 7; i++) {
      this.calendarWeekdays.innerHTML += `
        <div class="calendar__weekday">${
          this.WEEKDAYS[(i + this.START_WEEKDAY) % 7]
        }</div>
      `;
    }
  }

  /** Compute the day values in current month, and previous month number of days */
  generateDays() {
    // Previous Month
    // this.firstDay_PrevMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1).getDay();
    this.numOfDays_PrevMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      0
    ).getDate();
    // for (let i = 0; i < this.numOfDays_PrevMonth; i++) {
    //   this.daysIn_PrevMonth.push({ day: i + 1, selected: false });
    // }

    // Current Month
    this.firstDay_CurrentMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    ).getDay();
    this.numOfDays_CurrentMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    ).getDate();
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
    this.calendarDays.innerHTML = "";
    let insertCount = 0;

    // Filter events data to this month only
    const currentMonth = this.currentDate.getMonth();
    this.filteredEventsThisMonth = this.eventsData.filter((event) => {
      if (new Date(event.start).getMonth() === currentMonth) {
        return true;
      } else {
        return false;
      }
    });

    // Create object of all days that have events - for creating event bullets
    this.eventDayMap = {};
    this.filteredEventsThisMonth.forEach((event) => {
      const start = new Date(event.start).getDate();
      const end = new Date(event.end).getDate();
      for(let i = start; i <= end; i++) {
        this.eventDayMap[i] = true;
      }
    });

    // Weekday Offset calculation
    let dayOffset;
    if (this.firstDay_CurrentMonth < this.START_WEEKDAY) {
      dayOffset = 7 + this.firstDay_CurrentMonth - this.START_WEEKDAY;
    } else {
      dayOffset = this.firstDay_CurrentMonth - this.START_WEEKDAY;
    }

    // Prev Month (Light)
    for (let i = 0; i < dayOffset; i++) {
      this.calendarDays.innerHTML += `
        <div class="calendar__day calendar__day-other">${
          this.numOfDays_PrevMonth + 1 - dayOffset + i
        }</div>
      `;
      insertCount++;
    }

    // Current Month
    let isTodayMonth = this.today.getMonth() === this.currentDate.getMonth();
    this.daysIn_CurrentMonth.forEach((day) => {
      let isTodayDate = isTodayMonth && day.day === this.today.getDate();
      this.calendarDays.innerHTML += `
        <div class="calendar__day calendar__day-active${isTodayDate ? ' calendar__day-today' : ''}${
        this.eventDayMap[day.day]
          ? ' calendar__day-event'
          : ' calendar__day-no-event'
        }${day.selected ? ' calendar__day-selected' : ''}">
          <span class="calendar__day-text">${day.day}</span>
          <div class="calendar__day-box"></div>
          <div class="calendar__day-bullet"></div>
          ${isTodayDate ? '<div class="calendar__day-box-today"></div>' : ''}
        </div>
      `;
      insertCount++;
    });

    // Next Month (Light)
    for (let i = 0; i < this.DAYS_TO_DISPLAY - insertCount; i++) {
      this.calendarDays.innerHTML += `
        <div class="calendar__day calendar__day-other">${i + 1}</div>
      `;
    }
  }

  /**
   * @param {HTMLElement} element - Element to rerender
   * @param {number} dayNum - Value of day
   * @param {boolean} [storeOldSelected] - Whether to store created element for later reference
   */
  rerenderSelectedDay(element, dayNum, storeOldSelected) {
    // Get reference to previous day (day before target day)
    let previousElement = element.previousElementSibling;

    // Remove target day from DOM
    element.remove(element);

    // Create new target day element
    let isTodayMonth = this.today.getMonth() === this.currentDate.getMonth();
    let isTodayDate = isTodayMonth && dayNum === this.today.getDate();
    let div = document.createElement("div");
    div.className += `calendar__day calendar__day-active${
      isTodayDate ? " calendar__day-today" : ""
    }${
      this.eventDayMap[dayNum]
        ? " calendar__day-event"
        : " calendar__day-no-event"
    }${
      this.daysIn_CurrentMonth[dayNum - 1].selected
        ? " calendar__day-selected"
        : ""
    }`;
    div.innerHTML = `
      <span class="calendar__day-text">${dayNum}</span>
      <div class="calendar__day-box"></div>
      <div class="calendar__day-bullet"></div>
      ${isTodayDate ? '<div class="calendar__day-box-today"></div>' : ""}
    `;

    // Insert newly created target day to DOM
    previousElement.parentElement.insertBefore(
      div,
      previousElement.nextSibling
    );

    // Store this element for later reference
    if (storeOldSelected) {
      this.oldSelectedNode = [div, dayNum];
    }
  }
}
