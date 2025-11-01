export class InvalidDurationError extends Error {
  constructor() {
    super("Theres is already an appointment at this time");
  }
}
