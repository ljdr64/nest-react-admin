export default interface ContentQuery {
  name?: string;
  description?: string;
  courseId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}
