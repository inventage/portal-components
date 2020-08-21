// ids of menu and items must all be unique.
/**
 * An IdPath is a sequence of ids (strings) that describe the path through the menu/item structure, starting from a
 * menu id and leading through one or more item ids.
 */
export class IdPath {
  constructor(...ids) {
    this.ids = ids ? ids.filter(id => id !== undefined) : [];
  }

  /**
   * Gets the id for a given level. Simply prevents errors and returns undefined for index out of bounds.
   *
   * @param {Number} level - a level (e.g. 0 for the root id, which is the menu id).
   * @returns {string} an id.
   */
  getId(level) {
    return level < this.ids.length ? this.ids[level] : undefined;
  }

  /**
   * Convenience function to get the root level id (menu id) of the path.
   *
   * @returns {string} an id.
   */
  getMenuId() {
    return this.getId(0);
  }

  /**
   * Convenience function to get the first-level id of the path.
   *
   * @returns {string} an id.
   */
  getFirstLevelItemId() {
    return this.getId(1);
  }

  /**
   * Check whether or not the path contains a given id.
   *
   * @param {string} id - an id to look for in the path.
   * @returns {boolean} true if the id is part of the path.
   */
  contains(id) {
    for (const currentId of this.ids) {
      if (currentId === id) {
        return true;
      }
    }
    return false;
  }

  /**
   * @returns {boolean} true if the path has no ids.
   */
  isEmpty() {
    return this.ids.length === 0;
  }

  /**
   * @param ids a list of ids to append to the newly created path.
   * @returns {IdPath} a new id path consisting of this path's ids with the given ids appended at the end.
   */
  concat(...ids) {
    return new IdPath(...this.ids, ...ids);
  }
}
