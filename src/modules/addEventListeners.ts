import type Calendar from "../index";

export function addEventListeners(this: Calendar) {
  // Use event delegation for better performance and reduced memory usage
  // Single event listener on calendar root handles all interactions
  this.calendarRoot.addEventListener("click", this.handleCalendarClick.bind(this));
  this.calendarRoot.addEventListener("keydown", this.handleKeyboardNavigation.bind(this));
}

/**
 * Centralized event handler using event delegation
 * This approach reduces memory usage and improves performance by using a single event listener
 */
export function handleCalendarClick(this: Calendar, e: MouseEvent) {
  const target = e.target as HTMLElement;

  // Handle navigation arrows
  if (target.closest(".calendar__arrow-prev .calendar__arrow-inner")) {
    this.handlePrevMonthButtonClick();
    return;
  }

  if (target.closest(".calendar__arrow-next .calendar__arrow-inner")) {
    this.handleNextMonthButtonClick();
    return;
  }

  // Handle month/year display click
  if (target.closest(".calendar__monthyear")) {
    this.handleMonthYearDisplayClick(e);
    return;
  }

  // Handle calendar day clicks
  if (target.closest(".calendar__days")) {
    this.handleCalendarDayClick(e);
    return;
  }

  // Handle month picker clicks
  if (target.closest(".calendar__picker-month")) {
    this.handleMonthPickerClick(e);
    return;
  }

  // Handle year picker chevron clicks (must come before year picker clicks)
  if (target.closest(".calendar__picker-year-arrow-left")) {
    e.preventDefault();
    e.stopPropagation();
    this.handleYearChevronLeftClick();
    return;
  }

  if (target.closest(".calendar__picker-year-arrow-right")) {
    e.preventDefault();
    e.stopPropagation();
    this.handleYearChevronRightClick();
    return;
  }

  // Handle year picker clicks
  if (target.closest(".calendar__picker-year")) {
    this.handleYearPickerClick(e);
    return;
  }
}

/**
 * Handles keyboard navigation for accessibility
 */
export function handleKeyboardNavigation(this: Calendar, e: KeyboardEvent) {
  const target = e.target as HTMLElement;

  // Handle navigation arrows
  if (target.closest(".calendar__arrow-prev")) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.handlePrevMonthButtonClick();
    }
    return;
  }

  if (target.closest(".calendar__arrow-next")) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.handleNextMonthButtonClick();
    }
    return;
  }

  // Handle month/year display
  if (target.closest(".calendar__month")) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // Create a synthetic mouse event for the month display click
      const syntheticEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        clientX: 0,
        clientY: 0,
        button: 0,
        buttons: 1,
      });
      Object.defineProperty(syntheticEvent, "target", { value: target });
      this.handleMonthYearDisplayClick(syntheticEvent);
    }
    return;
  }

  if (target.closest(".calendar__year")) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // Create a synthetic mouse event for the year display click
      const syntheticEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        clientX: 0,
        clientY: 0,
        button: 0,
        buttons: 1,
      });
      Object.defineProperty(syntheticEvent, "target", { value: target });
      this.handleMonthYearDisplayClick(syntheticEvent);
    }
    return;
  }

  // Handle calendar days grid navigation
  if (target.closest(".calendar__days")) {
    // Don't allow calendar days navigation if picker is open
    const isPickerOpen = this.pickerContainer.style.visibility !== "hidden";
    if (isPickerOpen) {
      return; // Block calendar days navigation when picker is open
    }
    this.handleCalendarDaysKeyboardNavigation(e);
    return;
  }

  // Handle picker navigation
  if (target.closest(".calendar__picker")) {
    this.handlePickerKeyboardNavigation(e);
    return;
  }
}

/**
 * Handles keyboard navigation within the calendar days grid
 */
export function handleCalendarDaysKeyboardNavigation(this: Calendar, e: KeyboardEvent) {
  const target = e.target as HTMLElement;
  const currentDay = target.closest(".calendar__day");

  if (!currentDay) {
    // No day is focused, check if there's a focusable day available
    const allDays = Array.from(
      this.calendarDays.querySelectorAll(".calendar__day")
    ) as HTMLElement[];
    const focusableDay = allDays.find((day) => day.getAttribute("tabindex") === "0");
    if (!focusableDay) {
      return; // No focusable day available
    }
    // Use the focusable day for navigation
    this.navigateToDay(focusableDay, e);
    return;
  }

  // Handle navigation from the currently focused day
  this.navigateToDay(currentDay as HTMLElement, e);
}

