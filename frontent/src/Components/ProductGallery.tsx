import React, { useState } from "react";
import { Gallery } from "../interfaces/product";

const ProductGallery: React.FC<{ images: Gallery[] }> = ({ images: gallery }) => {
    const [selectedImage, setSelectedImage] = useState<string>(gallery[0].image);
    const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number } | null>(null);

    const handleThumbnailClick = (image: string) => {
        setSelectedImage(image);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setZoomPosition(null);
    };

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails on the left in md and larger, below in smaller screens */}
            <div className="w-full md:w-1/4 flex flex-row md:flex-col space-x-4 md:space-x-0 md:space-y-4 max-h-[450px] overflow-y-auto">
                {gallery.map((item) => (
                    <img
                        key={item.id}
                        src={item.image}
                        alt={`Thumbnail ${item.id}`}
                        className={`w-20 h-20 object-cover rounded-md shadow cursor-pointer ${selectedImage === item.image ? "border-2 border-orange-500" : ""
                            }`}
                        onClick={() => handleThumbnailClick(item.image)}
                    />
                ))}
            </div>

            {/* Main Image with Zoom */}
            <div
                className="relative w-full md:w-3/4 group"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <img
                    src={selectedImage}
                    alt="Selected product"
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                />
                {/* Zoom Effect */}
                {zoomPosition && (
                    <div
                        className="absolute w-[200px] h-[200px] border-2 border-orange-500 rounded-lg pointer-events-none"
                        style={{
                            top: `${zoomPosition.y}%`,
                            left: `${zoomPosition.x}%`,
                            transform: "translate(-50%, -50%)",
                            backgroundImage: `url(${selectedImage})`,
                            backgroundSize: "500% 500%", // Zoom level
                            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }}
                    ></div>
                )}
            </div>
        </div>
    );
};

export default ProductGallery;