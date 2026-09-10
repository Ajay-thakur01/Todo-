import { useEffect, useMemo, useState } from 'react';

import './App.css';
import TodoForms from './Components/TodoForms';
import TodoItems from './Components/TodoItems';
import { TodoProvider } from './contexts';

const STORAGE_KEY = 'todoist-dashboard-v1';
const REWARD_KEY = 'todo-reward-balance-v1';
const THEME_KEY = 'todo-theme-v1';

const getTodayString = () => new Date().toISOString().slice(0, 10);
const getRandomReward = () => Math.floor(Math.random() * 9 + 2) * 5;
const addDays = (date, amount) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate.toISOString().slice(0, 10);
};

const sampleTasks = [
  {
    id: 1,
    text: 'Do 30 minutes of yoga',
    completed: false,
    priority: 'medium',
    date: getTodayString(),
    startTime: '07:30',
    endTime: '08:00',
    reward: 25,
    project: 'Today',
  },
  {
    id: 2,
    text: 'Dentist appointment',
    completed: false,
    priority: 'urgent',
    date: getTodayString(),
    startTime: '10:00',
    endTime: '10:45',
    reward: 40,
    project: 'Today',
  },
  {
    id: 3,
    text: 'Buy bread',
    completed: true,
    priority: 'low',
    date: getTodayString(),
    startTime: '18:00',
    endTime: '18:30',
    reward: 15,
    project: 'Today',
  },
];

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return sampleTasks;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) return sampleTasks;

    return parsed;
  } catch {
    return sampleTasks;
  }
};

const getDefaultReward = (tasks) => {
  return tasks.reduce((sum, task) => sum + (task.completed ? Number(task.reward || 0) : 0), 0);
};

