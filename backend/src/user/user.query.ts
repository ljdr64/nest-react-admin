import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserQuery {
  @ApiPropertyOptional({ description: 'Filter by first name' })
  firstName?: string;

  @ApiPropertyOptional({ description: 'Filter by last name' })
  lastName?: string;

  @ApiPropertyOptional({ description: 'Filter by username' })
  username?: string;

  @ApiPropertyOptional({ description: 'Filter by user role' })
  role?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  limit?: number = 10;

  @ApiPropertyOptional({
    description:
      'Field to sort by (id, username, firstName, lastName, role, dateCreated)',
    default: 'dateCreated',
  })
  sortBy?: string = 'dateCreated';

  @ApiPropertyOptional({
    description: 'Order direction (ASC or DESC)',
    default: 'DESC',
  })
  order?: 'ASC' | 'DESC' = 'DESC';
}
