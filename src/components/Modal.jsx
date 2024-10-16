import React from "react";
import image from "../assets/modal.png"; // Assuming this is a placeholder image for the modal

function Modal(props) {
    // Destructure the prediction data for easier access
    const { predicted_class, venomous_status, image_url } = props.data || {};

    return (
        <div className="w-[500px] h-[500px] rounded-xl bg-secondary shadow-md flex flex-col p-6 ml-[330px] backdrop-blur-sm">
            <div className="flex justify-end">
                <button
                    className="bg-transparent border-none text-2xl cursor-pointer text-primary font-bold"
                    onClick={() => {
                        props.setIsOpen(false);
                    }}
                >
                    X
                </button>
            </div>
            <div className="block text-center text-3xl mt-3 font-semibold">
                <h1>Predicted Snake Species:</h1>
                <img
                    src={image}
                    alt="modal_img"
                    className="object-cover opacity-80 tra"
                />
            </div>
            <div className="flex-[50%] flex flex-col justify-center items-center text-center text-2xl font-bold text-primary">
                {props.data ? (
                    <>
                        <p>Species: <span className="font-normal">{predicted_class}</span></p>
                        <p>Venomous Status: <span className="font-normal">{venomous_status}</span></p>
                        {image_url && (
                            <img
                                src={image_url}
                                alt="Predicted snake"
                                className="mt-4 rounded-md"
                            />
                        )}
                    </>
                ) : (
                    <p>No prediction data available.</p>
                )}
            </div>
        </div>
    );
}

export default Modal;
