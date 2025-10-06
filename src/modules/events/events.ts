import type Calendar from "../../index";
import type { EventData } from "../../types";

export function getEventsData(this: Calendar) {
  return JSON.parse(JSON.stringify(this.eventsData));
}

/** Set new events data array */
export function setEventsData(this: Calendar, events: EventData[]) {
  this.eventsData = JSON.parse(JSON.stringify(events));
  this.setSelectedDate(this.selectedDate);
  return this.eventsData.length;
}

/** Add events to existing events data array */
export function addEventsData(this: Calendar, newEvents: EventData[] = []) {
  const eventAddedCount = this.eventsData.push(...newEvents);
  this.setSelectedDate(this.selectedDate);
  return eventAddedCount;
}

export function getDateEvents(this: Calendar, date: Date) {
  const filteredEventsThisDate = this.eventsData.filter((event: EventData) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    // Normalize dates to local timezone for comparison
    // Create new dates with only year, month, day components to avoid timezone issues
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const normalizedEventStart = new Date(
      eventStart.getFullYear(),
      eventStart.getMonth(),
      eventStart.getDate()
    );
    const normalizedEventEnd = new Date(
      eventEnd.getFullYear(),
      eventEnd.getMonth(),
      eventEnd.getDate()
    );

    // Check if the given date falls within the event range
    return normalizedDate >= normalizedEventStart && normalizedDate <= normalizedEventEnd;
  });
  return filteredEventsThisDate;
}

export function getMonthEvents(this: Calendar) {
  return this.filteredEventsThisMonth;
}
