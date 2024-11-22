/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticoEntity } from './diagnostico/diagnostico.entity';
import { MedicoEntity } from './medico/medico.entity';
import { PacienteEntity } from './paciente/paciente.entity';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';
import { PacienteModule } from './paciente/paciente.module';
import { MedicoModule } from './medico/medico.module';


@Module({
  imports: [DiagnosticoModule, PacienteModule, MedicoModule, TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial_2',
      entities: [DiagnosticoEntity,MedicoEntity,PacienteEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }
  ), ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
