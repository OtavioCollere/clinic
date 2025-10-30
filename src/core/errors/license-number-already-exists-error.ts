export class LicenseNumberAlreadyExistsError extends Error {
  constructor() {
    super("License Number already exists!");
  }
}
