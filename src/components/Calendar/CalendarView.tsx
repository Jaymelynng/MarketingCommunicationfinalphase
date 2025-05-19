import React, { useState } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { DayDetailsPanel } from './DayDetailsPanel';
import { CalendarDayType, DayDetails } from '../../types/calendar';
import { useCalendarStore } from '../../store/calendarStore';

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { events } = useCalendarStore();

  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const generateCalendarDays = (): CalendarDayType[] => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return days.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const dayEvents = events.filter(event => event.date.startsWith(dateStr));
      
      return {
        date,
        tasks: {
          email: dayEvents.filter(e => e.type === 'email').length || 0,
          social: dayEvents.filter(e => e.type === 'social').length || 0,
          inGym: dayEvents.filter(e => e.type === 'in-gym').length || 0
        },
        isToday: isSameDay(date, new Date())
      };
    });
  };

  const getDayDetails = (date: Date): DayDetails => {
    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = events.filter(event => event.date.startsWith(dateStr));

    return {
      tasks: dayEvents
        .filter(event => event.type === 'task')
        .map(event => ({
          id: event.id,
          title: event.title,
          checklist: event.description ? [event.description] : [],
          due: new Date(event.date).toLocaleTimeString()
        })),
      content: dayEvents
        .filter(event => event.type === 'content')
        .map(event => ({
          id: event.id,
          title: event.title,
          time: new Date(event.date).toLocaleTimeString(),
          link: event.link || '#'
        }))
    };
  };

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="bg-[#b48f8f] rounded-lg shadow-lg overflow-hidden">
        <CalendarHeader
          currentMonth={currentMonth}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
        <CalendarGrid
          days={generateCalendarDays()}
          onSelectDate={setSelectedDate}
          selectedDate={selectedDate}
        />
        </div>
      </div>
      {selectedDate && (
        <DayDetailsPanel
          selectedDate={selectedDate}
          details={getDayDetails(selectedDate)}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}