import type { Professional } from "@/domain/enterprise/entities/professional";

export class ProfessionalPresenter {
  static toHTTP(professional: Professional) {
    return {
      id: professional.id.toString(),
      clientId: professional.clientId.toString(),
      type: professional.type,
      licenseNumber: professional.licenseNumber,
      description: professional.description,
      createdAt: professional.createdAt,
      updatedAt: professional.updatedAt,
    };
  }
}
