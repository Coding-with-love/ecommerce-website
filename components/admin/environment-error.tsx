import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export function EnvironmentError() {
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <CardTitle>Environment Setup Required</CardTitle>
        </div>
        <CardDescription>Your Supabase environment variables are missing or incorrectly configured.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">To use the admin features, you need to set up the following environment variables:</p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>
            <code className="bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code>
          </li>
          <li>
            <code className="bg-muted px-1 py-0.5 rounded">SUPABASE_SERVICE_ROLE_KEY</code>
          </li>
        </ul>
        <p>These can be found in your Supabase project dashboard under Project Settings &gt; API.</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="https://app.supabase.io" target="_blank" rel="noopener noreferrer">
            Go to Supabase Dashboard
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
