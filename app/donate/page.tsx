import { Metadata } from "next";
import Banner from "@/components/banner";
import { DonationForm } from "@/components/donate/donate-form";
import Link from "next/link";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const metadata: Metadata = {
    title: 'Donate',
    description: 'As a 501(c)(3) non-profit, Financedu relies on your donations to provide financial education for youth, free of cost. Make a tax-deductible donation today!'
}

export default function DonatePage() {
    return (
        <main>
            <Banner title="Donate" className="bg-gradient-to-tr from-primary to-chart-4" />
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2 flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
                    <h1 className="text-3xl font-bold">Support Us</h1>
                    <p className="text-lg text-muted-foreground">
                        We are a 501(c)(3) non-profit and rely on your donations to fulfill our mission. All of your contributions to our organization are tax-deductible.
                    </p>
                    <p className="text-lg text-muted-foreground">
                        Interested in sponsoring? We&apos;d love to hear from you! Please <Link href="/policy#contact" className="text-primary underline">contact us</Link>.
                    </p>
                </div>
                <div className="w-full md:w-1/2 flex justify-center items-center bg-muted/60 p-4 md:p-8">
                    <div className="w-full md:max-w-sm">
                        <DonationForm />
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row-reverse items-center justify-between p-4 md:p-8 gap-4">
                <PiggyBank />
                <div className="md:w-2/3 mt-4 md:mt-0 z-10 space-y-3">
                    <h3 className="text-2xl md:text-3xl font-bold">Give the Gift that Keeps Giving Back</h3>
                    <p className="text-lg text-muted-foreground"> Financial education is the gift that keeps giving back. The knowledge and skills instilled by our program empowers youth for lifelong success!</p>
                </div>
            </div>
            <div className="flex flex-col py-6 md:py-0">
                <div className="flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-between">
                    <div className="md:w-1/3 flex justify-center items-center">
                        <div className="h-24 md:h-32 fill-secondary">
                            <HostingIllustration />
                        </div>
                    </div>
                    <div className="md:w-2/3 flex items-center justify-center md:bg-muted/60 py-6 md:pt-12 md:pb-8 px-4">
                        <div className="md:w-4/5">
                            <h1 className="text-2xl font-bold mb-4">Hosting</h1>
                            <p className="text-lg text-muted-foreground">Financedu needs robust, but costly cloud hosting to keep us online for the students, teachers, and parents we serve.</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-between">
                    <div className="md:w-1/3 flex justify-center items-center">
                        <div className="h-24 md:h-32 fill-secondary">
                            <TechSupportIllustration />
                        </div>
                    </div>
                    <div className="md:w-2/3 flex items-center justify-center md:bg-muted/60 py-6 md:pt-12 md:pb-8 px-4">
                        <div className="md:w-4/5">
                            <h1 className="text-2xl font-bold mb-4">Maintenance & Tech Support</h1>
                            <p className="text-lg text-muted-foreground">Your donations are essential in keeping our users supported and platform bug-free.</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-between">
                    <div className="md:w-1/3 flex justify-center items-center">
                        <div className="h-20 md:h-28 fill-secondary">
                            <RocketIllustration />
                        </div>
                    </div>
                    <div className="md:w-2/3 flex items-center justify-center md:bg-muted/60 py-6 md:pt-12 md:pb-8 px-4">
                        <div className="md:w-4/5">
                            <h1 className="text-2xl font-bold mb-4">Future Improvements</h1>
                            <p className="text-lg text-muted-foreground">Help us continue to develop new features and content, such as <strong><i>an offline-compatible app, a course for middle school students,</i></strong> and <strong><i>lessons on more topics.</i></strong></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-2">
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible>
                    <AccordionItem value="1">
                        <AccordionTrigger>Which Methods of Payment do you accept?</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            Online donations are processed via Stripe, which accepts Credit Cards. If you would like to donate using a different method, please <Link href="/policy#contact" className="text-primary underline">contact us</Link>.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="2">
                        <AccordionTrigger>Are My Donations Tax-Deductible?</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            As a 501(c)(3) non-profit in the United States, are donations are tax-deductible in accordance to the law. Our tax identification number/EIN is <strong>92-3500587 .</strong>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="3">
                        <AccordionTrigger>What is your Tax ID number?</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            Our tax identification number/EIN is <strong>92-3500587.</strong>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="4">
                        <AccordionTrigger>Where can I manage, update or cancel my recurring donation?</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            To manage, update or cancel your recurring donation, please <Link href="/policy#contact" className="text-primary underline">contact us</Link>.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="5">
                        <AccordionTrigger>Can I sponsor Financedu?</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            Yes! Please <Link href="/policy#contact" className="text-primary underline">contact us</Link> for more information.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </main>
    );
}


