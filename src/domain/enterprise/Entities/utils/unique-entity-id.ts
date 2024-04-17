import { randomUUID } from "node:crypto";

export class UniqueEntityId {
  private value: string;

  public toString(): string {
    return this.value;
  }

  public equals(id: UniqueEntityId): boolean {
    return this.toString() === id.toString();
  }

  public constructor(value?: string) {
    this.value = value ?? randomUUID();
  }
}
