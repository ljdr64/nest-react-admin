import { useQuery } from 'react-query';

import UpdateProfile from '../components/dashboard/UpdateProfile';
import Layout from '../components/layout';
import statsService from '../services/StatsService';
import CourseService from '../services/CourseService';

export default function Dashboard() {
  const { data, isLoading } = useQuery('stats', statsService.getStats);
  const { data: topCourses, isLoading: loadingRanking } = useQuery(
    'topCourses',
    () => CourseService.getTopRated()
  );

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">Dashboard</h1>
      <hr />
      <div className="mt-5 flex flex-col gap-5">
        <div className="card shadow flex flex-col">
          {!isLoading && (
            <div className="flex flex-col sm:flex-row gap-5 mb-4">
              <div className="card shadow text-white bg-blue-500 flex-1">
                <h1 className="font-semibold sm:text-4xl text-center mb-3">
                  {data.numberOfUsers}
                </h1>
                <p className="text-center sm:text-lg font-semibold">Users</p>
              </div>
              <div className="card shadow text-white bg-indigo-500 flex-1">
                <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                  {data.numberOfCourses}
                </h1>
                <p className="text-center sm:text-lg font-semibold">Courses</p>
              </div>
              <div className="card shadow text-white bg-green-500 flex-1">
                <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                  {data.numberOfContents}
                </h1>
                <p className="text-center sm:text-lg font-semibold">Contents</p>
              </div>
            </div>
          )}
          {!loadingRanking && (
            <div className="overflow-x-auto rounded border bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-2 text-left">Rank</th>
                    <th className="p-2 text-left">Course</th>
                    <th className="p-2 text-left">Rating</th>
                    <th className="p-2 text-left">Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {topCourses && topCourses.length > 0 ? (
                    [...topCourses]
                      .sort((a, b) => b.rating - a.rating)
                      .slice(0, 3)
                      .map((c, i) => (
                        <tr key={c.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-semibold">{i + 1}</td>
                          <td className="p-2">{c.name}</td>
                          <td className="p-2">{c.rating.toFixed(1)}</td>
                          <td className="p-2">{c.votesCount}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-4 text-center text-gray-500 italic"
                      >
                        No courses ranking available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <UpdateProfile />
      </div>
    </Layout>
  );
}
