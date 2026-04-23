import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'About - Todo App',
  description: 'Learn more about this Next.js 15 todo application',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">About This App</h1>
        <p className="text-muted-foreground">
          A demonstration of Next.js 15 with the App Router
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What is this?</CardTitle>
          <CardDescription>A full-stack todo application showcase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This is a simple todo application built with Next.js 15 using the App Router architecture.
            It demonstrates modern web development practices including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Server-side API routes for data management</li>
            <li>Client-side state management with React hooks</li>
            <li>Type-safe development with TypeScript</li>
            <li>Input validation using Zod</li>
            <li>Modern UI with Tailwind CSS</li>
            <li>Responsive design patterns</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tech Stack</CardTitle>
          <CardDescription>Built with modern web technologies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-1">Framework</p>
              <p className="text-muted-foreground">Next.js 15.3</p>
            </div>
            <div>
              <p className="font-semibold mb-1">UI Library</p>
              <p className="text-muted-foreground">React 19</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Language</p>
              <p className="text-muted-foreground">TypeScript</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Styling</p>
              <p className="text-muted-foreground">Tailwind CSS 4</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Validation</p>
              <p className="text-muted-foreground">Zod</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Icons</p>
              <p className="text-muted-foreground">Lucide React</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>What you can do with this app</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Create new todo items with titles and descriptions</li>
            <li>Mark todos as completed or incomplete</li>
            <li>Delete todos you no longer need</li>
            <li>View active and completed todos separately</li>
            <li>All data persists in memory during the session</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          Back to Todos
        </Link>
      </div>
    </div>
  );
}
