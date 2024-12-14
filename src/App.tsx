/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { getTodos } from './api';
import { Filters } from './types/Filters';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Filters>(Filters.All);

  const onModalClose = () => {
    setSelectedTodoId(null);
  };

  const selectedTodo = todos.find(todo => todo.id === selectedTodoId);

  const filteredTodos = todos
    .filter(todo => todo.title.toLowerCase().includes(query.toLowerCase()))
    .filter(todo => {
      if (status === Filters.All) {
        return true;
      }

      return status === Filters.Completed ? todo.completed : !todo.completed;
    });

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                query={query}
                setQuery={setQuery}
                status={status}
                setStatus={setStatus}
              />
            </div>

            <div className="block">
              {isLoading ? (
                <Loader />
              ) : (
                <TodoList
                  todos={filteredTodos}
                  selectedTodoId={selectedTodoId}
                  setSelectedTodoId={setSelectedTodoId}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedTodoId && selectedTodo && (
        <TodoModal todo={selectedTodo} onClose={onModalClose} />
      )}
    </>
  );
};
