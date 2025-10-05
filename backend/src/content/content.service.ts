import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

import { CourseService } from '../course/course.service';
import { CreateContentDto, UpdateContentDto } from './content.dto';
import { Content } from './content.entity';
import { ContentQuery } from './content.query';

@Injectable()
export class ContentService {
  constructor(private readonly courseService: CourseService) {}

  async save(
    courseId: string,
    createContentDto: CreateContentDto,
  ): Promise<Content> {
    const { name, description } = createContentDto;
    const course = await this.courseService.findById(courseId);
    return await Content.create({
      name,
      description,
      course,
      dateCreated: new Date(),
    }).save();
  }

  async findAll(contentQuery: ContentQuery): Promise<Content[]> {
    Object.keys(contentQuery).forEach((key) => {
      contentQuery[key] = ILike(`%${contentQuery[key]}%`);
    });

    return await Content.find({
      where: contentQuery,
      order: {
        name: 'ASC',
        description: 'ASC',
      },
    });
  }

  async findById(id: string): Promise<Content> {
    const content = await Content.findOne(id);

    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return content;
  }

  async findByCourseIdAndId(courseId: string, id: string): Promise<Content> {
    const content = await Content.findOne({ where: { courseId, id } });
    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return content;
  }

  async findAllByCourseId(
    courseId: string,
    contentQuery: ContentQuery,
  ): Promise<{
    data: Content[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      name,
      description,
      page = 1,
      limit = 10,
      sortBy = 'id',
      order = 'ASC',
    } = contentQuery;

    const qb = Content.createQueryBuilder(
      'content',
    ).where('content.courseId = :courseId', { courseId });

    if (name) {
      qb.andWhere('content.name ILIKE :name', { name: `%${name}%` });
    }

    if (description) {
      qb.andWhere('content.description ILIKE :description', {
        description: `%${description}%`,
      });
    }

    const validSortColumns = [
      'id',
      'name',
      'description',
      'dateCreated',
      'dateUpdated',
    ];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'id';

    qb.orderBy(`"content"."${sortColumn}"`, order === 'DESC' ? 'DESC' : 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    courseId: string,
    id: string,
    updateContentDto: UpdateContentDto,
  ): Promise<Content> {
    const content = await this.findByCourseIdAndId(courseId, id);
    return await Content.create({ id: content.id, ...updateContentDto }).save();
  }

  async delete(id: string): Promise<string> {
    const result = await Content.delete(id);

    if (result.affected === 0) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return id;
  }

  async count(): Promise<number> {
    return await Content.count();
  }
}
