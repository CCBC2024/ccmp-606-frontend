import './globals.css'
import React from 'react'
import type {Metadata} from 'next'

export const metadata: Metadata = {
    title: 'Blockchain-based Charity Donation Platform',
    description: 'A blockchain-based charity donation platform',
}

export default function RootLayout(
    {
        children,
    }: {
        children: React.ReactNode
    },
) {
    return (
        <html lang="en">
        <body>
        <div id="root">
            <div className="container mx-auto px-4 py-4">
                {children}
            </div>
        </div>
        </body>
        </html>
    )
}