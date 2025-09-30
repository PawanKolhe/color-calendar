import type Calendar from "../../index";
import type { Day, EventData, StartWeekday } from "../../types";

export function setDate(this: Calendar, date: Date) {
  if (!date) {
    return;
  }
  if (date instanceof Date) {
    this.reset(date);
  } else {
    this.reset(new Date(date));
  }
}

export function getSelectedDate(this: Calendar) {
  return this.currentDate;
}

/** Clear calendar day values */
export function clearCalendarDays(this: Calendar) {
  this.daysIn_PrevMonth = [];
  this.daysIn_CurrentMonth = [];
  this.daysIn_NextMonth = [];
}

export function updateCalendar(this: Calendar, isMonthChanged?: boolean) {
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

export function setOldSelectedNode(this: Calendar) {
  if (!this.oldSelectedNode) {
    let selectedNode: HTMLElement | undefined;
    for (let i = 1; i < this.calendarDays?.childNodes.length; i += 2) {
      const ele = this.calendarDays?.childNodes[i] as HTMLElement;
      if (
        ele.classList?.contains("calendar__day-active") &&
        ele.innerText === this.currentDate.getDate().toString()
      ) {
        selectedNode = ele;
        break;
      }
    }
    if (selectedNode) {
      this.oldSelectedNode = [selectedNode, parseInt(selectedNode.innerText, 10)];
    }
  }
}

/** Updates which element is to be selected when month changes */
export function selectDayInitial(this: Calendar, setDate?: boolean) {
  if (setDate) {
    const idx = this.currentDate.getDate() - 1;
    const dayItem = this.daysIn_CurrentMonth[idx];
    if (dayItem) {
      this.daysIn_CurrentMonth[idx] = {
        ...dayItem,
        selected: true,
      };
    }
  } else {
    const isTodayMonth = this.today.getMonth() === this.currentDate.getMonth();
    const isTodayDay = this.today.getDate() === this.currentDate.getDate();
    if (isTodayMonth && isTodayDay) {
      const idx = this.today.getDate() - 1;
      const todayDayItem = this.daysIn_CurrentMonth[idx];
      if (todayDayItem) {
        this.daysIn_CurrentMonth[idx] = {
          ...todayDayItem,
          selected: true,
        };
      }
    } else {
      const firstDayItem = this.daysIn_CurrentMonth[0];
      if (firstDayItem) {
        this.daysIn_CurrentMonth[0] = {
          ...firstDayItem,
          selected: true,
        };
      }
    }
  }
}

/** Invoked on calendar day click */
export function handleCalendarDayClick(this: Calendar, e: MouseEvent) {
  // Filter out unwanted click events
  const target = e.target as HTMLElement;
  if (
    !(
      target.classList.contains("calendar__day-box") ||
      target.classList.contains("calendar__day-text") ||
      target.classList.contains("calendar__day-box-today") ||
      target.classList.contains("calendar__day-bullet")
    )
  ) {
    return;
  }

  // Check if Day click is disabled
  if (this.disableDayClick) {
    return;
  }

  // Error check for old selected node
  if (this.oldSelectedNode && !this.oldSelectedNode[0]) {
    return;
  }

  // Invoke user provided callback
  if (target.parentElement?.classList.contains("calendar__day-selected")) {
    if (this.selectedDateClicked) {
      this.selectedDateClicked(this.currentDate, this.getDateEvents(this.currentDate));
    }
    return;
  }

  // Find which day of the month is clicked
  const day = target.parentElement?.innerText || "0";
  const dayNum = parseInt(day, 10);

  //Remove old day selection
  this.removeOldDaySelection();

  // Select clicked day
  if (day) {
    this.updateCurrentDate(0, dayNum);
    const dayItem = this.daysIn_CurrentMonth[dayNum - 1];
    if (dayItem) {
      Object.assign(dayItem, { selected: true });
    }
    const parentElement = target.parentElement;
    if (parentElement) {
      this.rerenderSelectedDay(parentElement, dayNum, true);
    }
  }
}

export function removeOldDaySelection(this: Calendar) {
  if (this.oldSelectedNode) {
    const idx = this.oldSelectedNode[1] - 1;
    const dayItem = this.daysIn_CurrentMonth[idx];
    if (dayItem) {
      Object.assign(dayItem, {
        selected: false,
      });
    }
    this.rerenderSelectedDay(this.oldSelectedNode[0], this.oldSelectedNode[1]);
  }
}

/**
 *  0 - Do not change month
 * -1 - Go to previous month
 *  1 - Go to next month
 * @param {number} monthOffset - Months to go backward or forward
 * @param {number} [newDay] - Value of new day
 * @param {number} [newMonth] - Value of new month
 * @param {number} [newYear] - Value of new year
 */
export function updateCurrentDate(
  this: Calendar,
  monthOffset: number,
  newDay?: number,
  newMonth?: number,
  newYear?: number
) {
  this.currentDate = new Date(
    newYear ? newYear : this.currentDate.getFullYear(),
    newMonth !== undefined && newMonth !== null
      ? newMonth
      : this.currentDate.getMonth() + monthOffset,
    monthOffset !== 0 || !newDay ? 1 : newDay
  );

  if (monthOffset !== 0 || (newMonth !== undefined && newMonth !== null) || newYear) {
    this.updateCalendar(true);
    // Invoke user provided monthChanged callback
    if (this.monthChanged) {
      this.monthChanged(this.currentDate, this.getMonthEvents());
    }
  }
  // Invoke user provided callback
  if (this.dateChanged) {
    this.dateChanged(this.currentDate, this.getDateEvents(this.currentDate));
  }
}

/** Compute the day values in current month, and previous month number of days */
export function generateDays(this: Calendar) {
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
export function renderDays(this: Calendar) {
  let insertCount = 0;

  // Filter events data to this month only
  const currentYear = this.currentDate.getFullYear();
  const currentMonth = this.currentDate.getMonth();
  this.filteredEventsThisMonth = this.eventsData.filter((event: EventData) => {
    const eventDate = new Date(event.start);
    if (eventDate.getFullYear() === currentYear && eventDate.getMonth() === currentMonth) {
      return true;
    } else {
      return false;
    }
  });

  // Create object of all days that have events - for creating event bullets
  this.eventDayMap = new Map();
  this.filteredEventsThisMonth.forEach((event: EventData) => {
    const start = new Date(event.start).getDate();
    const end = new Date(event.end).getDate();
    for (let i = start; i <= end; i++) {
      this.eventDayMap.set(i.toString(), [event]);
    }
  });

  // Weekday Offset calculation
  let dayOffset: number;
  if (this.firstDay_CurrentMonth < this.startWeekday) {
    dayOffset = 7 + this.firstDay_CurrentMonth - this.startWeekday;
  } else {
    dayOffset = this.firstDay_CurrentMonth - this.startWeekday;
  }

  let newHTML = "";

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
  const isTodayYear = this.today.getFullYear() === this.currentDate.getFullYear();
  const isTodayMonth = this.today.getMonth() === this.currentDate.getMonth() && isTodayYear;
  this.daysIn_CurrentMonth.forEach((day: Day) => {
    const isTodayDate = isTodayMonth && day.day === this.today.getDate();
    newHTML += `
      <div class="calendar__day calendar__day-active${isTodayDate ? " calendar__day-today" : ""}${
        this.eventDayMap.has(day.day.toString())
          ? " calendar__day-event"
          : " calendar__day-no-event"
      }${day.selected ? " calendar__day-selected" : ""}">
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
export function rerenderSelectedDay(
  this: Calendar,
  element: HTMLElement,
  dayNum: number,
  storeOldSelected?: boolean
) {
  // Get reference to previous day (day before target day)
  const previousElement = element.previousElementSibling;

  // Create new target day element
  const isTodayYear = this.today.getFullYear() === this.currentDate.getFullYear();
  const isTodayMonth = this.today.getMonth() === this.currentDate.getMonth() && isTodayYear;
  const isTodayDate = isTodayMonth && dayNum === this.today.getDate();
  const div = document.createElement("div");
  div.className += `calendar__day calendar__day-active${isTodayDate ? " calendar__day-today" : ""}${
    this.eventDayMap.has(dayNum.toString()) ? " calendar__day-event" : " calendar__day-no-event"
  }${this.daysIn_CurrentMonth[dayNum - 1]?.selected ? " calendar__day-selected" : ""}`;
  div.innerHTML = `
    <span class="calendar__day-text">${dayNum}</span>
    <div class="calendar__day-bullet"></div>
    <div class="calendar__day-box"></div>
  `;

  // Insert newly created target day to DOM
  if (!previousElement) {
    // Handle edge case when it is the first element in the calendar
    this.calendarDays.insertBefore(div, element);
  } else {
    if (previousElement.parentElement) {
      previousElement.parentElement.insertBefore(div, previousElement.nextSibling);
    } else {
      console.log("Previous element does not have parent");
    }
  }

  // Store this element for later reference
  if (storeOldSelected) {
    this.oldSelectedNode = [div, dayNum];
  }

  // Remove target day from DOM
  element?.remove();
}
