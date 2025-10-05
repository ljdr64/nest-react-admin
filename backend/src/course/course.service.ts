import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';

@Injectable()
export class CourseService {
  async save(createCourseDto: CreateCourseDto): Promise<Course> {
    return await Course.create({
      ...createCourseDto,
      dateCreated: new Date(),
    }).save();
  }

  async findAll(
    userQuery: CourseQuery,
  ): Promise<{
    data: Course[];
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
    } = userQuery;

    const qb = Course.createQueryBuilder('course');

    if (name) {
      qb.andWhere('course.name ILIKE :name', {
        name: `%${name}%`,
      });
    }

    if (description) {
      qb.andWhere('course.description ILIKE :description', {
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

    qb.orderBy(`"course"."${sortColumn}"`, order === 'DESC' ? 'DESC' : 'ASC')
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

  async findById(id: string): Promise<Course> {
    const course = await Course.findOne(id);
    if (!course) {
      throw new HttpException(
        `Could not find course with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findById(id);
    return await Course.create({ id: course.id, ...updateCourseDto }).save();
  }

  async delete(id: string): Promise<string> {
    const result = await Course.delete(id);

    if (result.affected === 0) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return id;
  }

  async count(): Promise<number> {
    return await Course.count();
  }
}
