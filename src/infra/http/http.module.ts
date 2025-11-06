import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { AuthModule } from "../auth/auth.module";
import { CryptographyModule } from "../cryptography/cryptography.module";

// 🧱 CLIENTS
import { CreateClientController } from "./controllers/clients/create-client";
import { EditClientController } from "./controllers/clients/edit-client";
import { GetClientController } from "./controllers/clients/get-client";
import { CreateClientUseCase } from "@/domain/application/use-cases/client/create-client";
import { EditClientUseCase } from "@/domain/application/use-cases/client/edit-client";
import { GetClientUseCase } from "@/domain/application/use-cases/client/get-client";

// 🧱 USERS
import { CreateUserController } from "./controllers/users/create-user";
import { AuthenticateController } from "./controllers/users/authenticate-user";
import { CreateUserUseCase } from "@/domain/application/use-cases/users/create-user";
import { AuthenticateUseCase } from "@/domain/application/use-cases/users/authenticate-user";
import { GetUserUseCase } from "@/domain/application/use-cases/users/get-user";
import { ListUsersUseCase } from "@/domain/application/use-cases/users/list-users";

// 🧱 PROFESSIONALS
import { CreateProfessionalController } from "./controllers/professionals/create-professional";
import { GetProfessionalController } from "./controllers/professionals/get-professional";
import { CreateProfessionalUseCase } from "@/domain/application/use-cases/professionals/create-professional";
import { GetProfessionalUseCase } from "@/domain/application/use-cases/professionals/get-professional";
import { ListProfessionalUseCase } from "@/domain/application/use-cases/professionals/list-professional";

// 🧱 PROCEDURES
import { CreateProcedureController } from "./controllers/procedures/create-procedure";
import { GetProceduresByClientIdController } from "./controllers/procedures/get-procedures-by-client-id";
import { GetProceduresByProfessionalIdController } from "./controllers/procedures/get-procedures-by-professional-id";
import { CreateProcedureUseCase } from "@/domain/application/use-cases/procedures/create-procedure";
import { EditProcedureUseCase } from "@/domain/application/use-cases/procedures/edit-procedure";
import { GetProceduresByClientIdUseCase } from "@/domain/application/use-cases/procedures/get-procedures-by-client-id";
import { GetProceduresByProfessionalIdUseCase } from "@/domain/application/use-cases/procedures/get-procedures-by-professional-id";

// 🧱 APPOINTMENTS
import { CreateAppointmentController } from "./controllers/appointments/create-appointment";
import { EditAppointmentController } from "./controllers/appointments/edit-appointment";
import { GetAppointmentController } from "./controllers/appointments/get-appointment";
import { FetchAppointmentsController } from "./controllers/appointments/fetch-appointment";
import { CreateAppointmentUseCase } from "@/domain/application/use-cases/appointments/create-appointment";
import { EditAppointmentUseCase } from "@/domain/application/use-cases/appointments/edit-appointment";
import { GetAppointmentUseCase } from "@/domain/application/use-cases/appointments/get-appointments";
import { FetchAppointmentsUseCase } from "@/domain/application/use-cases/appointments/fetch-appointments";

// 🧱 ANAMNESIS
import { CreateAnamnesisUseCase } from "@/domain/application/use-cases/anamnesis/create-anamnesis";
import { EditAnamnesisUseCase } from "@/domain/application/use-cases/anamnesis/edit-anamnesis";
import { GetAnamnesisByClientIdUseCase } from "@/domain/application/use-cases/anamnesis/get-anamnesis-by-client-id";
import { CreateAnamnesisController } from "./controllers/anamnesis/create-anamnesis";
import { EditAnamnesisController } from "./controllers/anamnesis/edit-anamnesis";
import { GetAnamnesisByClientIdController } from "./controllers/anamnesis/get-anamnesis-by-client-id";
import { ListProfessionalsController } from "./controllers/professionals/list-professional";

@Module({
  imports: [DatabaseModule, AuthModule, CryptographyModule],

  controllers: [
    // CLIENTS
    CreateClientController,
    EditClientController,
    GetClientController,

    // USERS
    CreateUserController,
    AuthenticateController,

    // PROFESSIONALS
    CreateProfessionalController,
    GetProfessionalController,
    ListProfessionalsController,

    // PROCEDURES
    CreateProcedureController,
    GetProceduresByClientIdController,
    GetProceduresByProfessionalIdController,

    // APPOINTMENTS
    CreateAppointmentController,
    EditAppointmentController,
    GetAppointmentController,
    FetchAppointmentsController,

    // ANAMNESIS
    CreateAnamnesisController,
    EditAnamnesisController,
    GetAnamnesisByClientIdController,
  ],

  providers: [
    // CLIENTS
    CreateClientUseCase,
    EditClientUseCase,
    GetClientUseCase,

    // USERS
    CreateUserUseCase,
    AuthenticateUseCase,
    GetUserUseCase,
    ListUsersUseCase,

    // PROFESSIONALS
    CreateProfessionalUseCase,
    GetProfessionalUseCase,
    ListProfessionalUseCase,

    // PROCEDURES
    CreateProcedureUseCase,
    EditProcedureUseCase,
    GetProceduresByClientIdUseCase,
    GetProceduresByProfessionalIdUseCase,

    // APPOINTMENTS
    CreateAppointmentUseCase,
    EditAppointmentUseCase,
    GetAppointmentUseCase,
    FetchAppointmentsUseCase,

    // ANAMNESIS
    CreateAnamnesisUseCase,
    EditAnamnesisUseCase,
    GetAnamnesisByClientIdUseCase,
  ],
})
export class HttpModule {}
