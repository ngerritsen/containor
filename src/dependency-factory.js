import Dependency from './dependency';

/**
 * @typedef  {Object}   DependencyFactory
 * @property {Function} create
 */

export default class DependencyFactory {
  /**
   * @param   {MatchingElement} matchingElement
   * @param   {Function}        [implementingConstructor]
   * @param   {shared}          [shared]
   * @returns {Dependency}
   */
  create(matchingElement, implementingConstructor, shared = false) {
    if (typeof matchingElement === 'function') {
      return new Dependency(matchingElement.name, matchingElement, shared);
    }

    return new Dependency(matchingElement, implementingConstructor, shared);
  }
}
