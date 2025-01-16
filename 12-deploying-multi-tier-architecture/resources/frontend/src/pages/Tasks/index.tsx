import { Link } from 'react-router'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pencil, Trash } from 'lucide-react'

import { apiClient, TaskEntity, ResponseError } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'

export default function Tasks() {
    const [tasks, setTasks] = useState<TaskEntity[]>([])
    const { token } = useAuth()
    const { toast } = useToast()

    const tasksApi = useMemo(() => apiClient.createTasksClient(token), [token])

    const handleDelete = (id: number) => () => {
        tasksApi
            .tasksControllerDeleteTask({ id })
            .then(() => {
                setTasks(tasks.filter((task) => task.id !== id))
                toast({
                    title: 'Success',
                    description: 'Task deleted successfully',
                    variant: 'success',
                })
            }).catch((error: ResponseError) => {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                })
            })
    }

    const toggleCompleted = (id: number) => () => {
        const task = tasks.find((task) => task.id === id)
        if (!task) {
            return
        }

        tasksApi.tasksControllerUpdateTask({
            id,
            updateTaskDto: { completed: !task.completed, },
        }).then(() => {
            setTasks(tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task))
            toast({
                title: 'Success',
                description: 'Task updated successfully',
                variant: 'success',
            })
        }).catch((error: ResponseError) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            })
        })
    }

    useEffect(() => {
        tasksApi.tasksControllerFindAllTasks()
            .then(setTasks)
            .catch((error: ResponseError) => {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                })
            })
    }, [tasksApi, toast])

    return (
        <>
            <div className="my-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{tasks.length}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{tasks.filter((task) => task.completed).length}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{tasks.filter((task) => !task.completed).length}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center my-6">
                    <h1 className="text-3xl font-bold">Tasks</h1>
                    <Button asChild>
                        <Link to="/tasks/new">New Task</Link>
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Status</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>
                                    <Checkbox checked={task.completed} onCheckedChange={toggleCompleted(task.id)} />
                                </TableCell>
                                <TableCell>{task.title}</TableCell>
                                <TableCell className="text-right">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link to={`/tasks/${task.id}`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Edit</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={handleDelete(task.id)}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Delete</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}