function PiggyBank() {
    return (
        <div data-testid="mesh-container-content" className='size-[140px] md:size-[200px]'>
            <svg preserveAspectRatio="xMidYMid meet" data-bbox="35.984 19.006 128.053 162.015" viewBox="35.984 19.006 128.053 162.015" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" data-type="color" role="presentation" aria-hidden="true">
                <g>
                    <path d="M160.7 118.226c5.879 25.68-17.067 52.842-51.252 60.67s-66.665-6.644-72.545-32.324 17.066-52.842 51.251-60.67 66.665 6.644 72.545 32.324z" data-color="1" className='fill-muted'></path>
                    <path d="M48 143.9l12.1 1.5 10.6-5 15 7.7.5 15.4L94 169l11.8-1.3 5.5-5.6v-12.6l3.6-3.4 23.2-10.1 7.9 1.2 8.8-5.1-.5-5.2 7.6-12.5-.9-11.6-7.1-8.8-2.8-13.3L143 65l3.2-21.2-6.2-5.1-7.8 3.2-7.4 6.6-3.9-.3-16.3-3.9-14-1-11.6 1-19.4 8.4-5.9 6.1-8.9 1-3.4 5.4 3.7 7.9-2.7 16.7 2.2 19.2 5.6 12.8-.7 7.1-3.7 10.8 2.2 4.2z" data-color="2" className='fill-white'></path>
                    <path d="M106.2 65.2c-3.9-5-11.2-4.8-14.9-3.4-3.8 1.4-12.6 5.9-13 17.2-.3 8.2 3.7 13.3 5.4 15.2.9 1 2.8 2.6 4.5 2.6 1.4 0 2.6-.5 3.4-1.5 1.1-1.2 1.5-2.9 1.2-5.2-.2-2.1 0-4.2.7-6.4.5-1.5 1.3-3 2.1-4.6 2-2.9 5.2-5.3 6.7-6.5.2-.2.4-.3.6-.5.1-.1.3-.2.5-.4 1.3-1 3.1-2.4 3.4-4.2.2-.7-.1-1.6-.6-2.3zm-24.1 14c.3-8.2 6-11.9 9.8-13.5-3.1 2.7-5.2 7.1-5.8 12.4-.5 4.2.7 11.4 2.2 14.9-1.3-.6-6.5-5.5-6.2-13.8z" data-color="3" className='fill-primary'></path>
                    <path d="M44.9 73.6c-2.2-.5-4.1-2.5-4.8-5-.8-3 0-6.2 2.4-8.6 4.7-4.7 10.6-2.7 10.9-2.6L52.1 61l.6-1.8-.6 1.8c-.2-.1-3.9-1.3-6.9 1.7-1.9 1.9-1.6 4-1.4 4.8.3 1.2 1.1 2.1 2 2.3l-.9 3.8z" data-color="3" className='fill-primary'></path>
                    <path d="M160.4 121.3c5.3-7.5 4.7-18.8-1.1-25-.1-.2-.3-.4-.5-.5-.1-.1-.2-.1-.2-.2l-.3-.3c-.9-.8-1.7-1.5-2.5-2.1-.3-3.3-2-15.8-11.1-29.2 0 0-.1-.2-.2-.6.8-3.1 4.2-16.3 2.5-21.3-.1-.4-.3-.9-.5-1.2-.9-1.7-2.4-2.8-4.4-3.2-4.5-.9-10 1.9-13.3 4.7-3 2.6-4.1 3.6-4.6 4.1-.2.2-.3.3-.5.4-.2.1-.4.3-.9 0-.2-.1-21.2-10.9-49.3-2.4-13.3 4-23.2 12.4-28.6 24.3-4.8 10.6-5.7 23.6-2.6 36.5 1.7 7 4.6 13.5 7.3 18.3-.8 2.1-3.6 9.3-4.1 10.9l-.2.4c-.8 2.2-3.2 8.7 2.1 10.7 2.5.9 5.9 1.6 9.3 1.6 2.1 0 4.2-.3 6.1-1 3.2-1.2 5.6-3.2 6.7-4.4 3.4 2.1 8.3 4.9 14 6.9.9.4 1.1.8 1.1 1.9 0 .6-.1 2.3-.1 4.1-.1 3.7-.2 6.2-.1 7 .4 4.9 3.7 8.2 9.5 9.1 1.4.2 2.8.3 4.1.3 6.4 0 12.2-2.4 14.2-6.3 1.7-3.3 1.5-6 1.2-9.3-.1-1.2-.2-2.3-.2-3.7-.1-3.2.9-3.5 2.8-4l.9-.3c1.7-.6 11.5-4.4 19.2-9.2.9.1 3.5.4 6.4.4 3 0 6.4-.3 8.9-1.5 4.4-2 6.2-4.4 5.7-7.3-.1-.8-.8-2.2-1.3-3.3 1.5-1.4 3.1-3.2 4.6-5.3zm-44.9 22.6c-.2.1-.5.2-.7.2-2.1.6-5.7 1.6-5.6 7.8 0 1.5.1 2.8.2 3.9.2 3 .4 4.9-.8 7.2-1.4 2.8-7.3 5.1-14.2 4-5.9-.9-6.1-4.4-6.2-5.6 0-.6.1-4.2.2-6.5.1-1.9.1-3.5.1-4.2 0-1.7-.4-4.1-3.4-5.4 0 0-.1 0-.1-.1-9.7-3.4-17.6-9.4-17.6-9.5-.8-.6-2.1-.5-2.7.4-.6.8-.5 2.1.4 2.7.1.1.6.4 1.3 1-1 .9-2.7 2.2-4.8 3-3.7 1.4-9 .7-12.7-.7-1.2-.4-1.1-2.2.2-5.8l.2-.5c.4-1.1 1.9-5.1 3.1-8.1 1.2 1.7 2.2 3.1 3 3.8.4.4.9.6 1.4.6s1-.2 1.4-.6c.8-.8.8-2 0-2.7-2-2-8.8-11.9-11.9-24.4-5.4-22.1 1.4-48.1 28.6-56.2 2.8-.9 5.6-1.5 8.3-2h.1c3 .7 12.8 3.1 20.7 8.4.1.1.3.1.5 0l2.3-1.9c.2-.2.2-.5 0-.6-1.7-1-7.8-4.7-15.8-6.9 18.2-1.3 30.4 5 30.5 5.1 1.8 1 3.6.8 5.2-.4.2-.2.3-.3.7-.6.5-.5 1.6-1.5 4.6-4.1 1.9-1.7 4.3-2.9 6.5-3.5-.3.2-.6.4-.8.6-6.6 4.9-9.8 13.7-10 14.1-.3.8 0 1.6.6 2.1s1.5.6 2.2.1c0 0 1.8-1.1 4.2-.9 3.2.2 5.8 2.6 6.6 6.1 0 .1.1.1.1.2.2 1.1.7 1.9.8 2 6.3 9.3 8.9 18.2 9.9 23.4-1.5-1.2-2.3-1.8-2.4-1.8-.9-.6-2.1-.4-2.7.5-.6.9-.4 2.1.5 2.7 0 0 1.5 1.1 4.1 3.2-3.8.7-12.3 3.9-17.3 19.4-2.4 7.5-2 12.3-.9 15.1-1.9-.4-3.8-.9-5.6-1.4-1-.3-2.1.3-2.4 1.4-.3 1 .3 2.1 1.4 2.4 1.9.5 6.6 1.7 10.5 2.5-8.2 5.2-20.1 10-21.8 10.5zm34-10c-2.2 1-5.7 1.2-8.7 1.1.4-.3.7-.6 1.1-.9h.2c2.1-.2 6.2-1.8 10.4-4.8.3.7.5 1.3.6 1.5 0 .3.2 1.3-3.6 3.1zm-7.9-3.7c-.5.1-1.8-.1-3.5-.4-.7-.5-4.6-3.6-.9-15.1 5.4-16.6 14.7-16.9 15.4-16.9 1.1 0 2.5.3 3.5.8 4.4 4.4 5.9 13.9 1.2 20.6-5.1 7.1-13.2 10.7-15.7 11z" data-color="3" className='fill-primary'></path>
                    <path d="M127.393 89.202c.121 1.209-.67 2.278-1.77 2.388s-2.089-.78-2.21-1.989.67-2.278 1.77-2.389 2.089.78 2.21 1.99z" data-color="3" className='fill-primary'></path>
                    <path d="M143.458 78.256c.293 1.179-.077 2.286-.827 2.473-.75.187-1.597-.617-1.89-1.796-.294-1.18.076-2.287.827-2.474.75-.186 1.596.618 1.89 1.797z" data-color="3" className='fill-primary'></path>
                    <path d="M147.2 116.7c0-4.6-.1-9.5-2.6-8.3-1.3.6-2.6 3.7-2.6 8.3 0 4.6.5 9.4 2.6 8.3 1.2-.6 2.6-3.7 2.6-8.3z" data-color="3" className='fill-primary'></path>
                    <path d="M155.7 109.9c0-4.1-.1-8.5-2.3-7.4-1.1.6-2.3 3.3-2.3 7.4s.4 8.4 2.3 7.4c1.2-.6 2.3-3.3 2.3-7.4z" data-color="3" className='fill-primary'></path>
                    <path d="M110 39.2c.6-9-5.2-17.9-12.8-19.8-2.3-.6-4.5-.5-6.5.2l-3.2 1.1.9-.3c-5.1 1.2-9 6.1-9.4 12.8-.3 4.7 1.1 9.4 3.7 13.1 1.4.3 2.7.6 4.2 1.1 4.3 1.2 9.2 3.1 12.8 5l1.8-.6c4.6-1.6 8.1-6.3 8.5-12.6z" data-color="1" className='fill-secondary'></path>
                </g>
            </svg>
        </div>
    )
}

