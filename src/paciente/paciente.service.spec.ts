/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { Repository } from 'typeorm';
import { PacienteEntity } from './paciente.entity';
import { TypeOrmTestingConfig } from './../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;
  let pacientesList: PacienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository =module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    pacientesList = [];
    for(let i = 0; i < 5; i++){
      const paciente: PacienteEntity = await repository.save({
        nombre: faker.company.name(),
        genero: faker.helpers.arrayElement(['M', 'F']),
      });
      pacientesList.push(paciente);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create a patient correctly', async () => {
    const paciente: PacienteEntity = {
        id: '',
        nombre: 'Juan Pérez',
        genero: 'Masculino',
        medicos: [],
        diagnosticos: [],
    };
    const newPaciente = await service.create(paciente);
    expect(newPaciente).not.toBeNull();
    const storedPaciente = await repository.findOne({ where: { id: newPaciente.id } });
    expect(storedPaciente).not.toBeNull();
    expect(storedPaciente.nombre).toEqual(newPaciente.nombre);
    expect(storedPaciente.genero).toEqual(newPaciente.genero);
});

it('create should throw an exception for a name shorter than 3 characters', async () => {
  const paciente: PacienteEntity = {
      id: '',
      nombre: 'Jo',
      genero: 'Masculino',
      medicos: [],
      diagnosticos: [],
  };

  await expect(() => service.create(paciente)).rejects.toHaveProperty(
      'message',
      'El nombre del paciente debe tener al menos 3 caracteres',
  );
});
  



});
