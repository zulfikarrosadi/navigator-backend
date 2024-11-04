export class UserAlreadyExistError extends Error {
  public code: number;
  constructor(message: string) {
    super(message);
    this.code = 400
  }
}

export class ServerError extends Error {
  public code: number;
  constructor(message: string) {
    super(message);
    this.code = 500;
  }
}
