export class MockEvent {
  count = 0;

  preventDefault(): void {
    this.count += 1;
  }
}
