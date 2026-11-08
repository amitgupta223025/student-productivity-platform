import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold tracking-tight">
          Study Smarter.
          <br />
          Stay Organized.
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Manage your tasks, subjects and deadlines in one place.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="mt-8 rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800"
        >
          Get Started
        </button>
      </div>
    </main>
  );
}

export default Landing;
