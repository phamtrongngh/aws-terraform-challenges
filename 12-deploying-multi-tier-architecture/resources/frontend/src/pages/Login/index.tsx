import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { ResponseError } from '@/lib/api'
import { ErrorAlert } from '@/components/error-alert'

const schema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
})

type FormData = z.infer<typeof schema>

export default function Login() {
    const { login } = useAuth()
    const [serverError, setServerError] = useState<string | null>(null)
    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            username: '',
            password: '',
        }
    })

    const onSubmit = async ({ username, password }: FormData) => {
        login(username, password).catch(async (error) => {
            let message = 'An error occurred'
            if (error instanceof ResponseError) {
                const data = (await error.response.json())
                message = data.message
            }
            setServerError(message)
        })
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        {serverError && (
                            <ErrorAlert message={serverError} />
                        )}
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="john123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full">Login</Button>
                            <p className="text-sm text-center">
                                {'Don\'t have an account? '}
                                <Link to="/register" className="text-primary underline">
                                    Register here
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    )
}
