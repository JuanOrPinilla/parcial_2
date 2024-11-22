/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AeropuertoEntity } from './aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';
import { faker } from '@faker-js/faker/.';

describe('AeropuertoService', () => {
 let service: AeropuertoService;
 let repository: Repository<AeropuertoEntity>;
 let aeropuertoList: AeropuertoEntity[];

 beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
 });

 const seedDatabase = async () => {
    repository.clear();
    aeropuertoList = [];
    for(let i = 0; i < 5; i++){
        const aeropuerto = await repository.save({
            nombre: faker.company.name(),
            ciudad: faker.address.city(),
            pais: faker.address.country(),
            codigo: faker.string.alphanumeric(3)})
            aeropuertoList.push(aeropuerto);
        }
 };

 it('should be defined', () => {
    expect(service).toBeDefined();
 });

 it('findAll should return all airports', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertoList.length);
 });

 it('findOne should return an airport by id', async () => {
    const storedAeropuerto: AeropuertoEntity = aeropuertoList[0];
    const aeropuerto: AeropuertoEntity = await service.findOne(storedAeropuerto.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(storedAeropuerto.nombre);
    expect(aeropuerto.ciudad).toEqual(storedAeropuerto.ciudad);
    expect(aeropuerto.pais).toEqual(storedAeropuerto.pais);
    expect(aeropuerto.codigo).toEqual(storedAeropuerto.codigo);
 });

 it('findOne should throw an exception for an invalid airport', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The airport with the given id was not found");
 });

 it('create should return a new airport', async () => {
    const aeropuerto: AeropuertoEntity = {
        id: "",
        nombre: faker.company.name(),
        ciudad: faker.address.city(),
        pais: faker.address.country(),
        codigo: faker.string.alphanumeric(3),
        aerolineas: []
    };

    const newAeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(newAeropuerto).not.toBeNull();

    const storedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: newAeropuerto.id } });
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(newAeropuerto.nombre);
    expect(storedAeropuerto.ciudad).toEqual(newAeropuerto.ciudad);
    expect(storedAeropuerto.pais).toEqual(newAeropuerto.pais);
    expect(storedAeropuerto.codigo).toEqual(newAeropuerto.codigo);
 });

 it('create should throw an exception for an invalid airport code', async () => {
    const aeropuerto: AeropuertoEntity = {
        id: "",
        nombre: faker.company.name(),
        ciudad: faker.address.city(),
        pais: faker.address.country(),
        codigo: faker.string.alphanumeric(4), // Invalid code length
        aerolineas: []
    };

    await expect(() => service.create(aeropuerto)).rejects.toHaveProperty("message", "The airport code must have exactly three characters");
 });

 it('update should modify an airport', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto.nombre = "New name";
    aeropuerto.ciudad = "New city";

    const updatedAeropuerto: AeropuertoEntity = await service.update(aeropuerto.id, aeropuerto);
    expect(updatedAeropuerto).not.toBeNull();

    const storedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } });
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(aeropuerto.nombre);
    expect(storedAeropuerto.ciudad).toEqual(aeropuerto.ciudad);
 });

 it('update should throw an exception for an invalid airport', async () => {
    let aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto = {
        ...aeropuerto, nombre: "New name", ciudad: "New city"
    };
    await expect(() => service.update("0", aeropuerto)).rejects.toHaveProperty("message", "The airport with the given id was not found");
 });

 it('update should throw an exception for an invalid airport code', async () => {
    let aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto = {
        ...aeropuerto, codigo: "1234" // Invalid code length
    };
    await expect(() => service.update(aeropuerto.id, aeropuerto)).rejects.toHaveProperty("message", "The airport code must have exactly three characters");
 });

 it('delete should remove an airport', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await service.delete(aeropuerto.id);

    const deletedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } });
    expect(deletedAeropuerto).toBeNull();
 });

 it('delete should throw an exception for an invalid airport', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await service.delete(aeropuerto.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The airport with the given id was not found");
 });
});
