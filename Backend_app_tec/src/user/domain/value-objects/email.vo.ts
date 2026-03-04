export class Email {
  private readonly value: string;
  private constructor(value: string) {
    this.value = value;
  }
  public static create(email: string): Email {
    if (!email.includes('@')) {
      throw new Error('The email is requiered');
    }
    return new Email(email.toLowerCase());
  }
  public getEmail(): string {
    return this.value;
  }
}
