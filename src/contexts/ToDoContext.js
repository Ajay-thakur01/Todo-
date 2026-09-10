import { createContext, useContext } from "react";

export const TodoContext = createContext({
    todos: [
        {
            id: 1,
            todo: "will complete xyz by ---",
            completed: false,
        },
        {},
    ],
    addTodo: (_todo) => {},
    updateTodo: (_id, _todo) =>{},
    deleteTodo: (_id) => {},
    toggleComplete: (_id) => {},
})

export const useTodo = () =>{
    return useContext(TodoContext)
}

export const TodoProvider = TodoContext.Provider