/**
 * @typedef  {Object}   Dependency
 * @property {boolean}  name
 * @property {Array}    arguments
 * @property {Function} getInstance
 */

export default class Dependency {
  /**
   * @param {string}      name
   * @param {constructor} constructor
   * @param {shared}      [shared=false]
   */
  constructor(name, constructor, shared = false) {
    this._name = name;
    this._constructor = constructor;
    this._shared = shared;

    this.arguments = [];
    this.instance = null;
  }

  /**
   * @return {string} name
   */
  get name() {
    return this._name;
  }

  /**
   * @param  {Array}  [args=[]]
   * @return {Object} instance
   */
  getInstance(args = []) {
    if (this._shared) {
      return this._getSharedInstance(args);
    }

    return Reflect.construct(this._constructor, args);
  }

  /**
   * @private
   * @param  {Array}  [args=[]]
   * @return {Object} instance
   */
  _getSharedInstance(args = []) {
    if (!this._instance) {
      this._instance = Reflect.construct(this._constructor, args);
    }

    return this._instance;
  }
}
