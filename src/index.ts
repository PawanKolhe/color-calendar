import * as api from "./modules/api";
import { addEventListeners } from "./modules/addEventListeners";
import { configureStylePreferences } from "./modules/stylePreferences";
import * as picker from "./modules/picker/picker";
import * as monthPicker from "./modules/picker/month/monthPicker";
import * as yearPicker from "./modules/picker/year/yearPicker";

import {
  CalendarSize,
  LayoutModifier,
  CalendarOptions,
  EventData,
  Day,
  MonthDisplayType,
  WeekdayDisplayType,
  Weekdays,
  StartWeekday,
} from "./types.d";

export default class Calendar {
  /* Constants */
  readonly CAL_NAME = 'color-calendar';
  readonly DAYS_TO_DISPLAY = 42;

  /* Options */
  id: string;
  calendarSize: CalendarSize;
  layoutModifiers: LayoutModifier[];
  eventsData: EventData[];
  theme: string;
  primaryColor?: string;
  headerColor?: string;
  headerBackgroundColor?: string;
  weekdaysColor?: string;
  weekdayDisplayType: WeekdayDisplayType;
  monthDisplayType: MonthDisplayType;
  startWeekday: StartWeekday;
  fontFamilyHeader?: string;
  fontFamilyWeekdays?: string;
  fontFamilyBody?: string;
  dropShadow?: string;
  border?: string;
  borderRadius?: string;
  disableMonthYearPickers: boolean;
  disableDayClick: boolean;
  disableMonthArrowClick: boolean;
  monthChanged?: (currentDate?: Date, filteredMonthEvents?: EventData[]) => void;
  dateChanged?: (currentDate?: Date, filteredDateEvents?: EventData[]) => void;

  /* State */
  weekdayDisplayTypeOptions = {
    "short": ["S", "M", "T", "W", "T", "F", "S"] as Weekdays,
    "long-lower": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as Weekdays,
    "long-upper": ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as Weekdays,
  }
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
  yearPickerOffsetTemporary: number;

  /* Elements */
  calendar: HTMLElement;
  calendarRoot: HTMLElement;
  calendarHeader: HTMLElement;
  calendarWeekdays: HTMLElement;
  calendarDays: HTMLElement;
  prevButton: HTMLElement;
  nextButton: HTMLElement;
  pickerContainer: HTMLElement;
  pickerMonthContainer: HTMLElement;
  pickerYearContainer: HTMLElement;
  yearPickerChevronLeft: HTMLElement;
  yearPickerChevronRight: HTMLElement;
  monthyearDisplay: HTMLElement;
  monthDisplay: HTMLElement;
  yearDisplay: HTMLElement;

  /* Methods */
  // API
  reset: (date: Date) => void;
  setDate: (date: Date) => void;
  getSelectedDate: () => Date;
  getEventsData: () => any;
  setEventsData: (events: EventData[]) => number;
  addEventsData: (newEvents?: EventData[]) => number;
  setWeekdayDisplayType: (weekdayDisplayType: WeekdayDisplayType) => void;
  setMonthDisplayType: (monthDisplayType: MonthDisplayType) => void;
  // Event Listeners
  addEventListeners: () => void;
  // Style Preferences
  configureStylePreferences: () => void;
  // Picker
  togglePicker: (shouldOpen?: boolean) => void;
  // Picker - Month
  handleMonthPickerClick: (e: any) => void;
  updateMonthPickerSelection: (newMonthValue: number) => void;
  removeMonthPickerSelection: () => void;
  // Picker - Year
  handleYearPickerClick: (e: any) => void;
  updateYearPickerSelection: (newYearValue: number, newYearIndex?: number) => void;
  updateYearPickerTodaySelection: () => void;
  removeYearPickerSelection: () => void;
  generatePickerYears: () => void;
  handleYearChevronLeftClick: () => void;
  handleYearChevronRightClick: () => void;

