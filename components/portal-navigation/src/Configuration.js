/**
 * Wraps the json structured configuration of a portal navigation, does some basic sanitizing of the received data
 * (e.g. generating missing ids), and provides convenience functions to access menus and items with the data.
 */
import { ObjectPath } from './ObjectPath.js';
// eslint-disable-next-line no-unused-vars
import { IdPath } from './IdPath.js';

export class Configuration {
  /**
   * @param {*|undefined} data - configuration data. On more info how this needs to be structured see
   * [documentation]{@link https://github.com/inventage/portal-components/blob/master/docs/portal-navigation/configuration.md}.
   */
  constructor(data = undefined) {
    this.__data = data || undefined;
    this.__generateAllMissingIds();
  }

  /**
   * Generates "unique ids" for menus/items missing an id.
   *
   * @private
   */
  __generateAllMissingIds() {
    if (!this.__data) {
      return;
    }

    let id = 0;
    this.getMenus().forEach(menu => {
      id = this.__generateMissingIds(menu, id);
    });
  }

  /**
   * Generates the missing ids for menu/items of the given object and its child items.
   * @param object the "root" object of the tree structure that would be checked for missing ids.
   * @param nextAvailableId the next available id.
   * @returns {Number} the next available id.
   * @private
   */
  __generateMissingIds(object, nextAvailableId) {
    let id = nextAvailableId;
    if (!object.id) {
      // eslint-disable-next-line no-param-reassign
      object.id = `(${id})`;
      id += 1;
    }

    if (object.items && object.items.length > 0) {
      object.items.forEach(item => {
        id = this.__generateMissingIds(item, id);
      });
    }

    return id;
  }

  /**
   * @returns {undefined|*} returns all menus within the 'menus' property of the dataset.
   */
  getMenus() {
    return this.getData(['menus']);
  }

  /**
   * Returns the menu object identified by the given menuId.
   *
   * @param {string} menuId - a menuId of a menu found within the configuration.
   * @returns {*} the menu object found in the configuration.
   */
  getMenu(menuId) {
    return this.getData([`menus::${menuId}`]);
  }

  /**
   * Returns the first object within the given data that matches the given array of keys (keyPath).
   * By default the configurations data will be used, but you can pass subsets of the data to only search these parts.
   * A key within the path can be a simple string (referring to a property name) or a two strings delimited by '::'.
   * This refers to a menu/item (by id) within an array structure. e.g. ['menus::menu1', 'items::item3'] would find
   * the first item with id 'menu3' (in array property named 'items') of menu with id 'menu1' (in array of property
   * named 'menus').
   *
   * @param {string[]} keyPath - a path of property names describing the path to the object to be found.
   * @param data the data set to be searched. the configurations data set by default.
   * @returns {undefined|*} the first object matching the given path.
   */
  getData(keyPath, data = this.__data) {
    if (!data || !keyPath || keyPath.length <= 0) {
      return undefined;
    }

    const head = keyPath[0];

    const value = this.__resolveValue(head, data);

    if (keyPath.length === 1) {
      return value;
    }

    const tail = keyPath.slice(1, keyPath.length);
    return this.getData(tail, value);
  }

  /**
   * Returns the id path to the first item, whose url matches the given url.
   * If none can be found the process is repeated while the given url is "reduced" step by step by removing the last
   * part delimited with '/' until a match can be found. If still none can be found undefined is returned.
   *
   * @param {string} url - the url of an item within the data set.
   * @returns {IdPath}
   */
  getIdPathForUrl(url) {
    if (!url) {
      return undefined;
    }
    const result = this.getIdPathForSelection(object => object.url === url);
    if (result && !result.isEmpty()) {
      return result;
    }
    const index = url.lastIndexOf('/');
    if (index > 0) {
      return this.getIdPathForUrl(url.substring(0, index));
    }
    return undefined;
  }

  /**
   * @callback selector
   * @param {*} object - a menu or item object.
   * @return {boolean} - returns true if the menu or item should be selected.
   */

  /**
   * Returns an id path to the first menu or item that is selected by the given selector.
   *
   * @param {selector} selector
   * @returns {IdPath}
   */
  getIdPathForSelection(selector) {
    return this.getObjectPathForSelection(selector).toIdPath();
  }

  /**
   * Returns an object path (full objects from data set, not just ids) to the first menu or item that is selected by the
   * given selector.
   *
   * @param {selector} selector
   * @returns {ObjectPath}
   */
  getObjectPathForSelection(selector) {
    if (!this.__data || !selector) {
      return new ObjectPath();
    }

    const menus = this.getMenus();
    for (const menu of menus) {
      const result = this.__getObjectPathForSelection([], menu, selector);
      if (result) {
        return new ObjectPath(...result);
      }
    }

    return new ObjectPath();
  }

  /**
   * Returns an array of objects from the data set to the item selected by the selector, if it should exist. Otherwise,
   * undefined is returned.
   *
   * @param visitedObjects the path of objects visited so far (will be prepended to the return value if a match is found)
   * @param currentObject this object (and its children, if any) are checked next for selection
   * @param selector a result will be returned if an item is found for which selector returns true.
   * @returns {any[]|undefined} the object path (as an array) to the item selected by selector or undefined it none can be found.
   * @private
   */
  __getObjectPathForSelection(visitedObjects, currentObject, selector) {
    const newVisitedObjecte = visitedObjects.concat(currentObject);
    if (currentObject && selector(currentObject)) {
      return newVisitedObjecte;
    }

    if (currentObject.items && currentObject.items.length > 0) {
      for (const childObject of currentObject.items) {
        const result = this.__getObjectPathForSelection(newVisitedObjecte, childObject, selector);
        if (result) {
          return result;
        }
      }
    }

    return undefined;
  }

  /**
   * Returns the value of the property specified by the given key from the given data object. If the value of the
   * property is an array, you can specify which array element you want resolved by appending '::' with the id of
   * the desired menu or item in the array. e.g.: items::idOfItem4
   *
   * @param {string} key - a string that is either the name of a property or the name of a property, that's expected to
   * be an array, followed by '::' and an id of the menu or item within that array to tbe returned.
   * @param {*} data - a object from the data set.
   * @returns {*|undefined} - the object found in data based on the given key, which is either the value of the property
   * or a specific array element if the property's value is an array.
   * @private
   */
  // eslint-disable-next-line class-methods-use-this
  __resolveValue(key, data) {
    if (!data || !key) {
      return undefined;
    }

    const keyParts = key.split('::');
    if (keyParts.length === 1) {
      return data[key];
    }

    if (keyParts.length === 2) {
      const values = data[keyParts[0]].filter(object => object.id === keyParts[1]);
      if (values.length > 0) {
        return values[0];
      }
    }

    return undefined;
  }
}
