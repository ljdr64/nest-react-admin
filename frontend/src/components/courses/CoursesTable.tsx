import { useState } from 'react';
import { AlertTriangle, Loader, Star, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { QueryObserverResult, useQuery } from 'react-query';

import ApiService from '../../services/ApiService';
import UserService from '../../services/UserService';

import useAuth from '../../hooks/useAuth';
import Course from '../../models/course/Course';
import UpdateCourseRequest from '../../models/course/UpdateCourseRequest';
import CourseService from '../../services/CourseService';
import Modal from '../shared/Modal';
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';

interface CoursesTableData {
  data: Course[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CoursesTableProps {
  data: CoursesTableData | undefined;
  isLoading: boolean;
  refetch: () => Promise<QueryObserverResult<CoursesTableData, unknown>>;
}

export default function CoursesTable({
  data,
  isLoading,
  refetch,
}: CoursesTableProps) {
  const { authenticatedUser } = useAuth();
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>();
  const [error, setError] = useState<string>();
  const [updateShow, setUpdateShow] = useState<boolean>(false);
  const [hover, setHover] = useState({});
  const [rated, setRated] = useState({});
  const { data: user } = useQuery('currentUser', UserService.getProfile);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateCourseRequest>();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await CourseService.delete(selectedCourseId);
      await refetch();
      setDeleteShow(false);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateCourseRequest: UpdateCourseRequest) => {
    try {
      await CourseService.update(selectedCourseId, updateCourseRequest);
      await refetch();
      setUpdateShow(false);
      reset();
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const courses = data?.data || [];

  return (
    <>
      <div className="table-container">
        <Table
          columns={['Name', 'Description', 'Created', 'Rating', 'Actions']}
        >
          {!isLoading &&
            courses.map(({ id, name, description, dateCreated, rating }) => (
              <tr key={id}>
                <TableItem>
                  <Link to={`/courses/${id}`}>{name}</Link>
                </TableItem>
                <TableItem>{description}</TableItem>
                <TableItem>
                  {new Date(dateCreated).toLocaleDateString()}
                </TableItem>
                <TableItem>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((value) => {
                      const userVote = user?.votes?.find(
                        (v) => v.courseId === id
                      );
                      const userRating = userVote?.rating ?? 0;

                      const alreadyRated = userRating > 0 || rated[id]; // 👈 bloqueo total si ya votó

                      return (
                        <Star
                          key={value}
                          size={18}
                          color={
                            value <= (hover[id] || userRating || rating)
                              ? '#ffc107'
                              : '#e4e5e9'
                          }
                          onMouseEnter={() => {
                            if (!alreadyRated)
                              setHover((prev) => ({ ...prev, [id]: value }));
                          }}
                          onMouseLeave={() => {
                            if (!alreadyRated)
                              setHover((prev) => ({ ...prev, [id]: 0 }));
                          }}
                          onClick={async () => {
                            if (alreadyRated) return; // 👈 evita cualquier click si ya votó

                            try {
                              await ApiService.post(`/api/courses/${id}/rate`, {
                                rating: value,
                              });
                              await ApiService.post('/api/users/rate', {
                                courseId: id,
                                rating: value,
                              });
                              await refetch();
                              setRated((prev) => ({ ...prev, [id]: true }));
                            } catch (error) {
                              console.error('Error rating course:', error);
                            }
                          }}
                          className={`cursor-pointer transition-colors ${
                            alreadyRated ? 'pointer-events-none opacity-70' : ''
                          }`}
                        />
                      );
                    })}
                  </div>
                </TableItem>

                <TableItem className="text-right">
                  {['admin', 'editor'].includes(authenticatedUser.role) ? (
                    <button
                      className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                      onClick={() => {
                        setSelectedCourseId(id);

                        setValue('name', name);
                        setValue('description', description);

                        setUpdateShow(true);
                      }}
                    >
                      Edit
                    </button>
                  ) : null}
                  {authenticatedUser.role === 'admin' ? (
                    <button
                      className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
                      onClick={() => {
                        setSelectedCourseId(id);
                        setDeleteShow(true);
                      }}
                    >
                      Delete
                    </button>
                  ) : null}
                </TableItem>
              </tr>
            ))}
        </Table>
        {!isLoading && courses.length < 1 && (
          <div className="text-center my-5 text-gray-500">
            <h1>Empty</h1>
          </div>
        )}
      </div>

      {data && (
        <div className="text-sm text-gray-600 mt-2 text-right pr-2">
          Showing {(data.page - 1) * data.limit + 1}–
          {Math.min(data.page * data.limit, data.total)} of {data.total} courses
        </div>
      )}

      {/* Delete Course Modal */}
      <Modal show={deleteShow}>
        <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
        <div className="ml-10">
          <h3 className="mb-2 font-semibold">Delete Course</h3>
          <hr />
          <p className="mt-2">
            Are you sure you want to delete the course? All of course's data
            will be permanently removed.
            <br />
            This action cannot be undone.
          </p>
        </div>
        <div className="flex flex-row gap-3 justify-end mt-5">
          <button
            className="btn"
            onClick={() => {
              setError(null);
              setDeleteShow(false);
            }}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="btn danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader className="mx-auto animate-spin" />
            ) : (
              'Delete'
            )}
          </button>
        </div>
        {error && (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
            {error}
          </div>
        )}
      </Modal>

      {/* Update Course Modal */}
      <Modal show={updateShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Update Course</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              setUpdateShow(false);
              setError(undefined);
              reset();
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(handleUpdate)}
        >
          <input
            type="text"
            className="input"
            placeholder="Name"
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder="Description"
            required
            disabled={isSubmitting}
            {...register('description')}
          />
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Save'
            )}
          </button>
          {error && (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          )}
        </form>
      </Modal>
    </>
  );
}
