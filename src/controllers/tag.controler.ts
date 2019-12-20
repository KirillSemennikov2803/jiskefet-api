import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TagService } from '../services/tag.service';
import { ResponseObject } from '../interfaces/response_object.interface';
import { User } from '../entities/user.entity';
import { createResponseItem } from '../helpers/response.helper';
import { Tag } from '../entities/tag.entity';

@ApiUseTags('tag')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('tag')
export class TagControler {
    constructor(
        private readonly tagService: TagService
    ) {}
    @Get(':id')
    async findById(@Param('id') tegId: number): Promise<ResponseObject<Tag>> {
        const findUserById = await this.tagService.byTegId(tegId);
        return createResponseItem(findUserById);
    }
    @Get('/all')
    async findAll(): Promise<ResponseObject<Tag[]>> {
        const findUserById = await this.tagService.findAll();
        return createResponseItem(findUserById);
    }
}
