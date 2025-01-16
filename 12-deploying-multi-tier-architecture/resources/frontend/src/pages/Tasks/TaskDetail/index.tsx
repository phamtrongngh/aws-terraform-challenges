'use client'

import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ResponseError, apiClient } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { ErrorAlert } from '@/components/error-alert'

const schema = z.object({
    title: z.string().nonempty('Title must not be empty'),
    description: z.string().max(255, 'Description must not exceed 255 characters').optional(),
    completed: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

export default function TaskForm() {
    const navigate = useNavigate()
    let { id } = useParams()
    id = id ?? 'new'

    const { token } = useAuth()
    const tasksApi = useMemo(() => apiClient.createTasksClient(token), [token])

    const [serverError, setServerError] = useState<string | null>(null)

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            completed: false,
        },
    })

    useEffect(() => {
        if (id !== 'new') {
            tasksApi.tasksControllerFindTaskById({ id: +id })
                .then((task) => {
                    form.reset({
                        title: task.title,
                        description: task.description ?? '',
                        completed: task.completed,
                    })
                })
                .catch((error: ResponseError) => {
                    setServerError(error.message)
                })
        }
    }, [form, id, tasksApi])

    const createTask = async (data: FormData) => {
        tasksApi.tasksControllerCreateTask({ createTaskDto: data })
            .then(() => navigate('/tasks'))
            .catch(async (error) => {
                let message = 'An error occurred'
                if (error instanceof ResponseError) {
                    const body = await error.response.json()
                    message = body.message
                }
                setServerError(message)
            })
    }

    const updateTask = async (data: FormData) => {
        tasksApi.tasksControllerUpdateTask({ id: +id, updateTaskDto: data })
            .then(() => navigate('/tasks'))
            .catch(async (error) => {
                let message = 'An error occurred'
                if (error instanceof ResponseError) {
                    const body = await error.response.json()
                    message = body.message
                }
                setServerError(message)
            })
    }

    const onSubmit = async (data: FormData) => {
        if (id === 'new') {
            createTask(data)
        } else {
            updateTask(data)
        }
    }

    return (
        <div className='space-y-6 max-w-xl my-6'>
            <h1 className="text-3xl font-bold mb-6">
                {id === 'new' ? 'New Task' : 'Edit Task'}
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
                    {serverError && <ErrorAlert message={serverError} />}
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='font-bold'>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Meeting..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Meeting with the team at 10am..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <FormField
                            control={form.control}
                            name="completed"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel className='font-bold ml-2'>Mark as completed</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex items-center space-x-1 mt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate('/tasks')}
                        >
                            Back
                        </Button>
                        <Button type="submit">Save</Button>
                    </div>

                </form>
            </Form>
        </div>
    )
}

