import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './style.less';

class Theme {
  color: string;
  subscriptions: any[];

  constructor(color) {
    this.color = color;
    this.subscriptions = [];
  }

  setColor(color) {
    this.color = color;
    this.subscriptions.forEach(f => f());
  }

  subscribe(f) {
    this.subscriptions.push(f);
  }
}

const TODOS = ['Get coffee', 'Eat cookies'];

interface ThemedTextContext {
  theme: Theme;
}

class ThemedText extends React.Component<any, any> {
  static contextTypes = {
    theme: React.PropTypes.object,
  };

  context: ThemedTextContext;

  componentDidMount() {
    this.context.theme.subscribe(() => this.forceUpdate());
  }

  render() {
    return (
      <div style={{color: this.context.theme.color}}>
        {this.props.children}
      </div>
    );
  }
}

interface TodoListProps {
  todos: string[];
}

class TodoList extends React.PureComponent<TodoListProps, any> {
  render() {
    return (
      <ul>
        {this.props.todos.map(todo => {
          return (
            <li key={todo}><ThemedText>{todo}</ThemedText></li>
          );
        })}
      </ul>
    );
  }
}

interface ThemeProviderChildContext {
  theme: Theme;
}

interface ThemeProviderProps {
  color: string;
}

class ThemeProvider extends React.Component<ThemeProviderProps, any> {
  static childContextTypes = {
    theme: React.PropTypes.object,
  };

  theme: Theme;

  constructor(props: ThemeProviderProps) {
    super(props);

    this.theme = new Theme(props.color);
  }

  getChildContext(): ThemeProviderChildContext {
    return { theme: this.theme };
  }

  componentWillReceiveProps(nextProps: ThemeProviderProps) {
    this.theme.setColor(nextProps.color);
  }

  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}

interface AppState {
  color: string;
}

class App extends React.Component<any, Partial<AppState>> {
  constructor(props) {
    super(props);

    this.state = {
      color: 'blue',
    };
  }

  makeRed() {
    this.setState({ color: 'red' });
  }

  render() {
    return (
    <ThemeProvider color={this.state.color}>
      <button onClick={this.makeRed.bind(this)}>
        <ThemedText>Red please!</ThemedText>
      </button>
      <TodoList todos={TODOS} />
    </ThemeProvider>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('root'),
);
