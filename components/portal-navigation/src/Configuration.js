export class Configuration {
  constructor(groupIds) {
    this.__data = undefined;
    this.groupIds = groupIds;
  }

  setConfigData(data) {
    this.__data = data || undefined;
    this.__generateUniqueIds();
  }

  __generateUniqueIds() {
    if (!this.__data) {
      return;
    }

    let id = 0;
    this.groupIds.forEach(groupId => {
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

  getGroup(groupId) {
    return this.getData(['groups', groupId]);
  }

  getItem(path /* { groupId, menuId, itemId } */) {
    if (!path || !path.groupId || !path.menuId || !path.itemId) {
      return undefined;
    }

    const nodePath = this.findFirstNodePath(element => {
      return element.id === path.itemId;
    });

    if (nodePath) {
      return nodePath.item;
    }
    return undefined;
  }

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

  getPathFromUrl(url, includedGroupIds = this.groupIds) {
    return this.findFirstPath(element => element.link === url, includedGroupIds);
  }

  findFirstPath(selector /* (menu|item) => boolean */, includedGroupIds = this.groupIds) {
    return Configuration.toPath(this.findFirstNodePath(selector, includedGroupIds));
  }

  findFirstNodePath(selector /* (menu|item) => boolean */, includedGroupIds = this.groupIds) {
    if (!this.__data || !selector) {
      return undefined;
    }

    for (let g = 0; g < includedGroupIds.length; g += 1) {
      const group = this.getGroup(includedGroupIds[g]);
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
