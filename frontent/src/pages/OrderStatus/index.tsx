import React from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearBasket } from "../../redux/slices/basketSlice";
import { useTranslation } from "react-i18next";

const OrderStatusPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const success = queryParams.get("success") === "true";
    if (success) {
        dispatch(clearBasket());
    }
    const handleBuyNow = () => {

        navigate("/order");
        window.scrollTo(0, 0);
    };
    const handleGoHome = () => {

        navigate("/");
        window.scrollTo(0, 0);
    };
    return (
        <div className="max-w-4xl mx-auto mt-32 bg-white rounded">
            {success ? (
                <div className="rounded-2xl">
                    <h1 className="p-8 text-center text-3xl bg-orange-500 text-white"> {t("order_success_title")} </h1>
                    <p className="p-8 text-lg text-green-700 font-semibold"> {t("order_success_description")} </p>
                    <button
                        onClick={handleGoHome}
                        className="mx-8 mb-8 bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition"
                    >
                        {t("nav_home")}
                    </button>
                </div>
            ) : (
                <div className="rounded-2xl">
                    <h1 className=" p-8 text-center text-3xl bg-orange-500 text-white"> {t("order_failed_title")} </h1>
                    <p className="p-8 text-lg text-red-500 font-semibold"> {t("order_failed_description")} </p>
                    <button
                        onClick={handleBuyNow}
                        className="mx-8 mb-8 bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition"
                    >
                        {t("buy_now")}
                    </button>
                </div>
            )
            }
        </div >
    );
};

export default OrderStatusPage;