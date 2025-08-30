import React from "react";
import { useParams } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { PenLoader } from "../components/PenLoader";
import { BlogCard } from "../components/BlogCard";
import { useUser } from "../hooks";
import { motion } from "framer-motion";

export const Author = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, user } = useUser(Number(id));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Appbar />
        <motion.div
          className="pt-20 flex justify-center items-center min-h-[60vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <div className="text-center">
            <PenLoader size="lg" />
            <p className="mt-4 text-gray-600">Loading author profile...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Appbar />
        <div className="pt-20 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Author not found</h3>
            <p className="mt-1 text-gray-600">The author you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar />
      <motion.div
        className="pt-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div
          className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-16"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
                <p className="text-teal-100 text-lg mb-4">
                  Writer and storyteller sharing insights and experiences
                </p>
                <div className="flex items-center space-x-6 text-teal-100">
                  <div>
                    <span className="font-semibold text-white">{user.blogs?.length || 0}</span> Stories
                  </div>
                  <div>
                    <span className="font-semibold text-white">Member</span> since {new Date().getFullYear()}
                  </div>
                </div>
              </div>
              <button
                className="px-6 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gold/20 transition-all duration-300 transform hover:scale-105 shadow-lg self-start md:self-auto"
                onClick={() => alert("Follow functionality coming soon!")}
              >
                Follow
              </button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Stories by {user.username}
          </h2>
          
          {user.blogs && user.blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.blogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <BlogCard
                    id={blog.id}
                    authorName={user.username}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={
                      blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString()
                        : ""
                    }
                    tags={blog.tags}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No stories yet</h3>
              <p className="mt-1 text-gray-600">This author hasn't published any stories yet.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

