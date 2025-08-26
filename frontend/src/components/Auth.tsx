import { ChangeEvent, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupInput, signinInput } from "penscape-common";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();

  const [postInputs, setpostInputs] = useState<any>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [currentThought, setCurrentThought] = useState<string>("");
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  const thoughts = [
    "Every great writer started with a single word.",
    "Writing is thinking. To write well is to think clearly.",
    "The scariest moment is always just before you start.",
    "Fill your paper with the breathings of your heart.",
    "There is no greater agony than bearing an untold story within you.",
    "You can make anything by writing.",
    "Start writing, no matter what. The water does not flow until the faucet is turned on.",
    "We write to taste life twice, in the moment and in retrospect."
  ];

  const recommendedCredentials = {
    signin: {
      username: "john_doe",
      password: "Password123"
    },
    signup: {
      username: "jane_smith",
      email: "jane.smith@example.com",
      password: "SecurePass123"
    }
  };

  useEffect(() => {
    setCurrentThought(thoughts[Math.floor(Math.random() * thoughts.length)]);
  }, []);

  async function sendRequest() {
    setError(null);
    const schema = type === "signup" ? signupInput : signinInput;
    const payload = type === "signup"
      ? { username: postInputs.username, email: postInputs.email, password: postInputs.password }
      : { username: postInputs.username, password: postInputs.password };
    const result = schema.safeParse(payload);
    if (!result.success) {
      setError(result.error.errors[0]?.message || "Invalid input");
      return;
    }
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signin" ? "signin" : "signup"}`,
        payload
      );
      const jwt = response.data.jwt;
      localStorage.setItem("token", jwt);
      navigate("/blogs");
    } catch (error) {
      setError("Server error or invalid credentials");
    }
  }

  const fillRecommendedCredentials = () => {
    const creds = recommendedCredentials[type];
    setpostInputs({
      username: creds.username,
      email: type === "signup" ? (creds as { email: string }).email : (postInputs as { email?: string }).email ?? "",
      password: creds.password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-gold/10 to-teal/10 flex items-center justify-center p-4">
      {/* subtle animated glow behind the card – inspired by Magic UI backgrounds */}
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-64 max-w-xl bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_transparent_60%)] opacity-70 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-gold/10 to-teal/10 opacity-70 blur-xl" />

        <div className="relative rounded-3xl border border-white/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur-xl p-8 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center rounded-full border border-amber-200/80 bg-amber-50/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-700 mb-4 animate-in fade-in-0 slide-in-from-top-3 duration-500">
              {type === "signin" ? "Welcome back writer" : "New chapter starts here"}
            </div>

            <div className="text-3xl font-extrabold text-slate-900 mb-2">
              {type === "signin" ? "Sign in to Penscape" : "Create your Penscape account"}
            </div>
            <div className="text-sm text-slate-500 mb-4">
              {type === "signin"
                ? "Pick up where you left off."
                : "Capture ideas before they slip away."}
            </div>

            <div className="bg-gradient-to-r from-gold/40 via-rose-50 to-teal/20 rounded-xl p-4 mb-6 shadow-[0_12px_40px_rgba(15,23,42,0.18)] transition-all duration-500 hover:shadow-[0_18px_55px_rgba(15,23,42,0.35)] hover:from-gold/50 hover:to-teal/30 animate-in fade-in-0 slide-in-from-top-2 duration-700">
              <p className="text-sm text-darkgreen/90 italic">
                “{currentThought}”
              </p>
            </div>

            <button
              onClick={fillRecommendedCredentials}
              className="text-xs font-medium text-teal-700 hover:text-teal-900 underline underline-offset-4 transition-all duration-200 hover:scale-[1.03]"
            >
              Use recommended credentials
            </button>
          </div>

          <div className="space-y-6">
            <LabelledInput
              label="Username"
              placeholder="Enter your username"
              value={postInputs.username}
              onFocus={() => setHoveredField("username")}
              onBlur={() => setHoveredField(null)}
              onChange={(e) => {
                setpostInputs({
                  ...postInputs,
                  username: e.target.value,
                });
              }}
            />
            {type === "signup" && (
              <LabelledInput
                label="Email"
                placeholder="Enter your email"
                value={postInputs.email}
                onFocus={() => setHoveredField("email")}
                onBlur={() => setHoveredField(null)}
                onChange={(e) => {
                  setpostInputs({
                    ...postInputs,
                    email: e.target.value,
                  });
                }}
              />
            )}
            <LabelledInput
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={postInputs.password}
              onFocus={() => setHoveredField("password")}
              onBlur={() => setHoveredField(null)}
              onChange={(e) => {
                setpostInputs({
                  ...postInputs,
                  password: e.target.value,
                });
              }}
            />
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-in fade-in-0 slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={sendRequest}
              type="button"
              className="w-full bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-600 hover:from-teal-500 hover:via-emerald-400 hover:to-teal-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:translate-y-0.5 hover:shadow-[0_18px_35px_rgba(15,23,42,0.45)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300"
            >
              {type === "signin" ? "Sign in" : "Create account"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <div className="text-slate-500">
              {type === "signin" ? "Don't have an account?" : "Already have an account?"}
              <Link
                className="ml-2 text-teal-700 hover:text-teal-900 font-medium transition-colors duration-200"
                to={type === "signin" ? "/signup" : "/signin"}
              >
                {type === "signin" ? "Sign up" : "Sign in"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  value?: string;
  type?: string;
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  value,
  type,
}: LabelledInputType) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type || "text"}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white hover:border-teal-400 hover:shadow-md focus:shadow-lg"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        required
      />
    </div>
  );
}
