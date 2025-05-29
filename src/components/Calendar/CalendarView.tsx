import React, { useState } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, format } from 'date-fns';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { DayDetailsPanel } from './DayDetailsPanel';
import { CalendarDayType, DayDetails, TaskItem, ContentItem } from '../../types/calendar';
import { useTaskStore } from '../../store/taskStore';
import { useEmailStore } from '../../store/emailStore';

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const taskStore = useTaskStore();
  const { emails } = useEmailStore();

  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const generateCalendarDays = (): CalendarDayType[] => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return days.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const taskCounts = taskStore.getTasksByDate(dateStr);
      
      const dayTasks = {
        email: emails.filter(e => e.scheduledDate.startsWith(dateStr)).length,
        social: taskCounts.social,
        inGym: taskCounts.inGym,
        content: [] // Add empty content array to match type
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
    const tasks = taskStore.getTasksForDateRange(dateStr, dateStr).map(task => ({
      id: task.task_id,
      title: task.task_title,
      checklist: task.checklist || [],
      due: task.due_date,
      type: task.channel.toLowerCase() as 'email' | 'social' | 'inGym' | 'misc'
    }));

    const dayEmails = emails.filter(e => e.scheduledDate.startsWith(dateStr));
    
    // Convert emails to ContentItem format
    const content: ContentItem[] = dayEmails.map(email => ({
      id: email.id,
      title: email.title,
      type: 'email',
      time: email.scheduledDate,
      link: '', // Add appropriate link if available
      description: email.title
    }));

    return {
      tasks,
      emails: dayEmails,
      content
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