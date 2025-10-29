import { randomUUID } from "node:crypto"
import type { Entity } from "./entity"

export class UniqueEntityID{
  private value : string

  constructor(value? : string){
    this.value = value ?? randomUUID()
  }

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  public equals(id: UniqueEntityID) {
    return id.toValue() === this.value
  }
}