/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';
import { AeropuertoEntity } from './aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from './aerolinea/aerolinea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [AerolineaModule, AeropuertoModule,TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial_practica',
      entities: [AeropuertoEntity,AerolineaEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }
  ), ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
