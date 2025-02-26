import HeaderContent from './header-content';
import { auth } from "@/lib/auth";

export default async function Header() {
    const session = await auth();
    const userData = session?.user ? {
        name: session.user.firstName + " " + session.user.lastName,
        image: session.user.image,
        email: session.user.email,
        roles: session.user.roles
    } : undefined;
    return (
        <HeaderContent
            userData={userData}
        />
    );
}