export class Configuration {
  constructor() {
    this.__data = {};
  }

  setConfigData(data) {
    this.__data = data || {};
  }

  getData(key, fallback, data = this.__data) {
    if (!data) {
      return fallback;
    }

    const parts = key.split('.');
    const prop = parts[0];

    const propParts = prop.split(':');

    // console.log(`prop: ${propParts[0]}, index: ${propParts.length > 1 ? propParts[1] : '<none>'}`);

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

  getActivePathFromUrl(url, includedGroups = []) {
    if (!this.__data) {
      return undefined;
    }

    if (url) {
      for (let g = 0; g < includedGroups.length; g += 1) {
        const group = includedGroups[g];
        const menus = this.getData(`groups.${group}`, []);
        if (menus && menus.length > 0) {
          for (let m = 0; m < menus.length; m += 1) {
            const menu = menus[m];
            if (menu && menu.link === url) {
              return { group, menuId: menu.id, itemId: undefined };
            }
            const { items } = menu;
            if (items && items.length > 0) {
              for (let i = 0; i < menus.length; i += 1) {
                const item = items[i];
                if (item && item.link === url) {
                  return { group, menuId: menu.id, itemId: item.id };
                }
              }
            }
          }
        }
      }
    } else {
      this.activePath = undefined;
    }
    return undefined;
  }
}
