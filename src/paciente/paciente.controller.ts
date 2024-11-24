/* eslint-disable prettier/prettier */
import { Controller, Get, Param, UseInterceptors, Body, Post, Delete, HttpCode } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { PacienteDto } from './paciente.dto';
import { plainToInstance } from 'class-transformer';
import { PacienteEntity } from './paciente.entity';

@Controller('paciente')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteController {
    
    constructor(private readonly pacienteService: PacienteService) {}

    @Get()
    async findAll() {
        return await this.pacienteService.findAll();
    }

    @Get(':pacienteId')
    async findOne(@Param('pacienteId') pacienteId: string) {
        return await this.pacienteService.findOne(pacienteId);
    }

    @Post()
    async create(@Body() pacienteDto: PacienteDto) {
        const paciente: PacienteEntity = plainToInstance(PacienteEntity, pacienteDto);
        return await this.pacienteService.create(paciente);
    }

    @Delete(':pacienteId')
    @HttpCode(204)
    async delete(@Param('pacienteId') pacienteId: string) {
        return await this.pacienteService.delete(pacienteId);
    }
}

