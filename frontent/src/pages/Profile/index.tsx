import React, { useEffect, useState } from "react";
import { clearTokens, fetchProfile, updateUserInfo } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { User } from "../../interfaces/user";
import { Order } from "../../interfaces/order";

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchProfile(); // Fetch profile data
                setUser(data.user);
                setEditedUser(data.user); // Set editable copy of user data
                setOrders(data.orders);
            } catch (err: any) {

                navigate("/login");

            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [navigate]);

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
            const updatedUser = await updateUserInfo({
                first_name: editedUser.first_name,
                last_name: editedUser.last_name,
                email: editedUser.email,
            });

            setUser(updatedUser); // Update the local state with the new user info
            setIsEditing(false); // Reset editing state
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleLogOut = () => {
        clearTokens();
        navigate("/login");
    };
    if (loading) {
        return <div>Loading...</div>;
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

                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>
                        <button
                            onClick={handleLogOut}
                            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                        >Log Out</button>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg shadow space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                First Name
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
                                Last Name
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
                                Email
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
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>

                {/* Orders */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
                    {orders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition"
                                >
                                    <div className="mb-4">
                                        <p className="font-medium">
                                            <strong>Order ID:</strong> {order.id}
                                        </p>
                                        <p>
                                            <strong>Status:</strong>{" "}
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
                                            <strong>Total:</strong> ${order.total_price.toFixed(2)}
                                        </p>
                                        <p>
                                            <strong>Date:</strong>{" "}
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <h3 className="font-semibold mb-2">Items</h3>
                                    <ul className="space-y-2">
                                        {order.items.map((item, index) => (
                                            <li key={index} className="flex items-center gap-4">
                                                <img
                                                    src={item.product.gallery[0]?.image}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded-md shadow"
                                                />
                                                <div className="flex-grow">
                                                    <p className="font-medium">{item.product.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {item.quantity} x ${item.product.discounted_price.toFixed(2)}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4">
                                        <p>
                                            <strong>Delivery Address:</strong>{" "}
                                            {order.address}, {order.city}, {order.postal_code},{" "}
                                            {order.country}
                                        </p>
                                        <p>
                                            <strong>Phone:</strong> {order.phone}
                                        </p>
                                        {order.order_notes && (
                                            <p>
                                                <strong>Notes:</strong> {order.order_notes}
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