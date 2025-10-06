import CreateUserRequest from '../models/user/CreateUserRequest';
import UpdateUserRequest from '../models/user/UpdateUserRequest';
import User from '../models/user/User';
import UserQuery from '../models/user/UserQuery';
import apiService from './ApiService';

class UserService {
  async save(createUserRequest: CreateUserRequest): Promise<void> {
    await apiService.post('/api/users', createUserRequest);
  }

  async findAll(userQuery: UserQuery): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await apiService.get('/api/users', {
      params: userQuery,
    });
    return response.data;
  }

  async findOne(id: string): Promise<User> {
    const response = await apiService.get(`/api/users/${id}`);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await apiService.get('/api/users/profile');
    return response.data;
  }

  async update(
    id: string,
    updateUserRequest: UpdateUserRequest
  ): Promise<void> {
    const { firstName, lastName, username, role, isActive, password } =
      updateUserRequest;

    await apiService.put(`/api/users/${id}`, {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      username: username || undefined,
      role: role || undefined,
      isActive,
      password: password || undefined,
    });
  }

  async delete(id: string): Promise<void> {
    await apiService.delete(`/api/users/${id}`);
  }
}

export default new UserService();
