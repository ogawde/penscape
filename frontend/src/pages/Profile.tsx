import React, { useState } from "react";
import { Appbar } from "../components/Appbar";
import { PenLoader } from "../components/PenLoader";
import { BlogCard } from "../components/BlogCard";
import { useCurrentUser } from "../hooks";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Profile = () => {
  const { loading, user } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const updateData: any = {};
      if (formData.username !== user?.username) updateData.username = formData.username;
      if (formData.email !== user?.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;

      await axios.put(`${BACKEND_URL}/api/v1/user/me`, updateData, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
      setFormData({ ...formData, password: "" });
      window.location.reload(); // Refresh to get updated data
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      password: "",
    });
    setMessage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Appbar />
        <div className="pt-20 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <PenLoader size="lg" />
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Appbar />
        <div className="pt-20 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Failed to load profile</h3>
            <p className="mt-1 text-gray-600">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar />
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account settings and view your stories</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Information */}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Username</label>
                <p className="mt-1 text-lg text-gray-900">{user.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-lg text-gray-900">{user.email}</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Total Stories</p>
                    <p className="text-2xl font-bold text-gray-900">{user.blogs?.length || 0}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User's Blogs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Stories</h2>
          {user.blogs && user.blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  authorName={user.username}
                  title={blog.title}
                  content={blog.content}
                  publishedDate={new Date().toLocaleDateString()}
                  tags={blog.tags}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
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
              <p className="mt-1 text-gray-600">Start writing your first story!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

