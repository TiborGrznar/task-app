import type { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

/**
 * Shared page layout for Login/Register: centers a white card on a light
 * background. The actual form content is passed in via children, so both
 * pages reuse this wrapper without duplicating the same Tailwind classes.
 */
function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900">
            <div className="w-full max-w-sm bg-neutral-800 border border-neutral-700 p-8 rounded-lg shadow-md">
                {children}
            </div>
        </div>
    );
}

export default AuthLayout;