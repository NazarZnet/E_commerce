import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { sendHelpRequest } from "../../utils/api";
// import { sendSupportRequest } from "../../utils/api";

const HelpCenter: React.FC = () => {
    const { t } = useTranslation();

    const [form, setForm] = useState({
        email: "",
        subject: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            await sendHelpRequest(form.email, form.subject, form.message);
            setSuccess(t("help_success"));
            setForm({ email: "", subject: "", message: "" });
        } catch (err) {
            console.error("Failed to send support request:", err);
            setError(t("help_error"));
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="px-4 py-24 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">{t("help_title")}</h1>
                <p className="text-gray-600 mb-6">{t("help_description")}</p>
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}

                    <div className="grid grid-cols-1 gap-4 px-6">
                        <input
                            type="email"
                            name="email"
                            placeholder={t("help_email")}
                            value={form.email}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                        <input
                            type="text"
                            name="subject"
                            placeholder={t("help_subject")}
                            value={form.subject}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                        <textarea
                            name="message"
                            placeholder={t("help_message")}
                            value={form.message}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full mt-4"
                            rows={4}
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition"
                        disabled={loading}
                    >
                        {loading ? t("help_btn_loading") : t("help_btn")}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HelpCenter;
