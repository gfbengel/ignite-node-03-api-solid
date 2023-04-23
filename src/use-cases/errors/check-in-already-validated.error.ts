export class CheckInAlreadyValidatedError extends Error {
  constructor() {
    super('The check-in is already validated')
  }
}
