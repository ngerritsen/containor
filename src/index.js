import Containor from './containor';
import DependenyRegistry from './dependency-registry';
import DependencyResolver from './dependency-resolver';

export default class ContainorWrapper extends Containor {
  constructor() {
    const dependencyRegistry = new DependenyRegistry();
    const dependencyResolver = new DependencyResolver(dependencyRegistry);

    super(dependencyRegistry, dependencyResolver);
    this.name = 'Containor';
  }
}
