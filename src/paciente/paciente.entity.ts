/* eslint-disable prettier/prettier */
import {Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable} from 'typeorm';
import { MedicoEntity} from './../medico/medico.entity';
import { DiagnosticoEntity } from './../diagnostico/diagnostico.entity';
@Entity()
export class PacienteEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    genero: string;

    @ManyToMany(() => MedicoEntity, medico => medico.pacientes)
    @JoinTable()
    medicos: MedicoEntity[];

    @ManyToMany(() => DiagnosticoEntity, diagnostico => diagnostico.pacientes)
    @JoinTable()
    diagnosticos: DiagnosticoEntity[];
}