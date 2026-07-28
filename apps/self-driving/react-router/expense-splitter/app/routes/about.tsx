import { Link } from 'react-router';

export default function About() {
  return (
    <>
      <nav>
        <Link to="/">Back to expenses</Link>
      </nav>

      <h1>About</h1>
      <p className="lede">
        A small React Router v7 expense splitter with an in-memory store, used as a test app for the
        PostHog wizard. Expenses reset whenever the server restarts.
      </p>
    </>
  );
}
