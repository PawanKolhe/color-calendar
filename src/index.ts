import {
  addEventListeners,
  focusDay,
  handleCalendarClick,
  handleCalendarDaysKeyboardNavigation,
  handleKeyboardNavigation,
  handleMonthPickerKeyboardNavigation,
  handlePickerKeyboardNavigation,
  handleYearPickerKeyboardNavigation,
  navigateToDay,
  selectDayFromKeyboard,
} from "./modules/addEventListeners";
import * as day from "./modules/day/day";
import * as events from "./modules/events/events";
import * as header from "./modules/header/header";
import * as monthPicker from "./modules/picker/month/monthPicker";
import * as picker from "./modules/picker/picker";
import * as yearPicker from "./modules/picker/year/yearPicker";
import { configureStylePreferences } from "./modules/stylePreference";
import * as weekday from "./modules/weekday/weekday";

import type {
  CalendarOptions,
  CalendarSize,
  Day,
  EventBulletMode,
  EventData,
  LayoutModifier,
  MonthDisplayType,
  StartWeekday,
  WeekdayDisplayType,
  Weekdays,
} from "./types";

export default class Calendar {
  /* Constants */
  readonly CAL_NAME = "color-calendar";
  readonly DAYS_TO_DISPLAY = 42;

  /* Options */
  container: string | HTMLElement | (() => HTMLElement | null);
  calendarSize: CalendarSize;
  layoutModifiers: LayoutModifier[];
  eventsData: EventData[];
  theme: string;
  primaryColor?: string;
  headerColor?: string;
  headerBackgroundColor?: string;
  weekdaysColor?: string;
  weekdayDisplayType: WeekdayDisplayType = "long-lower";
  monthDisplayType: MonthDisplayType;
  startWeekday: StartWeekday = 0;
  fontFamilyHeader?: string;
  fontFamilyWeekdays?: string;
  fontFamilyBody?: string;
  dropShadow?: string;
  border?: string;
  borderRadius: string = "0.5rem";
  disableMonthYearPickers: boolean;
  disableDayClick: boolean;
  disableMonthArrowClick: boolean;
  customMonthValues?: string[];
  customWeekdayValues?: string[];
  eventBulletMode: EventBulletMode = "multiple";

  onMonthChange?: (currentDate?: Date, filteredMonthEvents?: EventData[]) => void;

  onSelectedDateChange?: (currentDate?: Date, filteredDateEvents?: EventData[]) => void;

  onSelectedDateClick?: (currentDate?: Date, filteredDateEvents?: EventData[]) => void;