/**
 * Handles navigation to a specific day
 */
export function navigateToDay(this: Calendar, currentDay: HTMLElement, e: KeyboardEvent) {
  const allDays = Array.from(this.calendarDays.querySelectorAll(".calendar__day")) as HTMLElement[];
  const currentIndex = allDays.indexOf(currentDay);

  if (currentIndex === -1) return;

  let newIndex = currentIndex;
  let handled = false;

  switch (e.key) {
    case "ArrowLeft":
      e.preventDefault();
      newIndex = Math.max(0, currentIndex - 1);
      handled = true;
      break;
    case "ArrowRight":
      e.preventDefault();
      newIndex = Math.min(allDays.length - 1, currentIndex + 1);
      handled = true;
      break;
    case "ArrowUp":
      e.preventDefault();
      newIndex = Math.max(0, currentIndex - 7);
      handled = true;
      break;
    case "ArrowDown":
      e.preventDefault();
      newIndex = Math.min(allDays.length - 1, currentIndex + 7);
      handled = true;
      break;
    case "Enter":
    case " ":
      e.preventDefault();
      this.selectDayFromKeyboard(currentDay);
      return;
    case "Home":
      e.preventDefault();
      newIndex = 0;
      handled = true;
      break;
    case "End":
      e.preventDefault();
      newIndex = allDays.length - 1;
      handled = true;
      break;
  }

  if (handled && newIndex !== currentIndex) {
    const targetDay = allDays[newIndex];
    if (targetDay) {
      this.focusDay(targetDay);
    }
  }
}

/**
 * Selects a day from keyboard input
 */
export function selectDayFromKeyboard(this: Calendar, dayElement: HTMLElement) {
  if (!dayElement.classList.contains("calendar__day-active")) {
    return;
  }

  const dayText = dayElement.querySelector(".calendar__day-text");
  if (!dayText) return;

  const dayNum = parseInt(dayText.textContent || "0", 10);
  if (dayNum <= 0) return;

  const dayItem = this.daysIn_CurrentMonth[dayNum - 1];
  if (!dayItem) return;

  // Check if this day is already selected
  if (dayItem.selected) {
    return; // Day is already selected, do nothing
  }

  // Remove old selection and select new day
  this.removeOldDaySelection();
  this.updateSelectedDate(dayNum);
  dayItem.selected = true;
  this.rerenderSelectedDay(dayElement, dayNum, true);
}

/**
 * Focuses a specific day and updates tabindex
 */
export function focusDay(this: Calendar, dayElement: HTMLElement) {
  const allDays = Array.from(this.calendarDays.querySelectorAll(".calendar__day")) as HTMLElement[];

  // Update tabindex for all days
  allDays.forEach((day) => {
    day.setAttribute("tabindex", day === dayElement ? "0" : "-1");
  });

  // Focus the day
  dayElement.focus();
}

/**
 * Handles keyboard navigation within the picker
 */
export function handlePickerKeyboardNavigation(this: Calendar, e: KeyboardEvent) {
  const target = e.target as HTMLElement;

  // Handle month picker
  if (target.closest(".calendar__picker-month")) {
    this.handleMonthPickerKeyboardNavigation(e);
    return;
  }

  // Handle year picker
  if (target.closest(".calendar__picker-year")) {
    this.handleYearPickerKeyboardNavigation(e);
    return;
  }

  // Close picker on Escape
  if (e.key === "Escape") {
    e.preventDefault();
    this.togglePicker(false);
    // Focus the appropriate element based on picker type
    if (this.pickerType === "month" && this.monthDisplay) {
      this.monthDisplay.setAttribute("aria-expanded", "false");
      this.monthDisplay.focus();
    } else if (this.pickerType === "year" && this.yearDisplay) {
      this.yearDisplay.setAttribute("aria-expanded", "false");
      this.yearDisplay.focus();
    }
  }
}

/**
 * Handles keyboard navigation within the month picker
 */
