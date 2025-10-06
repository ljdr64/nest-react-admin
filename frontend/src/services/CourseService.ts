import Course from '../models/course/Course';
import CourseQuery from '../models/course/CourseQuery';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import UpdateCourseRequest from '../models/course/UpdateCourseRequest';
import apiService from './ApiService';

class CourseService {
  async save(createCourseRequest: CreateCourseRequest): Promise<void> {
    await apiService.post('/api/courses', createCourseRequest);
  }

  async findAll(courseQuery: CourseQuery): Promise<{
    data: Course[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await apiService.get('/api/courses', {
      params: courseQuery,
    });
    return response.data;
  }

  async findOne(id: string): Promise<Course> {
    const response = await apiService.get(`/api/courses/${id}`);
    return response.data;
  }

  async update(
    id: string,
    updateCourseRequest: UpdateCourseRequest
  ): Promise<void> {
    await apiService.put(`/api/courses/${id}`, updateCourseRequest);
  }

  async getTopRated() {
    const res = await apiService.get(
      '/api/courses?sortBy=rating&order=DESC&limit=5'
    );
    return res.data.data;
  }

  async delete(id: string): Promise<void> {
    await apiService.delete(`/api/courses/${id}`);
  }
}

export default new CourseService();