  /* State */
  weekdayDisplayTypeOptions = {
    short: ["S", "M", "T", "W", "T", "F", "S"] satisfies Weekdays,
    "long-lower": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] satisfies Weekdays,
    "long-upper": ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] satisfies Weekdays,
  };

  weekdays: Weekdays;
  today: Date;
  selectedDate: Date;
  currentViewDate: Date;
  pickerType: string;
  eventDayMap: Map<string, EventData[]>;
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
  calendar: HTMLElement | null;
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
  // Event Listeners
  declare addEventListeners: () => void;
  declare handleCalendarClick: (e: MouseEvent) => void;
  declare handleKeyboardNavigation: (e: KeyboardEvent) => void;
  declare handleCalendarDaysKeyboardNavigation: (e: KeyboardEvent) => void;
  declare navigateToDay: (currentDay: HTMLElement, e: KeyboardEvent) => void;
  declare selectDayFromKeyboard: (dayElement: HTMLElement) => void;
  declare focusDay: (dayElement: HTMLElement) => void;
  declare handlePickerKeyboardNavigation: (e: KeyboardEvent) => void;
  declare handleMonthPickerKeyboardNavigation: (e: KeyboardEvent) => void;
  declare handleYearPickerKeyboardNavigation: (e: KeyboardEvent) => void;

  // Style Preference
  declare configureStylePreferences: () => void;

  // Picker
  declare togglePicker: (shouldOpen?: boolean) => void;
  declare openPicker: () => void;
  declare closePicker: () => void;
  declare openYearPicker: () => void;
  declare openMonthPicker: () => void;
  declare makeMonthPickerOptionsFocusable: () => void;
  declare makeYearPickerOptionsFocusable: () => void;
  declare makeAllPickerOptionsUnfocusable: () => void;
  declare makeAllCalendarDaysUnfocusable: () => void;
  declare restoreCalendarDaysFocusability: () => void;
  declare focusSelectedYearOption: () => void;
  declare focusSelectedMonthOption: () => void;

  // Picker - Month
  declare handleMonthPickerClick: (e: MouseEvent) => void;
  declare updateMonthPickerSelection: (newMonthValue: number) => void;
  declare updateMonthPickerTodaySelection: () => void;
  declare removeMonthPickerSelection: () => void;

  // Picker - Year
  declare handleYearPickerClick: (e: MouseEvent) => void;
  declare updateYearPickerSelection: (newYearValue: number, newYearIndex?: number) => void;
  declare updateYearPickerTodaySelection: () => void;
  declare removeYearPickerSelection: () => void;
  declare generatePickerYears: () => void;
  declare handleYearChevronLeftClick: () => void;
  declare handleYearChevronRightClick: () => void;

  // Header
  declare setMonthDisplayType: (monthDisplayType: MonthDisplayType) => void;
  declare handleMonthYearDisplayClick: (e: MouseEvent) => void;
  declare handlePrevMonthButtonClick: () => void;
  declare handleNextMonthButtonClick: () => void;
  declare updateMonthYear: () => void;

  // Weekday
  declare setWeekdayDisplayType: (weekdayDisplayType: WeekdayDisplayType) => void;
  declare generateAndRenderWeekdays: () => void;

  // Day
  declare setSelectedDate: (date: Date) => void;
  declare getSelectedDate: () => Date;
  declare clearCalendarDays: () => void;
  declare updateCalendar: (isMonthChanged?: boolean) => void;
  declare setOldSelectedNode: () => void;
  declare selectDayInitial: (setDate?: boolean) => void;
  declare ensureFirstDayFocusable: () => void;
  declare makeFirstDayFocusable: () => void;
  declare handleCalendarDayClick: (e: MouseEvent) => void;
  declare removeOldDaySelection: () => void;
  declare updateSelectedDate: (newDay: number) => void;
  declare updateCurrentDate: (monthOffset: number, newMonth?: number, newYear?: number) => void;
  declare generateDays: () => void;
  declare renderDays: () => void;
  declare rerenderSelectedDay: (
    element: HTMLElement,
    dayNum: number,
    storeOldSelected?: boolean
  ) => void;

  // Methods
  declare getEventsData: () => EventData[];
  declare setEventsData: (events: EventData[]) => number;
  declare addEventsData: (newEvents?: EventData[]) => number;
  declare getDateEvents: (date: Date) => EventData[];
  declare getMonthEvents: () => EventData[];

  constructor(options: CalendarOptions = {}) {
    /* Initialize Options */
    this.container = options.container ?? "#color-calendar";
    this.calendarSize = (options.calendarSize ?? "large") as CalendarSize;
    this.layoutModifiers = options.layoutModifiers ?? [];
    this.eventsData = options.eventsData ?? [];
    this.theme = options.theme ?? "basic";
    this.primaryColor = options.primaryColor;
    this.headerColor = options.headerColor;
    this.headerBackgroundColor = options.headerBackgroundColor;
    this.weekdaysColor = options.weekdaysColor;
    this.weekdayDisplayType = (options.weekdayDisplayType ?? "long-lower") as WeekdayDisplayType;
    this.monthDisplayType = (options.monthDisplayType ?? "long") as MonthDisplayType;
    this.startWeekday = options.startWeekday ?? 0; // 0 (Sun), 1 (Mon), 2 (Tues), 3 (Wed), 4 (Thu), 5 (Fri), 6 (Sat)
    this.fontFamilyHeader = options.fontFamilyHeader;
    this.fontFamilyWeekdays = options.fontFamilyWeekdays;
    this.fontFamilyBody = options.fontFamilyBody;
    this.dropShadow = options.dropShadow;
    this.border = options.border;
    this.borderRadius = options.borderRadius ?? "0.5rem";
    this.disableMonthYearPickers = options.disableMonthYearPickers ?? false;
    this.disableDayClick = options.disableDayClick ?? false;
    this.disableMonthArrowClick = options.disableMonthArrowClick ?? false;
    this.customMonthValues = options.customMonthValues;
    this.customWeekdayValues = options.customWeekdayValues;
    this.eventBulletMode = options.eventBulletMode ?? "multiple";
    this.onMonthChange = options.onMonthChange;
    this.onSelectedDateChange = options.onSelectedDateChange;
    this.onSelectedDateClick = options.onSelectedDateClick;

    /* Initialize State */
    if (this.customWeekdayValues && this.customWeekdayValues.length === 7) {
      this.weekdays = this.customWeekdayValues as Weekdays;
    } else {
      this.weekdays =
        this.weekdayDisplayTypeOptions[this.weekdayDisplayType] ??
        this.weekdayDisplayTypeOptions["short"];
    }

    this.today = new Date();
    this.selectedDate = options.initialSelectedDate
      ? new Date(options.initialSelectedDate)
      : new Date();
    this.currentViewDate = options.initialSelectedDate
      ? new Date(options.initialSelectedDate)
      : new Date();
    this.pickerType = "month";
    this.eventDayMap = new Map();
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

    // Check if HTML element with given selector exists in DOM
    this.calendar = this.resolveContainer();

    if (!this.calendar) {
      const containerDescription =
        typeof this.container === "function"
          ? "function"
          : this.container instanceof HTMLElement
            ? "HTMLElement"
            : `'${this.container}'`;
      throw new Error(`[COLOR-CALENDAR] Element with container ${containerDescription} not found`);
    }

    // Initialize initial HTML layout

    this.getCalendar().innerHTML = `
      <div class="${this.CAL_NAME} ${this.theme} color-calendar--${this.calendarSize}" role="application" aria-label="Calendar">
        <header class="calendar__header">
          <button class="calendar__arrow calendar__arrow-prev" aria-label="Previous month">
            <span class="calendar__arrow-inner"></span>
          </button>
          <div class="calendar__monthyear">
            <button class="calendar__month" aria-label="Select month" aria-expanded="false"></button>&nbsp;
            <button class="calendar__year" aria-label="Select year" aria-expanded="false"></button>
          </div>
          <button class="calendar__arrow calendar__arrow-next" aria-label="Next month">
            <span class="calendar__arrow-inner"></span>
          </button>
        </header>
        <main class="calendar__body">
          <div class="calendar__weekdays" role="row" aria-label="Weekday headers"></div>
          <div class="calendar__days" role="grid" aria-label="Calendar days"></div>
          <div class="calendar__picker" role="dialog" aria-label="Month and year picker" aria-hidden="true">
            <div class="calendar__picker-month" role="listbox" aria-label="Month selection">
              ${(this.customMonthValues ?? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]).map((month, i) => `<button class="calendar__picker-month-option" data-value="${i}" role="option" tabindex="-1">${month}</button>`).join("")}
            </div>
            <div class="calendar__picker-year" role="listbox" aria-label="Year selection">
              <button class="calendar__picker-year-option" data-value="0" role="option" tabindex="-1"></button>
              <button class="calendar__picker-year-option" data-value="1" role="option" tabindex="-1"></button>
              <button class="calendar__picker-year-option" data-value="2" role="option" tabindex="-1"></button>
              <button class="calendar__picker-year-option" data-value="3" role="option" tabindex="-1"></button>
              <button class="calendar__picker-year-option" data-value="4" role="option" tabindex="-1"></button>
              <button class="calendar__picker-year-option" data-value="5" role="option" tabindex="-1"></button>
              <button class="calendar__picker-year-option" data-value="6" role="option" tabindex="-1"></button>
              <button class="calendar__picker-year-option" data-value="7" role="option" tabindex="-1"></button>
              <button class="calendar__picker-year-option" data-value="8" role="option" tabindex="-1"></button>
              <button class="calendar__picker-year-option" data-value="9" role="option" tabindex="-1"></button>
              <button class="calendar__picker-year-option" data-value="10" role="option" tabindex="-1"></button>
              <button class="calendar__picker-year-option" data-value="11" role="option" tabindex="-1"></button>
              <button class="calendar__picker-year-arrow calendar__picker-year-arrow-left" aria-label="Previous year range" tabindex="-1">
                <span class="chevron-thin chevron-thin-left"></span>
              </button>
              <button class="calendar__picker-year-arrow calendar__picker-year-arrow-right" aria-label="Next year range" tabindex="-1">
                <span class="chevron-thin chevron-thin-right"></span>
              </button>
            </div>
          </div>
        </main>
      </div>
    `;

    // Store HTML element references

    this.calendarRoot = this.getCalendar().querySelector(`.${this.CAL_NAME}`) as HTMLElement;

    this.calendarHeader = this.getCalendar().querySelector(`.calendar__header`) as HTMLElement;

    this.calendarWeekdays = this.getCalendar().querySelector(`.calendar__weekdays`) as HTMLElement;

    this.calendarDays = this.getCalendar().querySelector(`.calendar__days`) as HTMLElement;

    this.pickerContainer = this.getCalendar().querySelector(`.calendar__picker`) as HTMLElement;

    this.pickerMonthContainer = this.getCalendar().querySelector(
      `.calendar__picker-month`
    ) as HTMLElement;

    this.pickerYearContainer = this.getCalendar().querySelector(
      `.calendar__picker-year`
    ) as HTMLElement;

    this.yearPickerChevronLeft = this.getCalendar().querySelector(
      `.calendar__picker-year-arrow-left`
    ) as HTMLElement;

    this.yearPickerChevronRight = this.getCalendar().querySelector(
      `.calendar__picker-year-arrow-right`
    ) as HTMLElement;

    // Mark today's month in month picker (only if viewing current year)
    this.updateMonthPickerTodaySelection();

    // Apply Layout Modifiers
    this.layoutModifiers.forEach((item) => {
      this.calendarRoot.classList.add(item);
    });

    // Shifts month and year header UI to be left aligned
    if (this.layoutModifiers.includes("month-left-align")) {
      this.calendarHeader.innerHTML = `
        <div class="calendar__monthyear">
          <button class="calendar__month" aria-label="Select month" aria-expanded="false"></button>&nbsp;
          <button class="calendar__year" aria-label="Select year" aria-expanded="false"></button>
        </div>
        <button class="calendar__arrow calendar__arrow-prev" aria-label="Previous month">
          <span class="calendar__arrow-inner"></span>
        </button>
        <button class="calendar__arrow calendar__arrow-next" aria-label="Next month">
          <span class="calendar__arrow-inner"></span>
        </button>
      `;
    }

    this.monthyearDisplay = this.getCalendar().querySelector(`.calendar__monthyear`) as HTMLElement;

    this.monthDisplay = this.getCalendar().querySelector(`.calendar__month`) as HTMLElement;

    this.yearDisplay = this.getCalendar().querySelector(`.calendar__year`) as HTMLElement;

    this.prevButton = this.getCalendar().querySelector(
      `.calendar__arrow-prev .calendar__arrow-inner`
    ) as HTMLElement;

    this.nextButton = this.getCalendar().querySelector(
      `.calendar__arrow-next .calendar__arrow-inner`
    ) as HTMLElement;

    // Set initial picker styles
    this.togglePicker(false);

    // Set CSS Variables based on options given
    this.configureStylePreferences();

    // Apply click listeners to HTML elements
    this.addEventListeners();

    this.reset(options.initialSelectedDate ? new Date(options.initialSelectedDate) : new Date());
  }

  /**
   * Resolves the container to an HTMLElement, handling string selectors, HTMLElement, and function-based container
   * @returns HTMLElement or null if not found
   */
  private resolveContainer(): HTMLElement | null {
    if (typeof this.container === "function") {
      return this.container();
    } else if (this.container instanceof HTMLElement) {
      return this.container;
    } else {
      return document.querySelector(this.container) as HTMLElement;
    }
  }

  /**
   * Gets the calendar element, ensuring it's not null
   * @returns HTMLElement
   * @throws Error if calendar is null
   */
  private getCalendar(): HTMLElement {
    if (!this.calendar) {
      throw new Error("[COLOR-CALENDAR] Calendar element is null");
    }
    return this.calendar;
  }

  reset(date: Date) {
    this.selectedDate = date ? date : new Date();
    this.currentViewDate = new Date(this.selectedDate);
    this.clearCalendarDays();
    this.updateMonthYear();
    this.updateMonthPickerSelection(this.currentViewDate.getMonth());
    this.updateMonthPickerTodaySelection();
    this.generatePickerYears();
    this.updateYearPickerSelection(this.currentViewDate.getFullYear(), 4);
    this.updateYearPickerTodaySelection();
    this.generateAndRenderWeekdays();
    this.generateDays();
    this.selectDayInitial(!!date);
    this.renderDays();
    this.setOldSelectedNode();

    if (this.onSelectedDateChange) {
      this.onSelectedDateChange(this.selectedDate, this.getDateEvents(this.selectedDate));
    }

    if (this.onMonthChange) {
      this.onMonthChange(this.currentViewDate, this.getMonthEvents());
    }
  }
}

