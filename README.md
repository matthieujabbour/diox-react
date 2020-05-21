# diox-react

Official [diox](https://github.com/matthieujabbour/diox) connector for React.

[![Build Status](https://travis-ci.org/matthieujabbour/diox-react.svg?branch=master)](https://travis-ci.org/matthieujabbour/diox-react)
[![Coverage Status](https://coveralls.io/repos/github/matthieujabbour/diox-react/badge.svg)](https://coveralls.io/github/matthieujabbour/diox-react)
[![npm version](https://badge.fury.io/js/diox-react.svg)](https://badge.fury.io/js/diox-react)
[![Downloads](https://img.shields.io/npm/dm/diox-react.svg)](https://www.npmjs.com/package/diox-react)


## Installation

```bash
yarn add diox-react
```


## Usage

```typescript
// main.js
// --------------------------
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Counter from './Counter.tsx';

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
        return Object.assign({}, state || { count: 0 }};
    }
  },
  dispatcher: ({ mutate, hash }, action) => {
    switch (action) {
      case 'incrementAsync':
        setTimeout(() => {
          mutate(hash, 'INCREMENT');
        }, 1000);
        break;
      default:
        break;
    }
  },
});

export default store;


// Counter.tsx
// --------------------------
import * as React from 'react';
import connect from 'diox-react';
import store from './store.js';

const mapper = {
  'my-module': newState => ({ count: newState.count }),
};

export default connect(store, mapper)(({ dispatch }) => class extends React.PureComponent<{}, {
  count : number;
}> {
  public static displayName : string = 'Counter';

  public constructor(props) {
    super(props);
  }

  public doSomething() {
    dispatch('my-module', 'incrementAsync');
  },

  public render(): JSX.Element {
    return  <div onClick={this.doSomething}>{this.state.count}</div>
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
