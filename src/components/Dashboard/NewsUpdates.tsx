@@ .. @@
-import { AlertCircle, Info, Clock, CheckCircle, Calendar, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
+import { Bell, AlertCircle, Clock, CheckCircle2, Calendar } from 'lucide-react';
 import { format, parseISO } from 'date-fns';
-import { useNewsUpdates, useTasks } from '../../hooks/useSupabase';
-import { Link } from 'react-router-dom';
+import { useNewsUpdates } from '../../hooks/useSupabase';

 interface NewsUpdatesProps {
   dateRange: {
     start: Date;
     end: Date;
   };
 }

 export function NewsUpdates({ dateRange }: NewsUpdatesProps) {
-  const { news, loading } = useNewsUpdates();
-  const [expandedItem, setExpandedItem] = useState<string | null>(null);
-  const { tasks: overdueTasks } = useTasks({ status: 'pending', dueWithin: 0 });
-  const { tasks: upcomingTasks } = useTasks({ status: 'pending', dueWithin: 7 });
+  const { news, loading, error } = useNewsUpdates();

-  // Combine news and tasks into a single timeline
-  const timelineItems = [
-    ...news.map(item => ({
-      ...item,
-      itemType: 'news',
-      date: item.published_at
-    })),
-    ...overdueTasks.map(task => ({
-      id: task.id,
-      title: task.title,
-      content: `Task is overdue`,
-      type: 'reminder',
-      date: task.due_date,
-      itemType: 'task',
-      priority: 2
-    })),
-    ...upcomingTasks.map(task => ({
-      id: task.id,
-      title: task.title,
-      content: `Due ${format(new Date(task.due_date), 'MMM d, yyyy')}`,
-      type: 'update',
-      date: task.due_date,
-      itemType: 'task',
-      priority: 1
-    }))
-  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
+  const getStatusIcon = (category: string) => {
+    switch (category) {
+      case 'alert':
+        return <AlertCircle size={16} className="text-red-500" />;
+      case 'update':
+        return <Clock size={16} className="text-blue-500" />;
+      default:
+        return <CheckCircle2 size={16} className="text-green-500" />;
+    }
+  };

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

+  if (error) {
+    return (
+      <div className="bg-red-50 text-red-500 p-4 rounded-lg">
+        Failed to load updates. Please try again later.
+      </div>
+    );
+  }

   return (
     <div className="bg-white rounded-lg border p-4 h-full" style={{ borderColor: "#cec4c1" }}>
-      <h2 className="text-xl font-medium mb-6 text-[#8b8585] flex items-center gap-2">
-        <Clock size={20} />
-        Recent Activity
+      <div className="flex items-center justify-between mb-6">
+      <h2 className="text-xl font-medium text-[#8b8585]">Recent Updates</h2>
+      <Bell className="text-[#8b8585]" size={20} />
+      </div>

       <div className="space-y-3">
-      {timelineItems.map((item) => (
-        <div
-          key={item.id}
-          className={`rounded-lg border transform-gpu transition-all duration-200 ${
-            item.priority > 1 ? 'bg-rose-50/50' : 'bg-white'
-          } hover:shadow-sm will-change-transform cursor-pointer`}
-          style={{ borderColor: "#cec4c1" }}
-          onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
-        >
-          <div className="flex items-start gap-3 p-3">
-            <div className="mt-1 flex-shrink-0">{getStatusIcon(item.type)}</div>
-            <div className="flex-1 min-w-0">
-              <h3 className="font-medium text-[#8b8585] mb-1">{item.title}</h3>
-              <p className="text-sm text-[#8f93a0] mb-2 line-clamp-2">{item.content}</p>
-              <div className="flex items-center gap-2 text-xs flex-wrap">
-                <span className={`px-2 py-1 rounded-full ${
-                  item.type === 'update' ? 'bg-blue-100 text-blue-700' :
-                  item.type === 'news' ? 'bg-green-100 text-green-700' :
-                  item.type === 'reminder' ? 'bg-amber-100 text-amber-700' :
-                  item.type === 'change' ? 'bg-red-100 text-red-700' :
-                  'bg-[#f9fafb] text-[#b48f8f]'
-                } shrink-0`}>
-                  {item.itemType === 'task' ? 'Task' : item.type.charAt(0).toUpperCase() + item.type.slice(1)}
-                </span>
-                <span className="flex items-center gap-1 text-[#8f93a0] whitespace-nowrap shrink-0">
-                  <Calendar size={12} />
-                  {format(new Date(item.date), 'MMM dd, yyyy')}
-                </span>
-                {item.due_date && (
-                  <span className="flex items-center gap-1 text-[#8f93a0] whitespace-nowrap shrink-0">
-                    <Clock size={12} />
-                    Due: {format(new Date(item.due_date), 'MMM dd, yyyy')}
-                  </span>
-                )}
-                <button className="ml-auto">
-                  {expandedItem === item.id ? (
-                    <ChevronUp size={16} className="text-[#8f93a0]" />
-                  ) : (
-                    <ChevronDown size={16} className="text-[#8f93a0]" />
-                  )}
-                </button>
+        {news.map((item) => (
+          <div
+            key={item.id}
+            className="p-4 rounded-lg border hover:shadow-sm transition-all"
+            style={{ borderColor: "#cec4c1" }}
+          >
+            <div className="flex items-start gap-3">
+              <div className="mt-1">{getStatusIcon(item.category)}</div>
+              <div className="flex-1">
+                <h3 className="font-medium text-[#8b8585] mb-1">{item.title}</h3>
+                <p className="text-sm text-[#737373] mb-2">{item.content}</p>
+                <div className="flex items-center gap-2 text-xs">
+                  <span className={`px-2 py-1 rounded-full ${
+                    item.category === 'alert' ? 'bg-red-100 text-red-700' :
+                    item.category === 'update' ? 'bg-blue-100 text-blue-700' :
+                    'bg-green-100 text-green-700'
+                  }`}>
+                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
+                  </span>
+                  <span className="flex items-center gap-1 text-[#737373]">
+                    <Calendar size={12} />
+                    {format(parseISO(item.published_at), 'MMM d, yyyy')}
+                  </span>
+                </div>
               </div>
             </div>
           </div>
-          {expandedItem === item.id && (
-            <div className="px-3 pb-3 pt-2 border-t mt-2" style={{ borderColor: "#cec4c1" }}>
-              <p className="text-sm text-[#8f93a0] whitespace-pre-line">{item.content}</p>
-              {item.itemType === 'task' && (
-                <Link
-                  to={`/tasks/${item.id}`}
-                  className="mt-3 text-sm text-[#b48f8f] hover:underline inline-flex items-center gap-1"
-                >
-                  View Task Details
-                  <ChevronRight size={14} />
-                </Link>
-              )}
-            </div>
-          )}
-        </div>
-      ))}
+        ))}
       </div>
     </div>
   );
 }