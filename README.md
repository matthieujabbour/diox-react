<div align="center">
  <img width="320" height="160" src="https://repository-images.githubusercontent.com/140085588/c5c67780-9dd3-11ea-9a14-8b129c46c06b">
<br>

# diox-react

Official [diox](https://github.com/matthieujabbour/diox) connector for React.

[![Build Status](https://travis-ci.org/matthieujabbour/diox-react.svg?branch=master)](https://travis-ci.org/matthieujabbour/diox-react)
[![Coverage Status](https://coveralls.io/repos/github/matthieujabbour/diox-react/badge.svg)](https://coveralls.io/github/matthieujabbour/diox-react)
[![npm version](https://badge.fury.io/js/diox-react.svg)](https://badge.fury.io/js/diox-react)
[![Downloads](https://img.shields.io/npm/dm/diox-react.svg)](https://www.npmjs.com/package/diox-react)

</div>


## Installation

```bash
yarn add diox-react
```


## Usage

```typescript
// main.jsx
// --------------------------
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Counter from './Counter.jsx';

ReactDOM.render(<Counter />, document.body);


// store.js
// --------------------------
import { Store } from 'diox';

const store = new Store();
store.register('my-module', {
  mutator: ({ state }, mutation) => {
    switch (mutation) {
      case 'INCREMENT':
        return {
          count: state.count + 1,
        };
      default:
        return { ...state || { count: 0 } };
    }
  },
});

export default store;


// Counter.jsx
// --------------------------
import * as React from 'react';
import connect from 'diox-react';
import store from './store.jsx';

const mapper = {
  'my-module': (newState) => ({ count: newState.count }),
};

export default connect(store, mapper)(({ mutate }) => class extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  doSomething() {
    mutate('my-module', 'INCREMENT');
  }

  render() {
    return <button type="button" onClick={this.doSomething}>{this.state.count}</button>;
  }
});
```


## API documentation

You can find the full API documentation [here](https://matthieujabbour.github.io/diox-react)


## Contributing

See the [Contribution guide](https://github.com/matthieujabbour/diox-react/blob/master/CONTRIBUTING.md)


## License

[MIT](https://github.com/matthieujabbour/diox-react/blob/master/LICENSE)

Copyright (c) Matthieu Jabbour.
