import type { EventData } from "../types";

/**
 * Generate dynamic events for the current month
 * This ensures events are always relevant and visible in Storybook
 */
export const generateDynamicEvents = (): EventData[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  return [
    {
      start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(3, daysInMonth)).padStart(2, "0")}`,
      end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(3, daysInMonth)).padStart(2, "0")}`,
      color: "#3b82f6",
      name: "Team Standup",
      description: "Daily team synchronization",
    },
    {
      start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(7, daysInMonth)).padStart(2, "0")}`,
      end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(7, daysInMonth)).padStart(2, "0")}`,
      color: "#10b981",
      name: "Client Meeting",
      description: "Quarterly business review",
    },
    {
      start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(12, daysInMonth)).padStart(2, "0")}`,
      end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(12, daysInMonth)).padStart(2, "0")}`,
      color: "#f59e0b",
      name: "Code Review",
      description: "Technical review session",
    },
    {
      start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(15, daysInMonth)).padStart(2, "0")}`,
      end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(17, daysInMonth)).padStart(2, "0")}`,
      color: "#ef4444",
      name: "Sprint Planning",
      description: "Planning next development sprint",
    },
    {
      start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(20, daysInMonth)).padStart(2, "0")}`,
      end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(20, daysInMonth)).padStart(2, "0")}`,
      color: "#8b5cf6",
      name: "Design Workshop",
      description: "UI/UX design session",
    },
    {
      start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(25, daysInMonth)).padStart(2, "0")}`,
      end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(25, daysInMonth)).padStart(2, "0")}`,
      color: "#06b6d4",
      name: "Demo Day",
      description: "Product demonstration",
    },
    {
      start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(28, daysInMonth)).padStart(2, "0")}`,
      end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(28, daysInMonth)).padStart(2, "0")}`,
      color: "#f97316",
      name: "Team Lunch",
      description: "Monthly team building event",
    },
  ];
};

/**
 * Generate dynamic events for a specific month and year
 */
export const generateDynamicEventsForMonth = (year: number, month: number): EventData[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return [
    {
      start: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(3, daysInMonth)).padStart(2, "0")}`,
      end: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(3, daysInMonth)).padStart(2, "0")}`,
      color: "#3b82f6",
      name: "Team Standup",
      description: "Daily team synchronization",
    },
    {
      start: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(7, daysInMonth)).padStart(2, "0")}`,
      end: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(7, daysInMonth)).padStart(2, "0")}`,
      color: "#10b981",
      name: "Client Meeting",
      description: "Quarterly business review",
    },
    {
      start: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(12, daysInMonth)).padStart(2, "0")}`,
      end: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(12, daysInMonth)).padStart(2, "0")}`,
      color: "#f59e0b",
      name: "Code Review",
      description: "Technical review session",
    },
    {
      start: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(15, daysInMonth)).padStart(2, "0")}`,
      end: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(17, daysInMonth)).padStart(2, "0")}`,
      color: "#ef4444",
      name: "Sprint Planning",
      description: "Planning next development sprint",
    },
    {
      start: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(20, daysInMonth)).padStart(2, "0")}`,
      end: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(20, daysInMonth)).padStart(2, "0")}`,
      color: "#8b5cf6",
      name: "Design Workshop",
      description: "UI/UX design session",
    },
    {
      start: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(25, daysInMonth)).padStart(2, "0")}`,
      end: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(25, daysInMonth)).padStart(2, "0")}`,
      color: "#06b6d4",
      name: "Demo Day",
      description: "Product demonstration",
    },
    {
      start: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(28, daysInMonth)).padStart(2, "0")}`,
      end: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(28, daysInMonth)).padStart(2, "0")}`,
      color: "#f97316",
      name: "Team Lunch",
      description: "Monthly team building event",
    },
  ];
};