  constructor(options: CalendarOptions = {}) {
    /* Initialize Options */
    this.id = options.id ?? "#calendar";
    this.calendarSize = (options.calendarSize ?? "large") as CalendarSize;
    this.layoutModifiers = options.layoutModifiers ?? [];
    this.eventsData = options.eventsData ?? [];
    this.monthDisplayType = (options.monthDisplayType ?? "long") as MonthDisplayType;
    this.startWeekday = options.startWeekday ?? 0; // 0 (Sun), 1 (Mon), 2 (Tues), 3 (Wed), 4 (Thurs), 5 (Fri), 6 (Sat)
    this.theme = options.theme ?? "basic";
    this.primaryColor = options.primaryColor;
    this.fontFamilyHeader = options.fontFamilyHeader;
    this.fontFamilyWeekdays = options.fontFamilyWeekdays;
    this.fontFamilyBody = options.fontFamilyBody;
    this.dropShadow = options.dropShadow;
    this.border = options.border;
    this.borderRadius = options.borderRadius;
    this.headerColor = options.headerColor;
    this.headerBackgroundColor = options.headerBackgroundColor;
    this.weekdaysColor = options.weekdaysColor;
    this.disableMonthYearPickers = options.disableMonthYearPickers ?? false;
    this.disableDayClick = options.disableDayClick ?? false;
    this.disableMonthArrowClick = options.disableMonthArrowClick ?? false;
    this.monthChanged = options.monthChanged;
    this.dateChanged = options.dateChanged;

    /* Initialize State */
    this.weekdayDisplayType = (options.weekdayDisplayType ?? "long") as WeekdayDisplayType;
    this.weekdays = this.weekdayDisplayTypeOptions[this.weekdayDisplayType] ?? this.weekdayDisplayTypeOptions["short"];
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
    this.yearPickerOffsetTemporary = 0;

    /* Initialize Methods */
    // API
    this.reset = api.reset;
    this.setDate = api.setDate;
    this.getSelectedDate = api.getSelectedDate;
    this.getEventsData = api.getEventsData;
    this.setEventsData = api.setEventsData;
    this.addEventsData = api.addEventsData;
    this.setWeekdayDisplayType = api.setWeekdayDisplayType;
    this.setMonthDisplayType = api.setMonthDisplayType;
    // Add Event Listeners
    this.addEventListeners = addEventListeners;
    // Style Preferences
    this.configureStylePreferences = configureStylePreferences;
    // Picker
    this.togglePicker = picker.togglePicker;
    // Picker - Month
    this.handleMonthPickerClick = monthPicker.handleMonthPickerClick;
    this.updateMonthPickerSelection = monthPicker.updateMonthPickerSelection;
    this.removeMonthPickerSelection = monthPicker.removeMonthPickerSelection;
    // Picker - Year
    this.handleYearPickerClick = yearPicker.handleYearPickerClick;
    this.updateYearPickerSelection = yearPicker.updateYearPickerSelection;
    this.updateYearPickerTodaySelection = yearPicker.updateYearPickerTodaySelection;
    this.removeYearPickerSelection = yearPicker.removeYearPickerSelection;
    this.generatePickerYears = yearPicker.generatePickerYears;
    this.handleYearChevronLeftClick = yearPicker.handleYearChevronLeftClick;
    this.handleYearChevronRightClick = yearPicker.handleYearChevronRightClick;

    // Check if HTML element with given selector exists in DOM
    this.calendar = document.querySelector(this.id) as HTMLElement;
    if(!this.calendar) {
      throw new Error(`[COLOR-CALENDAR] Element with selector '${this.id}' not found`);
    }

    // Initialize initial HTML layout
    this.calendar.innerHTML = `
      <div class="${this.CAL_NAME} ${this.theme} color-calendar--${this.calendarSize}">
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
              <div class="calendar__picker-year-arrow calendar__picker-year-arrow-left">
                <div class="chevron-thin chevron-thin-left"></div>
              </div>
              <div class="calendar__picker-year-arrow calendar__picker-year-arrow-right">
                <div class="chevron-thin chevron-thin-right"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Store HTML element references
    this.calendarRoot = document.querySelector(`${this.id} .${this.CAL_NAME}`) as HTMLElement;
    this.calendarHeader = document.querySelector(`${this.id} .calendar__header`) as HTMLElement;
    this.calendarWeekdays = document.querySelector(`${this.id} .calendar__weekdays`) as HTMLElement;
    this.calendarDays = document.querySelector(`${this.id} .calendar__days`) as HTMLElement;
    this.pickerContainer = document.querySelector(`${this.id} .calendar__picker`) as HTMLElement;
    this.pickerMonthContainer = document.querySelector(`${this.id} .calendar__picker-month`) as HTMLElement;
    this.pickerYearContainer = document.querySelector(`${this.id} .calendar__picker-year`) as HTMLElement;
    this.yearPickerChevronLeft = document.querySelector(`${this.id} .calendar__picker-year-arrow-left`) as HTMLElement;
    this.yearPickerChevronRight = document.querySelector(`${this.id} .calendar__picker-year-arrow-right`) as HTMLElement;

    // Mark today's month in month picker
    this.pickerMonthContainer!.children[this.today.getMonth()].classList.add('calendar__picker-month-today');

    // Apply Layout Modifiers
    this.layoutModifiers.forEach(item => {
      this.calendarRoot.classList.add(item);
    });

    if(this.layoutModifiers.includes('month-left-align')) {
      this.calendarHeader.innerHTML = `
        <div class="calendar__monthyear">
          <span class="calendar__month"></span>&nbsp;
          <span class="calendar__year"></span>
        </div>
        <div class="calendar__arrow calendar__arrow-prev"><div class="calendar__arrow-inner"></div></div>
        <div class="calendar__arrow calendar__arrow-next"><div class="calendar__arrow-inner"></div></div>
      `
    }

    this.monthyearDisplay = document.querySelector(`${this.id} .calendar__monthyear`) as HTMLElement;
    this.monthDisplay = document.querySelector(`${this.id} .calendar__month`) as HTMLElement;
    this.yearDisplay = document.querySelector(`${this.id} .calendar__year`) as HTMLElement;
    this.prevButton = document.querySelector(`${this.id} .calendar__arrow-prev .calendar__arrow-inner`) as HTMLElement;
    this.nextButton = document.querySelector(`${this.id} .calendar__arrow-next .calendar__arrow-inner`) as HTMLElement;

    // Set initial picker styles
    this.togglePicker(false);

    // Set CSS Variables based on options given
    this.configureStylePreferences();

    // Apply click listeners to HTML elements
    this.addEventListeners();

    this.reset(new Date());
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

  selectDayInitial(setDate?: boolean) {
    if(setDate) {
      this.daysIn_CurrentMonth[this.currentDate.getDate() - 1].selected = true;
    } else {
      let isTodayMonth = this.today.getMonth() === this.currentDate.getMonth();
      let isTodayDay = this.today.getDate() === this.currentDate.getDate();
      if(isTodayMonth && isTodayDay) {
        this.daysIn_CurrentMonth[this.today.getDate() - 1].selected = true;
      } else {
        this.daysIn_CurrentMonth[0].selected = true;
      }
    }
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
    // Check if MonthYear click is disabled
    if(this.disableMonthYearPickers) {
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

    // Check if Day click is disabled
    if(this.disableDayClick) {
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
    }
  }

  getDateEvents(date: Date) {
    let filteredEventsThisDate = this.filteredEventsThisMonth.filter(
      (event) => {
        const start = new Date(event.start).getDate();
        const end = new Date(event.end).getDate();
        if (date.getDate() >= start && date.getDate() <= end) {
          return true;
        } else {
          return false;
        }
      }
    );
    return filteredEventsThisDate;
  }

  getMonthEvents() {
    return this.filteredEventsThisMonth;
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
    // Check if Month arrow click is disabled
    if(this.disableMonthArrowClick) {
      return;
    }

    const newMonthValue = this.currentDate.getMonth() - 1;
    if(this.currentDate.getFullYear() <= this.today.getFullYear() + this.yearPickerOffset - 4 && newMonthValue < 0) {
      this.yearPickerOffset -=12;
      this.generatePickerYears();
    }
    if(newMonthValue < 0) {
      this.updateYearPickerSelection(this.currentDate.getFullYear() - 1);
    }
    this.updateMonthPickerSelection(newMonthValue);
    this.updateCurrentDate(-1);
    this.togglePicker(false);
  }

  handleNextMonthButtonClick() {
    // Check if Month arrow click is disabled
    if(this.disableMonthArrowClick) {
      return;
    }

    const newMonthValue = this.currentDate.getMonth() + 1;
    if(this.currentDate.getFullYear() >= this.today.getFullYear() + this.yearPickerOffset + 7 && newMonthValue > 11) {
      this.yearPickerOffset +=12;
      this.generatePickerYears();
    }
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
        this.monthChanged(this.currentDate, this.getMonthEvents());
      }
    }
    // Invoke user provided dateChanged callback
    if(this.dateChanged) {
      this.dateChanged(this.currentDate, this.getDateEvents(this.currentDate));
    }
  }

  /** Update Month and Year HTML */
  updateMonthYear() {
    this.oldSelectedNode = null;
    this.monthDisplay!.innerHTML = new Intl.DateTimeFormat("default", {
      month: this.monthDisplayType,
    }).format(this.currentDate)
    this.yearDisplay!.innerHTML = this.currentDate.getFullYear().toString();
  }

  /** Update Weekdays HTML */
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
          <div class="calendar__day-bullet"></div>
          <div class="calendar__day-box"></div>
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
      <div class="calendar__day-bullet"></div>
      <div class="calendar__day-box"></div>
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
