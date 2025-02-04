import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateTempPassword, verifyTempPassword } from "../../utils/api";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../redux/slices/authSlice";
import { useTranslation } from "react-i18next";

import ReCAPTCHA from 'react-google-recaptcha';
import useRecaptcha from "../../Components/Recaptcha";

const LoginPage: React.FC = () => {
    const [step, setStep] = useState<"email" | "verify">("email");
    const [form, setForm] = useState({ email: "", temp_password: "" });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(600); // 10 minutes in seconds
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { capchaToken, recaptchaRef, handleRecaptcha } = useRecaptcha();

    const { t } = useTranslation();
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
            setError(t("auth_verify_exp_error"));
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
            await generateTempPassword(form.email, capchaToken); // Use API call function
            setStep("verify");
            setTimer(600); // Reset the timer to 10 minutes
            // Reset captcha after submission
            recaptchaRef.current?.reset();
        } catch (err: any) {
            console.error("Failed to generate temp password", err);
            setError(t("auth_error"));
            handleRecaptcha('');
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!form.temp_password.trim()) {
            setError(t("auth_temp_pass_error"));
            setLoading(false);
            return;
        }

        try {
            const data = await verifyTempPassword(form.email, form.temp_password);
            console.log("Login response: ", data);
            dispatch(
                setAuthData({
                    access_token: data.access,
                    refresh_token: data.refresh,
                    user: data.user,
                })
            );

            navigate("/profile");
        } catch (err: any) {
            console.error("Failed to verify temp password", err);
            setError(t("auth_error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-4 py-24 h-full">
            <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {step === "email" ? t("auth_title_login") : t("auth_title_verify")}
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
                                {t("auth_form_title")}
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                                placeholder={t("auth_form_email_placeholder")}
                                required
                            />
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey="6LcwaswqAAAAAMCSGK9B6mT5Cmt32PUnsOw_X1wF"
                                onChange={handleRecaptcha}
                                className="mt-4 "
                            />
                        </div>
                        <p className="text-gray-500 text-sm text-center">
                            By signing up, you agree to our Terms of Service and Privacy Policy
                        </p>
                        <button
                            type="submit"
                            className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition"
                            disabled={loading}
                        >
                            {loading ? t("auth_btn_send_loading") : t("auth_btn_send")}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifySubmit} className="space-y-4">
                        <div>
                            <label htmlFor="tempPassword" className="block text-gray-700 font-medium mb-2">
                                {t("auth_temp_password")}
                            </label>
                            <input
                                type="text"
                                id="tempPassword"
                                name="temp_password"
                                value={form.temp_password}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                                placeholder={t("auth_form_pass_placeholder")}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition"
                            disabled={loading}
                        >
                            {loading ? t("auth_btn_verify_loading") : t("auth_btn_verify")}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;