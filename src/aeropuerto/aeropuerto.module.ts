/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AeropuertoEntity])],
})
export class AeropuertoModule {}
