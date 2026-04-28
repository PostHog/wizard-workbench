import Head from 'next/head';
import { TodoList } from '@/components/todos/todo-list';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Todo App - Next.js 15</title>
        <meta name="description" content="A full-stack todo application built with Next.js 15" />
      </Head>
      <TodoList />
    </>
  );
}
