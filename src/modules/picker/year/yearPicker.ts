import type Calendar from "../../../index";

export function handleYearPickerClick(this: Calendar, e: MouseEvent) {
  // Filter out unwanted click events
  const target = e.target as HTMLElement;
  if (!target.classList.contains("calendar__picker-year-option")) {
    return;
  }

  this.yearPickerOffset += this.yearPickerOffsetTemporary;

  const newYearValue = parseInt(target.innerText, 10);
  const newYearIndex = parseInt(target.dataset["value"] || "0", 10);
  this.updateYearPickerSelection(newYearValue, newYearIndex);
  this.updateCurrentDate(0, undefined, newYearValue);
  this.togglePicker(false);
}

export function updateYearPickerSelection(
  this: Calendar,
  newYearValue: number,
  newYearIndex?: number
) {
  if (newYearIndex === undefined) {
    for (let i = 0; i < 12; i++) {
      const yearPickerChildren = this.pickerYearContainer?.children[i] as HTMLElement | undefined;
      if (!yearPickerChildren) continue;
      const elementYear = parseInt(yearPickerChildren.innerHTML, 10);
      if (elementYear === newYearValue && yearPickerChildren.dataset["value"]) {
        newYearIndex = parseInt(yearPickerChildren.dataset["value"] || "0", 10);
        break;
      }
    }

    if (newYearIndex === undefined) {
      return;
    }
  }

  this.removeYearPickerSelection();
  const child = this.pickerYearContainer?.children[newYearIndex] as HTMLElement | undefined;
  if (child) {
    child.className = `${child.className} calendar__picker-year-selected`;
    child.setAttribute("aria-selected", "true");
    child.setAttribute("tabindex", "0");
    // Focus the selected year option
    child.focus();
  }
}

export function updateYearPickerTodaySelection(this: Calendar) {
  // First, remove today marker from all year elements
  for (let i = 0; i < 12; i++) {
    const element = this.pickerYearContainer?.children[i] as HTMLElement | undefined;
    if (element) {
      const newClassName = element.className.replace(" calendar__picker-year-today", "");
      element.className = newClassName;
    }
  }

  // Then add today marker to the middle element if it matches current year
  const mid = this.pickerYearContainer?.children[4] as HTMLElement | undefined;
  if (mid) {
    if (parseInt(mid.innerHTML, 10) === this.today.getFullYear()) {
      mid.className = `${mid.className} calendar__picker-year-today`;
    }
  }
}

export function removeYearPickerSelection(this: Calendar) {
  // Remove old year selection by scanning for the selected year
  for (let i = 0; i < 12; i++) {
    const el = this.pickerYearContainer?.children[i] as HTMLElement | undefined;
    if (el?.classList.contains("calendar__picker-year-selected")) {
      const newClassName = el.className.replace(" calendar__picker-year-selected", "");
      el.className = newClassName;
      el.setAttribute("aria-selected", "false");
      el.setAttribute("tabindex", "-1");
    }
  }
}

export function generatePickerYears(this: Calendar) {
  // First, remove today marker from all year elements
  for (let i = 0; i < 12; i++) {
    const element = this.pickerYearContainer?.children[i] as HTMLElement | undefined;
    if (element) {
      const newClassName = element.className.replace(" calendar__picker-year-today", "");
      element.className = newClassName;
    }
  }

  const currentYear =
    this.today.getFullYear() + this.yearPickerOffset + this.yearPickerOffsetTemporary;
  let count = 0;
  for (let i = currentYear - 4; i <= currentYear + 7; i++) {
    const element = this.pickerYearContainer?.children[count] as HTMLElement | undefined;
    if (element) {
      element.innerText = i.toString();
    }
    count++;
  }

  this.updateYearPickerTodaySelection();
}

export function handleYearChevronLeftClick(this: Calendar) {
  this.yearPickerOffsetTemporary -= 12;
  this.generatePickerYears();
  this.removeYearPickerSelection();
  this.updateYearPickerSelection(this.currentViewDate.getFullYear());
  this.updateYearPickerTodaySelection();
}

export function handleYearChevronRightClick(this: Calendar) {
  this.yearPickerOffsetTemporary += 12;
  this.generatePickerYears();
  this.removeYearPickerSelection();
  this.updateYearPickerSelection(this.currentViewDate.getFullYear());
  this.updateYearPickerTodaySelection();
}
