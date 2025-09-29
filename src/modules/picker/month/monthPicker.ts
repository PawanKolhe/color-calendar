import type Calendar from "../../../index";

export function handleMonthPickerClick(this: Calendar, e: any) {
  // Filter out unwanted click events
  if (!e.target.classList.contains("calendar__picker-month-option")) {
    return;
  }

  const newMonthValue = parseInt(e.target.dataset.value, 10);

  this.updateMonthPickerSelection(newMonthValue);
  this.updateCurrentDate(0, undefined, newMonthValue);
  this.togglePicker(false);
}

export function updateMonthPickerSelection(this: Calendar, newMonthValue: number) {
  if (newMonthValue < 0) {
    newMonthValue = 11;
  } else {
    newMonthValue = newMonthValue % 12;
  }

  this.removeMonthPickerSelection();
  const child = this.pickerMonthContainer?.children[newMonthValue] as
    | HTMLElement
    | undefined;
  child?.classList.add("calendar__picker-month-selected");
}

export function removeMonthPickerSelection(this: Calendar) {
  // Remove old month selection by scanning for the selected month
  for (let i = 0; i < 12; i++) {
    const el = this.pickerMonthContainer?.children[i] as HTMLElement | undefined;
    if (el?.classList.contains("calendar__picker-month-selected")) {
      el.classList.remove("calendar__picker-month-selected");
    }
  }
}
