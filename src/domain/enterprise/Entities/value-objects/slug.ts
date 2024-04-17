export class Slug {
  private _value: string;

  public get value(): string {
    return this._value;
  }

  private constructor(value: string) {
    this._value = value;
  }

  public static fromPlainText(text: string): Slug {
    return new Slug(this.generateSlug(text));
  }

  private static generateSlug(text: string): string {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }
}
