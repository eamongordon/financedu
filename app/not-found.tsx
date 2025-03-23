import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
    return (
        <main className='flex flex-col-reverse md:flex-row md:h-[calc(80vh-64px)]'>
            <div className='w-full md:w-1/2 flex flex-col justify-center items-start p-8 gap-8'>
                <h2 className='font-semibold text-3xl md:text-5xl'>Oops, look like this is the wrong path.</h2>
                <p className='text-lg'>Check the URL, or go back to the homepage and try again.</p>
                <Link href="/" className={buttonVariants()}>Back to Homepage</Link>
            </div>
            <div className='w-full md:w-1/2 bg-gradient-to-br from-[#00B5EA] to-[#02CF46] dark:brightness-[0.6] flex justify-center items-center p-8'>
                <p className='font-bold text-white text-9xl md:text-[150px]'>4</p>
                <PiggyBank />
                <p className='font-bold text-white text-9xl md:text-[150px]'>4</p>
            </div>
        </main >
    )
}

function PiggyBank() {
    return (
        <div data-testid="mesh-container-content" className='size-[140px] md:size-[200px]'>
            <svg preserveAspectRatio="xMidYMid meet" data-bbox="35.984 19.006 128.053 162.015" viewBox="35.984 19.006 128.053 162.015" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" data-type="color" role="presentation" aria-hidden="true">
                <g>
                    <path d="M160.7 118.226c5.879 25.68-17.067 52.842-51.252 60.67s-66.665-6.644-72.545-32.324 17.066-52.842 51.251-60.67 66.665 6.644 72.545 32.324z" data-color="1" className='fill-white'></path>
                    <path d="M48 143.9l12.1 1.5 10.6-5 15 7.7.5 15.4L94 169l11.8-1.3 5.5-5.6v-12.6l3.6-3.4 23.2-10.1 7.9 1.2 8.8-5.1-.5-5.2 7.6-12.5-.9-11.6-7.1-8.8-2.8-13.3L143 65l3.2-21.2-6.2-5.1-7.8 3.2-7.4 6.6-3.9-.3-16.3-3.9-14-1-11.6 1-19.4 8.4-5.9 6.1-8.9 1-3.4 5.4 3.7 7.9-2.7 16.7 2.2 19.2 5.6 12.8-.7 7.1-3.7 10.8 2.2 4.2z" data-color="2" className='fill-white'></path>
                    <path d="M106.2 65.2c-3.9-5-11.2-4.8-14.9-3.4-3.8 1.4-12.6 5.9-13 17.2-.3 8.2 3.7 13.3 5.4 15.2.9 1 2.8 2.6 4.5 2.6 1.4 0 2.6-.5 3.4-1.5 1.1-1.2 1.5-2.9 1.2-5.2-.2-2.1 0-4.2.7-6.4.5-1.5 1.3-3 2.1-4.6 2-2.9 5.2-5.3 6.7-6.5.2-.2.4-.3.6-.5.1-.1.3-.2.5-.4 1.3-1 3.1-2.4 3.4-4.2.2-.7-.1-1.6-.6-2.3zm-24.1 14c.3-8.2 6-11.9 9.8-13.5-3.1 2.7-5.2 7.1-5.8 12.4-.5 4.2.7 11.4 2.2 14.9-1.3-.6-6.5-5.5-6.2-13.8z" data-color="3" className='fill-muted-foreground'></path>
                    <path d="M44.9 73.6c-2.2-.5-4.1-2.5-4.8-5-.8-3 0-6.2 2.4-8.6 4.7-4.7 10.6-2.7 10.9-2.6L52.1 61l.6-1.8-.6 1.8c-.2-.1-3.9-1.3-6.9 1.7-1.9 1.9-1.6 4-1.4 4.8.3 1.2 1.1 2.1 2 2.3l-.9 3.8z" data-color="3" className='fill-muted-foreground'></path>
                    <path d="M160.4 121.3c5.3-7.5 4.7-18.8-1.1-25-.1-.2-.3-.4-.5-.5-.1-.1-.2-.1-.2-.2l-.3-.3c-.9-.8-1.7-1.5-2.5-2.1-.3-3.3-2-15.8-11.1-29.2 0 0-.1-.2-.2-.6.8-3.1 4.2-16.3 2.5-21.3-.1-.4-.3-.9-.5-1.2-.9-1.7-2.4-2.8-4.4-3.2-4.5-.9-10 1.9-13.3 4.7-3 2.6-4.1 3.6-4.6 4.1-.2.2-.3.3-.5.4-.2.1-.4.3-.9 0-.2-.1-21.2-10.9-49.3-2.4-13.3 4-23.2 12.4-28.6 24.3-4.8 10.6-5.7 23.6-2.6 36.5 1.7 7 4.6 13.5 7.3 18.3-.8 2.1-3.6 9.3-4.1 10.9l-.2.4c-.8 2.2-3.2 8.7 2.1 10.7 2.5.9 5.9 1.6 9.3 1.6 2.1 0 4.2-.3 6.1-1 3.2-1.2 5.6-3.2 6.7-4.4 3.4 2.1 8.3 4.9 14 6.9.9.4 1.1.8 1.1 1.9 0 .6-.1 2.3-.1 4.1-.1 3.7-.2 6.2-.1 7 .4 4.9 3.7 8.2 9.5 9.1 1.4.2 2.8.3 4.1.3 6.4 0 12.2-2.4 14.2-6.3 1.7-3.3 1.5-6 1.2-9.3-.1-1.2-.2-2.3-.2-3.7-.1-3.2.9-3.5 2.8-4l.9-.3c1.7-.6 11.5-4.4 19.2-9.2.9.1 3.5.4 6.4.4 3 0 6.4-.3 8.9-1.5 4.4-2 6.2-4.4 5.7-7.3-.1-.8-.8-2.2-1.3-3.3 1.5-1.4 3.1-3.2 4.6-5.3zm-44.9 22.6c-.2.1-.5.2-.7.2-2.1.6-5.7 1.6-5.6 7.8 0 1.5.1 2.8.2 3.9.2 3 .4 4.9-.8 7.2-1.4 2.8-7.3 5.1-14.2 4-5.9-.9-6.1-4.4-6.2-5.6 0-.6.1-4.2.2-6.5.1-1.9.1-3.5.1-4.2 0-1.7-.4-4.1-3.4-5.4 0 0-.1 0-.1-.1-9.7-3.4-17.6-9.4-17.6-9.5-.8-.6-2.1-.5-2.7.4-.6.8-.5 2.1.4 2.7.1.1.6.4 1.3 1-1 .9-2.7 2.2-4.8 3-3.7 1.4-9 .7-12.7-.7-1.2-.4-1.1-2.2.2-5.8l.2-.5c.4-1.1 1.9-5.1 3.1-8.1 1.2 1.7 2.2 3.1 3 3.8.4.4.9.6 1.4.6s1-.2 1.4-.6c.8-.8.8-2 0-2.7-2-2-8.8-11.9-11.9-24.4-5.4-22.1 1.4-48.1 28.6-56.2 2.8-.9 5.6-1.5 8.3-2h.1c3 .7 12.8 3.1 20.7 8.4.1.1.3.1.5 0l2.3-1.9c.2-.2.2-.5 0-.6-1.7-1-7.8-4.7-15.8-6.9 18.2-1.3 30.4 5 30.5 5.1 1.8 1 3.6.8 5.2-.4.2-.2.3-.3.7-.6.5-.5 1.6-1.5 4.6-4.1 1.9-1.7 4.3-2.9 6.5-3.5-.3.2-.6.4-.8.6-6.6 4.9-9.8 13.7-10 14.1-.3.8 0 1.6.6 2.1s1.5.6 2.2.1c0 0 1.8-1.1 4.2-.9 3.2.2 5.8 2.6 6.6 6.1 0 .1.1.1.1.2.2 1.1.7 1.9.8 2 6.3 9.3 8.9 18.2 9.9 23.4-1.5-1.2-2.3-1.8-2.4-1.8-.9-.6-2.1-.4-2.7.5-.6.9-.4 2.1.5 2.7 0 0 1.5 1.1 4.1 3.2-3.8.7-12.3 3.9-17.3 19.4-2.4 7.5-2 12.3-.9 15.1-1.9-.4-3.8-.9-5.6-1.4-1-.3-2.1.3-2.4 1.4-.3 1 .3 2.1 1.4 2.4 1.9.5 6.6 1.7 10.5 2.5-8.2 5.2-20.1 10-21.8 10.5zm34-10c-2.2 1-5.7 1.2-8.7 1.1.4-.3.7-.6 1.1-.9h.2c2.1-.2 6.2-1.8 10.4-4.8.3.7.5 1.3.6 1.5 0 .3.2 1.3-3.6 3.1zm-7.9-3.7c-.5.1-1.8-.1-3.5-.4-.7-.5-4.6-3.6-.9-15.1 5.4-16.6 14.7-16.9 15.4-16.9 1.1 0 2.5.3 3.5.8 4.4 4.4 5.9 13.9 1.2 20.6-5.1 7.1-13.2 10.7-15.7 11z" data-color="3" className='fill-muted-foreground'></path>
                    <path d="M127.393 89.202c.121 1.209-.67 2.278-1.77 2.388s-2.089-.78-2.21-1.989.67-2.278 1.77-2.389 2.089.78 2.21 1.99z" data-color="3" className='fill-muted-foreground'></path>
                    <path d="M143.458 78.256c.293 1.179-.077 2.286-.827 2.473-.75.187-1.597-.617-1.89-1.796-.294-1.18.076-2.287.827-2.474.75-.186 1.596.618 1.89 1.797z" data-color="3" className='fill-muted-foreground'></path>
                    <path d="M147.2 116.7c0-4.6-.1-9.5-2.6-8.3-1.3.6-2.6 3.7-2.6 8.3 0 4.6.5 9.4 2.6 8.3 1.2-.6 2.6-3.7 2.6-8.3z" data-color="3" className='fill-muted-foreground'></path>
                    <path d="M155.7 109.9c0-4.1-.1-8.5-2.3-7.4-1.1.6-2.3 3.3-2.3 7.4s.4 8.4 2.3 7.4c1.2-.6 2.3-3.3 2.3-7.4z" data-color="3" className='fill-muted-foreground'></path>
                    <path d="M110 39.2c.6-9-5.2-17.9-12.8-19.8-2.3-.6-4.5-.5-6.5.2l-3.2 1.1.9-.3c-5.1 1.2-9 6.1-9.4 12.8-.3 4.7 1.1 9.4 3.7 13.1 1.4.3 2.7.6 4.2 1.1 4.3 1.2 9.2 3.1 12.8 5l1.8-.6c4.6-1.6 8.1-6.3 8.5-12.6z" data-color="1" className='fill-white'></path>
                </g>
            </svg>
        </div>
    )
}