import { LearnerNav } from "@/components/account/learner-tabs";
import { auth } from "@/lib/auth";

function getGreeting() {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
        return "Good morning";
    } else if (currentHour < 18) {
        return "Good afternoon";
    } else {
        return "Good evening";
    }
}

const funFacts = [
    "Did you know? A dollar bill can be folded over 4,000 times.",
    "Fun fact: There’s an ATM on Every Continent on Earth.",
    "Did you know? It costs over 3 cents to make one penny!",
    "Fun fact: The word 'bank' comes from the Italian word 'banco', meaning bench or counter.",
    "Did you know? Federal Reserve notes are a blend of 25% linen and 75% cotton.",
    "Fun fact: The U.S. Stock market usually performs the worst during September.",
    "Did you know? The U.S. Secret Service was created in 1865 to combat counterfeiting.",
    "Fun fact: A $1 dollar bill lasts ~5.8 years before it must be replaced due to wear & tear.",
];

function getRandomFunFact() {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    return funFacts[randomIndex];
}

export default async function LessonLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const funFact = getRandomFunFact();
    if (!session?.user) {
        throw new Error("Not authenticated");
    }
    const name = session.user.firstName;
    return (
        <main>
            <div className="space-y-0.5 border-b pb-6">
                <h2 className="text-2xl font-bold tracking-tight">{getGreeting()}{name ? ", " + name : ""}!</h2>
                <p className="text-muted-foreground">
                    {funFact}
                </p>
            </div>
            <LearnerNav />
            {children}
        </main>
    );
}