import { Roles } from '@/lib/db/schema';
import HeaderContent from './header-content';
import { getSession } from "@/lib/auth";

export default async function Header() {
    const session = await getSession();
    const userData = session?.user ? {
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        image: session.user.image,
        email: session.user.email,
        roles: session.user.roles as Roles
    } : undefined;
    return (
        <HeaderContent
            userData={userData}
        />
    );
}