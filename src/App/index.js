import React, { Component } from 'react';
import styled from 'styled-components';
import { styler, tween, easing } from 'popmotion';

import setting from '../assets/settings.svg';
import Todo from '../Components/Todo';
import EditingTodo from '../Components/EditingTodo';
import cross from '../assets/cross.svg';

class App extends Component {
  state = {
    todos: [
      { key: '1', data: { text: 'react', isDone: false } },
      { key: '3', data: { text: 'redux', isDone: false } },
      { key: '5', data: { text: 'rxjs', isDone: false } },
      { key: '7', data: { text: 'expo', isDone: true } },
      { key: '9', data: { text: 'create-react-app', isDone: false } },
    ],
    value: '',
    editing: {
      position: { x: -1, y: -1 },
      key: '',
    },
    selected: 'all', // all, completed, uncompleted
  };
  componentDidMount() {
    // this.editingTodoStyler = styler(this.editingTodo);
  }
  onCheck = (key) => {
    this.setState({
      todos: this.state.todos.map(todo => (
        todo.key === key
          ? ({
            key,
            data: {
              text: todo.data.text,
              isDone: !todo.data.isDone,
            },
          })
          : todo
      )),
    });
  }
  onDelete = (key) => {
    this.setState({
      todos: this.state.todos.filter(todo => todo.key !== key),
    });
  }
  onEdit = (key, { x, y }) => {
    this.setState({
      editing: {
        position: { x, y },
        key,
      },
    });
  }

  onEdited = (text) => {
    const todoIndex = this.state.todos.findIndex(t => t.key === this.state.editing.key);
    const { key, data: { isDone } } = this.state.todos[todoIndex];
    this.setState({
      todos: [
        ...this.state.todos.slice(0, todoIndex),
        { key, data: { text, isDone } },
        ...this.state.todos.slice(todoIndex + 1),
      ],
      editing: {
        position: { x: -1, y: -1 },
        key: '',
      },
    });
  }
  handleChange = ({ target: { value } }) => {
    this.setState({ value });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.value) {
      this.setState({
        value: '',
        todos: [
          {
            key: new Date(),
            data: {
              text: e.target.firstChild.value,
              isDone: false,
            },
          },
          ...this.state.todos,
        ],
      });
    }
  }
  clearValue = () => {
    this.setState({ value: '' });
  }
  clearCompleted = () => {
    const { todos } = this.state;
    this.setState({
      selected: 'completed',
    });
    setTimeout(() => this.setState({
      todos: todos.filter(todo => !todo.data.isDone),
    }), 300);
  }
  setSelected = (selected) => {
    this.setState({
      selected,
    });
  }
  isTodoActive = (isDone, selected) => {
    if (selected === 'all') {
      return true;
    } else if (selected === 'uncompleted') {
      return isDone === true;
    }
    return isDone === false;
  }
  render() {
    console.log(this.state.editing.position);

    const { className } = this.props;
    const { todos, value, selected } = this.state;

    const editingText = this.state.editing.key
      ? this.state.todos.find(t => t.key === this.state.editing.key).data.text
      : '';
    const clearButton = value && <ClearButton onClick={this.clearValue}>X</ClearButton>;
    const todoElements = todos.map(({ key, data: { text, isDone } }) => (
      <Todo
        key={key}
        text={text}
        isDone={isDone}
        active={this.isTodoActive(isDone, selected)}
        onCheck={() => this.onCheck(key)}
        onDelete={() => this.onDelete(key)}
        onEdit={position => this.onEdit(key, position)}
      />
    ));
    return (
      <section className={className}>
        <section ref={(r) => { this.wrapper = r; }} className={this.state.editing.key ? 'wrapper-editing' : 'wrapper'}>
          <h1 className="todo-title">todos</h1>
          <header>
            <section className="input-container">
              <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="what to do..." value={value} onChange={this.handleChange} />
              </form>
              {clearButton}
            </section>
            <section className="settings">
              <img className="settings-icon" src={setting} alt="settings" />
            </section>
          </header>
          <section className="content">
            {todoElements}
          </section>
          <footer>
            <div className="clear-completed">
              <button type="button" onClick={this.clearCompleted}>clear</button>
            </div>
            <div className="selected">
              <button type="button" onClick={() => this.setSelected('all')}>all</button>
              <button type="button" onClick={() => this.setSelected('completed')}>Completed</button>
              <button type="button" onClick={() => this.setSelected('uncompleted')}>Uncompleted</button>
            </div>
          </footer>
        </section>
        <EditingTodo text={editingText} position={this.state.editing.position} onEdited={this.onEdited} />
      </section>
    );
  }
}

const ClearButton = styled.button`
  background-color: transparent;
  border: 0;
  color: white;
  font-size: 1em;
  img {
    width: 20px;
    height: 20px;
  }
`;

export default styled(App)`
  position: fixed;
  left: 0;
  right: 0;
  top: 100px;
  display: flex;
  justify-content: center;

  .todo-title {
    position: absolute;
    margin: 0;
    color: white;
    text-shadow: 3px 3px 3px rgba(150, 150, 151, .5);
    transform: translate(30px ,-55px);
  }

  .wrapper, .wrapper-editing {
    transition-duration: .5s;
    background-color: white;
    width: 500px;
    box-shadow: 4px 10px 25px -8px rgba(0,0,0,0.75);
    border-radius: 2px;
  }
  .wrapper-editing {
    filter: blur(2px);
    opacity: 0.7;
  }

  header {
    box-shadow: 0 2px 2px -2px gray;
    border-radius: 2px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 11px; 
    padding-left: 20px;
    background-color: pink;
    .input-container {
      flex-grow: 1;
      margin-right: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      form {
        margin-right: 15px;
        width: 350px;
      }
      input {
        font-size: 1em;
        margin: 0;
        height: 100%;
        background-color: transparent;
        border: 0;
        &::placeholder {
          font-style: italic;
          opacity: 0.3;
        }
        &:focus {
          outline: none;
        }
      }
    }
    .settings {
      height: 30px;
      .settings-icon {
        width: 30px;
        height: 30px;
      }
    }
  }
  footer {
    width: 100%;
    border-top: solid 1px black;
    display: flex;
    font-size: 18px;
    display: flex;
    justify-content: space-between
    .clear-completed {
    }
    .selected {
      display: flex;
      justify-content: space-between;
    }
  }
`;