/* Methods */
// Add Event Listeners
Calendar.prototype.addEventListeners = addEventListeners;
Calendar.prototype.handleCalendarClick = handleCalendarClick;
Calendar.prototype.handleKeyboardNavigation = handleKeyboardNavigation;
Calendar.prototype.handleCalendarDaysKeyboardNavigation = handleCalendarDaysKeyboardNavigation;
Calendar.prototype.navigateToDay = navigateToDay;
Calendar.prototype.selectDayFromKeyboard = selectDayFromKeyboard;
Calendar.prototype.focusDay = focusDay;
Calendar.prototype.handlePickerKeyboardNavigation = handlePickerKeyboardNavigation;
Calendar.prototype.handleMonthPickerKeyboardNavigation = handleMonthPickerKeyboardNavigation;
Calendar.prototype.handleYearPickerKeyboardNavigation = handleYearPickerKeyboardNavigation;

// Style Preference
Calendar.prototype.configureStylePreferences = configureStylePreferences;

// Picker
Calendar.prototype.togglePicker = picker.togglePicker;
Calendar.prototype.openPicker = picker.openPicker;
Calendar.prototype.closePicker = picker.closePicker;
Calendar.prototype.openYearPicker = picker.openYearPicker;
Calendar.prototype.openMonthPicker = picker.openMonthPicker;
Calendar.prototype.makeMonthPickerOptionsFocusable = picker.makeMonthPickerOptionsFocusable;
Calendar.prototype.makeYearPickerOptionsFocusable = picker.makeYearPickerOptionsFocusable;
Calendar.prototype.makeAllPickerOptionsUnfocusable = picker.makeAllPickerOptionsUnfocusable;
Calendar.prototype.makeAllCalendarDaysUnfocusable = picker.makeAllCalendarDaysUnfocusable;
Calendar.prototype.restoreCalendarDaysFocusability = picker.restoreCalendarDaysFocusability;
Calendar.prototype.focusSelectedYearOption = picker.focusSelectedYearOption;
Calendar.prototype.focusSelectedMonthOption = picker.focusSelectedMonthOption;

