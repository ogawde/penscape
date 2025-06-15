import z from "zod";
export declare const signupInput: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    email: string;
    password: string;
}, {
    username: string;
    email: string;
    password: string;
}>;
export type SignupInput = z.infer<typeof signupInput>;
export declare const signinInput: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export type SigninInput = z.infer<typeof signinInput>;
export declare const createBlogInput: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    tags: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    tags: string[];
}, {
    title: string;
    content: string;
    tags?: string[] | undefined;
}>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export declare const updateBlogInput: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    id: z.ZodNumber;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    id: number;
    tags?: string[] | undefined;
}, {
    title: string;
    content: string;
    id: number;
    tags?: string[] | undefined;
}>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
