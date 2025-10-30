import { UniqueEntityID } from "./unique-entity-id";

export class Entity<EntityProps> {
  private _id: UniqueEntityID;
  protected props: EntityProps;

  constructor(props: EntityProps, id?: UniqueEntityID) {
    this.props = props;
    this._id = id ?? new UniqueEntityID();
  }

  public get id(): UniqueEntityID {
    return this._id;
  }

  public equals(entity: Entity<any>) {
    if (entity === this) return true;
    return entity.id.toValue() === this._id.toValue();
  }
}
