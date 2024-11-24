/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<MedicoEntity>;
  let medicosList: MedicoEntity[];
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MedicoService],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    medicosList = [];
    for(let i = 0; i < 5; i++){
      const medico: MedicoEntity = await repository.save({
        nombre: faker.person.firstName(),
        especialidad: faker.helpers.arrayElement(['Cardiología', 'Pediatría', 'Oncología']),
        telefono: faker.phone.number(),
      });
      medicosList.push(medico);
    }
  };
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create a doctor correctly', async () => {
    const medico: MedicoEntity = {
      id: '',
      nombre: 'Juan Pérez',
      especialidad: 'Cardiología',
      telefono: '1234567890',
      pacientes: [],
    };
  const newMedico = await service.create(medico);
  expect(newMedico).not.toBeNull();
  const storedMedico = await repository.findOne({ where: { id: newMedico.id } });
  expect(storedMedico).not.toBeNull();
  expect(storedMedico.nombre).toEqual(newMedico.nombre);
  expect(storedMedico.especialidad).toEqual(newMedico.especialidad);
  expect(storedMedico.telefono).toEqual(newMedico.telefono);
  });

  it('create should throw an exception for a name shorter than 3 characters', async () => {
    const medico: MedicoEntity = {
      id: '',
      nombre: '',
      especialidad: 'Cardiología',
      telefono: '1234567890',
      pacientes: [],
    };
    await expect(service.create(medico)).rejects.toHaveProperty("message", "El nombre del médico no puede estar vacío.");
  });

  it('findAll should return all doctors', async () => {
    const result = await service.findAll();
    expect(result).not.toBeNull();
    expect(result.length).toBe(5);
  });

  it('findOne should return a doctor correctly', async () => {
    const medico = faker.helpers.arrayElement(medicosList);
    const result = await service.findOne(medico.id);
    expect(result).not.toBeNull();
    expect(result.id).toEqual(medico.id);
    expect(result.nombre).toEqual(medico.nombre);
    expect(result.especialidad).toEqual(medico.especialidad);
    expect(result.telefono).toEqual(medico.telefono);
  });

  it('findOne should throw an exception for a non-existent doctor', async () => {
    await expect(service.findOne('0')).rejects.toHaveProperty("message", "No se encontró el médico");
  });

  it('update should update a doctor correctly', async () => {
    const medico: MedicoEntity = medicosList[0];
    medico.nombre = 'New doctor name';
    medico.especialidad = 'new specialty';
    medico.telefono = '0987654321';

    const updatedMedico = await service.update(medico.id, medico);
    expect(updatedMedico).not.toBeNull();

    const storedMedico = await repository.findOne({ where: { id: updatedMedico.id } });
    expect(storedMedico).not.toBeNull();
    expect(storedMedico.nombre).toEqual(medico.nombre);
    expect(storedMedico.especialidad).toEqual(medico.especialidad);
    expect(storedMedico.telefono).toEqual(medico.telefono);
  });

  it('update should throw an exception for a non-existent doctor', async () => {
    let medico: MedicoEntity = medicosList[0];
    medico = {
      ...medico,
      nombre: 'New doctor name',
      especialidad: 'new specialty',
      telefono: '0987654321',
    };
    await expect(service.update('0', medico)).rejects.toHaveProperty("message", "No se encontró el médico");
  });

  it('delete should remove a doctor correctly', async () => {
    const medico = medicosList[0];
    await service.delete(medico.id);
    const result = await repository.findOne({ where: { id: medico.id } });
    expect(result).toBeNull();
  });

  it('delete should throw an exception for a non-existent doctor', async () => {
    const medico = medicosList[0];
    await service.delete(medico.id);
    await expect(service.delete('0')).rejects.toHaveProperty("message", "No se encontró el médico");
  });
  
});
