import type Calendar from "../../index";
import type { Day, EventData, StartWeekday } from "../../types";

export function setSelectedDate(this: Calendar, date: Date | null) {
  if (date === null) {
    this.reset(null);
  } else if (date instanceof Date) {
    this.reset(date);
  } else {
    this.reset(new Date(date));
  }
}

export function getSelectedDate(this: Calendar) {
  return this.selectedDate;
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
    // After rendering, ensure first day is focusable if no date is selected
    this.ensureFirstDayFocusable();
  }
}

export function setOldSelectedNode(this: Calendar) {
  if (!this.oldSelectedNode && this.selectedDate) {
    let selectedNode: HTMLElement | undefined;
    for (let i = 1; i < this.calendarDays?.childNodes.length; i += 2) {
      const ele = this.calendarDays?.childNodes[i] as HTMLElement;
      if (
        ele.classList?.contains("calendar__day-active") &&
        ele.innerText === this.selectedDate.getDate().toString()
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
  if (setDate && this.selectedDate) {
    // Only select a date when explicitly setting a date (like during reset with a specific date)
    const idx = this.selectedDate.getDate() - 1;
    const dayItem = this.daysIn_CurrentMonth[idx];
    if (dayItem) {
      this.daysIn_CurrentMonth[idx] = {
        ...dayItem,
        selected: true,
      };
    }
  } else if (this.selectedDate) {
    // During month navigation, only select if the selected date exists in the current month
    const selectedDateInCurrentMonth =
      this.selectedDate.getFullYear() === this.currentViewDate.getFullYear() &&
      this.selectedDate.getMonth() === this.currentViewDate.getMonth();

    if (selectedDateInCurrentMonth) {
      const idx = this.selectedDate.getDate() - 1;
      const dayItem = this.daysIn_CurrentMonth[idx];
      if (dayItem) {
        this.daysIn_CurrentMonth[idx] = {
          ...dayItem,
          selected: true,
        };
      }
    }
    // If selected date is not in current month, don't select anything
  }
  // If selectedDate is null, don't select anything
}

/**
 * Ensures the first day of the month is focusable when no date is selected
 */
export function ensureFirstDayFocusable(this: Calendar) {
  // Check if any day is currently selected
  const hasSelectedDay = this.daysIn_CurrentMonth.some((day) => day.selected);

  if (!hasSelectedDay) {
    // No day is selected, make first day focusable
    this.makeFirstDayFocusable();
  }
}

/**
 * Makes the first day of the current month focusable without automatically focusing it
 */
export function makeFirstDayFocusable(this: Calendar) {
  const allDays = Array.from(
    this.calendarDays?.querySelectorAll(".calendar__day") || []
  ) as HTMLElement[];
  const activeDays = allDays.filter((day) => day.classList.contains("calendar__day-active"));

  // Find the first day of the current month (day number 1)
  const firstDayOfMonth = activeDays.find((day) => {
    const dayText = day.querySelector(".calendar__day-text");
    if (dayText) {
      const dayNum = parseInt(dayText.textContent || "0", 10);
      return dayNum === 1;
    }
    return false;
  });

  if (firstDayOfMonth) {
    // Don't make days focusable if picker is open
    const isPickerOpen = this.pickerContainer.style.visibility !== "hidden";
    // Set tabindex for all days - first day gets tabindex="0" only if picker is closed, others get tabindex="-1"
    allDays.forEach((day) => {
      day.setAttribute("tabindex", day === firstDayOfMonth && !isPickerOpen ? "0" : "-1");
    });
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

  // Find the day element
  const dayElement = target.closest(".calendar__day") as HTMLElement;
  if (!dayElement) return;

  // Check if this is already the selected day
  if (dayElement.classList.contains("calendar__day-selected")) {
    if (this.onSelectedDateClick && this.selectedDate) {
      this.onSelectedDateClick(this.selectedDate, this.getDateEvents(this.selectedDate));
    }
    return;
  }

  // Get the day number from the day text element
  const dayTextElement = dayElement.querySelector(".calendar__day-text");
  if (!dayTextElement) return;

  const dayNum = parseInt(dayTextElement.textContent || "0", 10);
  if (dayNum <= 0) return;

  // Determine if this is a current month day or previous/next month day
  const isCurrentMonth = dayElement.classList.contains("calendar__day-active");
  const isOtherMonth = dayElement.classList.contains("calendar__day-other");

  let clickedDate: Date;

  if (isCurrentMonth) {
    // Current month day
    clickedDate = new Date(
      this.currentViewDate.getFullYear(),
      this.currentViewDate.getMonth(),
      dayNum
    );
  } else if (isOtherMonth) {
    // Determine if it's previous or next month based on position in calendar grid
    const allDays = Array.from(
      this.calendarDays.querySelectorAll(".calendar__day")
    ) as HTMLElement[];
    const currentDayIndex = allDays.indexOf(dayElement);

    // Calculate the day offset for the current month
    let dayOffset: number;
    if (this.firstDay_CurrentMonth < this.startWeekday) {
      dayOffset = 7 + this.firstDay_CurrentMonth - this.startWeekday;
    } else {
      dayOffset = this.firstDay_CurrentMonth - this.startWeekday;
    }

    if (currentDayIndex < dayOffset) {
      // Previous month day
      clickedDate = new Date(
        this.currentViewDate.getFullYear(),
        this.currentViewDate.getMonth() - 1,
        dayNum
      );
    } else {
      // Next month day
      clickedDate = new Date(
        this.currentViewDate.getFullYear(),
        this.currentViewDate.getMonth() + 1,
        dayNum
      );
    }
  } else {
    // Fallback - should not happen with proper calendar structure
    clickedDate = new Date(
      this.currentViewDate.getFullYear(),
      this.currentViewDate.getMonth(),
      dayNum
    );
  }

  // Update selected date
  this.selectedDate = clickedDate;

  // Remove old day selection
  this.removeOldDaySelection();

  // Update the day item if it's a current month day
  if (isCurrentMonth) {
    const dayItem = this.daysIn_CurrentMonth[dayNum - 1];
    if (dayItem) {
      Object.assign(dayItem, { selected: true });
    }
    this.rerenderSelectedDay(dayElement, dayNum, true);
  } else if (isOtherMonth) {
    // For previous/next month days, we need to navigate to that month first
    this.updateCurrentDate(0, clickedDate.getMonth(), clickedDate.getFullYear());
    // Then select the day
    const dayItem = this.daysIn_CurrentMonth[dayNum - 1];
    if (dayItem) {
      Object.assign(dayItem, { selected: true });
    }
    // Re-render the day after navigation
    setTimeout(() => {
      const newDayElement = this.calendarDays.querySelector(
        `[aria-label*="${clickedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}"]`
      ) as HTMLElement;
      if (newDayElement) {
        this.rerenderSelectedDay(newDayElement, dayNum, true);
      }
    }, 0);
  }

  // Invoke user provided callback
  if (this.onSelectedDateChange) {
    this.onSelectedDateChange(
      this.selectedDate,
      this.selectedDate ? this.getDateEvents(this.selectedDate) : []
    );
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
 * Updates the selected date when a day is clicked
 * @param {number} newDay - Value of new day
 */
export function updateSelectedDate(this: Calendar, newDay: number) {
  this.selectedDate = new Date(
    this.currentViewDate.getFullYear(),
    this.currentViewDate.getMonth(),
    newDay
  );

  // Invoke user provided onSelectedDateChange callback only for actual date selection
  if (this.onSelectedDateChange) {
    this.onSelectedDateChange(this.selectedDate, this.getDateEvents(this.selectedDate));
  }
}

/**
 * Updates the current view (month/year) for navigation
 *  0 - Do not change month
 * -1 - Go to previous month
 *  1 - Go to next month
 * @param {number} monthOffset - Months to go backward or forward
 * @param {number} [newMonth] - Value of new month
 * @param {number} [newYear] - Value of new year
 */
export function updateCurrentDate(
  this: Calendar,
  monthOffset: number,
  newMonth?: number,
  newYear?: number
) {
  this.currentViewDate = new Date(
    newYear ? newYear : this.currentViewDate.getFullYear(),
    newMonth !== undefined && newMonth !== null
      ? newMonth
      : this.currentViewDate.getMonth() + monthOffset,
    1
  );

  this.updateCalendar(true);
  // Update month picker today marker based on current year
  this.updateMonthPickerTodaySelection();
  // Invoke user provided onMonthChange callback
  if (this.onMonthChange) {
    this.onMonthChange(this.currentViewDate, this.getMonthEvents());
  }
}

/** Compute the day values in current month, and previous month number of days */
export function generateDays(this: Calendar) {
  // Previous Month
  // this.firstDay_PrevMonth = new Date(this.currentViewDate.getFullYear(), this.currentViewDate.getMonth() - 1, 1).getDay() as StartWeekday;
  this.numOfDays_PrevMonth = new Date(
    this.currentViewDate.getFullYear(),
    this.currentViewDate.getMonth(),
    0
  ).getDate();
  // for (let i = 0; i < this.numOfDays_PrevMonth; i++) {
  //   this.daysIn_PrevMonth.push({ day: i + 1, selected: false });
  // }

  // Current Month
  this.firstDay_CurrentMonth = new Date(
    this.currentViewDate.getFullYear(),
    this.currentViewDate.getMonth(),
    1
  ).getDay() as StartWeekday;
  this.numOfDays_CurrentMonth = new Date(
    this.currentViewDate.getFullYear(),
    this.currentViewDate.getMonth() + 1,
    0
  ).getDate();
  for (let i = 0; i < this.numOfDays_CurrentMonth; i++) {
    this.daysIn_CurrentMonth.push({ day: i + 1, selected: false });
  }

  // Next Month
  // this.firstDay_NextMonth = new Date(this.currentViewDate.getFullYear(), this.currentViewDate.getMonth() + 1, 1).getDay() as StartWeekday;
  // this.numOfDays_NextMonth = new Date(this.currentViewDate.getFullYear(), this.currentViewDate.getMonth(), 0).getDate();
  // for (let i = 0; i < this.numOfDays_NextMonth; i++) {
  //   this.daysIn_NextMonth.push({ day: i + 1, selected: false });
  // }
}

/** Render days */
export function renderDays(this: Calendar) {
  let insertCount = 0;

  // Filter events data to this month only
  const currentYear = this.currentViewDate.getFullYear();
  const currentMonth = this.currentViewDate.getMonth();
  this.filteredEventsThisMonth = this.eventsData.filter((event: EventData) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    // Check if event overlaps with current month
    const eventStartYear = eventStart.getFullYear();
    const eventStartMonth = eventStart.getMonth();
    const eventEndYear = eventEnd.getFullYear();
    const eventEndMonth = eventEnd.getMonth();

    // Event starts in current month
    if (eventStartYear === currentYear && eventStartMonth === currentMonth) {
      return true;
    }

    // Event ends in current month
    if (eventEndYear === currentYear && eventEndMonth === currentMonth) {
      return true;
    }

    // Event spans across current month (starts before and ends after)
    if (
      eventStartYear < currentYear ||
      (eventStartYear === currentYear && eventStartMonth < currentMonth)
    ) {
      if (
        eventEndYear > currentYear ||
        (eventEndYear === currentYear && eventEndMonth > currentMonth)
      ) {
        return true;
      }
    }

    return false;
  });

  // Create object of all days that have events - for creating event bullets
  this.eventDayMap = new Map();
  this.filteredEventsThisMonth.forEach((event: EventData) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    // Calculate the range of days to show for this event in the current month
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0);

    // Determine the actual start and end days to display
    const displayStart = eventStart >= currentMonthStart ? eventStart.getDate() : 1;
    const displayEnd = eventEnd <= currentMonthEnd ? eventEnd.getDate() : currentMonthEnd.getDate();

    for (let i = displayStart; i <= displayEnd; i++) {
      const dayKey = i.toString();
      if (!this.eventDayMap.has(dayKey)) {
        this.eventDayMap.set(dayKey, []);
      }
      const dayEvents = this.eventDayMap.get(dayKey);
      if (dayEvents) {
        dayEvents.push(event);
      }
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
    const dayNum = this.numOfDays_PrevMonth + 1 - dayOffset + i;
    const prevMonthDate = new Date(
      this.currentViewDate.getFullYear(),
      this.currentViewDate.getMonth() - 1,
      dayNum
    );
    newHTML += `
      <div class="calendar__day calendar__day-other" role="gridcell" aria-label="${prevMonthDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}" tabindex="-1">${dayNum}</div>
    `;
    insertCount++;
  }

  // Current Month
  const isTodayYear = this.today.getFullYear() === this.currentViewDate.getFullYear();
  const isTodayMonth = this.today.getMonth() === this.currentViewDate.getMonth() && isTodayYear;
  this.daysIn_CurrentMonth.forEach((day: Day) => {
    const isTodayDate = isTodayMonth && day.day === this.today.getDate();
    const dayEvents = this.eventDayMap.get(day.day.toString()) || [];
    const currentDate = new Date(
      this.currentViewDate.getFullYear(),
      this.currentViewDate.getMonth(),
      day.day
    );

    // Generate bullets for each event with their specific colors
    let eventBullets = "";
    if (this.eventBulletMode === "multiple") {
      // Multiple bullets mode - show one bullet per event (max 5 to avoid overflow)
      const maxBullets = Math.min(dayEvents.length, 5);
      eventBullets = dayEvents
        .slice(0, maxBullets)
        .map((event, index) => {
          const eventColor = event["color"] || this.primaryColor || "var(--cal-color-primary)";
          return `<div class="calendar__day-bullet" style="background-color: ${eventColor}; left: calc(50% + ${index * 6 - (maxBullets - 1) * 3}px);"></div>`;
        })
        .join("");
    } else {
      // Single bullet mode - show one bullet using the first event's color or primary color
      if (dayEvents.length > 0) {
        const firstEvent = dayEvents[0];
        if (firstEvent) {
          const eventColor = firstEvent["color"] || this.primaryColor || "var(--cal-color-primary)";
          eventBullets = `<div class="calendar__day-bullet" style="background-color: ${eventColor}; left: 50%;"></div>`;
        }
      }
    }

    // Create accessible label for the day
    let ariaLabel = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (isTodayDate) {
      ariaLabel += ", Today";
    }
    if (day.selected) {
      ariaLabel += ", Selected";
    }
    if (dayEvents.length > 0) {
      ariaLabel += `, ${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}`;
    }

    // Don't make days focusable if picker is open
    const isPickerOpen = this.pickerContainer.style.visibility !== "hidden";
    const tabIndex = day.selected && !isPickerOpen ? "0" : "-1";

    newHTML += `
      <div class="calendar__day calendar__day-active${isTodayDate ? " calendar__day-today" : ""}${
        dayEvents.length > 0 ? " calendar__day-event" : " calendar__day-no-event"
      }${day.selected ? " calendar__day-selected" : ""}" 
           role="gridcell" 
           aria-label="${ariaLabel}" 
           tabindex="${tabIndex}"
           aria-selected="${day.selected ? "true" : "false"}">
        <span class="calendar__day-text">${day.day}</span>
        ${eventBullets}
        <div class="calendar__day-box"></div>
      </div>
    `;
    insertCount++;
  });

  // Next Month (Light)
  for (let i = 0; i < this.DAYS_TO_DISPLAY - insertCount; i++) {
    const dayNum = i + 1;
    const nextMonthDate = new Date(
      this.currentViewDate.getFullYear(),
      this.currentViewDate.getMonth() + 1,
      dayNum
    );
    newHTML += `
      <div class="calendar__day calendar__day-other" role="gridcell" aria-label="${nextMonthDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}" tabindex="-1">${dayNum}</div>
    `;
  }

  // Update DOM synchronously
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
  // Simply update the existing element's attributes instead of replacing it
  const isTodayYear = this.today.getFullYear() === this.currentViewDate.getFullYear();
  const isTodayMonth = this.today.getMonth() === this.currentViewDate.getMonth();
  const isTodayDate = isTodayYear && isTodayMonth && dayNum === this.today.getDate();
  const dayEvents = this.eventDayMap.get(dayNum.toString()) || [];
  const isSelected = Boolean(this.daysIn_CurrentMonth[dayNum - 1]?.selected);

  // Update classes
  element.className = `calendar__day calendar__day-active${
    isTodayDate ? " calendar__day-today" : ""
  }${
    dayEvents.length > 0 ? " calendar__day-event" : " calendar__day-no-event"
  }${isSelected ? " calendar__day-selected" : ""}`;

  // Update ARIA attributes
  const currentDate = new Date(
    this.currentViewDate.getFullYear(),
    this.currentViewDate.getMonth(),
    dayNum
  );
  let ariaLabel = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  if (isTodayDate) {
    ariaLabel += ", Today";
  }
  if (isSelected) {
    ariaLabel += ", Selected";
  }
  if (dayEvents.length > 0) {
    ariaLabel += `, ${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}`;
  }

  element.setAttribute("aria-label", ariaLabel);
  // Don't make days focusable if picker is open
  const isPickerOpen = this.pickerContainer.style.visibility !== "hidden";
  element.setAttribute("tabindex", isSelected && !isPickerOpen ? "0" : "-1");
  element.setAttribute("aria-selected", isSelected ? "true" : "false");

  // Update event bullets in the innerHTML
  let eventBullets = "";
  if (this.eventBulletMode === "multiple") {
    const maxBullets = Math.min(dayEvents.length, 5);
    eventBullets = dayEvents
      .slice(0, maxBullets)
      .map((event, index) => {
        const eventColor = event["color"] || this.primaryColor || "#007bff";
        return `<div class="calendar__day-bullet" style="background-color: ${eventColor}; left: calc(50% + ${index * 6 - (maxBullets - 1) * 3}px);"></div>`;
      })
      .join("");
  } else {
    if (dayEvents.length > 0) {
      const firstEvent = dayEvents[0];
      if (firstEvent) {
        const eventColor = firstEvent["color"] || this.primaryColor || "#007bff";
        eventBullets = `<div class="calendar__day-bullet" style="background-color: ${eventColor}; left: 50%;"></div>`;
      }
    }
  }

  // Update innerHTML while preserving the day text
  const dayText = element.querySelector(".calendar__day-text");
  if (dayText) {
    element.innerHTML = `
      <span class="calendar__day-text">${dayText.textContent}</span>
      ${eventBullets}
      <div class="calendar__day-box"></div>
    `;
  }

  // Store old selected node if requested
  if (storeOldSelected && isSelected) {
    this.oldSelectedNode = [element, dayNum];
  }
}