// Picker - Month
Calendar.prototype.handleMonthPickerClick = monthPicker.handleMonthPickerClick;
Calendar.prototype.updateMonthPickerSelection = monthPicker.updateMonthPickerSelection;
Calendar.prototype.updateMonthPickerTodaySelection = monthPicker.updateMonthPickerTodaySelection;
Calendar.prototype.removeMonthPickerSelection = monthPicker.removeMonthPickerSelection;

// Picker - Year
Calendar.prototype.handleYearPickerClick = yearPicker.handleYearPickerClick;
Calendar.prototype.updateYearPickerSelection = yearPicker.updateYearPickerSelection;
Calendar.prototype.updateYearPickerTodaySelection = yearPicker.updateYearPickerTodaySelection;
Calendar.prototype.removeYearPickerSelection = yearPicker.removeYearPickerSelection;
Calendar.prototype.generatePickerYears = yearPicker.generatePickerYears;
Calendar.prototype.handleYearChevronLeftClick = yearPicker.handleYearChevronLeftClick;
Calendar.prototype.handleYearChevronRightClick = yearPicker.handleYearChevronRightClick;

// Header
Calendar.prototype.setMonthDisplayType = header.setMonthDisplayType;
Calendar.prototype.handleMonthYearDisplayClick = header.handleMonthYearDisplayClick;
Calendar.prototype.handlePrevMonthButtonClick = header.handlePrevMonthButtonClick;
Calendar.prototype.handleNextMonthButtonClick = header.handleNextMonthButtonClick;
Calendar.prototype.updateMonthYear = header.updateMonthYear;

