/**
 * @typedef  {Object}   PublicDependencyProxy
 * @property {Function} withArguments
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
  withArguments(...args) {
    this._dependency.arguments = args;
  }
}
