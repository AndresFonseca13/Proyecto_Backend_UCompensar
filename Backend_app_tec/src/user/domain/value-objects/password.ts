export class Password {
  private readonly value: string;
  private constructor(value: string) {
    this.value = value;
  }
  public static create(password: string): Password {
    if (!password) {
      throw new Error('The password is requiered');
    } else if (password.length < 3) {
      throw new Error('The password must more that 3 caracteres');
    }
    return new Password(password);
  }
  public getPassword(): string {
    return this.value;
  }
}
