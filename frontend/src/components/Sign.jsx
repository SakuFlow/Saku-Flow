import { useState } from "react";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
    // Add your login logic here (API call)
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-96 bg-base-300 shadow-xl p-6 ">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="username"
              placeholder="Enter your username"
              className="input input-bordered"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          
          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary mt-4">
            Sign In
          </button>

          <p className="text-center text-sm text-gray-500 mt-2">
            Already have an account? <a className="link link-primary" href="/Login">Log in</a>
        </p>
        </form>
      </div>
    </div>
  );
}

export default SignInForm;
