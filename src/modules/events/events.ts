import type Calendar from "../../index";
import type { EventData } from "../../types";

export function getEventsData(this: Calendar) {
  return JSON.parse(JSON.stringify(this.eventsData));
}

/** Set new events data array */
export function setEventsData(this: Calendar, events: EventData[]) {
  this.eventsData = JSON.parse(JSON.stringify(events));
  this.setDate(this.currentDate);
  return this.eventsData.length;
}

/** Add events to existing events data array */
export function addEventsData(this: Calendar, newEvents: EventData[] = []) {
  const eventAddedCount = this.eventsData.push(...newEvents);
  this.setDate(this.currentDate);
  return eventAddedCount;
}

export function getDateEvents(this: Calendar, date: Date) {
  const filteredEventsThisDate = this.filteredEventsThisMonth.filter((event: EventData) => {
    const start = new Date(event.start).getDate();
    const end = new Date(event.end).getDate();
    if (date.getDate() >= start && date.getDate() <= end) {
      return true;
    } else {
      return false;
    }
  });
  return filteredEventsThisDate;
}

export function getMonthEvents(this: Calendar) {
  return this.filteredEventsThisMonth;
}
