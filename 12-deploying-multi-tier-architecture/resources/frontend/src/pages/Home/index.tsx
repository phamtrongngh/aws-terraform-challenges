import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Loading from '@/components/loading'
import { useAuth } from '@/hooks/use-auth'

export default function Home() {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-4xl font-bold">Welcome to Task Notes</CardTitle>
                    <CardDescription className="text-xl">
                        {user
                            ? `Hello, ${user?.name}! Ready to conquer your tasks?`
                            : "Your personal task management solution"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-lg mb-4">
                        {`Task Notes helps you organize, prioritize, and complete your tasks efficiently.
            Whether you're managing personal to-dos or collaborating on team projects,
            we've got you covered.`}
                    </p>
                    {!user && (
                        <div className="flex space-x-4">
                            <Button asChild>
                                <Link to="/login">Log In</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link to="/register">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <span className="mr-2">📝</span> Create Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        Easily add new tasks with titles, descriptions, and due dates.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <span className="mr-2">📂</span> Organize
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        Categorize your tasks with labels and prioritize them effortlessly.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <span className="mr-2">📊</span> Track Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        Monitor your productivity with visual progress indicators and completion stats.
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

