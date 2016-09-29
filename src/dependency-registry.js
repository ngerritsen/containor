import { DependencyAlreadyExistsError, DependencyNotFoundError } from './errors';

/**
 * @typedef  {Object}   DependenyRegistry
 * @property {Function} register
 * @property {Function} get
 */

export default class DependenyRegistry {
  constructor() {
    this._dependencies = [];
  }

  /**
   * @param {Dependency} dependency
   */
  register(dependency) {
    this._validateIfUnique(dependency);
    this._addDependency(dependency);
  }

  /**
   * @param   {Fucntion}    matchingConstructor
   * @returns {Dependency}  dependency
   */
  get(matchingConstructor) {
    const dependency = this._findDependency(matchingConstructor);

    if (!dependency) {
      throw new DependencyNotFoundError(matchingConstructor.name);
    }

    return this._findDependency(matchingConstructor);
  }

  /**
   * @private
   * @param  {Dependency} dependency
   *
   * @throws {DependencyAlreadyExistsError}
   */
  _validateIfUnique(dependency) {
    if (this._findDependency(dependency.dependencyConstructor)) {
      throw new DependencyAlreadyExistsError(dependency.dependencyConstructor.name);
    }
  }

  /**
   * @private
   * @param  {Function}           matchingConstructor
   * @return {(Object|undefined)} instance
   */
  _findDependency(matchingConstructor) {
    return this._dependencies.find(dep => dep.dependencyConstructor === matchingConstructor);
  }

  /**
   * @private
   * @param   {Dependency} dependency
   */
  _addDependency(dependency) {
    this._dependencies = [...this._dependencies, dependency];
  }
}
