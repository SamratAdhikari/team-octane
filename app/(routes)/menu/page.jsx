"use client"; // Ensure this file is rendered on the client side

import { useEffect, useState } from "react";
import MenuCard from "./_components/MenuCard";
import { Skeleton } from "@mui/material";
import { useUser } from "../../context/UserContext";
import ChatBot from "./_components/ChatBot/ChatBot";

const Menu = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { contextUser, setContextUser } = useUser();
    const [isChatOpen, setIsChatOpen] = useState(false); // State to control if chat is open

    useEffect(() => {
        // Get the query parameter from the window.location.search
        const queryParams = new URLSearchParams(window.location.search);
        const id = queryParams.get("id"); // Extract the 'id' from the URL
        console.log("Id here is:", id);

        setContextUser(id);
        const fetchItems = async () => {
            try {
                const response = await fetch(`/api/item/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch items");
                }
                const data = await response.json();
                setItems(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            // If the ID is found, fetch items
            fetchItems();
        }
    }, []); // Empty dependency array to run only once when the component is mounted

    useEffect(() => {
        if (contextUser) {
            console.log("hello from there", contextUser);
        }
    }, [contextUser]);

    return (
        <div className="w-full h-full p-4 flex flex-col justify-center">
            <div
                style={{
                    fontWeight: "500",
                    marginTop: "2vh",
                    marginBottom: "1vh",
                }}
                className="w-full text-center text-xl flex justify-start pl-4"
            >
                Items on the menu
            </div>

            <div className="flex justify-around items-center gap-4 flex-wrap mt-8 w-full px-4">
                {/* Skeleton Loading */}
                {loading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            variant="rectangular"
                            width={350}
                            height={400}
                            animation="wave"
                            className="rounded-lg"
                        />
                    ))
                ) : error ? (
                    <div className="text-red-500">Error: {error}</div>
                ) : (
                    // Map over items and render MenuCard for each item
                    items.map((item) => <MenuCard key={item._id} item={item} />)
                )}
            </div>

            {/* ChatBot should only appear once items are loaded */}
            {items.length > 0 && (
                <div
                    className="fixed bottom-10 right-10 cursor-pointer"
                    onClick={() => setIsChatOpen(!isChatOpen)} // Toggle chat open/close
                >
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <span>🤖</span> {/* ChatBot Circle Icon */}
                    </div>
                </div>
            )}

            {/* Display ChatBot if isChatOpen is true */}
            {isChatOpen && <ChatBot />}
        </div>
    );
};

export default Menu;
