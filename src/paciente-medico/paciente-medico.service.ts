/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PacienteEntity } from '../paciente/paciente.entity';
import { Repository } from 'typeorm';
import { MedicoEntity } from '../medico/medico.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class PacienteMedicoService {

    private readonly selectedRelations = [
        "medicos",
        "diagnosticos"
    ];

    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>,
    
        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>
    ) {}

    async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<PacienteEntity> {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {id: medicoId}});
        if(!medico){
            throw new BusinessLogicException("The doctor with the given id was not found", BusinessError.NOT_FOUND);
        }
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where: {id: pacienteId}, relations: this.selectedRelations});
        if(!paciente){
            throw new BusinessLogicException("The patient with the given id was not found", BusinessError.NOT_FOUND);
        }
        if(paciente.medicos !== undefined && paciente.medicos.includes(medico)){
            throw new BusinessLogicException("The doctor is already associated with the patient", BusinessError.PRECONDITION_FAILED);
        }
        paciente.medicos = [...paciente.medicos, medico];
        return await this.pacienteRepository.save(paciente);
    }
}
