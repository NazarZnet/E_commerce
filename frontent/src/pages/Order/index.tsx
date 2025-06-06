import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { removeItem, updateQuantity } from "../../redux/slices/basketSlice";
import { Link } from "react-router-dom";

import 'react-phone-number-input/style.css'
import PhoneInput from "react-phone-number-input"
import { CountryCode } from "libphonenumber-js";

import "./style.css"
import { createOrder, fetchProfile, refreshAccessToken } from "../../utils/api";
import { setAuthData, updateTokens } from "../../redux/slices/authSlice";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/config";
const OrderPage: React.FC = () => {
    const dispatch = useDispatch();
    const basket = useSelector((state: RootState) => state.basket);
    const countryOptions = [
        { value: "CZ", label: "Czech Republic" }
    ];
    const accessToken = useSelector((state: RootState) => state.auth.access_token);
    const refreshToken = useSelector((state: RootState) => state.auth.refresh_token);
    const { t } = useTranslation();

    const [form, setForm] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        country: countryOptions[0]?.value || "",
        address: "",
        city: "",
        postal_code: "",
        order_notes: "", // New field for order notes
    });
    const [selectedGuarantees, setSelectedGuarantees] = useState<{ [key: number]: boolean }>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchProfile(accessToken, i18n.language); // Fetch profile data
                const user = data.user;
                setForm((prev) => ({ ...prev, ["email"]: user.email, ["first_name"]: user.first_name, ["last_name"]: user.last_name }));
            } catch (err: any) {
                if (err.response?.status === 401 && refreshToken) {
                    console.log("Access token expired. Attempting to refresh...");
                    try {
                        // Attempt to refresh tokens
                        const refreshData = await refreshAccessToken(refreshToken);
                        console.log("Refreshed tokens: ", refreshData);

                        // Update tokens in Redux
                        dispatch(
                            updateTokens({
                                access_token: refreshData.access_token,
                                refresh_token: refreshData.refresh_token,
                            })
                        );

                        // Retry fetching the profile with the new token
                        const data = await fetchProfile(refreshData.access_token, i18n.language);
                        const user = data.user;
                        setForm((prev) => ({ ...prev, ["email"]: user.email, ["first_name"]: user.first_name, ["last_name"]: user.last_name }));
                    } catch (refreshError) {
                        console.error("Failed to refresh tokens:", refreshError);

                    }
                } else {
                    console.error("Error fetching profile:", err);

                }
            };
        }

        if (accessToken && refreshToken) {

            loadProfile();
        }
    }, [accessToken, refreshToken]);


    const totalPrice = basket.items.reduce(
        (total, item) => total + item.product.discounted_price * item.quantity + (selectedGuarantees[item.product.id] ? 1250 * item.quantity : 0),
        0
    );

    const handleGuaranteeChange = (productId: number) => {
        setSelectedGuarantees(prev => ({ ...prev, [productId]: !prev[productId] }));
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };


    const handleRemove = (productId: number) => {
        dispatch(removeItem(productId));
    };

    const handleUpdateQuantity = (productId: number, quantity: number) => {
        dispatch(updateQuantity({ productId, quantity }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (basket.items.length === 0) {
            setError(t("empty_basket"));
            return;
        }

        setError(null);
        setLoading(true);

        const orderData = {
            ...form,
            items: basket.items.map((item) => ({
                product_id: item.product.id,
                quantity: item.quantity,
                long_term_guarantee_selected: selectedGuarantees[item.product.id] || false,
            })),
        };


        try {


            const data = await createOrder(orderData);
            console.log("Payment data:", data);
            dispatch(
                setAuthData({
                    access_token: data.access,
                    refresh_token: data.refresh,
                    user: data.user,
                })
            );
            if (data.checkout_url) {
                // Redirect the user to the Stripe Checkout URL
                window.location.href = data.checkout_url;
            } else {
                console.error("Checkout url not provided");
                throw new Error(t("order_error"));
            }
        } catch (err: any) {
            console.error("Failed to create order:", err);
            setError(t("order_error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="  px-4 py-24">
            <div className="max-w-4xl m-auto">


                <h1 className="text-2xl font-bold mb-4">{t("order_title")}</h1>

                {/* Basket Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2"> {t("basket_title")} </h2>
                    {basket.items.length === 0 ? (
                        <p> {t("empty_basket")} </p>
                    ) : (
                        <ul className="space-y-4">
                            {basket.items.map(({ product, quantity }) => (
                                <li key={product.id} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={product.gallery[0]?.image}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                        <div>
                                            <Link to={`/products/${product.slug}`} className="font-medium">{product.name}</Link>
                                            <p className="text-sm text-gray-500">
                                                {t("price")} {product.discounted_price} Kč
                                            </p>
                                        </div>
                                    </div>
                                    {product.category.long_term_guarantee && (
                                        <div className="flex items-center space-x-4 relative">
                                            <label className="flex items-center space-x-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 accent-orange-500"
                                                    checked={selectedGuarantees[product.id] || false}
                                                    onChange={() => handleGuaranteeChange(product.id)}
                                                />
                                                <span>{t("order_add_guarantee")}</span>
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg w-52 text-center">
                                                    {t("order_add_guarantee_description")}
                                                </div>
                                                <span className="ml-1 text-gray-500 text-sm cursor-pointer">?</span>
                                            </label>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="number"
                                            min={1}
                                            value={quantity}
                                            onChange={(e) =>
                                                handleUpdateQuantity(product.id, Number(e.target.value))
                                            }
                                            className="w-16 text-center border rounded"
                                        />
                                        <button
                                            onClick={() => handleRemove(product.id)}
                                            className="text-orange-500 hover:text-orange-700 transition"
                                        >
                                            {t("remove_btn")}
                                        </button>
                                    </div>


                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-4 text-right font-bold">
                        {t("order_total_price")} {totalPrice.toFixed(2)} Kč
                    </div>
                </div>

                {/* Order Form Section */}
                <form onSubmit={handleSubmit}>
                    <h2 className="text-xl font-semibold mb-2">{t("order_form_title")}</h2>
                    {error && <p className="text-red-500 mt-2">{error}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
                        <input
                            type="email"
                            name="email"
                            placeholder={t("order_email")}
                            value={form.email}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full md:col-span-2"
                            required
                        />
                        <input
                            type="text"
                            name="first_name"
                            placeholder={t("order_first_name")}
                            value={form.first_name}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                        <input
                            type="text"
                            name="last_name"
                            placeholder={t("order_last_name")}
                            value={form.last_name}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full"
                            required
                        />

                        <select
                            id="country"
                            name="country"
                            value={form.country || countryOptions[0]?.value}
                            onChange={handleInputChange}
                            className="p-2 border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        >
                            <option value="" disabled>
                                {t("order_country")}
                            </option>
                            {countryOptions.map((country) => (
                                <option key={country.value} value={country.value}>
                                    {country.label}
                                </option>
                            ))}
                        </select>
                        <PhoneInput
                            placeholder={t("order_phone")}
                            name="phone"
                            value={form.phone}
                            onChange={(value: string | undefined) =>
                                setForm((prev) => ({ ...prev, phone: value || "" }))
                            }

                            rules={{ required: true }}
                            className="custom-selector"
                            defaultCountry={
                                (form.country.length > 0 ? (form.country as CountryCode) : undefined)
                            }
                        />



                        <input
                            type="text"
                            name="city"
                            placeholder={t("order_city")}
                            value={form.city}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                        <input
                            type="text"
                            name="postal_code"
                            placeholder={t("order_postal_code")}
                            value={form.postal_code}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                        <textarea
                            name="address"
                            placeholder={t("order_address")}
                            value={form.address}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full mt-4"
                            rows={3}
                            required
                        ></textarea>

                        <textarea
                            name="order_notes"
                            placeholder={t("order_notes")}
                            value={form.order_notes}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full mt-4"
                            rows={3}
                        ></textarea>
                    </div>




                    <button
                        type="submit"
                        className="mt-4 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition"
                        disabled={loading}
                    >
                        {loading ? t("order_btn_loading") : t("order_btn")}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OrderPage;