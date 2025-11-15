import { useState } from 'react';
import { Eye, Edit2, Trash2, Plus, User, Calendar } from 'lucide-react';
import styles from '../styles/KanbanBoard.module.css';

export default function KanbanBoard({ tasks = [], onTaskMove, onTaskClick, onAddTask, onViewTask, onEditTask, onDeleteTask }) {
  const columns = [
    { id: 'todo', title: 'To Do', color: '#6B7280' },
    { id: 'in-progress', title: 'In Progress', color: '#3B82F6' },
    { id: 'review', title: 'Review', color: '#F59E0B' },
    { id: 'done', title: 'Done', color: '#10B981' }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444',
      urgent: '#DC2626'
    };
    return colors[priority] || '#6B7280';
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.kanbanBoard}>
      {columns.map((column) => (
        <div key={column.id} className={styles.column}>
          <div className={styles.columnHeader} style={{ borderTopColor: column.color }}>
            <div className={styles.columnTitle}>
              <h3>{column.title}</h3>
              <span className={styles.taskCount}>
                {getTasksByStatus(column.id).length}
              </span>
            </div>
            <button 
              className={styles.addButton} 
              title="Add task"
              onClick={() => onAddTask && onAddTask(column.id)}
            >
              <Plus size={18} />
            </button>
          </div>

          <div className={styles.taskList}>
            {getTasksByStatus(column.id).map((task) => (
              <div
                key={task._id || task.id}
                className={styles.taskCard}
              >
                <div className={styles.taskHeader}>
                  <span
                    className={styles.priorityDot}
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                    title={task.priority}
                  />
                  <div className={styles.taskActions}>
                    <button 
                      className={styles.actionButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewTask && onViewTask(task);
                      }}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className={styles.actionButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTask && onEditTask(task);
                      }}
                      title="Edit Task"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className={styles.actionButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask && onDeleteTask(task);
                      }}
                      title="Delete Task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h4 
                  className={styles.taskTitle}
                  onClick={() => onTaskClick && onTaskClick(task)}
                >
                  {task.title}
                </h4>

                {task.description && (
                  <p className={styles.taskDescription}>{task.description}</p>
                )}

                <div className={styles.taskFooter}>
                  {task.dueDate && (
                    <div className={styles.dueDate}>
                      <Calendar size={14} />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  )}
                  
                  {(task.assignedTo || task.assignedUser) && (
                    <div className={styles.assignee} title={(task.assignedTo?.name || task.assignedUser?.name)}>
                      <User size={14} />
                      <span>{(task.assignedTo?.name || task.assignedUser?.name)?.split(' ')[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {getTasksByStatus(column.id).length === 0 && (
              <div className={styles.emptyState}>
                <p>No tasks</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
