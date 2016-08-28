import PublicDependencyProxy from './public-dependency-proxy';

/**
 * @typedef  {Object}   Containor
 * @property {Function} add
 * @property {Function} share
 * @property {Function} get
 */

 /**
  * @typedef {(Function|string)} MatchingElement
  */

export default class Containor {
  /**
   * @param {DependenyRegistry}  dependencyRegistry
   * @param {DependencyFactory}  dependencyFactory
   * @param {DependencyResolver} dependencyResolver
   */
  constructor(dependencyRegistry, dependencyFactory, dependencyResolver) {
    this._dependencyRegistry = dependencyRegistry;
    this._dependencyFactory = dependencyFactory;
    this._dependencyResolver = dependencyResolver;
  }

  /**
   * @param  {MatchingElement}        matchingElement - constructor or interface string
   * @param  {Function}               [implementingConstructor] - Manditory if matchingElement is interface string
   * @return {PublicDependencyProxy}  PublicDependencyProxy
   *
   * @throws {DependencyAlreadyExistsError}
   */
  add(matchingElement, implementingConstructor) {
    const dependency = this._dependencyFactory.create(matchingElement, implementingConstructor);
    this._dependencyRegistry.register(dependency);

    return new PublicDependencyProxy(dependency);
  }

  /**
   * @param {MatchingElement}         matchingElement - constructor or interface string
   * @param {Function}                [implementingConstructor] - Manditory if matchingElement is interface string
   * @return {PublicDependencyProxy}  PublicDependencyProxy
   *
   * @throws {DependencyAlreadyExistsError}
   */
  share(matchingElement, implementingConstructor) {
    const dependency = this._dependencyFactory.create(matchingElement, implementingConstructor, true);
    this._dependencyRegistry.register(dependency);

    return new PublicDependencyProxy(dependency);
  }

  /**
   * @param  {MatchingElement} matchingElement
   * @return {Object}          instance
   *
   * @throws {DependencyNotFoundError}
   */
  get(matchingElement) {
    return this._dependencyResolver.resolve(matchingElement);
  }
}
