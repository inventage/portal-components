export class MockEventListener {
  count = 0;

  e = undefined;

  create() {
    return e => {
      this.count += 1;
      this.e = e;
    };
  }
}
