import {
  CalendarOptions,
  EventData,
  Day,
  Weekdays,
  StartWeekday,
} from "./index.d";

export default class Calendar {
  // Constants
  readonly CAL_NAME = 'color-calendar';
  readonly DAYS_TO_DISPLAY = 42;

  // Options
  id: string;
  weekdayType: string;
  monthDisplayType: string;
  eventsData: EventData[];
  startWeekday: StartWeekday; // 0 (Sun), 1 (Mon), 2 (Tues), 3 (Wed), 4 (Thurs), 5 (Fri), 6 (Sat)
  theme: string;
  color?: string;
  fontFamily1?: string;
  fontFamily2?: string;
  dropShadow: boolean;
  border: boolean;
  headerColor?: string;
  headerBackgroundColor?: string;
  dayClicked?: any;
  monthChanged?: any;
  dateChanged?: any;

  // State
  weekdays: Weekdays;
  today: Date;
  currentDate: Date;
  pickerType: string;
  eventDayMap: any;
  oldSelectedNode: [HTMLElement, number] | null;
  filteredEventsThisMonth: EventData[];
  daysIn_PrevMonth: Day[];
  daysIn_CurrentMonth: Day[];
  daysIn_NextMonth: Day[];
  firstDay_PrevMonth: StartWeekday;
  firstDay_CurrentMonth: StartWeekday;
  firstDay_NextMonth: StartWeekday;
  numOfDays_PrevMonth: number;
  numOfDays_CurrentMonth: number;
  numOfDays_NextMonth: number;
  yearPickerOffset: number;

  // Elements
  calendar: HTMLElement;
  calendarMonthYear: HTMLElement;
  calendarWeekdays: HTMLElement;
  calendarDays: HTMLElement;
  prevButton: HTMLElement;
  nextButton: HTMLElement;
  pickerContainer: HTMLElement;
  pickerMonthContainer?: HTMLElement;
  pickerYearContainer?: HTMLElement;
  monthyearDisplay?: HTMLElement;
  monthDisplay?: HTMLElement;
  yearDisplay?: HTMLElement;

