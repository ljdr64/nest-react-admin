export default interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  isActive: boolean;
  dateCreated: string;
  votes: { courseId: string; rating: number }[];
}
