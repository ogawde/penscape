import { Link } from "react-router-dom";
interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: number;
  tags?: string[];
}

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
  tags,
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
      <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-teal-300 transition-all duration-300 cursor-pointer hover:shadow-xl transform hover:-translate-y-1">
        <div className="flex items-center mb-3">
          <Avatar name={authorName} />
          <div className="font-medium pl-2 text-sm text-gray-700">
            {authorName}
          </div>
          <div className="flex justify-center flex-col pl-2">
            <Circle />
          </div>
          <div className="pl-2 font-normal text-gray-500 text-sm">
            {publishedDate}
          </div>
        </div>
        <div className="text-xl font-bold pt-2 mb-2 text-gray-900 line-clamp-2 hover:text-teal-600 transition-colors duration-300">
          {title}
        </div>
        <div className="text-base font-normal text-gray-600 line-clamp-3 mb-4">
          {content.slice(0, 150)}...
        </div>
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-gray-500 text-sm font-medium">
            {`${Math.ceil(content.length / 100)} min read`}
          </div>
          <div className="text-teal-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Read more →
          </div>
        </div>
      </div>
    </Link>
  );
};

export function Circle() {
  return <div className="h-1 w-1 rounded-full bg-slate-800	"></div>;
}

export function Avatar({
  name,
  size = "small",
}: {
  name: string;
  size?: "small" | "big";
}) {
  const initial = name && name.length > 0 ? name[0].toUpperCase() : "A";
  
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${
        size === "small" ? "w-6 h-6" : "w-10 h-10"
      }`}
    >
      <span
        className={`${
          size === "small" ? "text-xs" : "text-md"
        } font-extralight text-white`}
      >
        {initial}
      </span>
    </div>
  );
}
