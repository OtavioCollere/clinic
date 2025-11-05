import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UsersRepository } from "@/domain/application/repositories/users-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { ProfessionalsRepository } from "@/domain/application/repositories/professionals-repository";
import { PrismaProfessionalsRepository } from "./prisma/repositories/prisma-professional-repository";
import { AppointmentsRepository } from "@/domain/application/repositories/appointment-repository";
import { PrismaAppointmentsRepository } from "./prisma/repositories/prisma-appointments-repository";
import { ClientsRepository } from "@/domain/application/repositories/client-repository";
import { PrismaClientsRepository } from "./prisma/repositories/prisma-clients-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: ProfessionalsRepository,
      useClass: PrismaProfessionalsRepository,
    },
    {
      provide: AppointmentsRepository,
      useClass: PrismaAppointmentsRepository,
    },
    {
      provide: ClientsRepository,
      useClass: PrismaClientsRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    ProfessionalsRepository,
    AppointmentsRepository,
    ClientsRepository,
  ],
})
export class DatabaseModule {}
