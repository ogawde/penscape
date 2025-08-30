import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  const plainSnippet = content.replace(/<[^>]+>/g, "").trim();
  const snippet = plainSnippet.slice(0, 150) + (plainSnippet.length > 150 ? "..." : "");

  return (
    <Link to={`/blog/${id}`}>
      <motion.div
        className="bg-white rounded-lg p-6 border border-gray-200 cursor-pointer"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        whileHover={{
          y: -6,
          scale: 1.01,
          boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
          borderColor: "rgba(13,148,136,0.8)",
        }}
      >
        <div className="flex items-center mb-3 text-sm text-gray-600">
          <span className="font-medium text-gray-800">{authorName}</span>
          {publishedDate && (
            <>
              <span className="mx-2 h-1 w-1 rounded-full bg-slate-500" />
              <span className="text-gray-500">{publishedDate}</span>
            </>
          )}
        </div>
        <div className="text-xl font-bold pt-2 mb-2 text-gray-900 line-clamp-2 hover:text-teal-600 transition-colors duration-300">
          {title}
        </div>
        <div className="text-base font-normal text-gray-600 line-clamp-3 mb-4">
          {snippet}
        </div>

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
            {`${Math.ceil(plainSnippet.length / 100)} min read`}
          </div>
          <div className="text-teal-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Read more →
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
