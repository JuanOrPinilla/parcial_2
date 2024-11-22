/* eslint-disable prettier/prettier */
/* archivo: src/aeropuerto/aeropuerto.service.ts */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';

@Injectable()
export class AeropuertoService {
    constructor(
         @InjectRepository(AeropuertoEntity)
         private readonly aeropuertoRepository: Repository<AeropuertoEntity>
    ){}

    async findAll(): Promise<AeropuertoEntity[]> {
         return await this.aeropuertoRepository.find({ relations: ["aerolineas"] });
    }

    async findOne(id: string): Promise<AeropuertoEntity> {
         const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id}, relations: ["aerolineas"] } );
         if (!aeropuerto)
            throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
  
         return aeropuerto;
    }
  
    async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        if (aeropuerto.codigo && aeropuerto.codigo.length !== 3) {
            throw new BusinessLogicException(
                "The airport code must have exactly three characters",
                BusinessError.PRECONDITION_FAILED,
            );
        }
        return await this.aeropuertoRepository.save(aeropuerto);
    }
    
    async update(id: string, aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        const persistedAeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({ where: { id } });
        if (!persistedAeropuerto) {
            throw new BusinessLogicException(
                "The airport with the given id was not found",
                BusinessError.NOT_FOUND,
            );
        }
    
        if (aeropuerto.codigo && aeropuerto.codigo.length !== 3) {
            throw new BusinessLogicException(
                "The airport code must have exactly three characters",
                BusinessError.PRECONDITION_FAILED,
            );
        }
    
        aeropuerto.id = id; 
        return await this.aeropuertoRepository.save(aeropuerto);
    }
    

    async delete(id: string) {
         const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where:{id}});
         if (!aeropuerto)
            throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
     
         await this.aeropuertoRepository.remove(aeropuerto);
    }
}
