import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Home Page</h1>
      <Link 
        to="/products" 
        className="btn btn-primary"
      >
        <button>
        View Products

        </button>
      </Link>
    </div>
  );
}