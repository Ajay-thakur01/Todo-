import { createContext, useContext } from 'react';

export const TodoContext = createContext({
  todos: [],
  rewardBalance: 0,
  addTodo: () => {},
  updateTodo: () => {},
  deleteTodo: () => {},
  toggleComplete: () => {},
});

export const useTodo = () => useContext(TodoContext);

export const TodoProvider = TodoContext.Provider;

export default TodoContext;