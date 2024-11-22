/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AerolineaEntity])],
})
export class AerolineaModule {}
