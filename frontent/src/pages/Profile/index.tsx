import React, { useEffect, useState } from "react";
import { fetchProfile, refreshAccessToken, updateUserInfo } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../interfaces/user";
import { Order } from "../../interfaces/order";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { clearAuthData, setAuthData, updateTokens } from "../../redux/slices/authSlice";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/config";

const ProfilePage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const accessToken = useSelector((state: RootState) => state.auth.access_token);
    const refreshToken = useSelector((state: RootState) => state.auth.refresh_token);

    const { t } = useTranslation();

    const dispatch = useDispatch();

    useEffect(() => {
        const loadProfile = async (language: string) => {
            setLoading(true);

            try {
                // Check if tokens are available
                if (!accessToken && !refreshToken) {
                    navigate("/login");
                    return;
                }

                // Attempt to fetch the profile
                const data = await fetchProfile(accessToken, language);

                setEditedUser(data.user); // Set editable copy of user data
                setOrders(data.orders);
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
                        const retryData = await fetchProfile(refreshData.access_token, language);

                        setEditedUser(retryData.user);
                        setOrders(retryData.orders);
                    } catch (refreshError) {
                        console.error("Failed to refresh tokens:", refreshError);
                        // Redirect to login if refresh also fails
                        navigate("/login");
                    }
                } else {
                    console.error("Error fetching profile:", err);
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };
        const handleLanguageChange = (language: string) => {
            loadProfile(language);
        };


        loadProfile(i18n.language);

        i18n.on("languageChanged", handleLanguageChange);

        return () => {
            i18n.off("languageChanged", handleLanguageChange);
        };
    }, [accessToken, refreshToken, navigate, dispatch, i18n]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser((prev) => (prev ? { ...prev, [name]: value } : null));
        setIsEditing(true);
    };

    const handleSaveChanges = async () => {
        if (!editedUser) return;
        setError(null);
        setLoading(true);

        try {
            const data = await updateUserInfo({
                first_name: editedUser.first_name,
                last_name: editedUser.last_name,
                email: editedUser.email,
            }, accessToken);


            setIsEditing(false);
            dispatch(
                setAuthData({
                    access_token: data.access,
                    refresh_token: data.refresh,
                    user: data.user,
                })
            );
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

                    const data = await updateUserInfo({
                        first_name: editedUser.first_name,
                        last_name: editedUser.last_name,
                        email: editedUser.email,
                    }, accessToken);


                    setIsEditing(false);
                    dispatch(
                        setAuthData({
                            access_token: data.access,
                            refresh_token: data.refresh,
                            user: data.user,
                        })
                    );
                } catch (refreshError) {
                    console.error("Failed to refresh tokens:", refreshError);
                    // Redirect to login if refresh also fails
                    navigate("/login");
                }
            } else {
                console.error("Error updating user's data:", err);
                setError(err.message)
            }
        } finally {
            setLoading(false);
        }
    };
    const handleLogOut = () => {
        dispatch(
            clearAuthData()
        );
        navigate("/login");
    };
    if (loading) {
        return <div>{t("loading")}</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="  px-4 py-24">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
                {/* User Info */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">

                        <h1 className="text-2xl font-bold text-gray-800 mb-4">{t("profile_title")}</h1>
                        <button
                            onClick={handleLogOut}
                            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                        > {t("logout_btn")} </button>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg shadow space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                {t("order_first_name")}
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={editedUser?.first_name || ""}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                {t("order_last_name")}
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={editedUser?.last_name || ""}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                {t("order_email")}
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={editedUser?.email || ""}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        {isEditing && (
                            <button
                                onClick={handleSaveChanges}
                                className="mt-4 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition"
                            >
                                {t("profile_save_btn")}
                            </button>
                        )}
                    </div>
                </div>

                {/* Orders */}
                <div>
                    <h2 className="text-xl font-semibold mb-4"> {t("profile_orders_title")} </h2>
                    {orders.length === 0 ? (
                        <p> {t("profile_no_order_titles")} </p>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition"
                                >
                                    <div className="mb-4">
                                        <p className="font-medium">
                                            <strong>{t("profile_order_id")}</strong> {order.id}
                                        </p>
                                        <p>
                                            <strong>{t("profile_order_status")}</strong>{" "}
                                            <span
                                                className={`px-2 py-1 rounded-full ${order.status === "delivered"
                                                    ? "bg-green-200 text-green-800"
                                                    : order.status === "processing"
                                                        ? "bg-yellow-200 text-yellow-800"
                                                        : "bg-gray-200 text-gray-800"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </p>
                                        <p>
                                            <strong>{t("order_total_price")}</strong> ${order.total_price.toFixed(2)}
                                        </p>
                                        <p>
                                            <strong> {t("profile_order_date")} </strong>{" "}
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <h3 className="font-semibold mb-2"> {t("profile_order_items")} </h3>
                                    <ul className="space-y-2">
                                        {order.items.map((item, index) => (
                                            <li key={index} className="flex items-center gap-4">
                                                <img
                                                    src={item.product.gallery[0]?.image}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded-md shadow"
                                                />
                                                <div className="flex-grow">
                                                    <Link to={`/products/${item.product.slug}`} className="font-medium">{item.product.name}</Link>
                                                    <p className="text-sm text-gray-500">
                                                        {item.quantity} x ${item.product.discounted_price.toFixed(2)}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4">
                                        <p>
                                            <strong> {t("profile_order_address")} </strong>{" "}
                                            {order.address}, {order.city}, {order.postal_code},{" "}
                                            {order.country}
                                        </p>
                                        <p>
                                            <strong> {t("profile_order_phone")} </strong> {order.phone}
                                        </p>
                                        {order.order_notes && (
                                            <p>
                                                <strong> {t("profile_order_notes")}</strong> {order.order_notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;