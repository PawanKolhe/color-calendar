export declare function setDate(date: Date): void;
export declare function getSelectedDate(): any;
/** Clear calendar day values */
export declare function clearCalendarDays(): void;
export declare function updateCalendar(isMonthChanged?: boolean): void;
export declare function setOldSelectedNode(): void;
/** Updates which element is to be selected when month changes */
export declare function selectDayInitial(setDate?: boolean): void;
/** Invoked on calendar day click */
export declare function handleCalendarDayClick(e: any): void;
export declare function removeOldDaySelection(): void;
/**
 *  0 - Do not change month
 * -1 - Go to previous month
 *  1 - Go to next month
 * @param {number} monthOffset - Months to go backward or forward
 * @param {number} [newDay] - Value of new day
 * @param {number} [newMonth] - Value of new month
 * @param {number} [newYear] - Value of new year
 */
export declare function updateCurrentDate(monthOffset: number, newDay?: number, newMonth?: number, newYear?: number): void;
/** Compute the day values in current month, and previous month number of days */
export declare function generateDays(): void;
/** Render days */
export declare function renderDays(): void;
/**
 * @param {HTMLElement} element - Element to rerender
 * @param {number} dayNum - Value of day
 * @param {boolean} [storeOldSelected] - Whether to store created element for later reference
 */
export declare function rerenderSelectedDay(element: HTMLElement, dayNum: number, storeOldSelected?: boolean): void;
