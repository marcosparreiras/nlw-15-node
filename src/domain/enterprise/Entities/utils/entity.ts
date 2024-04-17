import { UniqueEntityId } from "./unique-entity-id";

export abstract class Entity<Props> {
  private _id: UniqueEntityId;
  protected props: Props;

  public get id() {
    return this._id;
  }

  public equals(entity: Entity<unknown>) {
    this._id.equals(entity.id);
  }

  protected constructor(props: Props, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId(id);
  }
}
