import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { ApiModelProperty} from '@nestjs/swagger';

export class LinkRunToTagDto {
    @ApiModelProperty({
        example: 1,
        description: 'The id of the run to link to the tag.',
    })
    runNumber: number;
}
// tslint:disable-next-line:max-classes-per-file
export class LinkLogToTagDto {
    @ApiModelProperty({
        example: 1,
        description: 'The id of the log to link to the tag.',
    })
    logId: number;
}
// tslint:disable-next-line:max-classes-per-file
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
    /**
     * Returns a Tag with all the Runs that contains Tag with given ID.
     * @param tagId is id of a Tag.
     */
    async findRunsByTagId(tagId: number): Promise<Tag> {
        return await this.repository
            .createQueryBuilder('tag')
            .innerJoinAndSelect('tag.runs', 'runs')
            .where('tag_id = :tagId', {tagId})
            .getOne()
            .then((res: Tag) => Promise.resolve(res))
            .catch((err: string) => Promise.reject(err));
    }

    /**
     * Returns a Tag with all the Logs that contains Tag with given ID.
     * @param tagId is id of a Tag.
     */
    async findLogsByTagId(tagId: number): Promise<Tag> {
        return await this.repository
            .createQueryBuilder('tag')
            .innerJoinAndSelect('tag.logs', 'logs')
            .where('tag_id = :tagId', {tagId})
            .getOne()
            .then((res: Tag) => Promise.resolve(res))
            .catch((err: string) => Promise.reject(err));
    }

    /**
     * Links a Run to a Tag with given ID.
     * @param tagId is id of a Tag.
     * @param linkRunToTagDto LinkRunToTagDto for linking a Run to a Tag.
     */
    async linkRunToTag(tagId: number, linkRunToTagDto: LinkRunToTagDto): Promise<void> {
        return await this.repository
            .createQueryBuilder()
            .relation(Tag, 'runs')
            .of(tagId)
            .add(linkRunToTagDto.runNumber);
    }

    /**
     * Links a Log to a Tag with given ID.
     * @param tagId is id of a Tag.
     * @param linkLogToTagDto LinkLogToTagDto for linking a Log to a Tag.
     */
    async linkLogToTag(tagId: number, linkLogToTagDto: LinkLogToTagDto): Promise<void> {
        return await this.repository
            .createQueryBuilder()
            .relation(Tag, 'logs')
            .of(tagId)
            .add(linkLogToTagDto.logId);
    }

    /**
     * Deletes a Tag with given ID.
     * @param tagId is id of a Tag.
     */
    async deleteTag(tagId: number): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .delete()
            .from(Tag)
            .where('tag_id = :tagId', { tagId })
            .execute();
    }
}