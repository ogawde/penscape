import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { signinInput, signupInput } from "penscape-common";
import bcrypt from "bcryptjs";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ error: "invalid input" });
  }
  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
      },
    });
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (e) {
    c.status(403);
    return c.json({ error: "error while signing up" });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ error: "invalid input" });
  }
  const user = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
  });

  if (!user) {
    c.status(403);
    return c.json({ error: "user not found" });
  }

  const passwordMatch = await bcrypt.compare(body.password, user.password);
  if (!passwordMatch) {
    c.status(403);
    return c.json({ error: "invalid credentials" });
  }

  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ jwt });
});

userRouter.get("/me", async (c) => {
  const jwt = c.req.header("Authorization") || "";
  if (!jwt) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }

  const payload = await verify(jwt, c.env.JWT_SECRET);
  if (!payload) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const user = await prisma.user.findUnique({
    where: {
      id: Number(payload.id),
    },
    select: {
      id: true,
      username: true,
      email: true,
      blogs: {
        select: {
          id: true,
          title: true,
          content: true,
          published: true,
          tags: true,
        },
      },
    },
  });

  if (!user) {
    c.status(404);
    return c.json({ error: "user not found" });
  }

  return c.json(user);
});

userRouter.put("/me", async (c) => {
  const jwt = c.req.header("Authorization") || "";
  if (!jwt) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }

  const payload = await verify(jwt, c.env.JWT_SECRET);
  if (!payload) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const updateData: any = {};

  if (body.username) updateData.username = body.username;
  if (body.email) updateData.email = body.email;
  if (body.password) updateData.password = await bcrypt.hash(body.password, 10);

  try {
    const user = await prisma.user.update({
      where: {
        id: Number(payload.id),
      },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return c.json(user);
  } catch (e) {
    c.status(400);
    return c.json({ error: "failed to update user" });
  }
});

userRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      blogs: {
        select: {
          id: true,
          title: true,
          content: true,
          published: true,
          tags: true,
        },
      },
    },
  });

  if (!user) {
    c.status(404);
    return c.json({ error: "user not found" });
  }

  return c.json(user);
});