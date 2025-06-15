import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface Blog {
  content: string;
  title: string;
  id: number;
  published?: boolean;
  tags?: string[];
  author: {
    id: number;
    username: string;
    email?: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  blogs?: Blog[];
}

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
          headers: {
            Authorization: localStorage.getItem('token') || '',
          },
        });
        setBlog(response.data);
      } catch (error) {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    } else {
      setLoading(false);
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
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
          headers: {
            Authorization: localStorage.getItem("token") || '',
          },
        });
        setBlogs(response.data);
      } catch (error) {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return {
    loading,
    blogs,
  };
};

export const useAuthorBlogs = (authorId: number) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchAuthorBlogs = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/author/${authorId}`, {
          headers: {
            Authorization: localStorage.getItem("token") || '',
          },
        });
        setBlogs(response.data);
      } catch (error) {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    if (authorId) {
      fetchAuthorBlogs();
    } else {
      setLoading(false);
    }
  }, [authorId]);

  return {
    loading,
    blogs,
  };
};

export const useRelatedBlogs = (blogId: number) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${blogId}/related`, {
          headers: {
            Authorization: localStorage.getItem("token") || '',
          },
        });
        setBlogs(response.data);
      } catch (error) {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchRelatedBlogs();
    } else {
      setLoading(false);
    }
  }, [blogId]);

  return {
    loading,
    blogs,
  };
};

export const useCurrentUser = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
          headers: {
            Authorization: localStorage.getItem("token") || '',
          },
        });
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return {
    loading,
    user,
  };
};

export const useUser = (userId: number) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/${userId}`, {
          headers: {
            Authorization: localStorage.getItem("token") || '',
          },
        });
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [userId]);

  return {
    loading,
    user,
  };
};

