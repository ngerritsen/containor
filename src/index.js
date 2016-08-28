import Containor from './containor';
import DependenyRegistry from './dependency-registry';
import DependencyFactory from './dependency-factory';
import DependencyResolver from './dependency-resolver';

export default class ContainorWrapper extends Containor {
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
