export class MockEvent {
  count = 0;

  preventDefault() {
    this.count += 1;
  }
}
