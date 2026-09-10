import React, { useEffect, useState } from 'react';
import { useTodo } from '../contexts';

const PRIORITY_STYLES = {
  urgent: 'priority-urgent',
  medium: 'priority-medium',
  low: 'priority-low',
};

const getMinutes = (value) => {
  const [hours, minutes] = String(value || '00:00').split(':').map(Number);
  return (hours * 60) + minutes;
};

const formatDate = (date) => date.toISOString().slice(0, 10);

const getDateType = (date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date === formatDate(tomorrow)) return 'tomorrow';
  return 'today';
};

const getDateForType = (type) => {
  const date = new Date();
  if (type === 'tomorrow') date.setDate(date.getDate() + 1);
  return formatDate(date);
};

const getClockProgress = (startTime, endTime, currentDate) => {
  const start = getMinutes(startTime);
  const end = Math.max(start + 1, getMinutes(endTime));
  const current = (currentDate.getHours() * 60) + currentDate.getMinutes() + (currentDate.getSeconds() / 60);
  return Math.min(1, Math.max(0, (current - start) / (end - start)));
};

function TodoItems({ todo }) {
  const { updateTodo, deleteTodo, toggleComplete } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [clock, setClock] = useState(new Date());
  const [draft, setDraft] = useState({
    text: todo.text,
    priority: todo.priority === 'high' ? 'medium' : (todo.priority || 'medium'),
    dateType: getDateType(todo.date),
    endTime: todo.endTime || '10:00',
  });

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {
    const nextText = draft.text.trim();
    if (!nextText) return;

    updateTodo(todo.id, {
      ...todo,
      text: nextText,
      priority: draft.priority === 'high' ? 'medium' : draft.priority,
      date: getDateForType(draft.dateType),
      endTime: draft.endTime,
    });
    setIsEditing(false);
  };

  const toggleTask = () => toggleComplete(todo.id);
  const clockProgress = getClockProgress('00:00', todo.endTime, clock);
  const clockHue = Math.round(125 - (clockProgress * 125));
  const clockStyle = {
    '--clock-hue': clockHue,
    '--clock-progress': `${Math.round(clockProgress * 100)}%`,
  };

  return (
    <div className={`task-card ${PRIORITY_STYLES[todo.priority] || 'priority-medium'} ${todo.completed ? 'completed' : ''}`}>
      <div className="task-main">
        <button type="button" className="check-box" onClick={toggleTask} aria-label="Toggle task completion">
          {todo.completed ? '✓' : ''}
        </button>

        {isEditing ? (
          <div className="edit-task-form">
            <input
              type="text"
              value={draft.text}
              onChange={(event) => setDraft((previous) => ({ ...previous, text: event.target.value }))}
            />

            <div className="mini-fields">
              <select
                value={draft.priority}
                onChange={(event) => setDraft((previous) => ({ ...previous, priority: event.target.value }))}
              >
                <option value="urgent">Urgent</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={draft.dateType}
                onChange={(event) => setDraft((previous) => ({ ...previous, dateType: event.target.value }))}
              >
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
              </select>
              <input
                type="time"
                value={draft.endTime}
                onChange={(event) => setDraft((previous) => ({ ...previous, endTime: event.target.value }))}
              />
            </div>

            <div className="inline-actions">
              <button type="button" className="small-btn save" onClick={handleSave}>Save</button>
              <button type="button" className="small-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="task-text-group">
            <div className="task-title-row">
              <span className={`task-title ${todo.completed ? 'done' : ''}`}>{todo.text}</span>
              <span className={`priority-pill ${PRIORITY_STYLES[todo.priority] || 'priority-medium'}`}>
                {todo.priority || 'medium'}
              </span>
            </div>

            <div className="task-meta">
              {todo.date ? <span>📅 {todo.date}</span> : <span>📅 No date</span>}
              {todo.endTime ? <span>⌛ Ends {todo.endTime}</span> : null}
              <span className="clock-pill" style={clockStyle}>
                <span className="clock-sweep" aria-hidden="true" />
                <span aria-label="Current time">◷ {clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </span>
              <span className="reward-pill">🎁 +{todo.reward || 0} pts</span>
            </div>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="task-actions">
          <button type="button" className="action-btn edit-action" onClick={() => setIsEditing(true)} aria-label={`Edit ${todo.text}`} title="Edit task">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16.5-.7 3.7 3.7-.7L18.5 8a2.1 2.1 0 0 0-3-3L4 16.5Z" /><path d="m13.5 6.5 4 4" /></svg>
          </button>
          <button type="button" className="action-btn danger" onClick={() => deleteTodo(todo.id)} aria-label={`Delete ${todo.text}`} title="Delete task">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default TodoItems;