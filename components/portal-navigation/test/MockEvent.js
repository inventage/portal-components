export class MockEvent {
  constructor() {
    this.count = 0;
  }

  preventDefault() {
    this.count += 1;
  }
}
