import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import {AiOutlineDelete} from 'react-icons/ai';
import { BsCheckLg } from "react-icons/bs";
import { v4 as uuidv4 } from 'uuid';
import { postTaskAction } from './Redux/task/post/action';
import { useDispatch } from 'react-redux';

function App () {
  const dispatch = useDispatch()
  const [isCompleteScreen, setIsCompleteScreen] = useState (false);
  const [allTodos, setTodos] = useState ([]);
  const [newTitle, setNewTitle] = useState ('');
  const [completedTodos, setCompletedTodos] = useState ([]);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef(null);
  

  const handleAddTodo = (e) => {
    e.preventDefault();
  
    if (!newTitle.trim()) {
      setErrorMessage('Please enter a task!');
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      return;
    }
  
    const taskId = uuidv4();
    let newTodoItem = {
      _id: taskId,
      title: newTitle,
    };
  
    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    dispatch(postTaskAction(newTodoItem))
    setTodos(updatedTodoArr);
    setNewTitle('');
    inputRef.current.value = '';
  };
  

  const handleDeleteTodo = (_id) => {
    let reducedTodo = allTodos.filter((item) => item._id !== _id);
    localStorage.setItem('TodoData', JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  };
  

  const handleComplete = (index, _id) => {
    let now = new Date ();
    let dd = now.getDate ();
    let mm = now.getMonth () + 1;
    let yyyy = now.getFullYear ();
    let h = now.getHours ();
    let m = now.getMinutes ();
    let s = now.getSeconds ();
    let completedOn =
      dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;

    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push (filteredItem);
    setCompletedTodos (updatedCompletedArr);
    handleDeleteTodo (_id);
    localStorage.setItem (
      'completedTodos',
      JSON.stringify (updatedCompletedArr)
    );
  };

  const handleDeleteCompletedTodo = (_id) => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice (_id, 1);

    localStorage.setItem ('completedTodos', JSON.stringify (reducedTodo));
    setCompletedTodos (reducedTodo);
  };

  useEffect (() => {
    let savedTodo = JSON.parse (localStorage.getItem ('TodoData'));
    let savedCompletedTodo = JSON.parse (
      localStorage.getItem ('completedTodos')
    );
    if (savedTodo) {
      setTodos (savedTodo);
    }

    if (savedCompletedTodo) {
      setCompletedTodos (savedCompletedTodo);
    }
  }, []);

  return (
    <div className="App">
      <h1>My Todos</h1>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle (e.target.value)}
              placeholder="What's the task?"
              ref={inputRef} 
            />
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>
        {errorMessage && <p 
        // className="error" 
        style={{color:"red"}}>{errorMessage}</p>}

        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
            onClick={() => setIsCompleteScreen (false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
            onClick={() => setIsCompleteScreen (true)}
          >
            Completed
          </button>
        </div>

        <div className="todo-list">
          {isCompleteScreen === false &&
            allTodos.map ((item, index) => {
                return (
                  <div className="todo-list-item" key={item._id}>
                    <div>
                      <h3>{item.title}</h3>
                    </div>
  
                    <div>
                      <AiOutlineDelete
                        className="icon"
                        onClick={(e) => handleDeleteTodo (item._id)}
                        title="Delete?"
                      />
                      <BsCheckLg
                        className="check-icon"
                        onClick={(e) => handleComplete(index, item._id)}
                        title="Complete?"
                      />
                    </div>
                  </div>
                );
            })}

          {isCompleteScreen === true &&
            completedTodos.map ((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p><small>Completed on: {item.completedOn}</small></p>
                  </div>

                  <div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={(e) => handleDeleteCompletedTodo(item._id)}
                      title="Delete?"
                    />
                  </div>
                </div>
              );
            })}

        </div>
      </div>
    </div>
  );
}

export default App;