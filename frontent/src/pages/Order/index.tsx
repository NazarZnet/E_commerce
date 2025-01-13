import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { removeItem, updateQuantity, clearBasket } from "../../redux/slices/basketSlice";
import { Link } from "react-router-dom";
import countryList from 'react-select-country-list'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import "./style.css"
const OrderPage: React.FC = () => {
    const dispatch = useDispatch();
    const basket = useSelector((state: RootState) => state.basket);
    const countryOptions = useMemo(() => countryList().getData(), [])



    const [form, setForm] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        country: "",
        address: "",
        city: "",
        postal_code: "",
        order_notes: "", // New field for order notes
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const totalPrice = basket.items.reduce(
        (total, item) => total + item.product.discounted_price * item.quantity,
        0
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            setError("Your basket is empty.");
            return;
        }

        setError(null);
        setLoading(true);

        const orderData = {
            ...form,
            items: basket.items.map((item) => ({
                product: item.product.id,
                quantity: item.quantity,
            })),
        };

        try {
            const response = await fetch("/api/orders/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create the order.");
            }

            setSuccess(true);
            dispatch(clearBasket());
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 shadow-lg w-full px-4 py-24">
            <div className="max-w-4xl m-auto">


                <h1 className="text-2xl font-bold mb-4">Place Your Order</h1>

                {/* Basket Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Your Basket</h2>
                    {basket.items.length === 0 ? (
                        <p>Your basket is empty.</p>
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
                                                Price: ${product.price}
                                            </p>
                                        </div>
                                    </div>
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
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-4 text-right font-bold">
                        Total Price: ${totalPrice.toFixed(2)}
                    </div>
                </div>

                {/* Order Form Section */}
                <form onSubmit={handleSubmit}>
                    <h2 className="text-xl font-semibold mb-2">Shipping Details</h2>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {success && (
                        <p className="text-green-500 mt-2">
                            Order placed successfully! Thank you. We will contact with you in a while!
                        </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full col-span-2"
                            required
                        />
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={form.first_name}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={form.last_name}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                        {/* <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={form.country}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full"
                            required
                        /> */}
                        <select
                            id="country"
                            name="country"
                            value={form.country}
                            onChange={handleInputChange}
                            className="p-2 border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        >
                            <option value="" disabled>
                                Choose a country...
                            </option>
                            {countryOptions.map((country) => (
                                <option key={country.value} value={country.value}>
                                    {country.label}
                                </option>
                            ))}
                        </select>
                        <PhoneInput
                            placeholder="Phone Number"
                            name="phone"
                            value={form.phone}
                            onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
                            rules={{ required: true }}
                            className="custom-selector"
                            defaultCountry={form.country.length > 0 ? form.country : undefined}
                        />


                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={form.city}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                        <input
                            type="text"
                            name="postal_code"
                            placeholder="Postal Code"
                            value={form.postal_code}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                        <textarea
                            name="address"
                            placeholder="Address"
                            value={form.address}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full mt-4"
                            rows={3}
                            required
                        ></textarea>

                        <textarea
                            name="order_notes"
                            placeholder="Order Notes (optional)"
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
                        {loading ? "Placing Order..." : "Place Order"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OrderPage;