function HostingIllustration() {
    return (
        <svg preserveAspectRatio="xMidYMid meet" data-bbox="2 2 20 19" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="100%" width="100%" data-type="ugc" role="presentation" aria-hidden="true" aria-label="">
            <g>
                <path stroke-linecap="round" stroke-width="1.25" stroke="#FEC178" d="M13 21H6c-1.886 0-2.828 0-3.414-.586S2 18.886 2 17s0-2.828.586-3.414S4.114 13 6 13h12c1.886 0 2.828 0 3.414.586S22 15.114 22 17s0 2.828-.586 3.414S19.886 21 18 21h-1" fill="none"></path>
                <path stroke-linecap="round" stroke-width="1.25" stroke="#FEC178" d="M11 2h7c1.886 0 2.828 0 3.414.586S22 4.114 22 6s0 2.828-.586 3.414S19.886 10 18 10H6c-1.886 0-2.828 0-3.414-.586S2 7.886 2 6s0-2.828.586-3.414S4.114 2 6 2h1" fill="none"></path>
                <path stroke-linecap="round" stroke-width="1.25" stroke="#FEC178" d="M11 6h7" fill="none"></path>
                <path stroke-linecap="round" stroke-width="1.25" stroke="#FEC178" d="M6 6h2" fill="none"></path>
                <path stroke-linecap="round" stroke-width="1.25" stroke="#FEC178" d="M11 17h7" fill="none"></path>
                <path stroke-linecap="round" stroke-width="1.25" stroke="#FEC178" d="M6 17h2" fill="none"></path>
            </g>
        </svg>
    );
}

