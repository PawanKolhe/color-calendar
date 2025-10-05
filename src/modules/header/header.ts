import type Calendar from "../../index";
import type { MonthDisplayType } from "../../types";

export function setMonthDisplayType(this: Calendar, monthDisplayType: MonthDisplayType) {
  this.monthDisplayType = monthDisplayType;
  this.updateMonthYear();
}

/** Invoked on month or year click */
export function handleMonthYearDisplayClick(this: Calendar, e: MouseEvent) {
  // Filter out unwanted click events
  const target = e.target as HTMLElement;
  if (
    !(target.classList.contains("calendar__month") || target.classList.contains("calendar__year"))
  ) {
    return;
  }
  // Check if MonthYear click is disabled
  if (this.disableMonthYearPickers) {
    return;
  }

  const oldPickerType = this.pickerType;
  const classList = target.classList;

  // Set picker type
  if (classList.contains("calendar__month")) {
    this.pickerType = "month";
    if (this.monthDisplay) this.monthDisplay.style.opacity = "1";
    if (this.yearDisplay) this.yearDisplay.style.opacity = "0.7";
    if (this.pickerMonthContainer) this.pickerMonthContainer.style.display = "grid";
    if (this.pickerYearContainer) this.pickerYearContainer.style.display = "none";
  } else if (classList.contains("calendar__year")) {
    this.pickerType = "year";
    if (this.monthDisplay) this.monthDisplay.style.opacity = "0.7";
    if (this.yearDisplay) this.yearDisplay.style.opacity = "1";
    if (this.pickerMonthContainer) this.pickerMonthContainer.style.display = "none";
    if (this.pickerYearContainer) this.pickerYearContainer.style.display = "grid";
  }

  if (oldPickerType === this.pickerType) {
    // Toggle picker
    this.togglePicker();
    // Update aria-expanded state
    const isOpen = this.pickerContainer.style.visibility !== "hidden";
    if (this.monthDisplay) {
      this.monthDisplay.setAttribute("aria-expanded", isOpen.toString());
    }
    if (this.yearDisplay) {
      this.yearDisplay.setAttribute("aria-expanded", isOpen.toString());
    }
  } else {
    // Open picker
    this.togglePicker(true);
    if (this.monthDisplay) {
      this.monthDisplay.setAttribute("aria-expanded", "true");
    }
    if (this.yearDisplay) {
      this.yearDisplay.setAttribute("aria-expanded", "true");
    }
  }
}

export function handlePrevMonthButtonClick(this: Calendar) {
  // Check if Month arrow click is disabled
  if (this.disableMonthArrowClick) {
    return;
  }

  // Check if picker is currently open
  const isPickerOpen = this.pickerContainer.style.visibility !== "hidden";

  const newMonthValue = this.currentViewDate.getMonth() - 1;
  if (
    this.currentViewDate.getFullYear() <= this.today.getFullYear() + this.yearPickerOffset - 4 &&
    newMonthValue < 0
  ) {
    this.yearPickerOffset -= 12;
    this.generatePickerYears();
  }
  if (newMonthValue < 0) {
    this.updateYearPickerSelection(this.currentViewDate.getFullYear() - 1);
  }
  this.updateMonthPickerSelection(newMonthValue);
  this.updateCurrentDate(-1);

  // Only close picker if it wasn't already open
  if (!isPickerOpen) {
    this.togglePicker(false);
  }
}

export function handleNextMonthButtonClick(this: Calendar) {
  // Check if Month arrow click is disabled
  if (this.disableMonthArrowClick) {
    return;
  }

  // Check if picker is currently open
  const isPickerOpen = this.pickerContainer.style.visibility !== "hidden";

  const newMonthValue = this.currentViewDate.getMonth() + 1;
  if (
    this.currentViewDate.getFullYear() >= this.today.getFullYear() + this.yearPickerOffset + 7 &&
    newMonthValue > 11
  ) {
    this.yearPickerOffset += 12;
    this.generatePickerYears();
  }
  if (newMonthValue > 11) {
    this.updateYearPickerSelection(this.currentViewDate.getFullYear() + 1);
  }
  this.updateMonthPickerSelection(newMonthValue);
  this.updateCurrentDate(1);

  // Only close picker if it wasn't already open
  if (!isPickerOpen) {
    this.togglePicker(false);
  }
}

/** Update Month and Year HTML */
export function updateMonthYear(this: Calendar) {
  this.oldSelectedNode = null;
  if (this.customMonthValues) {
    if (this.monthDisplay) {
      this.monthDisplay.innerHTML = this.customMonthValues[this.currentViewDate.getMonth()] ?? "";
    }
  } else {
    if (this.monthDisplay) {
      const monthText = new Intl.DateTimeFormat("en-US", {
        month: this.monthDisplayType,
      }).format(this.currentViewDate);
      this.monthDisplay.innerHTML = monthText;
    }
  }
  if (this.yearDisplay) {
    this.yearDisplay.innerHTML = this.currentViewDate.getFullYear().toString();
  }
}
