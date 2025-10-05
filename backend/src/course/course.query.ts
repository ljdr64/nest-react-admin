import { ApiPropertyOptional } from '@nestjs/swagger';

export class CourseQuery {
  @ApiPropertyOptional({ description: 'Filter by course name' })
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by course description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Field to sort by (id, name, description, dateCreated)',
    default: 'dateCreated',
  })
  sortBy?: string = 'dateCreated';

  @ApiPropertyOptional({
    description: 'Order direction (ASC or DESC)',
    default: 'DESC',
  })
  order?: 'ASC' | 'DESC' = 'DESC';
}
