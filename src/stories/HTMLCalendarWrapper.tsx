import { useEffect, useId, useRef } from "react";
import Calendar, { type CalendarOptions, type EventData } from "../index";

export interface HTMLCalendarWrapperProps extends CalendarOptions {
  /** Sample events data for demonstration */
  sampleEvents?: EventData[];
}

const HTMLCalendarWrapper = (props: HTMLCalendarWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = useId();

  useEffect(() => {
    if (containerRef.current) {
      // Create new calendar instance
      const calendarOptions: CalendarOptions = {
        ...props,
        eventsData: props.sampleEvents ? props.sampleEvents : props.eventsData,
        container: containerRef.current, // Pass the actual DOM element
      };

      new Calendar(calendarOptions);
    }
  }, [props]);

  return <div ref={containerRef} id={containerId} />;
};

export default HTMLCalendarWrapper;
