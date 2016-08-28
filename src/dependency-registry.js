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
   * @param   {string}      name
   * @returns {Dependency}  dependency
   */
  get(name) {
    const dependency = this._findDependency(name);

    if (!dependency) {
      throw new DependencyNotFoundError(name);
    }

    return this._findDependency(name);
  }

  /**
   * @private
   * @param  {Dependency} dependency
   *
   * @throws {DependencyAlreadyExistsError}
   */
  _validateIfUnique(dependency) {
    if (this._findDependency(dependency.name)) {
      throw new DependencyAlreadyExistsError(dependency.name);
    }
  }

  /**
   * @private
   * @param  {string}             name
   * @return {(Object|undefined)} instance
   */
  _findDependency(name) {
    return this._dependencies.find((dep) => dep.name === name);
  }

  /**
   * @private
   * @param   {Dependency} dependency
   */
  _addDependency(dependency) {
    this._dependencies = [...this._dependencies, dependency];
  }
}
