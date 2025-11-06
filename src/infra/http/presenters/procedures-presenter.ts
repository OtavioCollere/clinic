// src/infra/http/presenters/procedure-presenter.ts

import { Procedure } from "@/domain/enterprise/entities/procedure";

export class ProcedurePresenter {
  static toHTTP(procedure: Procedure) {
    return {
      id: procedure.id.toString(),
      clientId: procedure.clientId.toString(),
      professionalId: procedure.professionalId.toString(),
      name: procedure.name,
      product: procedure.product ?? null,
      value: procedure.value,
      description: procedure.description ?? null,
      createdAt: procedure.createdAt,
      updatedAt: procedure.updatedAt ?? null,
    };
  }
}
