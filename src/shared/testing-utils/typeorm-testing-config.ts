/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import{ MedicoEntity} from '../../medico/medico.entity';
import{ PacienteEntity} from '../../paciente/paciente.entity';
import { DiagnosticoEntity } from 'src/diagnostico/diagnostico.entity';


export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [MedicoEntity,PacienteEntity, DiagnosticoEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([MedicoEntity,PacienteEntity, DiagnosticoEntity]),
];