function TechSupportIllustration() {
    return (
        <svg preserveAspectRatio="xMidYMid meet" data-bbox="7.5 0 377 391.999" viewBox="7.5 0 377 391.999" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" data-type="color" role="presentation" aria-hidden="true" aria-label="">
            <g>
                <path d="M142.311 89.495c2.175 4.469.412 9.856-4.058 12.031C92.025 124.025 63.5 169.919 63.5 221.298v36.332c0 4.971-4.415 9.371-9.386 9.371h-18.76C20.045 267 7.5 254.176 7.5 238.869v-41.042c0-12.095 7.786-22.717 19.325-26.432 4.729-1.522 9.836 1.078 11.359 5.809s-1.101 9.802-5.832 11.325c-4.008 1.291-6.852 5.114-6.852 9.298v41.042c0 5.382 4.471 10.131 9.854 10.131H45.5v-27.702c0-28.889 7.988-56.972 23.464-81.214 15.06-23.589 36.102-42.519 61.219-54.743 4.472-2.175 9.952-.316 12.128 4.154M384.5 197.827v41.042c0 15.307-12.045 28.131-27.353 28.131h-16.621c-5.46 17-14.122 33.477-25.788 48.188-19.169 24.173-45.546 41.749-74.88 50.601-1.319 14.807-13.792 26.21-28.933 26.21h-29.35c-16.017 0-29.047-12.982-29.047-28.999 0-16.02 13.03-29.001 29.047-29.001h29.35c10.542 0 19.791 5.837 24.882 14.264 55.474-17.165 93.579-68.2 93.579-126.966 0-13.307-1.934-26.329-5.761-38.862-17.421 13.779-39.419 22.015-63.304 22.015-49.121 0-90.261-34.832-100.021-81.092l-.061-.27a102.8 102.8 0 0 1-2.134-20.856c0-17.125 4.234-33.282 11.708-47.476q.148-.34.322-.669c14.619-27.331 40.46-46.183 70.106-52.1C246.594.718 253.152 0 259.863 0h.917c6.671 0 13.19.71 19.504 1.965 29.694 5.891 55.586 24.762 70.223 52.128q.173.324.317.658c7.478 14.196 11.714 30.359 11.714 47.488a103 103 0 0 1-2.133 20.87c-.021.103-.045.228-.069.33-3.598 17.026-11.447 32.549-22.38 45.31 6.26 16.819 9.43 34.594 9.43 52.734 0 9.278-.819 18.517-2.434 27.517h12.194c5.383 0 9.353-4.749 9.353-10.131v-41.042c0-4.185-2.645-8.008-6.653-9.298-4.73-1.523-7.178-6.594-5.654-11.325 1.522-4.731 6.491-7.331 11.223-5.809 11.538 3.714 19.085 14.337 19.085 26.432M221.974 363.146c0-.734-.072-1.258-.209-1.952-.024-.106-.047-.309-.067-.415-1.123-4.912-5.526-8.779-10.771-8.779h-29.35c-6.091 0-11.047 4.906-11.047 10.998 0 6.095 4.956 11.002 11.047 11.002h29.35c6.091 0 11.047-4.762 11.047-10.854m82.631-284.939a243 243 0 0 1 1.174 24.027c0 8.349-.414 16.551-1.217 24.457 13.817-2.665 26.936-6.598 39.018-11.732a85 85 0 0 0 .959-12.725c0-11.559-2.339-22.577-6.571-32.613-10.593 3.649-21.783 6.523-33.363 8.586m-14.449-54.733c1.535 2.933 2.981 6.125 4.327 9.567 3.171 8.109 5.723 17.347 7.593 27.336 9.328-1.689 18.365-3.948 26.982-6.754-9.614-13.556-23.13-24.156-38.902-30.149m-53.754 39.401c15.713 1.575 32.129 1.576 47.84 0-1.641-8.538-3.831-16.396-6.522-23.278-6.229-15.929-13.266-21.581-17.397-21.581s-11.168 5.652-17.397 21.581c-2.693 6.882-4.883 14.74-6.524 23.278m-59.235 52.083c12.081 5.134 25.101 9.067 38.918 11.732a243 243 0 0 1-1.214-24.457c0-8.198.406-16.254 1.18-24.027-11.579-2.063-22.756-4.937-33.35-8.586-4.229 10.034-6.545 21.057-6.545 32.613 0 1.899.114 3.797.24 5.688.001.011.104.022.104.034v.018c0 2.358.317 4.683.667 6.985m53.321 66.035c-1.535-2.933-2.98-6.125-4.327-9.567-3.025-7.736-5.486-16.5-7.33-25.963-12.294-2.036-24.148-4.986-35.367-8.81 9.136 20.318 26.097 36.388 47.024 44.34m0-157.519c-15.771 5.993-29.287 16.594-38.902 30.15 8.617 2.806 17.654 5.064 26.983 6.753 1.869-9.99 4.421-19.228 7.592-27.336 1.347-3.442 2.792-6.634 4.327-9.567m52.427 124.366a263.5 263.5 0 0 1-45.186 0c1.436 6.143 3.174 11.862 5.195 17.03 6.229 15.929 13.266 21.581 17.397 21.581s11.168-5.652 17.397-21.581c2.023-5.168 3.761-10.887 5.197-17.03m4.864-45.607c0-7.365-.342-14.581-1.007-21.526-17.387 1.797-35.514 1.797-52.9 0a226 226 0 0 0-1.007 21.526c0 9.397.557 18.55 1.63 27.209 8.438.909 17.071 1.371 25.827 1.371s17.389-.461 25.827-1.371c1.074-8.658 1.63-17.811 1.63-27.209m49.403 34.42c-11.222 3.825-23.072 6.774-35.368 8.81-1.844 9.463-4.305 18.228-7.33 25.963-1.346 3.442-2.792 6.634-4.327 9.567 20.927-7.952 37.889-24.022 47.025-44.34" fill="#FEC178" stroke-width="1" data-color="1"></path>
            </g>
        </svg>
    );
}

