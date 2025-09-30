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
  } else {
    // Open picker
    this.togglePicker(true);
  }
}

export function handlePrevMonthButtonClick(this: Calendar) {
  // Check if Month arrow click is disabled
  if (this.disableMonthArrowClick) {
    return;
  }

  const newMonthValue = this.currentDate.getMonth() - 1;
  if (
    this.currentDate.getFullYear() <= this.today.getFullYear() + this.yearPickerOffset - 4 &&
    newMonthValue < 0
  ) {
    this.yearPickerOffset -= 12;
    this.generatePickerYears();
  }
  if (newMonthValue < 0) {
    this.updateYearPickerSelection(this.currentDate.getFullYear() - 1);
  }
  this.updateMonthPickerSelection(newMonthValue);
  this.updateCurrentDate(-1);
  this.togglePicker(false);
}

export function handleNextMonthButtonClick(this: Calendar) {
  // Check if Month arrow click is disabled
  if (this.disableMonthArrowClick) {
    return;
  }

  const newMonthValue = this.currentDate.getMonth() + 1;
  if (
    this.currentDate.getFullYear() >= this.today.getFullYear() + this.yearPickerOffset + 7 &&
    newMonthValue > 11
  ) {
    this.yearPickerOffset += 12;
    this.generatePickerYears();
  }
  if (newMonthValue > 11) {
    this.updateYearPickerSelection(this.currentDate.getFullYear() + 1);
  }
  this.updateMonthPickerSelection(newMonthValue);
  this.updateCurrentDate(1);
  this.togglePicker(false);
}

/** Update Month and Year HTML */
export function updateMonthYear(this: Calendar) {
  this.oldSelectedNode = null;
  if (this.customMonthValues) {
    if (this.monthDisplay) {
      this.monthDisplay.innerHTML = this.customMonthValues[this.currentDate.getMonth()] ?? "";
    }
  } else {
    if (this.monthDisplay) {
      this.monthDisplay.innerHTML = new Intl.DateTimeFormat("en-US", {
        month: this.monthDisplayType,
      }).format(this.currentDate);
    }
  }
  if (this.yearDisplay) {
    this.yearDisplay.innerHTML = this.currentDate.getFullYear().toString();
  }
}
