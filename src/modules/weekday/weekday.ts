import { WeekdayDisplayType } from "../../types";
import type Calendar from "../../index";

export function setWeekdayDisplayType(this: Calendar, weekdayDisplayType: WeekdayDisplayType) {
  this.weekdayDisplayType = weekdayDisplayType;
  this.weekdays =
    this.weekdayDisplayTypeOptions[this.weekdayDisplayType] ??
    this.weekdayDisplayTypeOptions["short"];
  this.generateWeekdays();
}

/** Update Weekdays HTML */
export function generateWeekdays(this: Calendar) {
  let newHTML = "";
  for (let i = 0; i < 7; i++) {
    newHTML += `
      <div class="calendar__weekday">${
        this.weekdays[(i + this.startWeekday) % 7]
      }</div>
    `;
  }
  this.calendarWeekdays.innerHTML = newHTML;
}