function App() {
  const [todos, setTodos] = useState(loadState);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light');
  const [historyRange, setHistoryRange] = useState('tomorrow');
  const [rewardBalance, setRewardBalance] = useState(() => {
    try {
      const stored = localStorage.getItem(REWARD_KEY);
      if (stored === null) {
        return getDefaultReward(loadState());
      }
      return Number(stored) || 0;
    } catch {
      return getDefaultReward(loadState());
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(REWARD_KEY, String(rewardBalance));
  }, [rewardBalance]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const addTodo = (todo) => {
    const cleanTodo = {
      id: Date.now() + Math.random(),
      text: String(todo.text || '').trim(),
      completed: Boolean(todo.completed),
      priority: todo.priority || 'medium',
      dateType: todo.dateType || 'today',
      date: todo.date || getTodayString(),
      endTime: todo.endTime || '10:00',
      reward: getRandomReward(),
      project: todo.project || 'Today',
    };

    if (!cleanTodo.text) return;

    setTodos((previous) => [cleanTodo, ...previous]);
  };

  const updateTodo = (id, updatedTodo) => {
    setTodos((previous) =>
      previous.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              ...updatedTodo,
              text: String(updatedTodo.text || '').trim(),
            }
          : todo,
      ),
    );
  };

  const deleteTodo = (id) => {
    setTodos((previous) => {
      const task = previous.find((item) => item.id === id);
      if (task && task.completed) {
        setRewardBalance((balance) => Math.max(0, balance - Number(task.reward || 0)));
      }
      return previous.filter((item) => item.id !== id);
    });
  };

  const toggleComplete = (id) => {
    setTodos((previous) => {
      const task = previous.find((item) => item.id === id);
      if (!task) return previous;

      const increment = task.completed ? -Number(task.reward || 0) : Number(task.reward || 0);
      setRewardBalance((balance) => balance + increment);

      return previous.map((item) => item.id === id
        ? {
            ...item,
            completed: !item.completed,
            completedAt: item.completed ? null : new Date().toISOString(),
          }
        : item);
    });
  };

  const dailyStats = useMemo(() => {
    const todayKey = getTodayString();
    const todayTodos = todos.filter((todo) => todo.date === todayKey);
    const completed = todayTodos.filter((todo) => todo.completed).length;
    const pending = todayTodos.filter((todo) => !todo.completed).length;
    const active = todos.filter((todo) => !todo.completed).length;

    return { total: todayTodos.length, completed, pending, active };
  }, [todos]);

  const sortedTodos = useMemo(() => {
    const list = [...todos];

    return list.sort((first, second) => {
      const priorityRanking = { urgent: 0, medium: 1, low: 2 };
      const firstPriority = priorityRanking[first.priority] ?? 4;
      const secondPriority = priorityRanking[second.priority] ?? 4;

      if (first.completed !== second.completed) {
        return Number(first.completed) - Number(second.completed);
      }

      return firstPriority - secondPriority;
    });
  }, [todos]);

  const historyTodos = useMemo(() => {
    const today = getTodayString();
    const rangeStart = historyRange === 'tomorrow'
      ? addDays(today, 1)
      : addDays(today, historyRange === '7days' ? -7 : historyRange === '15days' ? -15 : -30);
    const rangeEnd = historyRange === 'tomorrow' ? rangeStart : today;

    return todos
      .filter((todo) => {
        const historyDate = todo.completedAt ? todo.completedAt.slice(0, 10) : todo.date;
        return historyDate >= rangeStart && historyDate <= rangeEnd;
      })
      .sort((first, second) => {
        const firstDate = first.completedAt?.slice(0, 10) || first.date;
        const secondDate = second.completedAt?.slice(0, 10) || second.date;
        return firstDate.localeCompare(secondDate);
      });
  }, [historyRange, todos]);

  return (
    <TodoProvider value={{ todos, rewardBalance, addTodo, updateTodo, deleteTodo, toggleComplete }}>
      <div className="planner-shell">
        <main className="main-panel">
          <header className="main-header">
            <div>
              <p className="eyebrow">Planner</p>
              <h1>Today</h1>
            </div>
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </button>
          </header>

          <section className="stats-grid">
            <div className="stat-card">
              <span>Completed</span>
              <strong>{dailyStats.completed}</strong>
            </div>
            <div className="stat-card">
              <span>Pending</span>
              <strong>{dailyStats.pending}</strong>
            </div>
            <div className="stat-card">
              <span>Active</span>
              <strong>{dailyStats.active}</strong>
            </div>
            <div className="stat-card reward">
              <span>Rewards</span>
              <strong>{rewardBalance}</strong>
            </div>
          </section>

          <section className="task-builder">
            <TodoForms />
          </section>

          <section className="task-list">
            {sortedTodos.length === 0 ? (
              <div className="empty-state">
                <h3>You're all caught up.</h3>
                <p>Enjoy your free time and come back later.</p>
              </div>
            ) : (
              sortedTodos.map((task) => <TodoItems key={task.id} todo={task} />)
            )}
          </section>

          <section className="history-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Saved timeline</p>
                <h2>Task history</h2>
              </div>
              <span className="history-count">{historyTodos.length} tasks</span>
            </div>

            <div className="history-tabs" role="tablist" aria-label="Task history ranges">
              {[
                ['tomorrow', 'Tomorrow'],
                ['7days', 'Last 7 days'],
                ['15days', 'Last 15 days'],
                ['month', 'Last month'],
              ].map(([value, label]) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={historyRange === value}
                  className={`history-tab ${historyRange === value ? 'active' : ''}`}
                  key={value}
                  onClick={() => setHistoryRange(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="history-list">
              {historyTodos.length === 0 ? (
                <p className="history-empty">No saved tasks in this range yet.</p>
              ) : (
                historyTodos.map((task) => (
                  <div className={`history-row priority-${task.priority || 'medium'}`} key={task.id}>
                    <span className={`history-check ${task.completed ? 'completed' : ''}`}>{task.completed ? '✓' : '•'}</span>
                    <span className="history-task-name">{task.text}</span>
                    <time dateTime={task.completedAt || task.date}>{task.completedAt ? task.completedAt.slice(0, 10) : task.date}</time>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </TodoProvider>
  );
}

export default App;
