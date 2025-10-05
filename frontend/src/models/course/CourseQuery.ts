export default interface CourseQuery {
  name?: string;
  description?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}
