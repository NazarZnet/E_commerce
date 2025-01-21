import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ProductComment } from "../interfaces/product";
import { deleteComment, refreshAccessToken, saveComment } from "../utils/api";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { updateTokens } from "../redux/slices/authSlice";

const CommentsList: React.FC<{ product_comments: ProductComment[], productId: number }> = ({ product_comments, productId }) => {
    const [newComment, setNewComment] = useState<string>("");
    const [rating, setRating] = useState<number>(0); // Selected rating
    const [hoverRating, setHoverRating] = useState<number>(0); // Hovered rating
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<ProductComment[]>(product_comments);

    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const accessToken = useSelector((state: RootState) => state.auth.access_token);
    const refreshToken = useSelector((state: RootState) => state.auth.refresh_token);
    const dispatch = useDispatch();

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!rating || !newComment.trim()) {
            setError("Both rating and comment are required.");
            return;
        }

        try {
            // Call the saveComment function
            let comment = await saveComment({
                product: productId,
                comment: newComment.trim(),
                rating,
            }, accessToken);

            setComments((comments) => [comment, ...comments]);


            // Clear inputs
            setNewComment("");
            setRating(0);
            setHoverRating(0);
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


                    let comment = await saveComment({
                        product: productId,
                        comment: newComment.trim(),
                        rating,
                    }, accessToken);

                    setComments((comments) => [comment, ...comments]);

                    // Clear inputs
                    setNewComment("");
                    setRating(0);
                    setHoverRating(0);

                } catch (refreshError) {
                    console.error("Failed to refresh tokens:", refreshError);
                    navigate("/login");
                }
            } else {
                console.error("Error saving comment:", err);
                navigate("/login");
            }
        }
    }


    const handleDeleteComment = async (commentId: number) => {
        try {
            await deleteComment(accessToken, commentId);
            setComments((comments) => comments.filter((c) => c.id !== commentId)); // Update UI
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
                    await deleteComment(accessToken, commentId);

                } catch (refreshError) {
                    console.error("Failed to refresh tokens:", refreshError);
                    setError("Failed to delete the comment. Try again later");
                }
            } else {
                console.error("Error deleting profile:", err);
                setError("Failed to delete the comment. Try again later");
            }
        }
    };

    const renderStars = (currentRating: number) => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;

            return (
                <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-8 h-8 cursor-pointer ${starValue <= currentRating ? "text-orange-500" : "text-gray-300"
                        }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(starValue)}
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            );
        });
    };

    return (
        <div className="mt-12 max-w-4xl mx-auto">
            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="my-8">
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                        {renderStars(hoverRating || rating)}
                    </div>
                </div>
                <textarea
                    className="w-full border rounded-lg p-2 mb-4"
                    placeholder="Write your review..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                ></textarea>

                {error && <p className="text-red-500">{error}</p>}

                <button
                    type="submit"
                    className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition"
                >
                    Submit
                </button>
            </form>

            {/* Display Comments */}
            <div className="space-y-6">
                {comments?.map((comment) => (
                    <div key={comment.id} className="p-4 bg-gray-100 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <p className="font-semibold">{comment.user.first_name}</p>
                                <div className="flex items-center">
                                    {Array(comment.rating)
                                        .fill(0)
                                        .map((_, index) => (
                                            <svg
                                                key={index}
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4 text-orange-500"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ))}
                                </div>
                            </div>
                            {user?.email === comment.user.email && (
                                <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentsList;