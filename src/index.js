/* global window module */

import Containor from './containor';
import DependenyRegistry from './dependency-registry';
import DependencyFactory from './dependency-factory';
import DependencyResolver from './dependency-resolver';

class ContainorWrapper extends Containor {
  constructor() {
    const dependencyRegistry = new DependenyRegistry();
    const dependencyFactory = new DependencyFactory();
    const dependencyResolver = new DependencyResolver(dependencyRegistry);

    super(dependencyRegistry, dependencyFactory, dependencyResolver);
    Reflect.defineProperty(this, 'name', {
      value: 'Containor'
    });
  }
}

if (window) {
  window.Containor = ContainorWrapper;
}

if (module) {
  module.exports = ContainorWrapper;
}
