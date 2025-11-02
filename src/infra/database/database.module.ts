import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UsersRepository } from "@/domain/application/repositories/users-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { ProfessionalsRepository } from "@/domain/application/repositories/professionals-repository";
import { PrismaProfessionalsRepository } from "./prisma/repositories/prisma-professional-repository";
import { AppointmentsRepository } from "@/domain/application/repositories/appointment-repository";
import { PrismaAppointmentsRepository } from "./prisma/repositories/prisma-appointments-repository";

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
  ],
  exports: [PrismaService, UsersRepository, ProfessionalsRepository, AppointmentsRepository],
})
export class DatabaseModule {}
