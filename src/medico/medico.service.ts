/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class MedicoService {
    constructor(
        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>
    ) {}

    async findAll(): Promise<MedicoEntity[]> {
        return await this.medicoRepository.find({ relations: ['pacientes'] });
    }

    async findOne(id: string): Promise<MedicoEntity> {
        const medico = await this.medicoRepository.findOne({where: {id}, relations: ['pacientes'] });
        if (!medico) {
            throw new BusinessLogicException("No se encontró el médico", BusinessError.NOT_FOUND);
        }
        return medico
    }

    async create(medico: MedicoEntity): Promise<MedicoEntity> {
        // Validar que los campos requeridos no estén vacíos
        if (!medico.nombre || medico.nombre.trim() === '') {
            throw new BusinessLogicException('El nombre del médico no puede estar vacío.', BusinessError.PRECONDITION_FAILED);
        }
    
        if (!medico.especialidad || medico.especialidad.trim() === '') {
            throw new BusinessLogicException('La especialidad del médico no puede estar vacía.', BusinessError.PRECONDITION_FAILED);
        }
        // Guardar en el repositorio si las validaciones son correctas
        return await this.medicoRepository.save(medico);
    }

    async update(id: string, medico: MedicoEntity): Promise<MedicoEntity> {
        const persistedMedico = await this.medicoRepository.findOne({where: {id}});
        if (!persistedMedico) {
            throw new BusinessLogicException("No se encontró el médico", BusinessError.NOT_FOUND);
        }
    return await this.medicoRepository.save({ ...persistedMedico, ...medico });
    }

    async delete(id: string): Promise<void> {
        // Buscar el médico junto con sus pacientes asociados
        const medico = await this.medicoRepository.findOne({
            where: { id },
            relations: ['pacientes'], // Asegúrate de que 'pacientes' sea el nombre correcto de la relación
        });
    
        // Validar si el médico existe
        if (!medico) {
            throw new BusinessLogicException(
                "No se encontró el médico",
                BusinessError.NOT_FOUND,
            );
        }
    
        // Validar si el médico tiene pacientes asociados
        if (medico.pacientes && medico.pacientes.length > 0) {
            throw new BusinessLogicException(
                "No se puede eliminar el médico porque tiene pacientes asociados",
                BusinessError.PRECONDITION_FAILED,
            );
        }
        await this.medicoRepository.remove(medico);
    }
    
}

