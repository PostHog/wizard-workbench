import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <p>
      Page not found. <Link to="/">Go home</Link>
    </p>
  );
}

export default NotFoundPage;
