/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from './diagnostico.entity';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';

@Injectable()
export class DiagnosticoService {
    constructor(
        @InjectRepository(DiagnosticoEntity)
        private readonly diagnosticoRepository: Repository<DiagnosticoEntity>
    ){}

    async findAll(): Promise<DiagnosticoEntity[]> {
        return await this.diagnosticoRepository.find({relations: ['pacientes']});
    }

    async findOne(id: string): Promise<DiagnosticoEntity> {
        const diagnostico = await this.diagnosticoRepository.findOne({where: {id}, relations: ['pacientes']});
        if (!diagnostico) {
            throw new BusinessLogicException("No se encontró el diagnóstico", BusinessError.NOT_FOUND);
        }
        return diagnostico;
    }

    async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
        if (diagnostico.descripcion.length > 200) {
            throw new BusinessLogicException("la descripcion no puede tener más de 200 caracteres", BusinessError.PRECONDITION_FAILED);
        }
        return await this.diagnosticoRepository.save(diagnostico);
    }

    async delete(id: string): Promise<void> {
        const diagnostico = await this.diagnosticoRepository.findOne({
            where: { id },
            relations: ['pacientes'], 
        });
    
        // Validar si el diagnostico existe
        if (!diagnostico) {
            throw new BusinessLogicException(
                "No se encontró el diagnostico",
                BusinessError.NOT_FOUND,
            );
        }
        await this.diagnosticoRepository.remove(diagnostico);
    }
}