// Weekday
Calendar.prototype.setWeekdayDisplayType = weekday.setWeekdayDisplayType;
Calendar.prototype.generateAndRenderWeekdays = weekday.generateAndRenderWeekdays;

// Day
Calendar.prototype.setSelectedDate = day.setSelectedDate;
Calendar.prototype.getSelectedDate = day.getSelectedDate;
Calendar.prototype.clearCalendarDays = day.clearCalendarDays;
Calendar.prototype.updateCalendar = day.updateCalendar;
Calendar.prototype.setOldSelectedNode = day.setOldSelectedNode;
Calendar.prototype.selectDayInitial = day.selectDayInitial;
Calendar.prototype.ensureFirstDayFocusable = day.ensureFirstDayFocusable;
Calendar.prototype.makeFirstDayFocusable = day.makeFirstDayFocusable;
Calendar.prototype.handleCalendarDayClick = day.handleCalendarDayClick;
Calendar.prototype.removeOldDaySelection = day.removeOldDaySelection;
Calendar.prototype.updateSelectedDate = day.updateSelectedDate;
Calendar.prototype.updateCurrentDate = day.updateCurrentDate;
Calendar.prototype.generateDays = day.generateDays;
Calendar.prototype.renderDays = day.renderDays;
Calendar.prototype.rerenderSelectedDay = day.rerenderSelectedDay;

// Methods
Calendar.prototype.getEventsData = events.getEventsData;
Calendar.prototype.setEventsData = events.setEventsData;
Calendar.prototype.addEventsData = events.addEventsData;
Calendar.prototype.getDateEvents = events.getDateEvents;
Calendar.prototype.getMonthEvents = events.getMonthEvents;

// Re-export types
export type {
  CalendarSize,
  LayoutModifier,
  CalendarOptions,
  EventData,
  Day,
  MonthDisplayType,
  WeekdayDisplayType,
  Weekdays,
  StartWeekday,
};
