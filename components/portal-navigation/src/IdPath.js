// ids of menu and items must all be unique.
export class IdPath {
  constructor(...ids) {
    this.ids = ids ? ids.filter(id => id !== undefined) : [];
  }

  getId(level) {
    return level < this.ids.length ? this.ids[level] : undefined;
  }

  getMenuId() {
    return this.getId(0);
  }

  getFirstLevelItemId() {
    return this.getId(1);
  }

  contains(id) {
    for (const currentId of this.ids) {
      if (currentId === id) {
        return true;
      }
    }
    return false;
  }

  isEmpty() {
    return this.ids.length === 0;
  }
}
