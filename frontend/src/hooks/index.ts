import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface Blog {
  content: string;
  title: string;
  id: number;
  author: {
    name: string;
  };
}

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log(`Fetching blog with id: ${id}`);
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
          headers: {
            Authorization: localStorage.getItem('token') || '',
          },
        });
        console.log('Blog data received:', response.data);
        setBlog(response.data); // Assuming response.data is the blog object
      } catch (error) {
        console.error('Error fetching blog:', error);
        setBlog(null); // Ensure blog is set to null in case of an error
      } finally {
        setLoading(false); // Ensure loading is set to false in all cases
      }
    };

    if (id) {
      fetchBlog();
    } else {
      setLoading(false); // Handle case where id is not provided
    }
  }, [id]);

  return {
    loading,
    blog,
  };
};

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log('Fetching all blogs');
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
          headers: {
            Authorization: localStorage.getItem("token") || '',
          },
        });
        console.log('Blogs data received:', response.data);
        setBlogs(response.data); // Set blogs state directly from response.data
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]); // Ensure blogs is set to an empty array in case of an error
      } finally {
        setLoading(false); // Ensure loading is set to false in all cases
      }
    };

    fetchBlogs();
  }, []);

  return {
    loading,
    blogs,
  };
};

