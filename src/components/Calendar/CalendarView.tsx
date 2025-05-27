import React, { useState } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { DayDetailsPanel } from './DayDetailsPanel';
import { useTaskStore } from '../../store/taskStore';
import { useEmailStore } from '../../store/emailStore';

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { tasks } = useTaskStore();
  const { emails } = useEmailStore();

  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Count tasks and emails for this date
      const dayTasks = {
        email: emails.filter(e => e.scheduledDate.startsWith(dateStr)).length,
        social: tasks.filter(t => t.channel === 'social-media' && t.dueDate.startsWith(dateStr)).length,
        inGym: tasks.filter(t => t.channel === 'in-gym-marketing' && t.dueDate.startsWith(dateStr)).length,
      };

      return {
        date,
        tasks: dayTasks,
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