import React, { useState, useEffect } from "react";
import { BlogCard } from "../components/BlogCard";
import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks";
import { PenLoader } from "../components/PenLoader";

const TAGS = [
  "All",
  "Technology",
  "Design",
  "Writing",
  "Life",
  "Travel",
  "Food",
  "Photography",
  "Music",
  "Art"
];

const BLOGS_PER_PAGE = 20;

export const Blogs = () => {
  const { loading, blogs } = useBlogs();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);

  useEffect(() => {
    let filtered = blogs;

    if (selectedTag !== "All") {
      filtered = filtered.filter((blog) =>
        (blog.tags && blog.tags.includes(selectedTag)) ||
        blog.title.toLowerCase().includes(selectedTag.toLowerCase()) ||
        blog.content.toLowerCase().includes(selectedTag.toLowerCase())
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((blog) =>
        blog.title.toLowerCase().includes(q) ||
        blog.content.toLowerCase().includes(q) ||
        (blog.author?.username || "").toLowerCase().includes(q) ||
        (blog.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    setFilteredBlogs(filtered);
    setCurrentPage(1);
  }, [blogs, searchQuery, selectedTag]);

  const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
  const endIndex = startIndex + BLOGS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F1]">
        <Appbar />
        <div className="pt-24 flex items-center justify-center">
          <PenLoader size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F1]">
      <Appbar />
      <div className="pt-28 sm:pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center mb-14 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#334443] mb-5 sm:mb-6">
            Discover Amazing Stories
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore a world of creativity, insights, and inspiration from talented writers around the globe.
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search stories, authors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedTag === tag
                    ? "bg-teal-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gold/20 hover:border-teal-300 shadow-sm"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Showing {currentBlogs.length} of {filteredBlogs.length} stories
            {searchQuery && ` for "${searchQuery}"`}
            {selectedTag !== "All" && ` in ${selectedTag}`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentBlogs.map((blog) => (
            <div key={blog.id}>
              <BlogCard
                id={blog.id}
                authorName={blog.author?.username || ""}
                title={blog.title}
                content={blog.content}
                publishedDate={
                  blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : ""
                }
                tags={blog.tags}
              />
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gold/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              const isCurrentPage = page === currentPage;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
                      isCurrentPage ? "bg-teal-600 text-white shadow-lg" : "border border-gray-300 text-gray-700 hover:bg-gold/20"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gold/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Next
            </button>
          </div>
        )}

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stories found</h3>
            <p className="text-gray-600">
              {searchQuery || selectedTag !== "All" ? "Try adjusting your search or filter criteria" : "No stories have been published yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
