import type Calendar from "../../index";

export function togglePicker(this: Calendar, shouldOpen?: boolean) {
  if (shouldOpen === true) {
    openPicker.call(this);
  } else if (shouldOpen === false) {
    closePicker.call(this);
  } else {
    // Toggle based on current state
    if (this.pickerContainer.style.visibility === "hidden") {
      openPicker.call(this);
    } else {
      closePicker.call(this);
    }
  }
}

/**
 * Opens the picker and sets up focus for the appropriate picker type
 */
export function openPicker(this: Calendar) {
  this.pickerContainer.style.visibility = "visible";
  this.pickerContainer.style.opacity = "1";
  this.pickerContainer.setAttribute("aria-hidden", "false");

  if (this.pickerType === "year") {
    openYearPicker.call(this);
  } else if (this.pickerType === "month") {
    openMonthPicker.call(this);
  }

  // Make all calendar days unfocusable after picker is fully set up
  setTimeout(() => {
    this.makeAllCalendarDaysUnfocusable();
  }, 0);
}

/**
 * Closes the picker and cleans up focus states
 */
export function closePicker(this: Calendar) {
  this.pickerContainer.style.visibility = "hidden";
  this.pickerContainer.style.opacity = "0";
  this.pickerContainer.setAttribute("aria-hidden", "true");

  // Make year picker arrows not focusable when picker is closed
  if (this.yearPickerChevronLeft) {
    this.yearPickerChevronLeft.setAttribute("tabindex", "-1");
  }
  if (this.yearPickerChevronRight) {
    this.yearPickerChevronRight.setAttribute("tabindex", "-1");
  }

  // Make all picker options not focusable when picker is closed
  this.makeAllPickerOptionsUnfocusable();

  // Restore calendar days focusability when picker is closed
  this.restoreCalendarDaysFocusability();

  if (this.monthDisplay && this.yearDisplay) {
    this.monthDisplay.style.opacity = "1";
    this.yearDisplay.style.opacity = "1";
    this.monthDisplay.setAttribute("aria-expanded", "false");
    this.yearDisplay.setAttribute("aria-expanded", "false");
  }

  this.yearPickerOffsetTemporary = 0;
}

/**
 * Opens the year picker with proper focus management
 */
export function openYearPicker(this: Calendar) {
  // Prepare the year picker DOM
  this.generatePickerYears();

  // Make year picker arrows focusable
  if (this.yearPickerChevronLeft) {
    this.yearPickerChevronLeft.setAttribute("tabindex", "0");
  }
  if (this.yearPickerChevronRight) {
    this.yearPickerChevronRight.setAttribute("tabindex", "0");
  }

  // Make year picker options focusable
  this.makeYearPickerOptionsFocusable();

  // Focus the selected year option after all DOM operations are complete
  setTimeout(() => {
    this.focusSelectedYearOption();
  }, 50);
}

/**
 * Opens the month picker with proper focus management
 */
export function openMonthPicker(this: Calendar) {
  // Make month picker options focusable
  this.makeMonthPickerOptionsFocusable();

  // Focus the selected month option after DOM is ready
  setTimeout(() => {
    this.focusSelectedMonthOption();
  }, 10);
}

/**
 * Makes month picker options focusable
 */
export function makeMonthPickerOptionsFocusable(this: Calendar) {
  const monthOptions = this.pickerMonthContainer?.querySelectorAll(
    ".calendar__picker-month-option"
  );
  monthOptions?.forEach((option) => {
    (option as HTMLElement).setAttribute("tabindex", "0");
  });
}

/**
 * Makes year picker options focusable
 */
export function makeYearPickerOptionsFocusable(this: Calendar) {
  const yearOptions = this.pickerYearContainer?.querySelectorAll(".calendar__picker-year-option");
  yearOptions?.forEach((option) => {
    (option as HTMLElement).setAttribute("tabindex", "0");
  });
}

/**
 * Makes all picker options unfocusable
 */
export function makeAllPickerOptionsUnfocusable(this: Calendar) {
  const monthOptions = this.pickerMonthContainer?.querySelectorAll(
    ".calendar__picker-month-option"
  );
  monthOptions?.forEach((option) => {
    (option as HTMLElement).setAttribute("tabindex", "-1");
  });

  const yearOptions = this.pickerYearContainer?.querySelectorAll(".calendar__picker-year-option");
  yearOptions?.forEach((option) => {
    (option as HTMLElement).setAttribute("tabindex", "-1");
  });
}

/**
 * Makes all calendar days unfocusable
 */
export function makeAllCalendarDaysUnfocusable(this: Calendar) {
  const allDays = this.calendarDays?.querySelectorAll(".calendar__day");
  allDays?.forEach((day) => {
    (day as HTMLElement).setAttribute("tabindex", "-1");
  });
}

/**
 * Restores calendar days focusability based on selection state
 */
export function restoreCalendarDaysFocusability(this: Calendar) {
  const allDays = this.calendarDays?.querySelectorAll(".calendar__day");
  if (!allDays) return;

  allDays.forEach((day) => {
    const dayElement = day as HTMLElement;
    const isSelected = dayElement.classList.contains("calendar__day-selected");
    dayElement.setAttribute("tabindex", isSelected ? "0" : "-1");
  });

  // If no day is selected, make first day focusable
  const hasSelectedDay = Array.from(allDays).some((day) =>
    day.classList.contains("calendar__day-selected")
  );
  if (!hasSelectedDay) {
    this.makeFirstDayFocusable();
  }
}

/**
 * Focuses the selected year option without updating selection
 */
export function focusSelectedYearOption(this: Calendar) {
  const currentYear = this.currentViewDate.getFullYear();

  // Find the year option that matches current year
  const yearOptions = this.pickerYearContainer?.querySelectorAll(".calendar__picker-year-option");
  if (!yearOptions || yearOptions.length === 0) return;

  // First, make all options unfocusable
  yearOptions.forEach((opt) => {
    (opt as HTMLElement).setAttribute("tabindex", "-1");
  });

  // Find and focus the matching option
  for (let i = 0; i < yearOptions.length; i++) {
    const option = yearOptions[i] as HTMLElement;
    const optionYear = parseInt(option.textContent || "0", 10);

    if (optionYear === currentYear) {
      // Make this option focusable
      option.setAttribute("tabindex", "0");

      // Focus the matching option with a small delay to ensure DOM is stable
      setTimeout(() => {
        option.focus();
      }, 0);
      break;
    }
  }
}

/**
 * Focuses the selected month option without updating selection
 */
export function focusSelectedMonthOption(this: Calendar) {
  const currentMonth = this.currentViewDate.getMonth();

  // Find the month option that matches current month
  const monthOptions = this.pickerMonthContainer?.querySelectorAll(
    ".calendar__picker-month-option"
  );
  if (!monthOptions) return;

  for (let i = 0; i < monthOptions.length; i++) {
    const option = monthOptions[i] as HTMLElement;
    const optionMonth = parseInt(option.getAttribute("data-value") || "0", 10);

    if (optionMonth === currentMonth) {
      // Update tabindex for all options
      monthOptions.forEach((opt, index) => {
        (opt as HTMLElement).setAttribute("tabindex", index === i ? "0" : "-1");
      });

      // Focus the matching option
      option.focus();
      break;
    }
  }
}