  constructor(options: CalendarOptions = {}) {
    // Options
    this.id = options.id ?? "#calendar";
    this.monthDisplayType = options.monthDisplayType ?? "long";
    this.eventsData = options.eventsData ?? [];
    this.startWeekday = options.startWeekday ?? 0;
    this.theme = options.theme ?? "basic";
    this.color = options.color;
    this.fontFamily1 = options.fontFamily1;
    this.fontFamily2 = options.fontFamily2;
    this.dropShadow = options.dropShadow ?? true;
    this.border = options.border ?? true;
    this.headerColor = options.headerColor;
    this.headerBackgroundColor = options.headerBackgroundColor;
    this.dayClicked = options.dayClicked;
    this.monthChanged = options.monthChanged;
    this.dateChanged = options.dateChanged;

    // State
    this.weekdayType = options.weekdayType ?? "short";
    switch (this.weekdayType) {
      case "long":
        this.weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        break;
      case "long-lower":
        this.weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        break;
      default:
        this.weekdays = ["S", "M", "T", "W", "T", "F", "S"];
    }
    this.today = new Date();
    this.currentDate = new Date();
    this.pickerType = 'month';
    this.eventDayMap = {};
    this.oldSelectedNode = null;
    this.filteredEventsThisMonth = [];
    this.daysIn_PrevMonth = [];
    this.daysIn_CurrentMonth = [];
    this.daysIn_NextMonth = [];
    this.firstDay_PrevMonth = 0;
    this.firstDay_CurrentMonth = 0;
    this.firstDay_NextMonth = 0;
    this.numOfDays_PrevMonth = 0;
    this.numOfDays_CurrentMonth = 0;
    this.numOfDays_NextMonth = 0;
    this.yearPickerOffset = 0;

    this.calendar = document.querySelector(this.id) as HTMLElement;
    if(!this.calendar) {
      throw new Error(`Element with selector '${this.id}' not found`);
    }
    this.calendar.innerHTML = `
      <div class="${this.CAL_NAME} ${this.theme}">
        <div class="calendar__header">
          <div class="calendar__arrow calendar__arrow-prev"><div class="calendar__arrow-inner"></div></div>
          <div class="calendar__monthyear">
            <span class="calendar__month"></span>&nbsp;
            <span class="calendar__year"></span>
          </div>
          <div class="calendar__arrow calendar__arrow-next"><div class="calendar__arrow-inner"></div></div>
        </div>
        <div class="calendar__body">
          <div class="calendar__weekdays"></div>
          <div class="calendar__days"></div>
          <div class="calendar__picker">
            <div class="calendar__picker-month">
              <div class="calendar__picker-month-option" data-value="0">Jan</div>
              <div class="calendar__picker-month-option" data-value="1">Feb</div>
              <div class="calendar__picker-month-option" data-value="2">Mar</div>
              <div class="calendar__picker-month-option" data-value="3">Apr</div>
              <div class="calendar__picker-month-option" data-value="4">May</div>
              <div class="calendar__picker-month-option" data-value="5">Jun</div>
              <div class="calendar__picker-month-option" data-value="6">Jul</div>
              <div class="calendar__picker-month-option" data-value="7">Aug</div>
              <div class="calendar__picker-month-option" data-value="8">Sep</div>
              <div class="calendar__picker-month-option" data-value="9">Oct</div>
              <div class="calendar__picker-month-option" data-value="10">Nov</div>
              <div class="calendar__picker-month-option" data-value="11">Dec</div>
            </div>
            <div class="calendar__picker-year">
              <div class="calendar__picker-year-option" data-value="0"></div>
              <div class="calendar__picker-year-option" data-value="1"></div>
              <div class="calendar__picker-year-option" data-value="2"></div>
              <div class="calendar__picker-year-option" data-value="3"></div>
              <div class="calendar__picker-year-option" data-value="4"></div>
              <div class="calendar__picker-year-option" data-value="5"></div>
              <div class="calendar__picker-year-option" data-value="6"></div>
              <div class="calendar__picker-year-option" data-value="7"></div>
              <div class="calendar__picker-year-option" data-value="8"></div>
              <div class="calendar__picker-year-option" data-value="9"></div>
              <div class="calendar__picker-year-option" data-value="10"></div>
              <div class="calendar__picker-year-option" data-value="11"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.calendarMonthYear = document.querySelector(`${this.id} .calendar__monthyear`) as HTMLElement;
    this.calendarWeekdays = document.querySelector(`${this.id} .calendar__weekdays`) as HTMLElement;
    this.calendarDays = document.querySelector(`${this.id} .calendar__days`) as HTMLElement;
    this.prevButton = document.querySelector(`${this.id} .calendar__arrow-prev .calendar__arrow-inner`) as HTMLElement;
    this.nextButton = document.querySelector(`${this.id} .calendar__arrow-next .calendar__arrow-inner`) as HTMLElement;
    this.pickerContainer = document.querySelector(`${this.id} .calendar__picker`) as HTMLElement;
    this.pickerMonthContainer = document.querySelector(`${this.id} .calendar__picker-month`) as HTMLElement;
    this.pickerYearContainer = document.querySelector(`${this.id} .calendar__picker-year`) as HTMLElement;
    this.monthyearDisplay = document.querySelector(`${this.id} .calendar__monthyear`) as HTMLElement;
    this.monthDisplay = document.querySelector(`${this.id} .calendar__month`) as HTMLElement;
    this.yearDisplay = document.querySelector(`${this.id} .calendar__year`) as HTMLElement;

    this.resetCalendar();
  }

  resetCalendar() {
    this.initializeLayout();
    this.updateMonthYear();
    this.updateMonthPickerSelection(this.currentDate.getMonth());
    this.generatePickerYears();
    this.updateYearPickerSelection(this.currentDate.getFullYear(), 4);
    this.generateWeekdays();
    this.generateDays();
    this.selectDayInitial();
    this.renderDays();
    this.setOldSelectedNode();
  }

  initializeLayout() {
    // Set initial picker styles
    this.togglePicker(false);

    // Event Listeners
    this.prevButton?.addEventListener("click",
      this.handlePrevMonthButtonClick.bind(this)
    );
    this.nextButton?.addEventListener("click",
      this.handleNextMonthButtonClick.bind(this)
    );
    this.monthyearDisplay?.addEventListener("click",
      this.handleMonthYearDisplayClick.bind(this)
    );
    this.calendarDays?.addEventListener("click",
      this.handleCalendarDayClick.bind(this)
    );
    this.pickerMonthContainer?.addEventListener("click",
      this.handleMonthPickerClick.bind(this)
    );
    this.pickerYearContainer?.addEventListener("click",
      this.handleYearPickerClick.bind(this)
    );

    this.configureStylePreferences();
  }

  /** Configure calendar style preferences */
  configureStylePreferences() {
    // let root = document.documentElement;
    let root = document.querySelector(`${this.id} .${this.CAL_NAME}`) as HTMLElement;
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

  updateCalendar(isMonthChanged?: boolean) {
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
      let selectedNode: HTMLElement | undefined = undefined;
      for(let i = 1; i < this.calendarDays!.childNodes.length; i+=2) {
        let ele = this.calendarDays!.childNodes[i] as HTMLElement;
        if(ele.classList && ele.classList.contains('calendar__day-active') && ele.innerText === this.currentDate.getDate().toString()){
          selectedNode = ele;
          break;
        }
      }
      if(selectedNode) {
        this.oldSelectedNode = [selectedNode, parseInt(selectedNode.innerText)];
      }
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
  setEventsData(data: EventData[]) {
    this.eventsData = JSON.parse(JSON.stringify(data));
    this.updateCalendar();
    return this.eventsData;
  }

  /** Add events to existing events data array */
  addEventsData(newEvents: EventData[] = []) {
    const eventCount = this.eventsData.push(...newEvents);
    this.updateCalendar();
    return eventCount;
  }

  /** Invoked on month or year click */
  handleMonthYearDisplayClick(e: any) {
    // Filter out unwanted click events
    if (!(
        e.target.classList.contains("calendar__month") ||
        e.target.classList.contains("calendar__year")
      )) {
      return;
    }

    const oldPickerType = this.pickerType;
    const classList = e.target.classList;

    // Set picker type
    if(classList.contains("calendar__month")) {
      this.pickerType = 'month';
      this.monthDisplay!.style.opacity = '1';
      this.yearDisplay!.style.opacity = '0.7';
      this.pickerMonthContainer!.style.display = 'grid';
      this.pickerYearContainer!.style.display = 'none';
    } else if(classList.contains("calendar__year")) {
      this.pickerType = 'year';
      this.monthDisplay!.style.opacity = '0.7';
      this.yearDisplay!.style.opacity = '1';
      this.pickerMonthContainer!.style.display = 'none';
      this.pickerYearContainer!.style.display = 'grid';
    }

    if(oldPickerType === this.pickerType) {
      // Toggle picker
      this.togglePicker();
    } else {
      // Open picker
      this.togglePicker(true);
    }
  }

  togglePicker(shouldOpen?: boolean) {
    if(shouldOpen === true) {
      this.pickerContainer.style.visibility = 'visible';
      this.pickerContainer.style.opacity = '1';
      if(this.pickerType === 'year') {
        this.generatePickerYears();
      }
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
        if(this.pickerType === 'year') {
          this.generatePickerYears();
        }
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

  handleMonthPickerClick(e: any) {
    // Filter out unwanted click events
    if (!(e.target.classList.contains("calendar__picker-month-option"))) {
      return;
    }

    const newMonthValue = parseInt(e.target.dataset.value);
    
    this.updateMonthPickerSelection(newMonthValue);
    this.updateCurrentDate(0, undefined, newMonthValue);
    this.togglePicker(false);
  }

  updateMonthPickerSelection(newMonthValue: number) {
    const oldMonthValue = this.currentDate.getMonth();
    if(newMonthValue < 0) {
      newMonthValue = 11;
    } else {
      newMonthValue = newMonthValue % 12;
    }
    this.pickerMonthContainer!.children[oldMonthValue].classList.remove('calendar__picker-month-selected');
    this.pickerMonthContainer!.children[newMonthValue].classList.add('calendar__picker-month-selected');
  }

  handleYearPickerClick(e: any) {
    // Filter out unwanted click events
    if (!(e.target.classList.contains("calendar__picker-year-option"))) {
      return;
    }

    const newYearValue = parseInt(e.target.innerText);
    const newYearIndex = parseInt(e.target.dataset.value);
    this.updateYearPickerSelection(newYearValue, newYearIndex);
    this.updateCurrentDate(0, undefined, undefined, newYearValue);
    this.togglePicker(false);
  }

  updateYearPickerSelection(newYearValue: number, newYearIndex?: number) {
    // // Find old year index
    // const oldYearValue = this.currentDate.getFullYear();
    // let oldYearIndex = 0;
    // for(let i = 0; i < this.pickerYearContainer!.children.length; i++) {
    //   let yearPickerChildren = this.pickerYearContainer!.children[i] as HTMLElement;
    //   let year = parseInt(yearPickerChildren.innerText)
    //   if(year === oldYearValue && yearPickerChildren.dataset.value) {
    //     oldYearIndex = parseInt(yearPickerChildren.dataset.value);
    //     break;
    //   }
    // }

    if(!newYearIndex) {
      for(let i = 0; i < 12; i++) {
        let yearPickerChildren = this.pickerYearContainer!.children[i] as HTMLElement;
        let year = parseInt(yearPickerChildren.innerHTML)
        // console.log('year', year, newYearValue, yearPickerChildren.dataset.value);
        // console.dir(yearPickerChildren);
        if(year === newYearValue && yearPickerChildren.dataset.value) {
          newYearIndex = parseInt(yearPickerChildren.dataset.value);
          // console.log('newYearIndex', newYearIndex);
          break;
        }
      }
    }

    this.removeYearPickerSelection();
    // this.pickerYearContainer!.children[oldYearIndex].classList.remove('calendar__picker-year-selected');
    if(newYearIndex !== undefined) {
      this.pickerYearContainer!.children[newYearIndex].classList.add('calendar__picker-year-selected');
    } else {
      throw new Error("newYearIndex is undefined");
    }
  }

  removeYearPickerSelection() {
    // Remove old year selection by scanning for the selected year
    for(let i = 0; i < 12; i++) {
      if(this.pickerYearContainer!.children[i].classList.contains('calendar__picker-year-selected')) {
        this.pickerYearContainer!.children[i].classList.remove('calendar__picker-year-selected');
      }
    }
  }

  generatePickerYears() {
    const currentYear = this.today.getFullYear() + this.yearPickerOffset;
    let count = 0;
    for(let i = currentYear - 4; i <= currentYear + 7; i++) {
      let element = this.pickerYearContainer!.children[count] as HTMLElement;
      element.innerText = i.toString();
      count++;
    }
  }

  /** Invoked on calendar day click */
  handleCalendarDayClick(e: any) {
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
      !this.oldSelectedNode[0]
    ) {
      return;
    }

    // Find which day of the month is clicked
    let day;
    let dayNum;
    day = e.target.parentElement.innerText;
    dayNum = parseInt(day, 10);

    //Remove old day selection
    this.removeOldDaySelection();

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

  removeOldDaySelection() {
    if (this.oldSelectedNode) {
      Object.assign(this.daysIn_CurrentMonth[this.oldSelectedNode[1] - 1], {
        selected: false,
      });
      this.rerenderSelectedDay(
        this.oldSelectedNode[0],
        this.oldSelectedNode[1]
      );
    }
  }

  handlePrevMonthButtonClick() {
    const newMonthValue = this.currentDate.getMonth() - 1;
    if(newMonthValue < 0) {
      this.updateYearPickerSelection(this.currentDate.getFullYear() - 1);
    }
    this.updateMonthPickerSelection(newMonthValue);
    this.updateCurrentDate(-1);
    this.togglePicker(false);
  }

  handleNextMonthButtonClick() {
    const newMonthValue = this.currentDate.getMonth() + 1;
    if(newMonthValue > 11) {
      this.updateYearPickerSelection(this.currentDate.getFullYear() + 1);
    }
    this.updateMonthPickerSelection(newMonthValue);
    this.updateCurrentDate(1);
    this.togglePicker(false);
  }

  /**
   *  0 - Do not change month
   * -1 - Go to previous month
   *  1 - Go to next month
   * @param {number} monthOffset - Months to go backward or forward
   * @param {number} [newDay] - Value of new day
   * @param {number} [newMonth] - Value of new month
   */
  updateCurrentDate(monthOffset: number, newDay?: number, newMonth?: number, newYear?: number) {
    this.currentDate = new Date(
      newYear ? newYear : this.currentDate.getFullYear(),
      (newMonth !== undefined && newMonth !== null)
        ? newMonth
        : this.currentDate.getMonth() + monthOffset,
      ((monthOffset !== 0) || !newDay) ? 1 : newDay
    );
    
    if(monthOffset !== 0 || (newMonth !== undefined && newMonth !== null) || newYear) {
      this.updateCalendar(true);
      // Invoke user provided monthChanged callback
      if(this.monthChanged) {
        this.monthChanged(this.DateUTCToISOLocal(this.currentDate));
      }
    } else {
      // Invoke user provided dateChanged callback
      if(this.dateChanged) {
        this.dateChanged(this.DateUTCToISOLocal(this.currentDate));
      }
    }
  }

  /**
   * @param {Date} date - Date to use
   */
  DateUTCToISOLocal(date: Date) {
    const tzoffset = (date).getTimezoneOffset() * 60000;
    let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    return localISOTime;
  }

  /** Update Month and Year HTML */
  updateMonthYear() {
    this.oldSelectedNode = null;
    this.monthDisplay!.innerHTML = new Intl.DateTimeFormat("default", {
      month: this.monthDisplayType,
    }).format(this.currentDate)
    this.yearDisplay!.innerHTML = this.currentDate.getFullYear().toString();
  }

  generateWeekdays() {
    let newHTML = '';
    for (let i = 0; i < 7; i++) {
      newHTML += `
        <div class="calendar__weekday">${
          this.weekdays[(i + this.startWeekday) % 7]
        }</div>
      `;
    }
    this.calendarWeekdays.innerHTML = newHTML;
  }

  /** Compute the day values in current month, and previous month number of days */
  generateDays() {
    // Previous Month
    // this.firstDay_PrevMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1).getDay() as StartWeekday;
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
    ).getDay() as StartWeekday;
    this.numOfDays_CurrentMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    ).getDate();
    for (let i = 0; i < this.numOfDays_CurrentMonth; i++) {
      this.daysIn_CurrentMonth.push({ day: i + 1, selected: false });
    }

    // Next Month
    // this.firstDay_NextMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1).getDay() as StartWeekday;
    // this.numOfDays_NextMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0).getDate();
    // for (let i = 0; i < this.numOfDays_NextMonth; i++) {
    //   this.daysIn_NextMonth.push({ day: i + 1, selected: false });
    // }
  }

  /** Render days */
  renderDays() {
    let insertCount = 0;

    // Filter events data to this month only
    const currentYear = this.currentDate.getFullYear();
    const currentMonth = this.currentDate.getMonth();
    this.filteredEventsThisMonth = this.eventsData.filter((event) => {
      const eventDate = new Date(event.start);
      if (eventDate.getFullYear() === currentYear && eventDate.getMonth() === currentMonth) {
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
    if (this.firstDay_CurrentMonth < this.startWeekday) {
      dayOffset = 7 + this.firstDay_CurrentMonth - this.startWeekday;
    } else {
      dayOffset = this.firstDay_CurrentMonth - this.startWeekday;
    }

    let newHTML = '';

    // Prev Month (Light)
    for (let i = 0; i < dayOffset; i++) {
      newHTML += `
        <div class="calendar__day calendar__day-other">${
          this.numOfDays_PrevMonth + 1 - dayOffset + i
        }</div>
      `;
      insertCount++;
    }

    // Current Month
    let isTodayYear = this.today.getFullYear() === this.currentDate.getFullYear();
    let isTodayMonth = (this.today.getMonth() === this.currentDate.getMonth()) && isTodayYear;
    this.daysIn_CurrentMonth.forEach((day) => {
      let isTodayDate = isTodayMonth && day.day === this.today.getDate();
      newHTML += `
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
      newHTML += `
        <div class="calendar__day calendar__day-other">${i + 1}</div>
      `;
    }

    this.calendarDays.innerHTML = newHTML;
  }

  /**
   * @param {HTMLElement} element - Element to rerender
   * @param {number} dayNum - Value of day
   * @param {boolean} [storeOldSelected] - Whether to store created element for later reference
   */
  rerenderSelectedDay(element: HTMLElement, dayNum: number, storeOldSelected?: boolean) {
    // Get reference to previous day (day before target day)
    let previousElement = element.previousElementSibling;

    // Create new target day element
    let isTodayYear = this.today.getFullYear() === this.currentDate.getFullYear();
    let isTodayMonth = (this.today.getMonth() === this.currentDate.getMonth()) && isTodayYear;
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
    if(!previousElement) {
      // Handle edge case when it is the first element in the calendar
      this.calendarDays.insertBefore(
        div,
        element
      );
    } else {
      if(previousElement.parentElement) {
        previousElement.parentElement.insertBefore(
          div,
          previousElement.nextSibling
        );
      } else {
        console.log('Previous element does not have parent');
      }
    }

    // Store this element for later reference
    if (storeOldSelected) {
      this.oldSelectedNode = [div, dayNum];
    }

    // Remove target day from DOM
    element.remove();
  }
}
