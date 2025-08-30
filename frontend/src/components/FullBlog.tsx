import { Blog, useRelatedBlogs } from "../hooks";
import { Appbar } from "./Appbar";
import { BlogCard } from "./BlogCard";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const FullBlog = ({ blog }: { blog: Blog }) => {
  const authorName = blog.author?.username || "";
  const authorId = blog.author?.id || 0;
  const { loading: relatedLoading, blogs: relatedBlogs } = useRelatedBlogs(blog.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar />
      <motion.div
        className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2 bg-white rounded-lg shadow-sm p-8"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
              <div>
                <Link
                  to={`/author/${authorId}`}
                  className="text-lg font-semibold text-gray-900 hover:text-teal-600 transition-colors duration-200"
                >
                  {authorName}
                </Link>
                <div className="mt-1 text-sm text-gray-500">
                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    : ""}
                </div>
              </div>
            </div>
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed preview-content"
              dangerouslySetInnerHTML={{
                __html: (() => {
                  const raw = blog.content || "";
                  if (!raw.trim()) return "";
                  if (/^\s*</.test(raw.trim())) return raw;
                  const escaped = raw
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/\n/g, "<br>");
                  return `<p>${escaped}</p>`;
                })(),
              }}
            />
          </motion.div>

          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
          >
            <div className="sticky top-24">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  About the Author
                </h3>
                <div>
                  <Link
                    to={`/author/${authorId}`}
                    className="text-lg font-bold text-gray-900 hover:text-teal-600 transition-colors duration-200"
                  >
                    {authorName}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
                    Writer and storyteller sharing insights and experiences.
                  </p>
                </div>
                <Link 
                  to={`/author/${authorId}`}
                  className="mt-4 block w-full text-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {!relatedLoading && relatedBlogs.length > 0 && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              More from {authorName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <BlogCard
                  key={relatedBlog.id}
                  id={relatedBlog.id}
                  authorName={relatedBlog.author?.username || ""}
                  title={relatedBlog.title}
                  content={relatedBlog.content}
                  publishedDate={
                    relatedBlog.createdAt
                      ? new Date(relatedBlog.createdAt).toLocaleDateString()
                      : ""
                  }
                  tags={relatedBlog.tags}
                />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
