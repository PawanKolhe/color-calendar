export interface CalendarOptions {
    id?: string;
    eventsData?: EventData[];
    theme?: string;
    primaryColor?: string;
    headerColor?: string;
    headerBackgroundColor?: string;
    weekdaysColor?: string;
    weekdayType?: WeekdayType;
    monthDisplayType?: MonthDisplayType;
    startWeekday?: StartWeekday;
    fontFamilyHeader?: string;
    fontFamilyWeekdays?: string;
    fontFamilyBody?: string;
    dropShadow?: boolean;
    border?: string;
    borderRadius?: string;
    monthChanged?: (currentDate?: Date, filteredMonthEvents?: EventData[]) => void;
    dateChanged?: (currentDate?: Date, filteredDateEvents?: EventData[]) => void;
}
  
export interface EventData {
    start: string,
    end: string,
    [key: string]: any,
}

export interface Day {
    day: number,
    selected?: boolean,
}

export type MonthDisplayType = "short" | "long";

export  type WeekdayType = "short" | "long-lower" | "long-upper";

export type Weekdays = [string, string, string, string, string, string, string];

export type StartWeekday =  0 | 1 | 2 | 3 | 4 | 5 | 6;
  

export default class Calendar {
    readonly CAL_NAME = "color-calendar";
    readonly DAYS_TO_DISPLAY = 42;
    id: string;
    weekdayType: WeekdayType;
    monthDisplayType: MonthDisplayType;
    eventsData: EventData[];
    startWeekday: StartWeekday;
    theme: string;
    primaryColor?: string;
    fontFamilyHeader?: string;
    fontFamilyWeekdays?: string;
    fontFamilyBody?: string;
    dropShadow: boolean;
    border?: string;
    borderRadius?: string;
    headerColor?: string;
    headerBackgroundColor?: string;
    weekdaysColor?: string;
    monthChanged?: any;
    dateChanged?: any;
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
    calendar: HTMLElement;
    calendarMonthYear: HTMLElement;
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
    constructor(options?: CalendarOptions);
    resetCalendar(): void;
    initializeLayout(): void;
    /** Configure calendar style preferences */
    configureStylePreferences(): void;
    /** Clear calendar day values */
    clearCalendarDays(): void;
    updateCalendar(isMonthChanged?: boolean): void;
    setOldSelectedNode(): void;
    selectDayInitial(): void;
    getEventsData(): any;
    /** Set new events data array */
    setEventsData(data: EventData[]): EventData[];
    /** Add events to existing events data array */
    addEventsData(newEvents?: EventData[]): number;
    /** Invoked on month or year click */
    handleMonthYearDisplayClick(e: any): void;
    togglePicker(shouldOpen?: boolean): void;
    handleMonthPickerClick(e: any): void;
    updateMonthPickerSelection(newMonthValue: number): void;
    handleYearPickerClick(e: any): void;
    updateYearPickerSelection(newYearValue: number, newYearIndex?: number): void;
    removeYearPickerSelection(): void;
    generatePickerYears(): void;
    handleYearChevronLeftClick(): void;
    handleYearChevronRightClick(): void;
    /** Invoked on calendar day click */
    handleCalendarDayClick(e: any): void;
    getDateEvents(date: Date): EventData[];
    getMonthEvents(): EventData[];
    removeOldDaySelection(): void;
    handlePrevMonthButtonClick(): void;
    handleNextMonthButtonClick(): void;
    /**
     *  0 - Do not change month
     * -1 - Go to previous month
     *  1 - Go to next month
     * @param {number} monthOffset - Months to go backward or forward
     * @param {number} [newDay] - Value of new day
     * @param {number} [newMonth] - Value of new month
     */
    updateCurrentDate(monthOffset: number, newDay?: number, newMonth?: number, newYear?: number): void;
    /** Update Month and Year HTML */
    updateMonthYear(): void;
    generateWeekdays(): void;
    /** Compute the day values in current month, and previous month number of days */
    generateDays(): void;
    /** Render days */
    renderDays(): void;
    /**
     * @param {HTMLElement} element - Element to rerender
     * @param {number} dayNum - Value of day
     * @param {boolean} [storeOldSelected] - Whether to store created element for later reference
     */
    rerenderSelectedDay(element: HTMLElement, dayNum: number, storeOldSelected?: boolean): void;
}
