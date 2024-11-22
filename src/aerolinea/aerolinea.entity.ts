/* eslint-disable prettier/prettier */
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class AerolineaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    fecha_de_fundacion: Date;
    
    @Column()
    pagina_web: string;

    @ManyToMany(() => AeropuertoEntity, aeropuerto => aeropuerto.aerolineas)
    @JoinTable()
    aeropuertos: AeropuertoEntity[];

}

export { AeropuertoEntity };
