import { Appbar } from "../components/Appbar";
import { RichTextEditor } from "../components/RichTextEditor";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
    const navigate = useNavigate();

    const handlePublish = async () => {
        if (!title.trim() || !content.trim()) {
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
            <div className="pt-28 sm:pt-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {/* Header */}
                <div className="mb-10 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        Create a New Story
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        Share your thoughts, ideas, and stories with the world
                    </p>
                </div>

                {/* Title Input */}
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

                {/* Tags Selector */}
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

                {/* Rich Text Editor */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                    </label>
                    <RichTextEditor
                        onChange={setContent}
                        placeholder="Start writing your story..."
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate("/blogs")}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium shadow-sm"
                        disabled={isPublishing}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
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
                    </button>
                </div>
            </div>
        </div>
    );
};