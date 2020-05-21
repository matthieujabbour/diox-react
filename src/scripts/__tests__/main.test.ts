/**
 * Copyright (c) 2018 - present, Inbenta France.
 * All rights reserved.
 */

/* eslint-disable max-classes-per-file */

import { PureComponent } from 'react';
import { Store } from 'diox';
import connect from 'scripts/main';

/** Any valid JavaScript primitive. */
type mixed = any; // eslint-disable-line @typescript-eslint/no-explicit-any

jest.mock('react');
jest.mock('diox');

describe('main', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should correctly connect component to diox Store (no lifecycle method declared)', () => {
    const store = new Store();
    const Container = connect(store, {
      'my-module': (newState) => ({ count: newState.count }),
    })(({ mutate }) => class extends PureComponent<{}, { count: number }> {
      // eslint-disable-next-line class-methods-use-this
      public test(): void {
        mutate('my-module', 'INCREMENT');
      }
    });
    Container.prototype.setState = jest.fn((callback) => callback());
    const container = new Container({});

    // Simulating React component's mounting...
    (container as mixed).componentDidMount();
    expect(store.subscribe).toHaveBeenCalledTimes(1);
    expect(store.unsubscribe).toHaveBeenCalledTimes(0);
    expect(container.setState).toHaveBeenCalledTimes(1);
    expect((container as mixed).subscriptions).toEqual([1]);

    // Simulating React component's destruction...
    (container as mixed).componentWillUnmount();
    expect(store.unsubscribe).toHaveBeenCalledTimes(1);
    expect((container as mixed).subscriptions).toEqual([]);
  });

  test('should correctly connect component to diox Store (lifecycle method declared)', () => {
    const store = new Store();
    const Container = connect(store, {
      'my-module': (newState) => ({ count: newState.count }),
    })(({ mutate }) => class extends PureComponent<{}, { count: number }> {
      public componentDidMount(): null {
        return null;
      }

      public componentWillUnmount(): null {
        return null;
      }

      // eslint-disable-next-line class-methods-use-this
      public test(): void {
        mutate('my-module', 'INCREMENT');
      }
    });
    Container.prototype.setState = jest.fn((callback) => callback());
    const container = new Container({});

    // Simulating React component's mounting...
    (container as mixed).componentDidMount();
    expect(store.subscribe).toHaveBeenCalledTimes(1);
    expect(store.unsubscribe).toHaveBeenCalledTimes(0);
    expect(container.setState).toHaveBeenCalledTimes(1);
    expect((container as mixed).subscriptions).toEqual([1]);

    // Simulating React component's destruction...
    (container as mixed).componentWillUnmount();
    expect(store.unsubscribe).toHaveBeenCalledTimes(1);
    expect((container as mixed).subscriptions).toEqual([]);
  });
});
