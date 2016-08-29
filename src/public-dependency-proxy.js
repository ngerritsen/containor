/**
 * @typedef  {Object}   PublicDependencyProxy
 * @property {Function} with
 */

export default class PublicDependencyProxy {
  /**
   * @param {Dependency} dependency
   */
  constructor(dependency) {
    this._dependency = dependency;
  }

  /**
   * Puts arguments on dependency
   */
  with(...args) {
    this._dependency.arguments = args;
  }
}
