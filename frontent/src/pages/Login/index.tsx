import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateTempPassword, verifyTempPassword } from "../../utils/api";
const LoginPage: React.FC = () => {
    const [step, setStep] = useState<"email" | "verify">("email");
    const [form, setForm] = useState({ email: "", temp_password: "" });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(600); // 10 minutes in seconds
    const navigate = useNavigate();

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (step === "verify" && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }

        if (timer === 0) {
            setStep("email");
            setForm({ email: "", temp_password: "" });
            setError("Verification time expired. Please request a new code.");
        }

        return () => clearInterval(interval);
    }, [step, timer]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await generateTempPassword(form.email); // Use API call function
            setStep("verify");
            setTimer(600); // Reset the timer to 10 minutes
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!form.temp_password.trim()) {
            setError("Temporary password cannot be empty.");
            setLoading(false);
            return;
        }

        try {
            const user = await verifyTempPassword(form.email, form.temp_password); // Use API call function
            console.log("User data:", user);
            navigate("/profile");
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-4 py-24 h-full">
            <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {step === "email" ? "Login or Sign Up" : "Verify Your Code"}
                    </h1>
                    {step === "verify" && (
                        <div className="text-red-500 font-bold">
                            {formatTime(timer)}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-red-500 text-center mb-4">{error}</p>
                )}
                {step === "email" ? (
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition"
                            disabled={loading}
                        >
                            {loading ? "Sending Code..." : "Send Code"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifySubmit} className="space-y-4">
                        <div>
                            <label htmlFor="tempPassword" className="block text-gray-700 font-medium mb-2">
                                Temporary Password
                            </label>
                            <input
                                type="text"
                                id="tempPassword"
                                name="temp_password"
                                value={form.temp_password}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                                placeholder="Enter the code sent to your email"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify and Login"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;