function RocketIllustration() {
    return (
        <svg preserveAspectRatio="xMidYMid meet" data-bbox="1.251 1.25 21.5 21.5" xmlns="http://www.w3.org/2000/svg" viewBox="1.251 1.25 21.5 21.5" height="100%" width="100%" data-type="color" role="presentation" aria-hidden="true" aria-label="">
            <g>
                <path fill="#FEC178" d="m7.58 15.008.53-.531zm0-5.477L7.05 9zm6.867 6.846.53.531zm-5.494 0-.53.531zm2.747 1.936v.75zm8.594-7.765-.53-.531zm-5.355-9.02a.75.75 0 0 0 .572 1.386zM7.737 15.16a.75.75 0 1 0 1.06 1.062zm3.12-.991a.75.75 0 1 0-1.06-1.063zm1.362 4.049.26.704zm-6.47-6.512-.695-.28zm7.28-6.55a.75.75 0 1 0-1.058-1.063zm6.735 4.86-5.847 5.829 1.06 1.062 5.846-5.83zm-10.281 5.83-1.374-1.37L7.05 15.54l1.374 1.37zM17.547 2.75h.569v-1.5h-.57zm3.703 3.123v.567h1.5v-.567zM18.116 2.75c.936 0 1.564.002 2.031.064.446.06.633.163.755.284l1.059-1.062c-.447-.446-1.003-.626-1.614-.708-.59-.08-1.337-.078-2.231-.078zm4.634 3.123c0-.892.002-1.636-.078-2.225-.082-.611-.264-1.166-.711-1.612L20.9 3.098c.122.121.225.307.285.75.063.466.064 1.09.064 2.025zM8.11 14.477c-.663-.66-1.105-1.104-1.391-1.478-.273-.356-.331-.56-.331-.73h-1.5c0 .632.265 1.152.64 1.642.361.472.89.997 1.522 1.628zm.314 2.431c.632.63 1.159 1.158 1.632 1.518.492.374 1.013.637 1.644.637v-1.5c-.173 0-.378-.059-.735-.33-.375-.286-.82-.727-1.482-1.387zm12.4-5.83c.798-.795 1.354-1.332 1.647-2.036l-1.385-.575c-.151.364-.436.667-1.322 1.55zm.426-4.638c0 1.249-.013 1.663-.164 2.027l1.385.575c.292-.704.28-1.476.28-2.602zm-3.703-5.19c-1.13 0-1.903-.013-2.608.278l.572 1.386c.366-.15.784-.164 2.036-.164zm-8.75 14.973 2.06-2.053-1.06-1.063-2.06 2.054zm5.12-.377c-.511.51-.896.893-1.226 1.178-.332.287-.556.426-.731.491l.518 1.408c.428-.158.814-.436 1.193-.764s.808-.755 1.305-1.25zm-1.957 1.669a.7.7 0 0 1-.26.048v1.5q.404-.001.778-.14zM7.05 9c-.485.484-.904.901-1.23 1.272-.324.37-.6.745-.766 1.156l1.392.56c.07-.177.216-.4.502-.727.285-.325.663-.702 1.161-1.2zm-1.996 2.428a2.2 2.2 0 0 0-.166.841h1.5c0-.09.016-.179.058-.282zm3.055-1.366 4.92-4.906-1.058-1.062L7.05 9z" data-color="1"></path>
                <path fill="#FEC178" d="m5.573 11.532.53-.53V11zm4.347-4.11a.75.75 0 1 0 .811-1.261zm-.224-1.035.406-.63zm-2.57-1.319.11-.742zm-4.9 2.956.529.53zm3.113-2.727.288.692zm-2.476 4.13-.276.697zm-.162.742a.75.75 0 0 0 .571-1.387zm-.217-.893.277-.697zm2.735 2.962a.75.75 0 0 0 1.06-1.06zm.403-1.716a.75.75 0 1 0-1.059 1.062zm5.11-4.361-.63-.405-.812 1.261.63.405zm-.63-.405c-.621-.4-1.123-.723-1.554-.956-.442-.238-.855-.406-1.312-.474L7.017 5.81c.22.033.46.117.819.31.368.2.814.485 1.454.897zM2.755 8.555a57 57 0 0 1 1.71-1.659c.27-.247.518-.46.73-.623.223-.172.365-.256.432-.284l-.575-1.385c-.257.107-.527.291-.773.481-.258.2-.54.442-.826.703-.572.522-1.2 1.149-1.757 1.705zm4.481-4.229a4.13 4.13 0 0 0-2.184.278l.575 1.385a2.63 2.63 0 0 1 1.39-.179zM2.208 9.974l.379.15.552-1.395-.378-.15zm.379.15.114.045.571-1.387-.133-.053zm-.891-2.631a1.514 1.514 0 0 0 .512 2.48l.553-1.394-.007-.003-.003-.008V8.56l.004-.005zm3.347 4.569.176.176 1.06-1.06L6.105 11zm-.48-.478.48.479L6.104 11l-.48-.48z" data-color="1"></path>
                <path fill="#FEC178" d="m12.5 18.5-.53.53.035.034zm5.323-5.268a.75.75 0 0 0-1.259.815zm-.223 1.035-.63.408zm1.322 2.562.742-.11zm-2.964 4.887-.53-.531zm2.735-3.105-.692-.29zm-3.248 2.686a.75.75 0 1 0-1.393.555zm-2.917-1.774a.75.75 0 1 0 .989-1.128zm3.346 2.276.53.532zm-3.125-4.11a.75.75 0 0 0-1.061 1.06zm3.815-3.642.406.628 1.26-.816-.407-.627zm-1.135 7.138-.085.083 1.06 1.063.084-.084zm1.541-6.51c.414.638.7 1.082.9 1.45.194.357.278.596.31.814l1.484-.22c-.068-.457-.237-.87-.476-1.31-.233-.43-.557-.93-.958-1.55zm-.482 7.572c.557-.556 1.186-1.183 1.71-1.753.261-.285.505-.565.704-.822.19-.246.376-.515.483-.772l-1.384-.578a2.3 2.3 0 0 1-.284.43 12 12 0 0 1-.625.728c-.497.541-1.1 1.143-1.663 1.705zm1.693-5.308c.067.456.007.934-.18 1.383l1.384.578c.29-.693.388-1.448.28-2.181zm-4.664 1.456-.523-.459-.989 1.128.523.459zm1.828 2.873a.1.1 0 0 1 .028-.016l.022-.001.024.012q.018.016.026.034l-1.393.555c.384.964 1.632 1.196 2.352.479zM13.03 17.97l-.281-.281-1.061 1.06.281.282z" data-color="1"></path>
                <path fill="#FEC178" d="M13.917 10.629a.75.75 0 1 0 1.06-1.063zm2.747-1.063a.75.75 0 0 0 1.059 1.063zm1.059-2.738a2.696 2.696 0 0 0-3.806 0l1.06 1.062a1.196 1.196 0 0 1 1.687 0zm-3.806 0a2.68 2.68 0 0 0 0 3.8l1.06-1.062a1.18 1.18 0 0 1 0-1.676zm3.806 3.8a2.68 2.68 0 0 0 0-3.8l-1.06 1.062a1.18 1.18 0 0 1 0 1.676z" data-color="1"></path>
            </g>
        </svg>
    );
}