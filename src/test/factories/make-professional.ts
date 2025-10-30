import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Professional, type ProfessionalProps } from "@/domain/enterprise/entities/professional";

export function makeProfessional(override: Partial<ProfessionalProps>, id?: UniqueEntityID) {
  const professional = Professional.create(
    {
      userId: new UniqueEntityID(),
      licenseNumber: "1234",
      description: "some description",
      type: "MEDICO",
      ...override,
    },
    id,
  );
  return professional;
}
