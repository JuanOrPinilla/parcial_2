/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AerolineaEntity } from './aerolinea.entity';
import { AerolineaService } from './aerolinea.service';
import { faker } from '@faker-js/faker/.';

describe('AerolineaService', () => {
 let service: AerolineaService;
 let repository: Repository<AerolineaEntity>;
 let aerolineasList: AerolineaEntity[];

 beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    await seedDatabase();
 });

 const seedDatabase = async () => {
    repository.clear();
    aerolineasList = [];
    for(let i = 0; i < 5; i++){
        const aerolinea = await repository.save({
            nombre: faker.company.name(),
            descripcion: faker.lorem.sentence(),
            fecha_de_fundacion: faker.date.past(),
            pagina_web: faker.internet.url()})
            aerolineasList.push(aerolinea);
        }
    }
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('FindAll should return all aerolineas', async () => {
        const aerolineas: AerolineaEntity[] = await service.findAll();
        expect(aerolineas).not.toBeNull();
        expect(aerolineas).toHaveLength(aerolineasList.length);
    })

    it('findOne should return an aerolinea', async () => {
        const storedAerolinea = aerolineasList[0];
        const aerolinea: AerolineaEntity = await service.findOne(storedAerolinea.id);
        expect(aerolinea).not.toBeNull();
        expect(aerolinea.nombre).toBe(storedAerolinea.nombre);
        expect(aerolinea.descripcion).toBe(storedAerolinea.descripcion);
        expect(aerolinea.fecha_de_fundacion).toStrictEqual(storedAerolinea.fecha_de_fundacion);
        expect(aerolinea.pagina_web).toBe(storedAerolinea.pagina_web);
    });

    it('findOne should throw an exception when the aerolinea does not exist', async () => {
        await expect(() => service.findOne('0')).rejects.toHaveProperty('message', 'The airline with the given id was not found');
    });

    it('create should return the created aerolinea', async () => {
        const aerolinea: AerolineaEntity = await repository.save({
            id: "",
            nombre: faker.company.name(),
            descripcion: faker.lorem.sentence(),
            fecha_de_fundacion: faker.date.past(),
            pagina_web: faker.internet.url()
        });
        const createdAerolinea: AerolineaEntity = await service.create(aerolinea);
        expect (createdAerolinea).not.toBeNull();

        const storedAerolinea: AerolineaEntity = await repository.findOne({where: {id: createdAerolinea.id}});
        expect(storedAerolinea).not.toBeNull();
        expect(storedAerolinea.nombre).toBe(createdAerolinea.nombre);
        expect(storedAerolinea.descripcion).toBe(createdAerolinea.descripcion);
        expect(storedAerolinea.fecha_de_fundacion).toStrictEqual(createdAerolinea.fecha_de_fundacion);
        expect(storedAerolinea.pagina_web).toBe(createdAerolinea.pagina_web);

    });
    it('update should return the updated aerolinea', async () => {
        const aerolinea = aerolineasList[0];
        aerolinea.nombre = "new name";
        aerolinea.descripcion = "new description";
        aerolinea.fecha_de_fundacion = faker.date.past();
        aerolinea.pagina_web = "new url";
        const updatedAerolinea: AerolineaEntity = await service.update(aerolinea.id, aerolinea);
        expect(updatedAerolinea).not.toBeNull();
        const storedAerolinea: AerolineaEntity = await repository.findOne({where: {id: updatedAerolinea.id}});
        expect(storedAerolinea).not.toBeNull();
        expect(storedAerolinea.nombre).toBe(updatedAerolinea.nombre);
        expect(storedAerolinea.descripcion).toBe(updatedAerolinea.descripcion);
        expect(storedAerolinea.fecha_de_fundacion).toStrictEqual(updatedAerolinea.fecha_de_fundacion);
        expect(storedAerolinea.pagina_web).toBe(updatedAerolinea.pagina_web);
    });

    it('update should throw an exception when the aerolinea does not exist', async () => {
        await expect(() => service.update('0', aerolineasList[0])).rejects.toHaveProperty('message', 'The airline with the given id was not found');
    });

    it('delete should remove the aerolinea', async () => {
        const aerolinea = aerolineasList[0];
        await service.delete(aerolinea.id);
        const storedAerolinea: AerolineaEntity = await repository.findOne({where: {id: aerolinea.id}});
        expect(storedAerolinea).toBeNull();
    });

    it('delete should throw an exception when the aerolinea does not exist', async () => {
        await expect(() => service.delete('0')).rejects.toHaveProperty('message', 'The airline with the given id was not found');
    });

});
