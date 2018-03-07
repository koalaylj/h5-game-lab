/**
 * module of data manager.
 * use {key:value} model to save data.
 */
define(function (require, exports, module) {

  var data = {};

  /**
   * is valid key.
   * @param {string} key 
   */
  function isValidKey(key) {
    return typeof key === 'string' && key !== null && key !== undefined;
  }

  /**
   * save data to cache.
   * @param {string} key  key must be a string type and cannot start with "__".
   * @param {any} value value canbe any type.
   */
  function set(key, value) {
    if (isValidKey(key)) {
      data[key] = value;
    } else {
      throw new Error('key should be a string.');
    }
  }

  /**
   * get data from cache.
   * @param {string} key 
   */
  function get(key) {
    if (isValidKey(key)) {
      return data[key];
    }
    return undefined;
  }

  /**
   * has the value of the specified key.
   * @param {string} key 
   */
  function has(key) {
    if (isValidKey(key)) {
      return data[key] !== undefined;
    } else {
      throw new Error('invalid key: key should be a string!');
    }
  }

  /**
   * delete data of the key from cache.
   * @param {string} key 
   */
  function remove(key) {
    if (isValidKey(key) && has(key)) {
      delete data[key];
    }
  }

  return {
    set: set,
    get: get,
    has: has,
    remove: remove
  };

});