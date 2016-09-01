/**
 * @typedef  {Object}   DependenyResolver
 * @property {Function} resolve
 */

export default class DependenyResolver {
  constructor(dependencyRegistry) {
    this._dependencyRegistry = dependencyRegistry;
  }

  /**
   * @param  {MatchingElement} matchingElement
   * @return {Object}          instance
   */
  resolve(matchingElement) {
    const name = matchingElement.name || matchingElement;
    const dependency = this._dependencyRegistry.get(name);
    const args = this._resolveArguments(dependency);

    return dependency.getInstance(args);
  }

  /**
   * @param  {Dependency} dependency
   * @return {Array}      arguments
   */
  _resolveArguments(dependency) {
    return dependency.arguments.map(({ value, raw }) => {
      return raw ? value : this.resolve(value);
    });
  }
}
