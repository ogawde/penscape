import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "penscape-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const jwt = c.req.header("Authorization") || "";
  if (!jwt) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
  
  const token = jwt

  const payload = await verify(token, c.env.JWT_SECRET);
  if (!payload) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }

  c.set("userId", payload.id as string);

  await next();
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ error: "input has some issue" });
  }

  const userId = c.get("userId");
  const post = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: Number(userId),
      tags: body.tags || [],
    },
  });
  return c.json({
    id: post.id,
  });
});

blogRouter.put("/", async (c) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ error: "new input has some issue" });
  }

  prisma.blog.update({
    where: {
      id: body.id,
      authorId: Number(userId),
    },
    data: {
      title: body.title,
      content: body.content,
      tags: body.tags || [],
    },
  });

  return c.text("updated post");
});

blogRouter.get("/bulk", async (c) => {
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const posts = await prisma.blog.findMany({
    select: {
      content: true,
      title: true,
      id: true,
      tags: true,
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return c.json(posts);
});

blogRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const post = await prisma.blog.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      tags: true,
      author: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
  return c.json(post);
});

blogRouter.get("/:id/related", async (c) => {
  const id = Number(c.req.param("id"));

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  // First get the blog to find its author
  const blog = await prisma.blog.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!blog) {
    c.status(404);
    return c.json({ error: "Blog not found" });
  }

  // Get 3 other blogs by the same author
  const relatedBlogs = await prisma.blog.findMany({
    where: {
      authorId: blog.authorId,
      id: { not: id },
    },
    select: {
      id: true,
      title: true,
      content: true,
      tags: true,
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    take: 3,
  });

  return c.json(relatedBlogs);
});

blogRouter.get("/author/:authorId", async (c) => {
  const authorId = Number(c.req.param("authorId"));

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogs = await prisma.blog.findMany({
    where: {
      authorId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      tags: true,
      author: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  return c.json(blogs);
});


