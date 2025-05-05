import React from "react";

const Loader: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500 border-solid"></div>
        </div>
    );
};

export default Loader;