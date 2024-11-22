/* eslint-disable prettier/prettier */
import { PacienteEntity } from './../paciente/paciente.entity';
import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class DiagnosticoEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @ManyToMany(() => PacienteEntity, paciente => paciente.diagnosticos)
    @JoinTable()
    pacientes: PacienteEntity[];
}