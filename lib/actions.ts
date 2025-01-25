import { hash } from "bcrypt";
import { auth } from "@/lib/auth";
import prisma from '@/prisma'

export interface FormSubmitObj {
    formData: any;
    key: string;
    slug?: string;
};


export const createUser = async (userdata: { email: string; password: string; name?: string }) => {
    const { email, password, name } = userdata;

    try {
        const exists = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (exists) {
            throw new Error("User already exists");
        } else {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: await hash(password, 10),
                    name,
                },
            });
            return user;
        }
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};