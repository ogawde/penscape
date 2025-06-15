import { Appbar } from "../components/Appbar";
import { FullBlog } from "../components/FullBlog";
import { PenLoader } from "../components/PenLoader";
import { useBlog } from "../hooks";
import { useParams } from "react-router-dom";

export const Blog = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, blog } = useBlog({ id: id || "" });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Appbar />
        <div className="h-screen flex flex-col justify-center items-center">
          <PenLoader size="lg" />
          <p className="mt-4 text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Appbar />
        <div className="h-screen flex flex-col justify-center items-center">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Story not found</h3>
            <p className="mt-1 text-gray-600">The story you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      <FullBlog blog={blog} />
    </div>
  );
};
