import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
      <p className="mb-4">You don't have permission to access this page.</p>
      <Link to="/login" className="text-blue-500 hover:underline">
        Go back to Login
      </Link>
    </div>
  );
};

export default Unauthorized;