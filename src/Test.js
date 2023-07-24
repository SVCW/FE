import React, { useState } from "react";

const Test = () => {
    const [yourArray, setYourArray] = useState([
        { id: 1, title: "Object 1", isJoined: false },
        { id: 2, title: "Object 2", isJoined: false },
        // ...
    ]);

    const handleJoinClick = (index) => {
        setYourArray((prevArray) => {
            // Deep copy the array using JSON.parse and JSON.stringify
            const newArray = JSON.parse(JSON.stringify(prevArray));
            newArray[index].isJoined = !newArray[index].isJoined; // Toggle the state when clicking the button
            return newArray;
        });
    };

    return (
        <div>
            {yourArray.map((item, index) => (
                <button
                    key={item.id}
                    className="btn btn-success ml-3 mb-4 mt-4"
                    onClick={() => handleJoinClick(index)}
                >
                    {item.isJoined ? "Hủy Tham Gia" : "Tham Gia"}
                </button>
            ))}
        </div>
    );
};

export default Test;