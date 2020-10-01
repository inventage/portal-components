export class MockEventListener {
  count = 0;

  e = undefined;

  constructor() {
    this.e = undefined;
  }

  create() {
    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line
    return e => {
      this.count += 1;
      this.e = e;
    };
  }
}
