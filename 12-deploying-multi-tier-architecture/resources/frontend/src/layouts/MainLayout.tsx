
import { Navigation } from '@/components/navigation';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto">
                {children}
            </main>
        </div>
    );
}

