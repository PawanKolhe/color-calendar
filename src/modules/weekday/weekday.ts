import { WeekdayDisplayType } from "../../types";

export function setWeekdayDisplayType(weekdayDisplayType: WeekdayDisplayType) {
  this.weekdayDisplayType = weekdayDisplayType;
  this.weekdays = this.weekdayDisplayTypeOptions[this.weekdayDisplayType] ?? this.weekdayDisplayTypeOptions["short"];
  this.generateWeekdays();
}

/** Update Weekdays HTML */
export function generateWeekdays() {
  let newHTML = '';
  for (let i = 0; i < 7; i++) {
    newHTML += `
      <div class="calendar__weekday">${this.weekdays[(i + this.startWeekday) % 7]
      }</div>
    `;
  }
  this.calendarWeekdays.innerHTML = newHTML;
}
