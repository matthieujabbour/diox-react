/**
 * Copyright (c) Matthieu Jabbour.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ComponentClass } from 'react';
import { Store, Mapper } from 'diox';

/** Any valid JavaScript primitive. */
type mixed = any; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Generic React component class. */
type Component = ComponentClass<mixed>;

/** Function that exposes Store's public methods to component for internal use. */
type connector = (publicApi: {
  dispatch: (hash: string, mutation: mixed) => void;
  mutate: (hash: string, mutation: mixed) => void;
}) => Component;

/**
 * Connects the given diox Store to React component. Once component is mounted in the DOM, it
 * automatically subscribes to modules and combiners specified in the mapper, and its state is
 * filled with those values. All subscriptions are removed right before unmounting component.
 *
 * @param {Store} store diox Store to bind to the component.
 *
 * @param {Mapper} mapper diox Mapper to register on component mounting.
 *
 * @returns {Component} React connected component.
 */
export default function connect(store: Store, mapper: Mapper) {
  return (bindComponent: connector): Component => {
    const Container: Component = bindComponent({
      dispatch: store.dispatch.bind(store),
      mutate: store.mutate.bind(store),
    });
    return class extends Container {
      /** List of component's subscriptions ids to the store. */
      private subscriptions: string[];

      public constructor(props: mixed) {
        super(props);
        this.subscriptions = [];
      }

      /** Subscribes to all modules and combiners defined in mapper. */
      public componentDidMount(): void {
        Object.keys(mapper).forEach((hash) => {
          this.subscriptions.push(store.subscribe(hash, (newState) => {
            this.setState(() => mapper[hash](newState));
          }));
        });
        if (super.componentDidMount !== undefined) {
          super.componentDidMount();
        }
      }

      /** Unsubscribes from all modules and combiners defined in mapper. */
      public componentWillUnmount(): void {
        Object.keys(mapper).forEach((combiner) => {
          store.unsubscribe(combiner, this.subscriptions.shift() as string);
        });
        if (super.componentWillUnmount !== undefined) {
          super.componentWillUnmount();
        }
      }
    };
  };
}
