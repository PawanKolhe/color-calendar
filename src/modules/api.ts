import { EventData, MonthDisplayType, WeekdayDisplayType } from "../types";

export function reset(date: Date) {
  this.currentDate = date ? date : new Date();
  this.clearCalendarDays();
  this.updateMonthYear();
  this.updateMonthPickerSelection(this.currentDate.getMonth());
  this.generatePickerYears();
  this.updateYearPickerSelection(this.currentDate.getFullYear(), 4);
  this.updateYearPickerTodaySelection();
  this.generateWeekdays();
  this.generateDays();
  this.selectDayInitial(date ? true : false);
  this.renderDays();
  this.setOldSelectedNode();
  if(this.dateChanged) {
    this.dateChanged(this.currentDate, this.getDateEvents(this.currentDate));
  }
  if(this.monthChanged) {
    this.monthChanged(this.currentDate, this.getMonthEvents());
  }
}

export function setDate(date: Date) {
  if(!date) {
    return;
  }
  if(date instanceof Date) {
    this.reset(date);
  } else {
    this.reset(new Date(date));
  }
}

export function getSelectedDate() {
  return this.currentDate;
}

export function getEventsData() {
  return JSON.parse(JSON.stringify(this.eventsData));
}

/** Set new events data array */
export function setEventsData(events: EventData[]) {
  this.eventsData = JSON.parse(JSON.stringify(events));
  this.setDate(this.currentDate);
  return this.eventsData.length;
}

/** Add events to existing events data array */
export function addEventsData(newEvents: EventData[] = []) {
  const eventAddedCount = this.eventsData.push(...newEvents);
  this.setDate(this.currentDate);
  return eventAddedCount;
}

export function setWeekdayDisplayType(weekdayDisplayType: WeekdayDisplayType) {
  this.weekdayDisplayType = weekdayDisplayType;
  this.weekdays = this.weekdayDisplayTypeOptions[this.weekdayDisplayType] ?? this.weekdayDisplayTypeOptions["short"];
  this.generateWeekdays();
}

export function setMonthDisplayType(monthDisplayType: MonthDisplayType) {
  this.monthDisplayType = monthDisplayType;
  this.updateMonthYear();
}
