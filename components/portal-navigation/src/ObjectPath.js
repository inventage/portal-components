import { IdPath } from './IdPath.js';

export class ObjectPath {
  constructor(...objects) {
    this.objects = objects ? objects.filter(object => object !== undefined) : [];
  }

  getObject(level) {
    return level < this.objects.length ? this.objects[level] : undefined;
  }

  getLastItem() {
    if (this.objects.length > 1) {
      return this.getObject(this.objects.length - 1);
    }
    return undefined;
  }

  toIdPath() {
    return new IdPath(...this.objects.map(object => object.id));
  }
}
