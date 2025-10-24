import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip';
import { DateWithLunar } from './DateWithLunar';
import { useApp } from './AppContext';
import { useMediaQuery } from './ui/use-mobile';
import { 
  Plus, 
  Clock,
  CheckCircle2,
  Circle,
  MapPin,
  Bell,
  BellOff,
  Trash2,
  Pencil,
  Leaf,
  User,
  Droplets,
  Bug,
  Wheat,
  CalendarDays,
  Download,
  Filter
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Tasks() {
  const { user, tasks, addTask, updateTask, deleteTask, language } = useApp();
  const [showAddTask, setShowAddTask] = useState(false);
  const [filterPlot, setFilterPlot] = useState('all');
  const [justAdded, setJustAdded] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [newTask, setNewTask] = useState({
    plotId: '',
    title: '',
    description: '',
    dueDate: '',
    type: 'other' as const
  });

  const texts = {
    EN: {
      tasks: 'Tasks & Reminders',
      description: 'Manage your farming tasks and get timely reminders',
      upcomingTasks: 'Upcoming Tasks',
      completedTasks: 'Completed Tasks',
      addTask: 'Add Task',
      editTask: 'Edit Task',
      export: 'Export',
      taskTitle: 'Task Title',
      selectPlot: 'Select Plot',
      selectType: 'Select Type',
      taskDescription: 'Description (Optional)',
      dueDate: 'Due Date',
      save: 'Save Task',
      update: 'Update Task',
      cancel: 'Cancel',
      edit: 'Edit',
      noTasks: 'No tasks yet',
      noCompleted: 'No completed tasks',
      addFirstTask: 'Add your first task to get started',
      planting: 'Planting',
      weeding: 'Weeding',
      irrigation: 'Irrigation',
      fertilizer: 'Fertilizer',
      pest: 'Pest Control',
      harvest: 'Harvest',
      other: 'Other',
      markComplete: 'Mark as complete',
      markIncomplete: 'Mark as incomplete',
      delete: 'Delete',
      reminder: 'Reminder',
      enableReminder: 'Enable Reminder',
      today: 'Today',
      tomorrow: 'Tomorrow',
      overdue: 'Overdue',
      allPlots: 'All Plots',
      filterBy: 'Filter by',
      tasks_count: 'tasks'
    },
    VI: {
      tasks: 'Công Việc & Nhắc Nhở',
      description: 'Quản lý công việc nông nghiệp và nhận nhắc nhở kịp thời',
      upcomingTasks: 'Công Việc Sắp Tới',
      completedTasks: 'Công Việc Hoàn Thành',
      addTask: 'Thêm Công Việc',
      editTask: 'Sửa Công Việc',
      export: 'Xuất File',
      taskTitle: 'Tiêu Đề',
      selectPlot: 'Chọn Lô Đất',
      selectType: 'Chọn Loại',
      taskDescription: 'Mô Tả (Tùy Chọn)',
      dueDate: 'Ngày Hết Hạn',
      save: 'Lưu',
      update: 'Cập Nhật',
      cancel: 'Hủy',
      edit: 'Sửa',
      noTasks: 'Chưa có công việc',
      noCompleted: 'Chưa có công việc hoàn thành',
      addFirstTask: 'Thêm công việc đầu tiên để bắt đầu',
      planting: 'Trồng Trọt',
      weeding: 'Làm Cỏ',
      irrigation: 'Tưới Nước',
      fertilizer: 'Bón Phân',
      pest: 'Phòng Trừ Sâu Bệnh',
      harvest: 'Thu Hoạch',
      other: 'Khác',
      markComplete: 'Đánh dấu hoàn thành',
      markIncomplete: 'Đánh dấu chưa hoàn thành',
      delete: 'Xóa',
      reminder: 'Nhắc nhở',
      enableReminder: 'Bật Nhắc Nhở',
      today: 'Hôm Nay',
      tomorrow: 'Ngày Mai',
      overdue: 'Quá Hạn',
      allPlots: 'Tất Cả Lô Đất',
      filterBy: 'Lọc theo',
      tasks_count: 'công việc'
    }
  };

  const t = texts[language];

  const taskTypes = [
    { value: 'planting', label: t.planting, icon: Leaf, color: 'text-green-600' },
    { value: 'weeding', label: t.weeding, icon: User, color: 'text-amber-600' },
    { value: 'irrigation', label: t.irrigation, icon: Droplets, color: 'text-blue-600' },
    { value: 'fertilizer', label: t.fertilizer, icon: Wheat, color: 'text-yellow-600' },
    { value: 'pest', label: t.pest, icon: Bug, color: 'text-red-600' },
    { value: 'harvest', label: t.harvest, icon: CalendarDays, color: 'text-purple-600' },
    { value: 'other', label: t.other, icon: Clock, color: 'text-gray-600' }
  ];

  const allPlots = user?.farms.flatMap(farm => farm.plots) || [];

  const getTaskStatus = (task: any) => {
    if (!task || !task.dueDate) return 'upcoming';
    if (task.completed) return 'completed';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    return 'upcoming';
  };

  // Apply filters
  const filteredTasks = tasks.filter(task => {
    const matchesPlot = filterPlot === 'all' || task.plotId === filterPlot;
    return matchesPlot;
  });

  // Sort tasks by due date (upcoming tasks sorted by closest date first)
  const upcomingTasks = filteredTasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  const completedTasks = filteredTasks
    .filter(task => task.completed)
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()); // Most recent first

  const handleAddTask = () => {
    // Validate required fields with specific error messages
    if (!newTask.title || newTask.title.trim() === '') {
      toast.error(language === 'EN' ? 'Please enter a task title' : 'Vui lòng nhập tiêu đề công việc');
      return;
    }

    if (!newTask.plotId) {
      toast.error(language === 'EN' ? 'Please select a plot' : 'Vui lòng chọn lô đất');
      return;
    }

    if (!newTask.dueDate) {
      toast.error(language === 'EN' ? 'Please select a due date' : 'Vui lòng chọn ngày hết hạn');
      return;
    }

    // Add the task
    addTask({
      ...newTask,
      title: newTask.title.trim(), // Trim whitespace
      completed: false,
      reminder: false
    });

    // Reset form
    setNewTask({
      plotId: '',
      title: '',
      description: '',
      dueDate: '',
      type: 'other'
    });

    // Close modal
    setShowAddTask(false);

    // Show success message with visual feedback
    toast.success(language === 'EN' ? 'Task added successfully!' : 'Đã thêm công việc thành công!');
    
    // Trigger animation
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    updateTask(taskId, { completed: !completed });
    toast.success(completed 
      ? (language === 'EN' ? 'Task marked as incomplete' : 'Đã đánh dấu chưa hoàn thành')
      : (language === 'EN' ? 'Task completed!' : 'Đã hoàn thành!')
    );
  };

  const handleToggleReminder = (taskId: string, currentReminder: boolean | undefined) => {
    const newReminder = !(currentReminder || false);
    updateTask(taskId, { reminder: newReminder });
    toast.success(newReminder
      ? (language === 'EN' ? 'Reminder enabled' : 'Đã bật nhắc nhở')
      : (language === 'EN' ? 'Reminder disabled' : 'Đã tắt nhắc nhở')
    );
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    toast.success(language === 'EN' ? 'Task deleted' : 'Đã xóa công việc');
  };

  const handleCancelAddTask = () => {
    setNewTask({
      plotId: '',
      title: '',
      description: '',
      dueDate: '',
      type: 'other'
    });
    setShowAddTask(false);
    setEditingTaskId(null);
  };

  const handleEditTask = (task: any) => {
    setNewTask({
      plotId: task.plotId,
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate,
      type: task.type
    });
    setEditingTaskId(task.id);
    setShowAddTask(true);
  };

  const handleUpdateTask = () => {
    // Validate required fields with specific error messages
    if (!newTask.title || newTask.title.trim() === '') {
      toast.error(language === 'EN' ? 'Please enter a task title' : 'Vui lòng nhập tiêu đề công việc');
      return;
    }

    if (!newTask.plotId) {
      toast.error(language === 'EN' ? 'Please select a plot' : 'Vui lòng chọn lô đất');
      return;
    }

    if (!newTask.dueDate) {
      toast.error(language === 'EN' ? 'Please select a due date' : 'Vui lòng chọn ngày hết hạn');
      return;
    }

    if (editingTaskId) {
      // Update existing task
      updateTask(editingTaskId, {
        ...newTask,
        title: newTask.title.trim()
      });

      // Reset form
      setNewTask({
        plotId: '',
        title: '',
        description: '',
        dueDate: '',
        type: 'other'
      });

      // Close modal
      setShowAddTask(false);
      setEditingTaskId(null);

      // Show success message
      toast.success(language === 'EN' ? 'Task updated successfully!' : 'Đã cập nhật công việc thành công!');
    }
  };

  const getPlotName = (plotId: string) => {
    const plot = allPlots.find(p => p.id === plotId);
    return plot ? plot.name : 'Unknown Plot';
  };

  const getTypeInfo = (type: string) => {
    const typeInfo = taskTypes.find(t => t.value === type);
    return typeInfo || { label: type, icon: Clock, color: 'text-gray-600' };
  };

  const getTypeBorderColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'planting': '#86EFAC',
      'weeding': '#86EFAC',
      'irrigation': '#BFDBFE',
      'fertilizer': '#FDE68A',
      'pest': '#FCA5A5',
      'harvest': '#DDD6FE',
      'other': '#E5E7EB'
    };
    return colorMap[type] || '#E5E7EB';
  };

  const TaskCard = ({ task }: { task: any }) => {
    const status = getTaskStatus(task);
    const typeInfo = getTypeInfo(task.type);
    const Icon = typeInfo.icon;
    const borderColor = getTypeBorderColor(task.type);

    return (
      <TooltipProvider>
        <Card 
          className="overflow-visible hover:shadow-md transition-shadow w-full" 
          style={{ 
            borderLeft: `4px solid ${borderColor}`,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            borderRadius: 'clamp(10px, 2.5vw, 12px)'
          }}
        >
          <CardContent 
            style={{
              padding: '0 clamp(8px, 2vw, 8px) clamp(14px, 3.5vw, 16px) clamp(8px, 2vw, 8px)'
            }}
          >
            {/* Main Card Layout: Checkbox + Content Area */}
            <div className="flex items-start" style={{ gap: 'clamp(8px, 2vw, 10px)', paddingTop: 'clamp(14px, 3.5vw, 16px)' }}>
              {/* Checkbox - Separate Column */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleToggleComplete(task.id, task.completed)}
                    className="flex-shrink-0 rounded hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    style={{ 
                      minWidth: 'clamp(44px, 11vw, 48px)',
                      minHeight: 'clamp(44px, 11vw, 48px)',
                      padding: 'clamp(8px, 2vw, 10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    aria-label={task.completed ? t.markIncomplete : t.markComplete}
                  >
                    {task.completed ? (
                      <CheckCircle2 style={{ width: 'clamp(22px, 5.5vw, 24px)', height: 'clamp(22px, 5.5vw, 24px)' }} className="text-green-600" />
                    ) : (
                      <Circle style={{ width: 'clamp(22px, 5.5vw, 24px)', height: 'clamp(22px, 5.5vw, 24px)' }} className="text-gray-400" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  sideOffset={8}
                  style={{
                    fontSize: '12px',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#111827',
                    color: '#FFFFFF'
                  }}
                >
                  {task.completed ? t.markIncomplete : t.markComplete}
                </TooltipContent>
              </Tooltip>

              {/* Content Area - Multi-Row Structure */}
              <div className="flex-1 min-w-0" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* Row 1: Task Icon + Title (Full Width) */}
                <div 
                  className="flex items-start" 
                  style={{ 
                    gap: '6px',
                    minWidth: 0
                  }}
                >
                  <Icon 
                    className={`flex-shrink-0 ${typeInfo.color}`}
                    style={{ 
                      width: '16px',
                      height: '16px',
                      marginTop: '2px'
                    }}
                  />
                  <h3 
                    className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                    style={{ 
                      fontSize: 'clamp(15px, 2vw, 17px)',
                      lineHeight: '1.3',
                      fontWeight: '600',
                      wordBreak: 'normal',
                      overflowWrap: 'anywhere',
                      hyphens: 'auto'
                    }}
                  >
                    {task.title}
                  </h3>
                </div>

                {/* Row 2: Action Icons (Bell, Edit, Delete) - All Three in One Line */}
                <div 
                  className="flex items-center"
                  style={{ gap: '6px' }}
                >
                  {/* Reminder Bell Toggle with Tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleToggleReminder(task.id, task.reminder)}
                          className="flex-shrink-0 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                          style={{ 
                            width: 'clamp(40px, 10vw, 40px)',
                            height: 'clamp(40px, 10vw, 40px)',
                            minWidth: '40px',
                            minHeight: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          aria-label={(task.reminder || false) ? (language === 'EN' ? 'Reminder set' : 'Đã đặt nhắc nhở') : (language === 'EN' ? 'Set reminder' : 'Đặt nhắc nhở')}
                        >
                          {(task.reminder || false) ? (
                            <Bell style={{ width: 'clamp(18px, 4.5vw, 20px)', height: 'clamp(18px, 4.5vw, 20px)' }} className="text-green-600" />
                          ) : (
                            <BellOff style={{ width: 'clamp(18px, 4.5vw, 20px)', height: 'clamp(18px, 4.5vw, 20px)' }} className="text-gray-500" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        sideOffset={12}
                        align="center"
                        style={{
                          fontSize: '12px',
                          padding: '4px 6px',
                          borderRadius: '4px',
                          backgroundColor: '#111827',
                          color: '#FFFFFF'
                        }}
                      >
                        {(task.reminder || false)
                          ? (language === 'EN' ? 'Reminder set' : 'Đã đặt nhắc nhở')
                          : (language === 'EN' ? 'Set reminder' : 'Đặt nhắc nhở')
                        }
                      </TooltipContent>
                    </Tooltip>

                    {/* Edit Button with Tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleEditTask(task)}
                          className="flex-shrink-0 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                          style={{ 
                            width: 'clamp(40px, 10vw, 40px)',
                            height: 'clamp(40px, 10vw, 40px)',
                            minWidth: '40px',
                            minHeight: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          aria-label={language === 'EN' ? 'Edit task' : 'Sửa công việc'}
                        >
                          <Pencil style={{ width: 'clamp(18px, 4.5vw, 20px)', height: 'clamp(18px, 4.5vw, 20px)' }} className="text-gray-500 hover:text-blue-600" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        sideOffset={12}
                        align="center"
                        style={{
                          fontSize: '12px',
                          padding: '4px 6px',
                          borderRadius: '4px',
                          backgroundColor: '#111827',
                          color: '#FFFFFF'
                        }}
                      >
                        {language === 'EN' ? 'Edit task' : 'Sửa công việc'}
                      </TooltipContent>
                    </Tooltip>

                    {/* Delete Button with Tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="flex-shrink-0 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                          style={{ 
                            width: 'clamp(40px, 10vw, 40px)',
                            height: 'clamp(40px, 10vw, 40px)',
                            minWidth: '40px',
                            minHeight: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          aria-label={language === 'EN' ? 'Delete task' : 'Xóa công việc'}
                        >
                          <Trash2 style={{ width: 'clamp(18px, 4.5vw, 20px)', height: 'clamp(18px, 4.5vw, 20px)' }} className="text-gray-500 hover:text-red-600" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        sideOffset={12}
                        align="center"
                        style={{
                          fontSize: '12px',
                          padding: '4px 6px',
                          borderRadius: '4px',
                          backgroundColor: '#111827',
                          color: '#FFFFFF'
                        }}
                      >
                        {language === 'EN' ? 'Delete task' : 'Xóa công việc'}
                      </TooltipContent>
                    </Tooltip>
                </div>

                {/* Row 3: Overdue Badge - Below Icons, Above Metadata */}
                {!task.completed && (status === 'overdue' || status === 'today') && (
                  <div>
                    <Badge 
                      variant={status === 'overdue' ? 'destructive' : 'default'}
                      className="whitespace-nowrap"
                      style={{ 
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        backgroundColor: status === 'overdue' ? '#DC2626' : '#F97316',
                        color: '#FFFFFF',
                        height: 'auto',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                      }}
                      aria-label={status === 'overdue' ? 'Overdue status' : 'Due today'}
                    >
                      {status === 'overdue' ? t.overdue : t.today}
                    </Badge>
                  </div>
                )}

                {/* Row 4: Metadata - Date with Lunar Calendar + Plot */}
                <div 
                  style={{ 
                    marginTop: 'clamp(6px, 1.5vw, 8px)',
                    paddingTop: '2px'
                  }}
                >
                  <div 
                    className="flex flex-wrap items-center text-gray-600"
                    style={{ 
                      fontSize: 'clamp(12px, 1.8vw, 13px)',
                      lineHeight: '1.4',
                      gap: 'clamp(6px, 1.5vw, 8px)'
                    }}
                  >
                    <DateWithLunar date={task.dueDate} className="whitespace-nowrap" />
                    <span>•</span>
                    <span className="flex items-center break-words" style={{ gap: 'clamp(4px, 1vw, 6px)' }}>
                      <MapPin className="flex-shrink-0" style={{ width: 'clamp(14px, 3.5vw, 16px)', height: 'clamp(14px, 3.5vw, 16px)' }} />
                      <span className="break-words">{getPlotName(task.plotId)}</span>
                    </span>
                  </div>
                </div>

                {/* Optional Divider Before Description */}
                {task.description && (
                  <div 
                    style={{ 
                      height: '1px',
                      backgroundColor: '#E5E7EB',
                      margin: 'clamp(10px, 2.5vw, 12px) 0'
                    }}
                  />
                )}

                {/* Description */}
                {task.description && (
                  <p 
                    className="text-gray-700 break-words whitespace-pre-wrap" 
                    style={{ 
                      fontSize: 'clamp(13px, 3vw, 14px)',
                      lineHeight: '1.4',
                      color: '#374151'
                    }}
                  >
                    {task.description}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
    );
  };

  const AddTaskForm = () => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (editingTaskId) {
          handleUpdateTask();
        } else {
          handleAddTask();
        }
      }
    };

    return (
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'clamp(16px, 4vw, 20px)' 
        }}
        onKeyDown={handleKeyDown}
      >
        {/* Helper text */}
        <p className="text-responsive-sm text-gray-600" style={{ marginTop: '-8px' }}>
          <span className="text-red-500">*</span> {language === 'EN' ? 'Required fields' : 'Thông tin bắt buộc'}
        </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.5vw, 8px)' }}>
        <Label htmlFor="task-title" className="text-responsive-base">
          {t.taskTitle} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="task-title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder={language === 'EN' ? 'e.g., Apply fertilizer' : 'Ví dụ: Bón phân'}
          className="farmer-input"
          required
          autoFocus
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-responsive">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.5vw, 8px)' }}>
          <Label htmlFor="task-plot" className="text-responsive-base">
            {t.selectPlot} <span className="text-red-500">*</span>
          </Label>
          <Select value={newTask.plotId} onValueChange={(value) => setNewTask({ ...newTask, plotId: value })}>
            <SelectTrigger className="farmer-input">
              <SelectValue placeholder={t.selectPlot} />
            </SelectTrigger>
            <SelectContent>
              {allPlots.length > 0 ? (
                allPlots.map(plot => (
                  <SelectItem key={plot.id} value={plot.id}>{plot.name}</SelectItem>
                ))
              ) : (
                <SelectItem value="no-plots" disabled>
                  {language === 'EN' ? 'No plots available' : 'Chưa có lô đất'}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.5vw, 8px)' }}>
          <Label htmlFor="task-type" className="text-responsive-base">{t.selectType}</Label>
          <Select value={newTask.type} onValueChange={(value: any) => setNewTask({ ...newTask, type: value })}>
            <SelectTrigger className="farmer-input">
              <SelectValue placeholder={t.selectType} />
            </SelectTrigger>
            <SelectContent>
              {taskTypes.map(type => {
                const Icon = type.icon;
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${type.color}`} />
                      {type.label}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.5vw, 8px)' }}>
        <Label htmlFor="task-due" className="text-responsive-base">
          {t.dueDate} <span className="text-red-500">*</span>
        </Label>
        
        {/* Enhanced Date Picker with Quick Options */}
        <div className="space-y-3">
          {/* Quick Date Options */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: language === 'EN' ? 'Today' : 'Hôm Nay', days: 0 },
              { label: language === 'EN' ? 'Tomorrow' : 'Ngày Mai', days: 1 },
              { label: language === 'EN' ? 'Next Week' : 'Tuần Sau', days: 7 },
              { label: language === 'EN' ? 'Next Month' : 'Tháng Sau', days: 30 }
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  const date = new Date();
                  date.setDate(date.getDate() + option.days);
                  const formattedDate = date.toISOString().split('T')[0];
                  setNewTask({ ...newTask, dueDate: formattedDate });
                }}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700"
              >
                {option.label}
              </button>
            ))}
          </div>
          
          {/* Native Date Input (matches sowing/harvest fields) */}
          <Input
            id="task-due"
            type="date"
            className="farmer-input"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            min={new Date(new Date().setHours(0,0,0,0)).toISOString().split("T")[0]}
          />
          
          {/* Date Preview */}
          {newTask.dueDate && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <CalendarDays size={12} />
              <span>
                {language === 'EN' ? 'Selected date:' : 'Ngày đã chọn:'} 
                <span className="font-medium ml-1">
                  {new Date(newTask.dueDate).toLocaleDateString(language === 'EN' ? 'en-US' : 'vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.5vw, 8px)' }}>
        <Label htmlFor="task-description" className="text-responsive-base">{t.taskDescription}</Label>
        <Textarea
          id="task-description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder={language === 'EN' ? 'Additional details...' : 'Chi tiết thêm...'}
          rows={3}
          className="resize-none farmer-input"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-responsive-sm" style={{ paddingTop: 'clamp(8px, 2vw, 12px)' }}>
        <Button 
          onClick={editingTaskId ? handleUpdateTask : handleAddTask} 
          className="flex-1 bg-green-600 hover:bg-green-700 farmer-button"
        >
          {editingTaskId ? t.update : t.save}
        </Button>
        <Button 
          variant="outline" 
          onClick={handleCancelAddTask}
          className="farmer-button sm:flex-initial"
        >
          {t.cancel}
        </Button>
      </div>
    </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Navigation />
      
      {/* Fully Responsive Container */}
      <div 
        className="mx-auto"
        style={{
          width: '100%',
          maxWidth: '1440px',
          padding: 'clamp(16px, 4vw, 32px) clamp(16px, 4vw, 32px) clamp(80px, 20vw, 32px)',
          minHeight: '100vh'
        }}
      >
        {/* Header Section - Fully Responsive */}
        <div style={{ marginBottom: 'clamp(20px, 5vw, 24px)' }}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start" style={{ gap: 'clamp(12px, 3vw, 16px)' }}>
            {/* Title & Description */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.tasks}</h1>
              <p className="text-gray-600">{t.description}</p>
            </div>
            
            {/* Action Buttons - Wrap on Mobile */}
            <div 
              className="flex flex-col sm:flex-row"
              style={{ 
                flexShrink: 0,
                gap: 'clamp(8px, 2vw, 10px)'
              }}
            >
              <Button 
                variant="outline"
                className="btn-touch-responsive w-full sm:w-auto"
              >
                <Download className="icon-responsive-sm mr-2" />
                <span className="text-responsive-base">{t.export}</span>
              </Button>
              <Button 
                onClick={() => setShowAddTask(true)}
                className="btn-touch-responsive w-full sm:w-auto bg-green-600 hover:bg-green-700"
              >
                <Plus className="icon-responsive-sm mr-2" />
                <span className="text-responsive-base">{t.addTask}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Section - Fully Responsive */}
        <Card style={{ 
          marginBottom: 'clamp(20px, 5vw, 24px)',
          borderRadius: 'clamp(10px, 2.5vw, 14px)'
        }}>
          <CardContent style={{ padding: 'clamp(14px, 3.5vw, 18px)' }}>
            <div className="flex items-center" style={{ gap: 'clamp(8px, 2vw, 10px)' }}>
              <Filter className="text-gray-500 flex-shrink-0" style={{ width: 'clamp(16px, 4vw, 18px)', height: 'clamp(16px, 4vw, 18px)' }} />
              <Select value={filterPlot} onValueChange={setFilterPlot}>
                <SelectTrigger 
                  className="farmer-input w-full sm:w-auto"
                  style={{ minWidth: 'clamp(140px, 35vw, 180px)' }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allPlots}</SelectItem>
                  {allPlots.map(plot => (
                    <SelectItem key={plot.id} value={plot.id}>{plot.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Grid - Responsive Layout: 1 col (mobile) → 2 cols (tablet) → 2-3 cols (desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-responsive-lg w-full">
          {/* Upcoming Tasks Column */}
          <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 3.5vw, 16px)' }}>
            <div className="flex items-center" style={{ gap: 'clamp(8px, 2vw, 10px)', marginBottom: 'clamp(8px, 2vw, 10px)' }}>
              <Clock className="flex-shrink-0 text-blue-600" style={{ width: 'clamp(18px, 4.5vw, 20px)', height: 'clamp(18px, 4.5vw, 20px)' }} />
              <h2 className="heading-sm text-gray-900">
                {t.upcomingTasks}
              </h2>
              <Badge variant="secondary" className="ml-auto" style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', padding: 'clamp(3px, 0.75vw, 4px) clamp(8px, 2vw, 10px)' }}>
                {upcomingTasks.length}
              </Badge>
            </div>

            {upcomingTasks.length === 0 ? (
              <Card className="w-full" style={{ borderRadius: 'clamp(10px, 2.5vw, 14px)' }}>
                <CardContent 
                  className="text-center" 
                  style={{ padding: 'clamp(32px, 8vw, 48px)' }}
                >
                  <Clock 
                    className="text-gray-400 mx-auto" 
                    style={{ 
                      width: 'clamp(40px, 10vw, 48px)',
                      height: 'clamp(40px, 10vw, 48px)',
                      marginBottom: 'clamp(10px, 2.5vw, 12px)'
                    }}
                  />
                  <p className="text-responsive-base text-gray-600 mb-2">{t.noTasks}</p>
                  <p className="text-responsive-sm text-gray-500">{t.addFirstTask}</p>
                </CardContent>
              </Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 14px)' }}>
                {upcomingTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>

          {/* Completed Tasks Column */}
          <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 3.5vw, 16px)' }}>
            <div className="flex items-center" style={{ gap: 'clamp(8px, 2vw, 10px)', marginBottom: 'clamp(8px, 2vw, 10px)' }}>
              <CheckCircle2 className="flex-shrink-0 text-green-600" style={{ width: 'clamp(18px, 4.5vw, 20px)', height: 'clamp(18px, 4.5vw, 20px)' }} />
              <h2 className="heading-sm text-gray-900">
                {t.completedTasks}
              </h2>
              <Badge variant="secondary" className="ml-auto" style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', padding: 'clamp(3px, 0.75vw, 4px) clamp(8px, 2vw, 10px)' }}>
                {completedTasks.length}
              </Badge>
            </div>

            {completedTasks.length === 0 ? (
              <Card className="w-full" style={{ borderRadius: 'clamp(10px, 2.5vw, 14px)' }}>
                <CardContent 
                  className="text-center" 
                  style={{ padding: 'clamp(32px, 8vw, 48px)' }}
                >
                  <CheckCircle2 
                    className="text-gray-400 mx-auto" 
                    style={{ 
                      width: 'clamp(40px, 10vw, 48px)',
                      height: 'clamp(40px, 10vw, 48px)',
                      marginBottom: 'clamp(10px, 2.5vw, 12px)'
                    }}
                  />
                  <p className="text-responsive-base text-gray-600">{t.noCompleted}</p>
                </CardContent>
              </Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 14px)' }}>
                {completedTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button - Above bottom nav on mobile */}
      <button
        onClick={() => setShowAddTask(true)}
        className="fixed bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-40 flex items-center justify-center"
        style={{
          bottom: 'clamp(88px, 22vw, 32px)',
          right: 'clamp(20px, 5vw, 24px)',
          width: 'clamp(56px, 14vw, 64px)',
          height: 'clamp(56px, 14vw, 64px)'
        }}
        aria-label={t.addTask}
      >
        <Plus style={{ width: 'clamp(24px, 6vw, 28px)', height: 'clamp(24px, 6vw, 28px)' }} />
      </button>

      {/* Add Task Modal - Desktop Dialog / Mobile Drawer */}
      {isDesktop ? (
        <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
          <DialogContent 
            className="sm:max-w-[500px] p-0 flex flex-col"
            style={{ 
              borderRadius: 'clamp(12px, 3vw, 16px)',
              maxHeight: '90vh'
            }}
          >
            <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
              <DialogHeader>
                <DialogTitle className="heading-md">{editingTaskId ? t.editTask : t.addTask}</DialogTitle>
                <DialogDescription className="sr-only">
                  {editingTaskId 
                    ? (language === 'EN' ? 'Edit an existing task for your farm' : 'Sửa công việc cho trang trại')
                    : (language === 'EN' ? 'Create a new task for your farm' : 'Tạo công việc mới cho trang trại')
                  }
                </DialogDescription>
              </DialogHeader>
            </div>
            <div 
              className="px-6 py-4 overflow-y-auto flex-1"
              style={{
                maxHeight: 'calc(90vh - 80px)'
              }}
            >
              <AddTaskForm />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={showAddTask} onOpenChange={setShowAddTask}>
          <DrawerContent 
            className="flex flex-col"
            style={{ maxHeight: '90vh' }}
          >
            <div 
              className="px-4 pt-4 pb-3 border-b border-gray-200 flex-shrink-0"
              style={{ padding: 'clamp(16px, 4vw, 20px) clamp(16px, 4vw, 20px) clamp(12px, 3vw, 16px)' }}
            >
              <DrawerHeader className="px-0 pb-0">
                <DrawerTitle className="heading-md">{editingTaskId ? t.editTask : t.addTask}</DrawerTitle>
                <DrawerDescription className="sr-only">
                  {editingTaskId 
                    ? (language === 'EN' ? 'Edit an existing task for your farm' : 'Sửa công việc cho trang trại')
                    : (language === 'EN' ? 'Create a new task for your farm' : 'Tạo công việc mới cho trang trại')
                  }
                </DrawerDescription>
              </DrawerHeader>
            </div>
            <div 
              className="overflow-y-auto flex-1"
              style={{ 
                padding: 'clamp(16px, 4vw, 24px)',
                maxHeight: 'calc(90vh - 100px)'
              }}
            >
              <AddTaskForm />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
