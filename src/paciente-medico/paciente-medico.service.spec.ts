/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { PacienteMedicoService } from './paciente-medico.service';
import { Repository } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/.';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoRepository: Repository<MedicoEntity>;
  let paciente: PacienteEntity;
  let medicosList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
  
    await seedDatabase();
  });

  const seedDatabase = async () => {

    await pacienteRepository.clear();
    await medicoRepository.clear();
    medicosList = [];

    for(let i = 0; i < 5; i++){
      const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.person.firstName(),
        especialidad: faker.helpers.arrayElement(['Cardiología', 'Pediatría', 'Oncología']),
        telefono: faker.phone.number()
      });
      medicosList.push(medico);
    }
    paciente = await pacienteRepository.save({
    nombre: faker.person.firstName(),
    genero: faker.helpers.arrayElement(['M', 'F']),
    medicos: medicosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMedicoToPaciente should add a doctor to a patient correctly', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.firstName(),
      especialidad: faker.helpers.arrayElement(['Cardiología', 'Pediatría', 'Oncología']),
      telefono: faker.phone.number()
    });
    const newPaciente: PacienteEntity = await pacienteRepository.save({
      nombre: faker.person.firstName(),
      genero: faker.helpers.arrayElement(['M', 'F'])
    });
    const result: PacienteEntity = await service.addMedicoToPaciente(newPaciente.id, newMedico.id);

    expect(result.medicos).not.toBeNull();
    expect(result.medicos.length).toBe(1);
    expect(result.medicos[0].nombre).toEqual(newMedico.nombre);
    expect(result.medicos[0].especialidad).toEqual(newMedico.especialidad);
  });

  it('addMedicoToPaciente should throw an exception for a non-existent doctor', async () => {
    const newPaciente: PacienteEntity = await pacienteRepository.save({
      nombre: faker.person.firstName(),
      genero: faker.helpers.arrayElement(['M', 'F'])
    });

    await expect(service.addMedicoToPaciente(newPaciente.id, '0')).rejects.toHaveProperty("message", "The doctor with the given id was not found");
  });

});
