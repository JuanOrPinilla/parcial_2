/* eslint-disable prettier/prettier */
import { Controller, Get, Param, UseInterceptors, Post, Body, Delete, HttpCode } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { MedicoService } from './medico.service';
import { MedicoDto } from './medico.dto';
import { MedicoEntity } from './medico.entity';
import { plainToInstance } from 'class-transformer';

@Controller('medico')
@UseInterceptors(BusinessErrorsInterceptor)  
export class MedicoController {

    constructor(private readonly medicoService: MedicoService) {}

    @Get()
    async findAll() {
        return await this.medicoService.findAll();
    }

    @Get(':medicoId')
    async findOne(@Param('medicoId') medicoId: string) {
        return await this.medicoService.findOne(medicoId);
    }

    @Post()
    async create(@Body() medicoDto: MedicoDto) {
        const medico: MedicoEntity = plainToInstance(MedicoEntity, medicoDto);
        return await this.medicoService.create(medico);
    }

    @Delete(':medicoId')
    @HttpCode(204)
    async delete(@Param('medicoId') medicoId: string) {
        return await this.medicoService.delete(medicoId);
    }
}
