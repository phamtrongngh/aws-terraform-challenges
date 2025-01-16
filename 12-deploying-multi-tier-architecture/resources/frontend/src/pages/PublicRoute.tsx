import { useNavigate } from 'react-router'

import { useAuth } from "@/hooks/use-auth";
import { useEffect } from 'react';

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const navigate = useNavigate()
    const { token, isLoading } = useAuth()

    useEffect(() => {
        if (token) {
            navigate("/")
        }
    }, [token, navigate])

    if (isLoading) {
        return null
    }

    return children
}