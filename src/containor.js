import PublicDependencyProxy from './public-dependency-proxy';
import Dependency from './dependency.js';

/**
 * @typedef  {Object}   Containor
 * @property {Function} add
 * @property {Function} share
 * @property {Function} get
 */

export default class Containor {
  /**
   * @param {DependenyRegistry}  dependencyRegistry
   * @param {DependencyResolver} dependencyResolver
   */
  constructor(dependencyRegistry, dependencyResolver) {
    this._dependencyRegistry = dependencyRegistry;
    this._dependencyResolver = dependencyResolver;
  }

  /**
   * @param  {Function}               dependencyConstructor
   * @return {PublicDependencyProxy}  PublicDependencyProxy
   *
   * @throws {DependencyAlreadyExistsError}
   */
  add(dependencyConstructor) {
    const dependency = new Dependency(dependencyConstructor);

    this._dependencyRegistry.register(dependency);
    return new PublicDependencyProxy(dependency);
  }

  /**
   * @param   {Function}               dependencyConstructor
   * @return  {PublicDependencyProxy}  PublicDependencyProxy
   *
   * @throws {DependencyAlreadyExistsError}
   */
  share(dependencyConstructor) {
    const dependency = new Dependency(dependencyConstructor, true);

    this._dependencyRegistry.register(dependency);
    return new PublicDependencyProxy(dependency);
  }

  /**
   * @param  {Function} matchingConstructor
   * @return {Object}   instance
   *
   * @throws {DependencyNotFoundError}
   */
  get(matchingConstructor) {
    return this._dependencyResolver.resolve(matchingConstructor);
  }
}