export function handleMonthPickerKeyboardNavigation(this: Calendar, e: KeyboardEvent) {
  const target = e.target as HTMLElement;
  const currentOption = target.closest(".calendar__picker-month-option");

  if (!currentOption) return;

  const allOptions = Array.from(
    this.pickerMonthContainer.querySelectorAll(".calendar__picker-month-option")
  ) as HTMLElement[];
  const currentIndex = allOptions.indexOf(currentOption as HTMLElement);

  if (currentIndex === -1) return;

  let newIndex = currentIndex;
  let handled = false;

  switch (e.key) {
    case "ArrowLeft":
      e.preventDefault();
      newIndex = Math.max(0, currentIndex - 1);
      handled = true;
      break;
    case "ArrowRight":
      e.preventDefault();
      newIndex = Math.min(allOptions.length - 1, currentIndex + 1);
      handled = true;
      break;
    case "ArrowUp":
      e.preventDefault();
      newIndex = Math.max(0, currentIndex - 3);
      handled = true;
      break;
    case "ArrowDown":
      e.preventDefault();
      newIndex = Math.min(allOptions.length - 1, currentIndex + 3);
      handled = true;
      break;
    case "Enter":
    case " ":
      e.preventDefault();
      {
        const monthValue = parseInt(currentOption.getAttribute("data-value") || "0", 10);
        this.updateMonthPickerSelection(monthValue);
        this.updateCurrentDate(0, monthValue);
        this.togglePicker(false);
        if (this.monthDisplay) {
          this.monthDisplay.setAttribute("aria-expanded", "false");
          this.monthDisplay.focus();
        }
      }
      return;
  }

  if (handled && newIndex !== currentIndex) {
    // Update tabindex for all options
    allOptions.forEach((option, index) => {
      option.setAttribute("tabindex", index === newIndex ? "0" : "-1");
    });

    // Focus the new option
    allOptions[newIndex]?.focus();
  }
}

/**
 * Handles keyboard navigation within the year picker
 */
export function handleYearPickerKeyboardNavigation(this: Calendar, e: KeyboardEvent) {
  const target = e.target as HTMLElement;

  // Handle year picker arrow buttons
  if (target.closest(".calendar__picker-year-arrow-left")) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.handleYearChevronLeftClick();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      // Move focus to first year option
      const firstYearOption = this.pickerYearContainer?.querySelector(
        ".calendar__picker-year-option"
      ) as HTMLElement;
      if (firstYearOption) {
        firstYearOption.focus();
      }
    }
    return;
  }

  if (target.closest(".calendar__picker-year-arrow-right")) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.handleYearChevronRightClick();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      // Move focus to last year option
      const yearOptions = this.pickerYearContainer?.querySelectorAll(
        ".calendar__picker-year-option"
      );
      const lastYearOption = yearOptions?.[yearOptions.length - 1] as HTMLElement;
      if (lastYearOption) {
        lastYearOption.focus();
      }
    }
    return;
  }

  // Handle year picker options
  const currentOption = target.closest(".calendar__picker-year-option");
  if (!currentOption) return;

  const allOptions = Array.from(
    this.pickerYearContainer.querySelectorAll(".calendar__picker-year-option")
  ) as HTMLElement[];
  const currentIndex = allOptions.indexOf(currentOption as HTMLElement);

  if (currentIndex === -1) return;

  let newIndex = currentIndex;
  let handled = false;

  switch (e.key) {
    case "ArrowLeft":
      e.preventDefault();
      if (currentIndex === 0) {
        // Move focus to left arrow button
        if (this.yearPickerChevronLeft) {
          this.yearPickerChevronLeft.focus();
        }
        return;
      }
      newIndex = Math.max(0, currentIndex - 1);
      handled = true;
      break;
    case "ArrowRight":
      e.preventDefault();
      if (currentIndex === allOptions.length - 1) {
        // Move focus to right arrow button
        if (this.yearPickerChevronRight) {
          this.yearPickerChevronRight.focus();
        }
        return;
      }
      newIndex = Math.min(allOptions.length - 1, currentIndex + 1);
      handled = true;
      break;
    case "ArrowUp":
      e.preventDefault();
      newIndex = Math.max(0, currentIndex - 3);
      handled = true;
      break;
    case "ArrowDown":
      e.preventDefault();
      newIndex = Math.min(allOptions.length - 1, currentIndex + 3);
      handled = true;
      break;
    case "Enter":
    case " ":
      e.preventDefault();
      {
        const yearValue = parseInt(currentOption.textContent || "0", 10);
        this.updateYearPickerSelection(yearValue);
        this.updateCurrentDate(0, undefined, yearValue);
        this.togglePicker(false);
        if (this.yearDisplay) {
          this.yearDisplay.setAttribute("aria-expanded", "false");
          this.yearDisplay.focus();
        }
      }
      return;
  }

  if (handled && newIndex !== currentIndex) {
    // Update tabindex for all options
    allOptions.forEach((option, index) => {
      option.setAttribute("tabindex", index === newIndex ? "0" : "-1");
    });

    // Focus the new option
    allOptions[newIndex]?.focus();
  }
}
