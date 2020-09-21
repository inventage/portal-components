export class MockEventListener {
  constructor() {
    this.count = 0;
    this.e = undefined;
  }

  create() {
    return e => {
      this.count += 1;
      this.e = e;
    };
  }
}
