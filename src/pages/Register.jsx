
import { useState } from "react"
import { registerUser } from "../services/api"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setMessage("")
    setError("")
    setLoading(true)

    try {
      const data = await registerUser({
        name,
        email,
        password
      })

      setMessage(data.message)
      setName("")
      setEmail("")
      setPassword("")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-gray-600 text-center mt-2">
          Start organizing your student life
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              className="w-full border rounded-lg px-4 py-3"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-green-700 text-center">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-4 text-red-600 text-center">
            {error}
          </p>
        )}
      </div>
    </main>
  )
}

export default Register