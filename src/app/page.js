import HomepageClient from "../components/HomepageClient";

export function generateStaticParams() {
    return [{ slug: [''] }]
}

export default function Page() {
    return <HomepageClient />
}