import React from 'react';
import logo from "../assets/images/logo.png";

const Navigation: React.FC = () => {
    return (
        <nav className=" fixed z-30 w-full flex justify-between items-center px-6 py-4 bg-black text-white shadow-md" style={{ fontFamily: 'RubikVinyl' }}>
            {/* Left Section: Logo */}
            <div className="flex items-center space-x-4">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-10 h-10"
                />
                <span className="text-xl font-bol">Ride Future</span>
            </div>

            {/* Center Section: Links */}
            <ul className="flex space-x-6 font-medium">
                <li className="hover:text-orange-500 transition">
                    <a href="#home">Home</a>
                </li>
                <li className="hover:text-orange-500 transition">
                    <a href="#shop">Shop</a>
                </li>
                <li className="hover:text-orange-500 transition">
                    <a href="#categories">Categories</a>
                </li>
                <li className="hover:text-orange-500 transition">
                    <a href="#accessories">Accessories</a>
                </li>
            </ul>

            {/* Right Section: Profile and Cart */}
            <div className="flex items-center space-x-4">
                <a href="#profile" className="hover:text-orange-500 transition w-8 h-8">
                    <svg fill="#ffffff" width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>Account Settings</title><path d="M9.6,3.32a3.86,3.86,0,1,0,3.86,3.85A3.85,3.85,0,0,0,9.6,3.32M16.35,11a.26.26,0,0,0-.25.21l-.18,1.27a4.63,4.63,0,0,0-.82.45l-1.2-.48a.3.3,0,0,0-.3.13l-1,1.66a.24.24,0,0,0,.06.31l1,.79a3.94,3.94,0,0,0,0,1l-1,.79a.23.23,0,0,0-.06.3l1,1.67c.06.13.19.13.3.13l1.2-.49a3.85,3.85,0,0,0,.82.46l.18,1.27a.24.24,0,0,0,.25.2h1.93a.24.24,0,0,0,.23-.2l.18-1.27a5,5,0,0,0,.81-.46l1.19.49c.12,0,.25,0,.32-.13l1-1.67a.23.23,0,0,0-.06-.3l-1-.79a4,4,0,0,0,0-.49,2.67,2.67,0,0,0,0-.48l1-.79a.25.25,0,0,0,.06-.31l-1-1.66c-.06-.13-.19-.13-.31-.13L19.5,13a4.07,4.07,0,0,0-.82-.45l-.18-1.27a.23.23,0,0,0-.22-.21H16.46M9.71,13C5.45,13,2,14.7,2,16.83v1.92h9.33a6.65,6.65,0,0,1,0-5.69A13.56,13.56,0,0,0,9.71,13m7.6,1.43a1.45,1.45,0,1,1,0,2.89,1.45,1.45,0,0,1,0-2.89Z"></path></g></svg>
                </a>
                <a href="#cart" className="hover:text-orange-500 transition w-8 h-8">
                    <svg fill="#ffffff" viewBox="0 0 512 512" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="shopping_cart-basket-heart-love-valentine"> <path d="M423.936,176.316C423.94,176.205,424,176.112,424,176v-32c0-13.234-10.766-24-24-24v-17.801 c0-16.417-16.066-27.962-31.586-22.77l-16,5.332c-0.004,0-0.004,0-0.004,0c-4.364,1.455-8.036,4.116-10.83,7.483 C337.713,89.578,333.042,88,328,88h-16c-5.042,0-9.713,1.578-13.58,4.245c-2.794-3.367-6.466-6.028-10.83-7.483c0,0,0,0-0.004,0 L271.59,79.43C256.041,74.236,240,85.8,240,102.199V120c-2.819,0-5.485,0.578-8,1.474V96c0-13.234-10.766-24-24-24h-16 c-13.234,0-24,10.766-24,24v80h-17.275l-12.858-76.758C135.492,83.453,122.18,72,106.219,72H88c-8.836,0-16,7.164-16,16 s7.164,16,16,16l18.266,0.266l45.953,274.375C153.508,386.352,160.18,392,168,392h51.059c-6.72,5.87-11.059,14.397-11.059,24 c0,17.645,14.355,32,32,32s32-14.355,32-32c0-9.603-4.339-18.13-11.059-24h38.118c-6.72,5.87-11.059,14.397-11.059,24 c0,17.645,14.355,32,32,32s32-14.355,32-32c0-9.603-4.339-18.13-11.059-24H384c8.836,0,16-7.164,16-16s-7.164-16-16-16H181.547 l-5.36-32H400.96c7.84,0,14.56-5.68,15.84-13.36l20.08-120C438.322,185.843,432.333,177.825,423.936,176.316z M240,432 c-8.824,0-16-7.176-16-16s7.176-16,16-16s16,7.176,16,16S248.824,432,240,432z M320,432c-8.824,0-16-7.176-16-16s7.176-16,16-16 s16,7.176,16,16S328.824,432,320,432z M352,107.531c0-3.449,2.199-6.5,5.473-7.59l16-5.332c5.099-1.727,10.527,2.068,10.527,7.59 V120h-32v-8V107.531z M341.742,251.543c3.523,4.426,2.813,11.449-1.621,15.984c-0.008,0.008-0.012,0.012-0.016,0.016L320.191,288 l-19.961-20.441c-4.402-4.555-5.094-11.59-1.57-16.02c4.11-5.172,11.332-5.409,15.758-0.848c1.508,1.555,3.578,2.43,5.742,2.43 c0.008,0,0.012,0,0.02,0c2.172-0.004,4.246-0.891,5.75-2.457C330.233,246.175,337.577,246.385,341.742,251.543z M304,176v-40h32v40 H304z M312,104h16c4.41,0,8,3.59,8,8v8h-32v-8C304,107.59,307.59,104,312,104z M256,102.199c0-5.464,5.323-9.315,10.531-7.59 l15.996,5.332c3.273,1.09,5.473,4.141,5.473,7.59V112v8h-32V102.199z M240,136h8h40v40h-56v-32C232,139.59,235.59,136,240,136z M184,176V96c0-4.41,3.59-8,8-8h16c4.41,0,8,3.59,8,8v48v32H184z M258.72,290.48l-32.48-32.88c-11.84-12-13.92-31.2-3.6-44.64 c12.4-16.16,35.52-17.2,49.36-3.2c13.84-14,36.96-12.96,49.36,3.2c4.379,5.671,6.392,12.375,6.5,19.127 c-2.981,0.668-5.49,1.678-7.708,2.964c-4.379-2.543-9.406-3.797-14.547-3.559c-7.574,0.375-14.668,4.051-19.469,10.086 c-8.566,10.766-7.449,26.715,2.574,37.086l4.098,4.196l-7.528,7.62C277.92,297.84,266.08,297.84,258.72,290.48z M352,176v-40h40h8 c4.41,0,8,3.59,8,8v32H352z"></path> </g> <g id="Layer_1"></g> </g></svg>
                </a>
            </div>
        </nav>
    );
};

export default Navigation;
