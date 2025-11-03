import { Client } from "@/domain/enterprise/entities/client";

export class ClientPresenter {
  static toHTTP(client: Client) {
    return {
      id: client.id.toString(),
      userId: client.userId.toString(),
      address: client.address,
      phone: client.phone,
      birthDate: client.birthDate,
      cpf: client.cpf,
      profession: client.profession,
      emergencyPhone: client.emergencyPhone,
      notes: client.notes,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
