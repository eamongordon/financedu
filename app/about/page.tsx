import type { Metadata } from "next";
import Banner from "@/components/banner";
import { CloudsDarkClass, CloudsLightClass } from "@/components/illustrations/clouds";
import { DividerWedge } from "@/components/illustrations/divider-wedge";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'About',
    description: 'We are Financedu, a 501(3)(c) non-profit dedicated to providing free financial education for youth of all ages. Learn more about us and our mission.'
}

export default function EducatorPage() {
    return (
        <>
            <Banner title="About Us" className="from-[#02CF46] to-[#00B5EA] bg-gradient-to-r" />
            <main>
                <div className="flex flex-col gap-4 py-6 md:py-14 justify-center items-center">
                    <div className="md:w-4/5 space-y-6 px-4 md:px-0">
                        <h1 className="font-semibold text-4xl md:text-5xl lg:text-6xl">We are <span className="text-primary">Financedu</span></h1>
                        <p className="text-lg text-muted-foreground">We are Financedu, a 501(c)(3) non-profit dedicated to providing free online financial education for youth of all ages. Our comprehensive, engaging curriculum and programs teach individuals the skills necessary for lifelong financial success!</p>
                    </div>
                </div>
                <section className="flex flex-col md:flex-row items-center justify-between px-4 md:p-8 gap-4">
                    <div className="w-full md:w-1/3 flex flex-col items-center">
                        <div className="w-full md:w-auto flex flex-col gap-4">
                            <h2 className="text-3xl font-semibold">Begginings</h2>
                            <Image
                                src="/Eamon-Gordon-Portrait-Compressed.png"
                                alt="Homepage Banner"
                                width={800}
                                height={500}
                                className="object-cover w-40 mx-auto md:mx-0 md:w-auto h-auto rounded-lg"
                            />
                            <div>
                                <h1 className="text-center md:text-start text-lg font-semibold">Eamon Gordon</h1>
                                <p className="text-md text-center md:text-start text-muted-foreground">Founder & Developer, Financedu</p>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-2/3 md:px-16">
                        <p className="text-lg text-muted-foreground">My lifelong interest in finance began when I received an iPod touch on my fourth birthday.  I tapped an unfamiliar chart icon and was fascinated by the graphs and real-time changes, which I later discovered to be the Stocks app. Since then, I have followed financial news and the stock market daily, and my interest in finance has deepened as I&apos;ve grown older.</p>
                        <br />
                        <p className="text-lg text-muted-foreground">But Financedu in its current form began on a summer morning in 2021, when I was completing an application for the 2021 Broadcom MASTERS National Science Fair.  Inspired by an essay question that asked me to create a novel school course, I have devoted much of my free time since then to developing free online financial education courses and resources, which has become Financedu.org.</p>
                        <br />
                        <p className="text-lg text-muted-foreground">Given its importance in modern society, I am passionate about universal and free access to financial education. I&apos;m happy that you&apos;ve found our website!</p>
                        <br />
                        <p className="text-lg text-muted-foreground">Sincerely,</p>
                        <p className="text-lg text-muted-foreground">Eamon</p>
                    </div>
                </section>
                <div className="relative h-[200px] flex items-center">
                    <h3 className="font-semibold text-3xl ml-8">Awards & Recognition</h3>
                    <div className="scale-x-[-1] absolute bottom-0 w-full h-[200px] fill-secondary/5">
                        <DividerWedge />
                    </div>
                    <div className="scale-x-[-1] absolute bottom-0 w-full h-[180px] fill-secondary/10">
                        <DividerWedge />
                    </div>
                    <div className="scale-x-[-1] absolute bottom-0 w-full h-[150px] fill-secondary/15">
                        <DividerWedge />
                    </div>
                    <div className="scale-x-[-1] absolute bottom-0 w-full h-[120px] fill-secondary/20">
                        <DividerWedge />
                    </div>
                </div>
                <div className="flex flex-col py-4 md:py-0">
                    <div className="flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-between">
                        <div className="md:w-1/3 flex justify-center items-center">
                            <Image
                                src="/Congressional-App-Challenge-transparent.png"
                                alt="Homepage Banner"
                                width={800}
                                height={500}
                                className="dark:brightness-150 object-cover w-auto h-20"
                            />
                        </div>
                        <div className="md:w-2/3 flex items-center justify-center md:bg-muted/60 md:pt-12 md:pb-8 px-4">
                            <div className="md:w-4/5">
                                <h1 className="text-2xl font-bold mb-4">Congressional App Challenge Winner, 2023</h1>
                                <p className="text-lg text-muted-foreground">Financedu won the <strong>2023 <Link target="_blank" className="underline" href="https://www.congressionalappchallenge.us/">Congressional App Challenge</Link> for California&apos;s 24th Congressional District</strong>, a computer science competition recognizing innovative applications created by youth across the nation.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-between">
                        <div className="md:w-1/3 flex justify-center items-center">
                            <Image
                                src="/MAIA-Badge-Transparent.png"
                                alt="Homepage Banner"
                                width={800}
                                height={500}
                                className="dark:brightness-150 object-cover w-auto h-56"
                            />
                        </div>
                        <div className="md:w-2/3 flex items-center justify-center md:bg-muted/60 md:min-h-56 md:py-8 px-4">
                            <div className="md:w-4/5">
                                <h1 className="text-2xl font-bold mb-4">Money Awareness and Inclusion Awards, 2024</h1>
                                <p className="text-lg text-muted-foreground">Financedu was awarded <strong>Runner-Up for Best Teacher, Student or Class Led Project</strong> by <Link target="_blank" className="underline" href="https://www.maiawards.org">The Money Awareness and Inclusion Awards (MAIA)</Link> - a global organization that celebrates outstanding financial literacy efforts by individuals, non-profits, and businesses.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col ml-8 gap-2 py-6">
                    <h3 className="text-2xl md:text-3xl font-semibold">Our Goals</h3>
                    <h4 className="text-xl font-semibold text-muted-foreground">We seek to...</h4>
                </div>
                <div className="space-y-4">
                    <div className={`dark:hidden h-12 w-full bg-repeat-x ${CloudsLightClass}`} />
                    <div className={`hidden dark:block h-12 w-full bg-repeat-x ${CloudsDarkClass}`} />
                </div>
                <div className="flex flex-col py-6 md:py-0">
                    <div className="flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-between">
                        <div className="md:w-1/3 flex justify-center items-center">
                            <div className="h-24 md:h-32 fill-secondary">
                                <RocketIllustration />
                            </div>
                        </div>
                        <div className="md:w-2/3 flex items-center justify-center md:bg-muted/60 py-6 md:pt-12 md:pb-8 px-4">
                            <div className="md:w-4/5">
                                <h1 className="text-2xl font-bold mb-4">Prepare Youth for the Future</h1>
                                <p className="text-lg text-muted-foreground">Our mission is to promote Financial Literacy, empowering youth with the knowledge and confidence to make sound financial decisions.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-between">
                        <div className="md:w-1/3 flex justify-center items-center">
                            <div className="h-24 md:h-32 fill-secondary">
                                <LadderIllustration />
                            </div>
                        </div>
                        <div className="md:w-2/3 flex items-center justify-center md:bg-muted/60 py-6 md:pt-12 md:pb-8 px-4">
                            <div className="md:w-4/5">
                                <h1 className="text-2xl font-bold mb-4">Close the Knowledge Equity Gap</h1>
                                <p className="text-lg text-muted-foreground">Disparities in access to financial education contribute to economic inequality. We strive to close some of these gaps by offering courses and resources free of charge.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-between">
                        <div className="md:w-1/3 flex justify-center items-center">
                            <div className="h-24 md:h-32 fill-secondary">
                                <BrainIllustration />
                            </div>
                        </div>
                        <div className="md:w-2/3 flex items-center justify-center md:bg-muted/60 py-6 md:pt-12 md:pb-8 px-4">
                            <div className="md:w-4/5">
                                <h1 className="text-2xl font-bold mb-4">Instill Life Skills</h1>
                                <p className="text-lg text-muted-foreground">Essential financial skills such as saving, budgeting, investing, and planning develop habits that are beneficial in all spheres of life.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

function RocketIllustration() {
    return (
        <svg height="100%" width="100%" preserveAspectRatio="xMidYMid meet" data-bbox="7.147 14.526 85.685 70.974" viewBox="7.147 14.526 85.685 70.974" xmlns="http://www.w3.org/2000/svg" data-type="shape" role="presentation" aria-hidden="true" aria-label="">
            <g>
                <path d="M76.4 30.2c-2.1-2.6-8.1-1.7-12.8-.5-1.1.3-2.2.6-3.3 1-4.1 1.4-8.2 3.2-10.6 4.8-2.9 1.9-5.7 4.4-8.1 6.9-.9-.7-2.7-1.7-5.1-1-3.6 1.1-6.7 4-9 8.2-1.7 3.1-2.4 5.9-2.4 6-.1.3 0 .6.3.8.1.1.3.2.5.2.1 0 .2 0 .3-.1l7.3-2.8c0 .1.1.2.1.3-2.8 1.7-4.1 4-4.6 5.4-1.3-.7-3.8-1.7-6.9-1.2-3.6.5-5.9 2.8-6.8 3.8-.9-.3-2.7-.7-4.7-.1-1.3.4-2.3 1.3-2.9 2.6-.7 1.4-.7 2.8-.2 3.9.4.9 6.9 11.5 10.5 14.4 2.2 1.8 4.3 2.7 6.3 2.7.4 0 .9 0 1.3-.1 2-.4 3.3-1.7 4.1-2.4l.2-.2c1.5-1.4 2-3.2 1.6-5.3-.1-.6-.3-1.2-.5-1.6 1.4-.3 3.5-1.3 4.4-3.8.8-2.4.2-4.6-.4-5.9 1.3-.1 3.3-.5 4.9-1.7l.2.2c.3.2.7.3 1.1.3h.1L39 71.9c-.1.3 0 .6.1.8.2.2.4.3.6.3h.1c.1 0 3-.4 6.5-1.6 4.8-1.6 8.2-3.9 10.3-6.7 1.3-1.8 1.2-3.6.7-4.8 2.4-1.1 4.7-2.3 6.7-3.7 2.3-1.6 5.2-5.2 7.9-9.7 2.8-4.6 4.7-9.1 5.1-12.2.3-1.8.1-3.2-.6-4.1zM28.8 50.4c1.5-2.7 4.1-6.1 8.1-7.4 1.6-.5 2.9.1 3.5.6-2 2.2-3.7 4.2-4.9 5.8-.1.1-.2.2-.2.3-.8 1.1-1.4 1.9-1.6 2.2L27 54.5c.4-1 1-2.5 1.8-4.1zm9.9 6.2c-.6-.7-1.8-1.7-3.7-2.8-.1-.1-.2-.2-.2-.3 0-.1 0-.3.1-.4.1-.1.6-.9 1.5-2.1 1.2.2 3.7.8 5.6 3.1l-3.3 2.5zM33 65.9s1.9 2.7.9 5.6c-.9 2.8-4 2.9-4.1 2.9-.3 0-.5.2-.7.4-.1.3-.1.6 0 .8 0 0 2.2 3.5-.3 5.9l-.2.2c-1.5 1.4-4.3 4.1-9.6-.2-3.3-2.7-9.6-13.1-10-13.9-.3-.6-.3-1.6.1-2.4.2-.5.8-1.4 1.9-1.8 2.2-.7 4.1.2 4.1.3.4.2.8.1 1-.3 0 0 2.2-3.2 6-3.7s6.6 1.5 6.6 1.5c.2.2.5.2.7.1.3-.1.4-.3.5-.6 0 0 1-3.6 4.6-5.6 1.4.9 2.4 1.7 2.9 2.2L34.3 60c-.4.3-.4.8-.1 1.1.2.2.4.3.6.3.2 0 .3-.1.5-.2l2.9-2.2c.3 1 .7 2.3 1 4-2.1 1.8-5.4 1.7-5.5 1.7-.3 0-.6.1-.7.4-.2.2-.2.6 0 .8zm8-2.6s-.1-.1-.1-.2c-.3-1.7-.8-3.7-1.3-5.1l3.4-2.6c1.3 2.1 2 4.6 2.1 7.1-1.6.4-3 .7-3.8.9-.2 0-.3-.1-.3-.1zm14.4.4c-3.6 4.9-11.4 6.8-14.5 7.4l2.2-6.5c2.9-.7 7.9-2 12.8-4.1.3.7.5 1.9-.5 3.2zm7.7-8.8c-4.8 3.4-11.6 5.7-16.5 7.1-.2-2.7-1-5.4-2.4-7.6l3.3-2.6c.4-.3.4-.8.1-1.1-.3-.4-.8-.4-1.1-.1L43.3 53c-1.9-2.3-4.2-3.2-5.8-3.5 1.2-1.5 2.7-3.4 4.5-5.3h.1l.2-.2c2.4-2.5 5.2-5.1 8.2-7.1 2.3-1.5 6.2-3.2 10.1-4.6 3.4.3 6.3 1.6 8.4 3.7 2.5 2.5 2.8 6.7 2.7 7.8-.4.7-.7 1.3-1.1 2-2.6 4.1-5.4 7.6-7.5 9.1zm12.4-20.8c-.3 1.8-1.1 4.3-2.4 6.9 0-.2-.1-.4-.1-.6-.5-2.3-1.5-4.2-2.8-5.6-1.6-1.7-3.7-2.9-6.2-3.6 5.8-1.5 9.9-1.6 11.1-.1.4.6.6 1.7.4 3z"></path>
                <path d="M57.9 38.6c-3.2 0-5.7 2.6-5.7 5.7 0 3.2 2.6 5.7 5.7 5.7 3.2 0 5.7-2.6 5.7-5.7.1-3.2-2.5-5.7-5.7-5.7zm0 9.8c-2.3 0-4.1-1.9-4.1-4.1 0-2.3 1.9-4.1 4.1-4.1s4.1 1.9 4.1 4.1c.1 2.3-1.8 4.1-4.1 4.1zm-6.3-21.1c.2 0 .3 0 .5-.1L68.3 16c.4-.3.5-.8.2-1.1-.3-.4-.8-.5-1.1-.2L51.1 25.8c-.4.3-.5.8-.2 1.1.2.3.4.4.7.4zm41.1-11.1c-.3-.3-.8-.4-1.1-.1L80.8 25c-.3.3-.4.8-.1 1.1.2.2.4.3.6.3.2 0 .4-.1.5-.2l10.7-8.9c.4-.3.4-.8.2-1.1zm-1.9 22.6-15.5 15c-.3.3-.3.8 0 1.1.2.2.4.2.6.2.2 0 .4-.1.6-.2l15.5-15c.3-.3.3-.8 0-1.1-.3-.3-.9-.3-1.2 0z"></path>
            </g>
        </svg>
    );
}

function LadderIllustration() {
    return (
        <svg height="100%" width="100%" viewBox="0 0 96 96" clipRule="evenodd" strokeMiterlimit="2" strokeLinejoin="round" fillRule="evenodd" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" d="M96 0v96H0V0h96z"></path>
            <path d="m15.767 67.09 17.177 17.178a1.502 1.502 0 0 0 2.122 0 1.502 1.502 0 0 0 0-2.122L17.888 64.969a1.501 1.501 0 0 0-2.121 0 1.501 1.501 0 0 0 0 2.121Zm23.634 10.721L18.189 56.599a1.502 1.502 0 0 0-2.122 0 1.502 1.502 0 0 0 0 2.122l21.212 21.212a1.502 1.502 0 0 0 2.122 0 1.502 1.502 0 0 0 0-2.122ZM26.688 48.1 47.9 69.312a1.5 1.5 0 1 0 2.121-2.121L28.809 45.979a1.5 1.5 0 1 0-2.121 2.121Zm27.668 14.756L33.144 41.644a1.5 1.5 0 1 0-2.121 2.121l21.212 21.212a1.5 1.5 0 1 0 2.121-2.121ZM41.644 33.144l21.212 21.212a1.5 1.5 0 1 0 2.121-2.121L43.765 31.023a1.5 1.5 0 1 0-2.121 2.121ZM69.312 47.9 48.1 26.688a1.5 1.5 0 1 0-2.121 2.121l21.212 21.212a1.5 1.5 0 1 0 2.121-2.121ZM56.599 18.189l21.212 21.212a1.502 1.502 0 0 0 2.122 0 1.502 1.502 0 0 0 0-2.122L58.721 16.067a1.502 1.502 0 0 0-2.122 0 1.502 1.502 0 0 0 0 2.122Zm27.669 14.755L63.056 11.732a1.502 1.502 0 0 0-2.122 0 1.502 1.502 0 0 0 0 2.122l21.212 21.212a1.502 1.502 0 0 0 2.122 0 1.502 1.502 0 0 0 0-2.122Z"></path>
            <path d="M44.965 16.142 1.842 59.264a4.585 4.585 0 0 0 0 6.482l1.42 1.419a4.583 4.583 0 0 0 6.482 0L67.165 9.744a4.583 4.583 0 0 0 0-6.482l-1.419-1.42a4.585 4.585 0 0 0-6.482 0L48.957 12.15a1.5 1.5 0 1 0 2.121 2.121L61.385 3.964a1.582 1.582 0 0 1 2.239 0l1.42 1.419a1.584 1.584 0 0 1 0 2.239L7.622 65.044a1.584 1.584 0 0 1-2.239 0l-1.419-1.419a1.583 1.583 0 0 1 0-2.24l43.122-43.122a1.5 1.5 0 1 0-2.121-2.121zm49.193 20.594a4.585 4.585 0 0 0 0-6.482l-1.42-1.419a4.583 4.583 0 0 0-6.482 0L28.835 86.256a4.583 4.583 0 0 0 0 6.482l1.419 1.42a4.585 4.585 0 0 0 6.482 0l57.422-57.422zm-2.122-2.121L34.615 92.036a1.582 1.582 0 0 1-2.239 0l-1.42-1.419a1.584 1.584 0 0 1 0-2.239l57.422-57.422a1.584 1.584 0 0 1 2.239 0l1.419 1.419a1.583 1.583 0 0 1 0 2.24z"></path>
        </svg>
    );
}

function BrainIllustration() {
    return (
        <svg preserveAspectRatio="xMidYMid meet" data-bbox="34.998 20.001 130.001 159.999" viewBox="34.998 20.001 130.001 159.999" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" data-type="color" role="presentation" aria-hidden="true" aria-label="">
            <g>
                <path d="M131.09 180a1.825 1.825 0 0 1-1.824-1.825v-31.309c-.006-.473-.066-12.25 7.776-22.49 3.163-4.132 5.341-8.115 6.659-12.181 3.586-11.057 8.639-38.533-21.804-54.805-.302-.154-32.797-16.485-57.242 5.941-4.649 4.266-7.923 9.543-9.468 15.258-1.494 5.524-1.879 11.459-1.141 17.637.093.771.227 1.53.362 2.292l.028.16c.415 2.354.959 8.468-2.938 14.395l-6.766 9.837c-.128.351-.326 1.151-.048 1.676.281.53 1.093.793 1.751.92.423.043 1.948.233 3.237.786a3.076 3.076 0 0 1 1.778 2.126 3.068 3.068 0 0 1-.655 2.68 1.804 1.804 0 0 0-.272.395c.067.067.205.182.469.325a3.105 3.105 0 0 1 1.214 4.299c-.224.382-.252.607-.246.658h.001c.006 0 .197.263 1.064.521 1.547.463 2.486 1.984 2.184 3.54-.321 1.647-1.181 7.239 1.158 10.033 1.017 1.213 2.586 1.788 4.713 1.773l7.93-.775c6.565-.644 12.638 3.91 13.789 10.364.751 4.201 1.131 9.566 1.131 15.944a1.824 1.824 0 1 1-3.648 0c0-6.164-.362-11.312-1.074-15.303-.819-4.594-5.134-7.835-9.846-7.373l-8.153.791c-3.282.014-5.885-.982-7.638-3.077-3.007-3.591-2.626-9.217-2.037-12.566-1.519-.541-2.516-1.395-2.97-2.542-.289-.733-.462-1.885.235-3.347-1.071-.694-1.71-1.569-1.898-2.606-.121-.666-.088-1.639.614-2.746a10.313 10.313 0 0 0-1.5-.273l-.162-.022c-2.681-.489-3.881-1.824-4.415-2.858-1.172-2.275-.093-4.72.034-4.992l.15-.262 6.853-9.962c3.156-4.801 2.71-9.799 2.369-11.723l-.027-.159a44.43 44.43 0 0 1-.392-2.494c-.794-6.646-.376-13.047 1.241-19.024 1.728-6.383 5.367-12.26 10.525-16.994 26.346-24.17 61.055-6.661 61.403-6.482 33.819 18.076 26.596 49.853 23.577 59.162-1.447 4.466-3.814 8.808-7.233 13.274-7.051 9.206-7.025 20.139-7.024 20.249v31.329A1.825 1.825 0 0 1 131.09 180z" data-color="1"></path>
                <path d="M103.79 130.079a8.558 8.558 0 0 1-5.513-2.013 8.548 8.548 0 0 1-7.3 1.825 8.561 8.561 0 0 1-5.928-4.638 8.553 8.553 0 0 1-7.411-1.305 8.567 8.567 0 0 1-3.53-6.649c-2.58-.359-4.898-1.882-6.24-4.209s-1.5-5.097-.521-7.511a8.571 8.571 0 0 1-3.99-6.382 8.573 8.573 0 0 1 2.577-7.077 8.569 8.569 0 0 1-1.05-7.455 8.567 8.567 0 0 1 5.229-5.415 8.574 8.574 0 0 1 2.071-7.238 8.544 8.544 0 0 1 6.978-2.818 8.574 8.574 0 0 1 12.355-5.503 8.56 8.56 0 0 1 6.761-3.305 8.558 8.558 0 0 1 6.761 3.305 8.576 8.576 0 0 1 12.355 5.504 8.54 8.54 0 0 1 6.978 2.818 8.572 8.572 0 0 1 2.071 7.239 8.565 8.565 0 0 1 5.229 5.415 8.568 8.568 0 0 1-1.05 7.455 8.57 8.57 0 0 1 2.577 7.075 8.574 8.574 0 0 1-3.99 6.383 8.57 8.57 0 0 1-.523 7.512 8.563 8.563 0 0 1-6.239 4.209 8.57 8.57 0 0 1-3.532 6.65 8.551 8.551 0 0 1-7.41 1.304 8.558 8.558 0 0 1-7.715 4.824zm-5.513-7.855 1.49 2.114a4.934 4.934 0 0 0 5.052 1.983 4.922 4.922 0 0 0 3.808-3.868l.501-2.54 2.222 1.326a4.913 4.913 0 0 0 5.419-.244 4.923 4.923 0 0 0 1.909-5.083l-.574-2.523 2.567.306a4.896 4.896 0 0 0 4.854-2.429 4.928 4.928 0 0 0-.323-5.42l-1.55-2.072 2.472-.766a4.925 4.925 0 0 0 3.446-4.195 4.926 4.926 0 0 0-2.499-4.82l-2.258-1.262 1.946-1.704a4.93 4.93 0 0 0-2.8-8.622l-2.574-.234 1.084-2.349a4.929 4.929 0 0 0-6.062-6.736l-2.449.835.037-2.588a4.924 4.924 0 0 0-8.274-3.687l-1.898 1.759-1.019-2.379a4.924 4.924 0 0 0-9.058 0l-1.019 2.379-1.898-1.759a4.925 4.925 0 0 0-8.274 3.687l.037 2.588-2.449-.835a4.927 4.927 0 0 0-6.062 6.736l1.084 2.349-2.574.234a4.93 4.93 0 0 0-2.8 8.622l1.946 1.704-2.258 1.262a4.93 4.93 0 0 0-2.499 4.822 4.928 4.928 0 0 0 3.446 4.194l2.472.766-1.55 2.072a4.928 4.928 0 0 0 4.53 7.85l2.567-.306-.574 2.523a4.922 4.922 0 0 0 1.908 5.082 4.915 4.915 0 0 0 5.421.245l2.222-1.326.501 2.54a4.922 4.922 0 0 0 3.808 3.868 4.933 4.933 0 0 0 5.052-1.984l1.494-2.115z" data-color="1"></path>
                <path d="M79.476 105.126a1.825 1.825 0 0 1 0-3.65 4.466 4.466 0 0 0 4.459-4.463c0-.672-.151-1.325-.45-1.942l-1.653-3.414 3.697.839a4.517 4.517 0 0 0 2.844-.238c1.534-.642 2.69-1.991 3.013-3.518a4.811 4.811 0 0 0-.204-2.704l-.952-2.58 3.086.145c.238 0 .472-.009.704-.031 1.987-.184 3.458-1.456 3.941-3.403.39-1.571.077-3.908-2.089-5.325-3.526-2.309-5.469-5.23-5.623-8.447a1.825 1.825 0 1 1 3.644-.174c.095 2.029 1.433 3.902 3.975 5.566 3.099 2.027 4.526 5.661 3.633 9.259-.799 3.219-3.211 5.482-6.382 6.054.06.796.006 1.597-.165 2.399-.577 2.721-2.51 5.012-5.173 6.127a8.277 8.277 0 0 1-2.237.592c.026.264.038.53.038.797 0 4.471-3.637 8.111-8.106 8.111z" data-color="1"></path>
                <path d="M93.316 87.25c-.202 0-.407-.034-.608-.105-.272-.097-6.7-2.441-9.151-9.371a1.824 1.824 0 1 1 3.439-1.218c1.876 5.306 6.877 7.129 6.928 7.147a1.826 1.826 0 0 1-.608 3.547z" data-color="1"></path>
                <path d="M104.089 83.13c-1.57 0-3.211-.279-4.917-.838a1.825 1.825 0 0 1 1.137-3.468c2.915.956 5.518.855 7.742-.296 4.291-2.222 6.008-7.649 6.025-7.703a1.826 1.826 0 0 1 2.277-1.209 1.822 1.822 0 0 1 1.212 2.272c-.085.282-2.153 6.921-7.811 9.868a12.12 12.12 0 0 1-5.665 1.374z" data-color="1"></path>
                <path d="M97.455 119.265a1.822 1.822 0 0 1-1.712-1.198c-2.428-6.625.554-12.393 2.549-15.242 1.228-1.757 2.698-3.166 4.368-4.185 5.689-3.474 11.701-2.108 14.728-1.013 2.405-5.884 7.891-7.227 10.684-7.05a1.826 1.826 0 0 1 1.711 1.932c-.061 1.002-.888 1.784-1.92 1.711-.604-.024-6.014-.093-7.585 6.302l-.561 2.285-2.071-1.112c-.066-.034-7.032-3.64-13.084.061-1.238.756-2.342 1.82-3.281 3.163-1.938 2.768-3.877 7.077-2.111 11.892a1.826 1.826 0 0 1-1.715 2.454z" data-color="1"></path>
                <path d="M109.09 100.169a1.825 1.825 0 0 1-1.822-1.78c-.41-16.617 16.508-19.921 16.679-19.953a1.817 1.817 0 0 1 2.123 1.465 1.824 1.824 0 0 1-1.462 2.124c-.604.115-14.026 2.816-13.692 16.274a1.826 1.826 0 0 1-1.778 1.869l-.048.001z" data-color="1"></path>
                <path d="M76.095 117.329a1.824 1.824 0 0 1-1.419-2.966c.091-.113 9.22-11.197 22.995-6.418a1.824 1.824 0 0 1-1.194 3.448c-11.306-3.926-18.657 4.886-18.964 5.263a1.827 1.827 0 0 1-1.418.673z" data-color="1"></path>
                <path d="M110.415 124.632c-.353 0-.709-.102-1.023-.315-.187-.127-4.569-3.171-4.59-9.081a7.71 7.71 0 0 1 3.945-6.75c2.386-1.337 5.187-1.284 7.488.141.855.529 1.178 1.687.651 2.543-.524.858-1.59 1.165-2.446.637l-.135-.085c-1.165-.72-2.546-.741-3.777-.052a4.01 4.01 0 0 0-2.079 3.553c.014 4.005 2.962 6.054 2.992 6.074a1.826 1.826 0 0 1-1.026 3.335z" data-color="1"></path>
                <path d="M101.148 104.025a1.824 1.824 0 0 1-1.815-1.669c-.658-7.698-7.492-8.503-7.783-8.534a1.828 1.828 0 0 1-1.628-1.996c.1-.999.965-1.727 1.98-1.637 3.505.33 10.327 3.233 11.064 11.856a1.824 1.824 0 0 1-1.661 1.974c-.053.003-.106.006-.157.006z" data-color="1"></path>
                <path d="M85.124 96.101c-.261 0-.524-.056-.776-.175-.171-.081-4.21-2.012-7.009-5.494a1.823 1.823 0 1 1 2.841-2.288c2.279 2.836 5.69 4.465 5.724 4.481.91.43 1.301 1.518.872 2.429a1.827 1.827 0 0 1-1.652 1.047z" data-color="1"></path>
                <path d="M99.89 37.92a1.825 1.825 0 0 1-1.824-1.825v-14.27a1.824 1.824 0 1 1 3.648 0v14.27a1.825 1.825 0 0 1-1.824 1.825z" data-color="1"></path>
                <path d="M80.365 41.365c-.745 0-1.445-.46-1.714-1.201l-5.246-14.421a1.823 1.823 0 1 1 3.428-1.248l5.246 14.421a1.825 1.825 0 0 1-1.714 2.449z" data-color="1"></path>
                <path d="M62.083 50.173a1.823 1.823 0 0 1-1.399-.652l-9.597-11.446a1.825 1.825 0 0 1 .225-2.57 1.823 1.823 0 0 1 2.57.225l9.597 11.446a1.825 1.825 0 0 1-1.396 2.997z" data-color="1"></path>
                <path d="M50.405 62.351c-.309 0-.623-.078-.91-.244L35.912 54.26a1.824 1.824 0 1 1 1.824-3.161l13.583 7.847a1.827 1.827 0 0 1 .668 2.493 1.826 1.826 0 0 1-1.582.912z" data-color="1"></path>
                <path d="M151.552 65.37a1.825 1.825 0 0 1-.913-3.405l11.625-6.716a1.823 1.823 0 0 1 2.492.668 1.827 1.827 0 0 1-.668 2.493l-11.625 6.716a1.819 1.819 0 0 1-.911.244z" data-color="1"></path>
                <path d="M138.875 51.435a1.827 1.827 0 0 1-1.396-2.998l9.303-11.094a1.823 1.823 0 0 1 2.57-.225c.771.648.872 1.798.225 2.571l-9.303 11.094a1.817 1.817 0 0 1-1.399.652z" data-color="1"></path>
                <path d="M119.415 42.477a1.825 1.825 0 0 1-1.714-2.449l5.214-14.336a1.823 1.823 0 1 1 3.428 1.248l-5.214 14.336a1.825 1.825 0 0 1-1.714 1.201z" data-color="1"></path>
            </g>
        </svg>
    )
}