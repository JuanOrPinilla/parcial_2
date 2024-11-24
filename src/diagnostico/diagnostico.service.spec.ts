/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoEntity } from './diagnostico.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let repository: Repository<DiagnosticoEntity>;
  let diagnosticosList: DiagnosticoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DiagnosticoService],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository	= module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    diagnosticosList = [];
    for(let i = 0; i < 5; i++){
      const diagnostico: DiagnosticoEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });
      diagnosticosList.push(diagnostico);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create a diagnosis correctly', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: '',
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      pacientes: [],
    };
    const newDiagnostico = await service.create(diagnostico);
    expect(newDiagnostico).not.toBeNull();
    const storedDiagnostico = await repository.findOne({ where: { id: newDiagnostico.id } });
    expect(storedDiagnostico).not.toBeNull();
    expect(storedDiagnostico.nombre).toEqual(newDiagnostico.nombre);
    expect(storedDiagnostico.descripcion).toEqual(newDiagnostico.descripcion);
  });

  it('create should throw an exception for a name shorter than 3 characters', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: '',
      nombre: 'AB',
      descripcion: faker.lorem.sentences(200),
      pacientes: [],
    };
    await expect(service.create(diagnostico)).rejects.toHaveProperty('message', 'la descripcion no puede tener más de 200 caracteres');
  });

  it('findAll should return all diagnoses', async () => { 
    const result = await service.findAll();
    expect(result).not.toBeNull();
    expect(result.length).toBe(5);
  });

  it('findOne should return a diagnosis by id', async () => {
    const result = await service.findOne(diagnosticosList[0].id);
    expect(result).not.toBeNull();
    expect(result.id).toEqual(diagnosticosList[0].id);
  });

  it('findOne should throw an exception for a non-existent diagnosis', async () => {  
    await expect(service.findOne('0')).rejects.toHaveProperty('message', 'No se encontró el diagnóstico');
  });

  it('delete should remove a diagnosis', async () => {
    const diagnostico = diagnosticosList[0];
    await service.delete(diagnostico.id);
    const result = await repository.findOne({ where: { id: diagnostico.id } });
    expect(result).toBeNull();
  });

  it('delete should throw an exception for a non-existent diagnosis', async () => {
    await expect(service.delete('0')).rejects.toHaveProperty('message', 'No se encontró el diagnostico');
  });

});
