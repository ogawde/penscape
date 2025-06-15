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
      email: type === "signup" ? creds.email : postInputs.email,
      password: creds.password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige to-gold/20 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-3xl font-extrabold text-gray-900 mb-2">
            {type === "signin" ? "Welcome back" : "Join Penscape"}
          </div>
          <div className="text-gray-600 mb-4">
            {type === "signin" ? "Continue your writing journey" : "Start your writing journey"}
          </div>
          <div className="bg-gradient-to-r from-gold/30 to-teal/10 rounded-lg p-4 mb-6 transition-all duration-500 hover:shadow-lg hover:from-gold/40 hover:to-teal/20">
            <p className="text-sm text-darkgreen italic transition-colors duration-300">"{currentThought}"</p>
          </div>
          <button
            onClick={fillRecommendedCredentials}
            className="text-sm text-teal-600 hover:text-teal-800 underline transition-all duration-200 hover:scale-105"
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
        <div className="mt-8">
          <button
            onClick={sendRequest}
            type="button"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-300"
          >
            {type === "signin" ? "Sign In" : "Create Account"}
          </button>
        </div>
        <div className="mt-6 text-center">
          <div className="text-gray-600">
            {type === "signin" ? "Don't have an account?" : "Already have an account?"}
            <Link
              className="ml-2 text-teal-600 hover:text-teal-800 font-medium transition-colors duration-200"
              to={type === "signin" ? "/signup" : "/signin"}
            >
              {type === "signin" ? "Sign up" : "Sign in"}
            </Link>
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
