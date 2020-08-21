import { IdPath } from './IdPath.js';

/**
 * An ObjectPath is a sequence of objects (from the menu/item data structure) starting from a menu object, where every
 * object is the child of the previous object in the path.
 */
export class ObjectPath {
  constructor(...objects) {
    this.objects = objects ? objects.filter(object => object !== undefined) : [];
  }

  /**
   * Gets the object for a given level. Simply prevents errors and returns undefined for index out of bounds.
   *
   * @param {Number} level - a level (e.g. 0 for the root id, which is the menu id).
   * @returns {*} an object.
   */
  getObject(level) {
    return level < this.objects.length ? this.objects[level] : undefined;
  }

  /**
   * Returns the last object of the path.
   * @returns {undefined|*}
   */
  getLastItem() {
    if (this.objects.length > 1) {
      return this.getObject(this.objects.length - 1);
    }
    return undefined;
  }

  /**
   * Returns the IdPath represented by this ObjectPath. Reduces the path to its ids.
   * @returns {IdPath}
   */
  toIdPath() {
    return new IdPath(...this.objects.map(object => object.id));
  }
}
