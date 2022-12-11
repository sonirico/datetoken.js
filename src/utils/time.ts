export class Clock {
  public getTime(): Date {
    return new Date();
  }

  public forward(millis: number): Date {
    return new Date();
  }

  public static create(): Clock {
    return new Clock();
  }
}

export class TestClock {
  private now: Date = new Date();
  public constructor(now: Date = new Date()) {
    this.now = now;
  }

  public getTime(): Date {
    return this.now;
  }

  public forward(millis: number): Date {
    return (this.now = new Date(this.now.getTime() + millis));
  }

  public static create(now: Date): TestClock {
    return new TestClock(now);
  }
}
