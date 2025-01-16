import { Link, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/user-menu'
import { useAuth } from '@/hooks/use-auth'

export function Navigation() {
    const { user } = useAuth()
    const { pathname } = useLocation()

    const getVariant = (path: string) => {
        return pathname === path ? 'default' : 'ghost'
    }

    return (
        <nav className="border-b">
            <div className="container mx-auto flex items-center justify-between py-4">
                <Link to="/" className="text-2xl font-bold">
                    Task Notes
                </Link>
                <div className="space-x-4">
                    <Button variant={getVariant('/')} asChild>
                        <Link to="/">Home</Link>
                    </Button>
                    <Button variant={getVariant('/tasks')} asChild>
                        <Link to="/tasks">Tasks</Link>
                    </Button>
                    {user ? (
                        <UserMenu name={user.name} />
                    ) : (
                        <Link to="/login">
                            <Button variant={getVariant('/login')}>Login</Button>
                        </Link>
                    )}

                </div>
            </div>
        </nav>
    )
}

