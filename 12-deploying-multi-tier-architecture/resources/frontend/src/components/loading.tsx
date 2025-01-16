import { Loader2 as Loader } from 'lucide-react'

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 h-screen flex justify-center items-center">
            <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
}