import { createPortal } from "react-dom";
import { Appbar } from "../components/Appbar";
import { RichTextEditor } from "../components/RichTextEditor";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AVAILABLE_TAGS = [
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

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const navigate = useNavigate();

    const hasContent = () => {
        const stripped = content.replace(/<[^>]+>/g, "").trim();
        return stripped.length > 0;
    };

    const handlePublish = async () => {
        if (!title.trim() || !hasContent()) {
            alert("Please provide both a title and content for your post.");
            return;
        }

        setIsPublishing(true);
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/blog`,
                {
                    title,
                    content,
                    tags: selectedTags,
                },
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            navigate(`/blog/${response.data.id}`);
        } catch (error) {
            alert("Failed to publish post. Please try again.");
        } finally {
            setIsPublishing(false);
        }
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else if (selectedTags.length < 3) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Appbar />
            <motion.div
                className="pt-28 sm:pt-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <div className="mb-10 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        Create a New Story
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        Share your thoughts, ideas, and stories with the world
                    </p>
                </div>

                <div className="mb-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                        placeholder="Enter your story title..."
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (Select up to 3)
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_TAGS.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                disabled={!selectedTags.includes(tag) && selectedTags.length >= 3}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                                    selectedTags.includes(tag)
                                        ? "bg-teal-600 text-white shadow-md"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gold/20 hover:border-teal-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        {selectedTags.length}/3 tags selected
                    </p>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                    </label>
                    <RichTextEditor
                        onChange={setContent}
                        placeholder="Start writing your story..."
                    />
                </div>

                <div className="flex items-center justify-between">
                    <motion.button
                        onClick={() => navigate("/blogs")}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium shadow-sm"
                        disabled={isPublishing}
                        whileHover={{ y: -1, scale: 1.01 }}
                        whileTap={{ scale: 0.985, y: 1 }}
                    >
                        Cancel
                    </motion.button>
                    <div className="flex items-center gap-3">
                        <motion.button
                            type="button"
                            onClick={() => setIsPreviewOpen(true)}
                            className="px-6 py-3 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-all duration-300 font-medium shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                            disabled={isPublishing}
                            whileHover={{ y: -1, scale: 1.01 }}
                            whileTap={{ scale: 0.985, y: 1 }}
                        >
                            Preview
                        </motion.button>
                        <motion.button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            whileHover={isPublishing ? {} : { scale: 1.03, y: -1 }}
                            whileTap={isPublishing ? {} : { scale: 0.985, y: 1 }}
                        >
                            {isPublishing ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Publishing...
                                </span>
                            ) : (
                                "Publish Story"
                            )}
                        </motion.button>
                    </div>
                </div>

                {isPreviewOpen &&
                    createPortal(
                        <div
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="preview-title"
                        >
                            <div className="relative w-full h-full max-w-5xl mx-auto bg-white shadow-xl overflow-y-auto">
                                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
                                    <h2 id="preview-title" className="text-lg font-semibold text-gray-900">
                                        Preview: {title || "Untitled story"}
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => setIsPreviewOpen(false)}
                                        className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                                    >
                                        Close
                                    </button>
                                </div>

                                <div className="px-6 py-8 max-w-3xl mx-auto">
                                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                        {title || "Untitled story"}
                                    </h1>

                                    {selectedTags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {selectedTags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div
                                        className="preview-content max-w-none min-h-[200px]"
                                        dangerouslySetInnerHTML={{
                                            __html: content || '<p style="color:#6b7280;">Start writing your story to see a preview here.</p>',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
            </motion.div>
        </div>
    );
};