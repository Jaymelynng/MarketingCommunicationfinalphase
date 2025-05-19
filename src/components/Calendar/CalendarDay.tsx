import React from 'react';
import { format } from 'date-fns';
import { Mail, Image, MessageSquare } from 'lucide-react';

interface CalendarDayProps {
  date: Date;
  tasks?: {
    email?: number;
    social?: number;
    inGym?: number;
  };
  isSelected: boolean;
  onClick: () => void;
}

export function CalendarDay({ date, tasks = {}, isSelected, onClick }: CalendarDayProps) {
  const email = tasks?.email ?? 0;
  const social = tasks?.social ?? 0;
  const inGym = tasks?.inGym ?? 0;
  const hasTasks = email > 0 || social > 0 || inGym > 0;

  return (
    <div
      className={`
        w-full aspect-square rounded-lg cursor-pointer p-4 relative overflow-hidden
        flex flex-col bg-white/90 backdrop-blur-sm
        transform-gpu transition-transform duration-200 ease-out
        hover:bg-white hover:shadow-lg hover:-translate-y-1
        group
        ${isSelected ? 'ring-2 ring-[#b48f8f] transform scale-105 shadow-xl bg-white' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-2xl font-medium transition-colors ${
          isSelected ? 'text-[#b48f8f]' : 'text-[#8b8585] group-hover:text-[#b48f8f]'
        }`}>
          {format(date, 'd')}
        </span>
      </div>
      
      <div className="space-y-1 flex-1 overflow-hidden">
        {hasTasks && (
          <div className="flex flex-col gap-1 transform transition-all duration-300 
            ${isSelected ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'}">
            {email > 0 && (
              <span className="text-xs px-2 py-1 rounded-lg bg-blue-50 text-blue-600 flex items-center gap-1">
                <Mail size={10} />
                <span>Email ({email})</span>
              </span>
            )}
            {social > 0 && (
              <span className="text-xs px-2 py-1 rounded-lg bg-purple-50 text-purple-600 flex items-center gap-1">
                <MessageSquare size={10} />
                <span>Social ({social})</span>
              </span>
            )}
            {inGym > 0 && (
              <span className="text-xs px-2 py-1 rounded-lg bg-green-50 text-green-600 flex items-center gap-1">
                <Image size={10} />
                <span>In-Gym ({inGym})</span>
              </span>
            )}
          </div>
        )}
      </div>
      {tasks?.content && tasks.content.length > 0 && (
        <div className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded-full bg-[#b48f8f]/10 text-[#b48f8f] flex items-center gap-1">
          <Calendar size={10} />
          <span className="min-w-[1ch]">{tasks.content.length}</span>
        </div>
      )}
    </div>
  );
}