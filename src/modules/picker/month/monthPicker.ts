import type Calendar from "../../../index";

export function handleMonthPickerClick(this: Calendar, e: MouseEvent) {
  // Filter out unwanted click events
  const target = e.target as HTMLElement;
  if (!target.classList.contains("calendar__picker-month-option")) {
    return;
  }

  const newMonthValue = parseInt(target.dataset["value"] || "0", 10);

  this.updateMonthPickerSelection(newMonthValue);
  this.updateCurrentDate(0, newMonthValue);
  this.togglePicker(false);
}

export function updateMonthPickerSelection(this: Calendar, newMonthValue: number) {
  if (newMonthValue < 0) {
    newMonthValue = 11;
  } else {
    newMonthValue %= 12;
  }

  this.removeMonthPickerSelection();
  const child = this.pickerMonthContainer?.children[newMonthValue] as HTMLElement | undefined;
  if (child) {
    child.className = `${child.className} calendar__picker-month-selected`;
    child.setAttribute("aria-selected", "true");
    child.setAttribute("tabindex", "0");
    // Focus the selected month option
    child.focus();
  }
}

export function updateMonthPickerTodaySelection(this: Calendar) {
  // Remove today marker from all months
  for (let i = 0; i < 12; i++) {
    const monthElement = this.pickerMonthContainer?.children[i] as HTMLElement | undefined;
    if (monthElement) {
      const newClassName = monthElement.className.replace(" calendar__picker-month-today", "");
      monthElement.className = newClassName;
    }
  }

  // Add today marker only if we're viewing the current year
  if (this.currentViewDate.getFullYear() === this.today.getFullYear()) {
    const todayMonthElement = this.pickerMonthContainer?.children[this.today.getMonth()] as
      | HTMLElement
      | undefined;
    if (todayMonthElement) {
      todayMonthElement.className = `${todayMonthElement.className} calendar__picker-month-today`;
    }
  }
}

export function removeMonthPickerSelection(this: Calendar) {
  // Remove old month selection by scanning for the selected month
  for (let i = 0; i < 12; i++) {
    const el = this.pickerMonthContainer?.children[i] as HTMLElement | undefined;
    if (el?.classList.contains("calendar__picker-month-selected")) {
      const newClassName = el.className.replace(" calendar__picker-month-selected", "");
      el.className = newClassName;
      el.setAttribute("aria-selected", "false");
      el.setAttribute("tabindex", "-1");
    }
  }
}
