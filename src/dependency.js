/**
 * @typedef  {Object}   Dependency
 * @property {Array}    arguments
 * @property {Function} getInstance
 * @property {Function} addArguments
 * @property {Function} dependencyConstructor
 */

export default class Dependency {
  /**
   * @param {Function}  dependencyConstructor
   * @param {shared}    [shared=false]
   */
  constructor(dependencyConstructor, shared = false) {
    this._constructor = dependencyConstructor;
    this._shared = shared;

    this._arguments = [];
    this.instance = null;
  }

  /**
   * @return {Function} constructor
   */
  get dependencyConstructor() {
    return this._constructor;
  }

  /**
   * @return {Array} arguments
   */
  get arguments() {
    return this._arguments;
  }

  /**
   * @param {array}   args
   * @param {boolean} [raw=false]
   */
  addArguments(args, raw = false) {
    const newArgs = args.map(value => ({ value, raw }));
    this._arguments = [...this._arguments, ...newArgs];
  }

  /**
   * @param  {Array}  [args=[]]
   * @return {Object} instance
   */
  getInstance(args = []) {
    if (this._shared) {
      return this._getSharedInstance(args);
    }

    return new this._constructor(...args);
  }

  /**
   * @private
   * @param  {Array}  [args=[]]
   * @return {Object} instance
   */
  _getSharedInstance(args = []) {
    if (!this._instance) {
      this._instance = new this._constructor(...args);
    }

    return this._instance;
  }
}
