import SideNav from '@/app/ui/dashboard/sidenav';
import { inter } from '@/app/ui/fonts';
import NavLinks from './nav-links';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`${inter.className} flex h-screen flex-col md:flex-row md:overflow-hidden`}>
            <div className="w-full flex-none md:w-64">
                <SideNav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                {/* <NavLinks /> */}
                {children}
            </div>
        </div>
    );
}