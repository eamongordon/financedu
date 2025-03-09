import type { Metadata } from 'next'
import Link from 'next/link'
import AnchorMenu from '@/components/policy/anchormenu'

export const metadata: Metadata = {
    title: 'Policy | Financedu',
    description: 'View our site policy, including copyright policy, terms of use, cookie policy, and privacy policy.',
    openGraph: {
        images: ['/Fluorite-164_horiz-Optimized.jpg'],
        siteName: 'Financedu',
        url: '/policy'
    }
}

const Page = async () => {
    return (
        <div className='flex flex-col max-w-screen-xl mx-auto'>
            <section className='py-12'>
                <h1 className="text-center font-semibold text-3xl sm:text-4xl">Site Policy</h1>
            </section>
            <div className='flex flex-row'>
                <main className="w-full sm:w-3/4 sm:flex-grow pr-8 pl-8 lg:pl-12 pb-8">
                    <section className='flex-col justify-center items-center pb-4 w-full max-w-screen-xl'>
                        <div>
                            <p>Thank you for reviewing our site policy. We seek to provide an understandable and transparent site policy and if there are any clarifications or inquries necessary, please <Link className="font-semibold text-primary" href="#contact">contact us</Link>.</p>
                        </div>
                    </section>
                    <section className='flex-col space-y-10 justify-center items-center py-4 w-full max-w-screen-xl'>
                        <div className="flex-col space-y-3">
                            <h2 className="text-3xl font-semibold scroll-mt-16" id="copyright">Copyright Policy</h2>
                            <p>
                                No portion of this site can be reproduced, distributed, replicated, modified or used as a source of derivative works without our written permission. To receive permission for the use of website content and images, please <Link className="font-semibold text-primary" href="#contact">contact us</Link>.
                                <br />
                                <br />
                                The Financedu logo may be used solely and only for promoting this website.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-semibold scroll-mt-16" id="termsofuse">Terms of Use</h2>
                            <p>Financedu is not liable for any damages incurred by the use of this site. When creating an account (signing up for a membership), we, Financedu, collect your email address, which may then be used for email updates or campaigns. If you would like to remove this information, please delete your account by visiting the <Link className="font-semibold text-primary" href="/account/settings#new-password">account settings page</Link>.
                                <br />
                                <br />
                                Members, registered by submission of &quot;Sign Up&quot; forms, must adhere to the Financedu terms of use. Failure to comply with these terms or abuse of this website or platform may result in membership suspension or account deletion at our sole discretion.
                            </p>
                        </div>
                        <div className="flex-col">
                            <h2 className="text-3xl font-semibold scroll-mt-16" id="privacy">Privacy Policy</h2>
                            <h3 className="text-2xl font-semibold my-2" id="collecteddata">Collected Data</h3>
                            <div className="flex-col space-y-6">
                                <div>
                                    <h4 className="text-xl font-semibold ">Account</h4>
                                    <p>When creating an account (&quot;signing up&quot; for a membership), we, Financedu, collect your email address, which may then be used for email updates or campaigns. If you would like to remove this information, please delete your account by visiting the <Link className="font-semibold text-primary" href="/account/settings#new-password">account settings page</Link>.</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold ">Third-Party Login Services</h4>
                                    <p>By using third-party login services (i.e. Google or Facebook) we may collect data including your email address, name, and phone number. See the <Link className="font-semibold text-primary" href="#datause" id="datause">Data Use section</Link> for information regarding the use of your data. Please note that the respective provider&apos;s terms of service and privacy policy apply.</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold ">Browser Cookies</h4>
                                    <p>
                                        By using this site, you consent to the use of our and third-party cookies and other similar technologies to enhance your browsing experience, store login, and language information, analyze your engagement with our content, and for other legitimate purposes.
                                        <br />
                                        <br />
                                        You may withdraw your consent at any time by deleting the website cookies through your browser.
                                    </p>
                                </div>
                            </div>
                            <h3 className="text-2xl font-semibold pt-6" id="datause">Data Use</h3>
                            <p>We may use your data for numerous legitimate purposes, including, but not limited to, the following:</p>
                            <div className="flex-col space-y-6 pt-4">
                                <div>
                                    <h4 className="text-xl font-semibold ">Account Management</h4>
                                    <p>Your email address, phone number, and other provided information may be used to assist with the management and login of your account.</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold ">Personalization & Customization</h4>
                                    <p>Your first name, last name, and IP address may be used in order to personalize your experience on our website and provide customization features.</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold ">Communication</h4>
                                    <p>We may communicate updates to our site content or policy via your email address provided upon subscription or account creation.</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold ">Analytics</h4>
                                    <p>We utilize trusted third-party tools such as Google Analytics in order to analyze your interaction with our content and website. Information collected may include IP address, geographic location, and browser data.</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-semibold " id="modifications">Modifications</h2>
                            <p>We reserve the right to modify this policy at any time, as a result, we recommend that it be reviewed regularly. Changes and clarifications will take effect immediately upon their posting on this website. If we make material changes to this policy, we will notify you that it has been updated through our email or our website.</p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-semibold scroll-mt-16" id="contact">Contact Us</h2>
                            <p>Have a suggestion for improving Financedu? Notice an error in our site? Need to contact us for another reason?
                                <br />
                                <br />
                                Contact Us at: <Link className="font-semibold text-primary" href="mailto:prospectorminerals@prospectorminerals.com">prospectorminerals@prospectorminerals.com</Link>.
                            </p>
                        </div>
                    </section>
                </main >
                <div className="hidden sm:block border-l border-gray-300 dark:border-gray-500"></div> {/* Divider */}
                <AnchorMenu />
            </div>
        </div>
    )
}

export default Page;