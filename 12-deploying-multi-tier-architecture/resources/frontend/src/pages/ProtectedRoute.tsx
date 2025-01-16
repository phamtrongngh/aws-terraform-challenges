import { useNavigate } from 'react-router'

import { useAuth } from "@/hooks/use-auth";
import { useEffect } from 'react';

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const navigate = useNavigate()
    const { token } = useAuth()

    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
    }, [token, navigate])

    if (!token) {
        return null
    }

    return children
}