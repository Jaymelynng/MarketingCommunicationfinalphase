import React from 'react';
import { Bell, AlertCircle, Clock, CheckCircle2, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useNewsUpdates } from '../../hooks/useSupabase';

interface NewsUpdatesProps {
  dateRange: {
    start: Date;
    end: Date;
  };
}

export function NewsUpdates({ dateRange }: NewsUpdatesProps) {
  const { news, loading, error } = useNewsUpdates();

  const getStatusIcon = (category: string) => {
    switch (category) {
      case 'alert':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'update':
        return <Clock size={16} className="text-blue-500" />;
      default:
        return <CheckCircle2 size={16} className="text-green-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 min-h-[200px]">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="animate-pulse p-4 rounded-lg border"
            style={{ borderColor: "#cec4c1" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                <div className="flex gap-2">
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg">
        Failed to load updates. Please try again later.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4 h-full" style={{ borderColor: "#cec4c1" }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-[#8b8585]">Recent Updates</h2>
        <Bell className="text-[#8b8585]" size={20} />
      </div>

      <div className="space-y-3">
        {news.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg border hover:shadow-sm transition-all"
            style={{ borderColor: "#cec4c1" }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{getStatusIcon(item.category)}</div>
              <div className="flex-1">
                <h3 className="font-medium text-[#8b8585] mb-1">{item.title}</h3>
                <p className="text-sm text-[#737373] mb-2">{item.content}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded-full ${
                    item.category === 'alert' ? 'bg-red-100 text-red-700' :
                    item.category === 'update' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                  <span className="flex items-center gap-1 text-[#737373]">
                    <Calendar size={12} />
                    {format(parseISO(item.published_at), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}