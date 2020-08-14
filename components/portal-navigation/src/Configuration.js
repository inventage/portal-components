/**
 * Wraps the json structured configuration of a portal navigation, does some basic sanitizing of the received data
 * (e.g. generating missing ids), and provides convenience functions to access groups, menus and items with the data.
 */
export class Configuration {
  /**
   * @param {*|undefined} data - configuration data. On more info how this needs to be structured see
   * [documentation]{@link https://github.com/inventage/portal-components/blob/master/docs/portal-navigation/configuration.md}.
   */
  constructor(data = undefined) {
    this.__data = data || undefined;
    this.__generateUniqueIds();
  }

  /**
   * Generates "unique ids" for menus and items missing an id.
   * Also, sets the name of each group as an id of the respective group for convenience.
   *
   * @private
   */
  __generateUniqueIds() {
    if (!this.__data) {
      return;
    }

    let id = 0;
    this.getGroupIds().forEach(groupId => {
      const group = this.getGroup(groupId);
      group.id = groupId;

      if (group.menus && group.menus.length > 0) {
        group.menus.forEach(menu => {
          if (!menu.id) {
            // eslint-disable-next-line no-param-reassign
            menu.id = `(${id})`;
            id += 1;
          }
          if (menu.items && menu.items.length > 0) {
            menu.items.forEach(item => {
              if (!item.id) {
                // eslint-disable-next-line no-param-reassign
                item.id = `(${id})`;
                id += 1;
              }
            });
          }
        });
      }
    });
  }

  /**
   * Returns all groupIds found in 'groups'.
   *
   * @returns {string[]}
   */
  getGroupIds() {
    const groups = this.getData(['groups']);
    return Object.keys(groups);
  }

  /**
   * Returns the group object identified by the given groupId.
   *
   * @param {string} groupId - a groupId of a group found within the configuration.
   * @returns {*} the group object found in the configuration.
   */
  getGroup(groupId) {
    return this.getData(['groups', groupId]);
  }

  /**
   * Returns the first object within the given data that matches the given 'path' array (keyPath).
   * By default the configurations data will be used, but you can pass subsets of the data to only earch these parts.
   * A key within the path can be a simple string (refering to a property name) or a two strings delimited by '::'.
   * This refers a menu/item (by id) within an array structure. e.g. ['groups', 'group1', 'menus::menu3'] would find
   * the first of match of a menu identified by id 'menu3' within the menus property of the group identified by id
   * 'group1' within the groups property.
   *
   * @param {string[]} keyPath - a path of property names describing the path to the object to be found.
   * @param data the data set to be searched. the configurtions data set by default.
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
   * Returns the id path to the first menu or item, whose url matches the given url.
   * If none can be found the process is repeated while the given url is "reduced" step by step by removing the last
   * part delimited with '/' until a match can be found. If still none can be found undefined is returned.
   *
   * @param {string} url - the url of an menu or item within the data set.
   * @returns {{itemId: (string), groupId: (string), menuId: (string|undefined)}|undefined}
   */
  getPathFromUrl(url) {
    if (!url) {
      return undefined;
    }
    const result = this.findFirstPath(element => element.url === url);
    if (result) {
      return result;
    }
    const index = url.lastIndexOf('/');
    if (index > 0) {
      return this.getPathFromUrl(url.substring(0, index));
    }
    return undefined;
  }

  /**
   * @callback selector
   * @param {*} menuOrItem - a menu or item object.
   * @return {boolean} - returns true if the menu or item should be selected.
   */

  /**
   * Returns an id path to the first menu or item that is selected by the given selector.
   *
   * @param {selector} selector
   * @returns {{itemId: (string), groupId: (string), menuId: (string|undefined)}}
   */
  findFirstPath(selector) {
    return Configuration.toPath(this.findFirstNodePath(selector));
  }

  /**
   * Returns a node path (full objects from data set, not just ids) to the first menu or item that is selected by the
   * given selector.
   *
   * @param {selector} selector
   * @returns {{group: *, menu: *, item: *|undefined}|undefined}
   */
  findFirstNodePath(selector) {
    if (!this.__data || !selector) {
      return undefined;
    }

    const groupIds = this.getGroupIds();
    for (let g = 0; g < groupIds.length; g += 1) {
      const group = this.getGroup(groupIds[g]);
      const { menus } = group;

      if (menus && menus.length > 0) {
        for (let m = 0; m < menus.length; m += 1) {
          const menu = menus[m];
          if (menu && selector(menu)) {
            return { group, menu, item: undefined };
          }
          const { items } = menu;
          if (items && items.length > 0) {
            for (let i = 0; i < items.length; i += 1) {
              const item = items[i];
              if (item && selector(item)) {
                return { group, menu, item };
              }
            }
          }
        }
      }
    }

    return undefined;
  }

  /**
   * Returns the value of the property specified by the given key from the given data object. If the value of the
   * property is an array, you can specify which array element you want resolved by appending '::' with the id of
   * the desired menu or item in the array. e.g.: menus::idOfMenu4
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
      const values = data[keyParts[0]].filter(item => item.id === keyParts[1]);
      if (values.length > 0) {
        return values[0];
      }
    }

    return undefined;
  }

  /**
   * Returns a path just defined by ids (groupId, menuId, itemId) from a full node path (full object from the data set).
   *
   * @param {{group: *, menu: *, item: *|undefined}|undefined} nodePath
   * @returns {{itemId: (string), groupId: (string), menuId: (string|undefined)}|undefined}
   */
  static toPath(nodePath /* {group, menu, item} */) {
    if (!nodePath || !nodePath.group) {
      return undefined;
    }
    return {
      groupId: nodePath.group ? nodePath.group.id : undefined,
      menuId: nodePath.menu ? nodePath.menu.id : undefined,
      itemId: nodePath.item ? nodePath.item.id : undefined,
    };
  }
}
