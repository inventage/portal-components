export class Configuration {
  static get groups() {
    return {
      main: 'main',
      meta: 'meta',
      profile: 'profile',
      logout: 'logout',
      all: ['main', 'meta', 'profile', 'logout'],
    };
  }

  constructor() {
    this.__data = {};
  }

  setConfigData(data) {
    this.__data = data || {};
    this.__generateUniqueIds();
  }

  __generateUniqueIds() {
    if (!this.__data) {
      return;
    }

    let id = 0;
    Configuration.groups.all.forEach(group => {
      this.getMenus(group).forEach(menu => {
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
    });
  }

  getMenus(group) {
    return this.getData(`groups.${group}`, []);
  }

  getItem(path /* { group, menuId, itemId } */) {
    if (!path || !path.group || !path.menuId || !path.itemId) {
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

  getData(key, fallback, data = this.__data) {
    if (!data) {
      return fallback;
    }

    const parts = key.split('.');
    const prop = parts[0];

    const propParts = prop.split(':');

    let obj;
    if (propParts[0] in data) {
      obj = data[propParts[0]];
    } else {
      return fallback;
    }

    if (parts.length === 1) {
      if (propParts.length === 1) {
        return obj;
      }
      const filtered = obj.filter(item => item.id === propParts[1]);
      if (filtered.length > 0) {
        return filtered[0];
      }
      return undefined;
    }

    const subKey = parts.slice(1, parts.length).join('.');
    return this.getData(subKey, fallback, obj);
  }

  getPathFromUrl(url, includedGroups = Configuration.groups.all) {
    return this.findFirstPath(element => element.link === url, includedGroups);
  }

  findFirstPath(selector /* (menu|item) => boolean */, includedGroups = Configuration.groups.all) {
    return Configuration.toPath(this.findFirstNodePath(selector, includedGroups));
  }

  findFirstNodePath(selector /* (menu|item) => boolean */, includedGroups = Configuration.groups.all) {
    if (!this.__data || !selector) {
      return undefined;
    }

    for (let g = 0; g < includedGroups.length; g += 1) {
      const group = includedGroups[g];
      const menus = this.getData(`groups.${group}`, []);

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
      group: nodePath.group,
      menuId: nodePath.menu ? nodePath.menu.id : undefined,
      itemId: nodePath.item ? nodePath.item.id : undefined,
    };
  }
}
