export default interface UserQuery {
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}
