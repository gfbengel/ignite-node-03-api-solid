export class LateCheckInValidationError extends Error {
  constructor() {
    super("The check-in can't be validated after 20 minutes of its creation")
  }
}
