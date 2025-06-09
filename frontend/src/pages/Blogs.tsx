import { BlogCard } from "../components/BlogCard";
import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  console.log('Blogs state:', blogs);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(blogs) || blogs.length === 0) {
    return <div>No blogs available</div>;
  }

  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div>
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              authorName={blog.author?.name || "Anon"}
              title={blog.title}
              content={blog.content}
              publishedDate={"22/11/2024"} // Adjust date as needed
            />
          ))}
        </div>
      </div>
    </div>
  );
};
