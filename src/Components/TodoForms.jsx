import React, { useState } from 'react';
import { useTodo } from '../contexts';

const formatDate = (date) => {
  const value = new Date(date);
  return Number.isNaN(value.getTime()) ? '' : value.toISOString().slice(0, 10);
};

const getRelativeDate = (value) => {
  const next = new Date();

  if (value === 'today') {
    return formatDate(next);
  }

  if (value === 'tomorrow') {
    next.setDate(next.getDate() + 1);
    return formatDate(next);
  }

  return '';
};

function TodoForms() {
  const { addTodo } = useTodo();
  const [form, setForm] = useState({
    text: '',
    priority: 'medium',
    dateType: 'today',
    endTime: '10:00',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => {
      const next = { ...previous, [name]: value };

      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = form.text.trim();

    if (!text) {
      return;
    }

    addTodo({
      text,
      completed: false,
      priority: form.priority,
      dateType: form.dateType,
      date: getRelativeDate(form.dateType),
      endTime: form.endTime,
      project: 'Today',
    });

    setForm({
      text: '',
      priority: 'medium',
      dateType: 'today',
      endTime: '10:00',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="todo-form-row">
        <input
          type="text"
          name="text"
          value={form.text}
          onChange={handleChange}
          placeholder="Add a task"
          className="todo-input"
          aria-label="Add task"
        />
      </div>

      <div className="todo-form-grid">
        <label className="field-group">
          <span>Priority</span>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="urgent">Urgent</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <label className="field-group">
          <span>Date</span>
          <select name="dateType" value={form.dateType} onChange={handleChange}>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
          </select>
        </label>

        <label className="field-group">
          <span>End</span>
          <input type="time" name="endTime" value={form.endTime} onChange={handleChange} />
        </label>

      </div>

      <div className="todo-form-actions">
        <button type="submit" className="primary-btn">
          Add task
        </button>
      </div>
    </form>
  );
}

export default TodoForms;