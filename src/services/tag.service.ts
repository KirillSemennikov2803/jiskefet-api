import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class TagService {
    private readonly repository: Repository<Tag>;
    constructor(
        @InjectRepository(Tag) repository: Repository<Tag>,
    ) {
        this.repository = repository;
    }
    async findAll(): Promise<Tag[]> {
        return await this.repository.find();
    }
    async byTegId(id: number): Promise<Tag> {
        return await this.repository.findOneOrFail({tagId: id});
    }
}
