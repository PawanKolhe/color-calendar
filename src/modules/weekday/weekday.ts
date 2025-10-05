import type Calendar from "../../index";
import type { WeekdayDisplayType, Weekdays } from "../../types";

export function setWeekdayDisplayType(this: Calendar, weekdayDisplayType: WeekdayDisplayType) {
  this.weekdayDisplayType = weekdayDisplayType;
  this.weekdays =
    this.weekdayDisplayTypeOptions[this.weekdayDisplayType] ?? this.weekdayDisplayTypeOptions.short;
  this.generateAndRenderWeekdays();
}

/** Update Weekdays HTML */
export function generateAndRenderWeekdays(this: Calendar) {
  // Ensure weekdays are always properly initialized
  if (!this.weekdays || this.weekdays.length !== 7) {
    if (this.customWeekdayValues && this.customWeekdayValues.length === 7) {
      this.weekdays = this.customWeekdayValues as Weekdays;
    } else {
      this.weekdays =
        this.weekdayDisplayTypeOptions[this.weekdayDisplayType] ??
        this.weekdayDisplayTypeOptions.short;
    }
  }

  if (!this.calendarWeekdays) {
    return;
  }

  let newHTML = "";
  for (let i = 0; i < 7; i++) {
    const weekdayIndex = (i + this.startWeekday) % 7;
    const weekdayValue = this.weekdays[weekdayIndex];
    newHTML += `
      <div class="calendar__weekday" role="columnheader" aria-label="${weekdayValue}">${weekdayValue}</div>
    `;
  }

  // Update DOM synchronously
  this.calendarWeekdays.innerHTML = newHTML;
}
