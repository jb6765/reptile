import React, { useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import CanvasTwo from "./canvas/Snake2";
import SectionWrapper from "../hoc/SectionWrapper";
import { slideIn } from "../utils/motion";
import Modal from "./Modal";
import axios from "axios";

const Identification = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [disable, setDisable] = useState(false);
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);
    const [msg, setMsg] = useState(null);
    const [danger, setIsDanger] = useState(false);

    const isValidFileUploaded = (file) => {
        const validExtensions = ["png", "jpeg", "jpg"];
        const fileExtension = file.type.split("/")[1];
        return validExtensions.includes(fileExtension);
    };

    const handleChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile && isValidFileUploaded(uploadedFile)) {
            setMsg("Valid file uploaded!");
            setIsDanger(false);
            setFile(uploadedFile);
            setDisable(true);
        } else {
            setIsDanger(true);
            setMsg("Invalid file uploaded! Please upload a png, jpeg, or jpg file.");
            setDisable(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMsg("Please upload a valid file!");
            setIsDanger(true);
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append("imagefile", file); // Ensure this key matches what Flask expects

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        try {
            const url = "http://localhost:5000/predict"; // Ensure the URL is correct
            const response = await axios.post(url, formData, config);
            console.log("API Response:", response.data);

            // Set the data for display
            setData(response.data); // Update data with the response from Flask
            setMsg("Prediction successful!");
            setIsDanger(false);
            setIsOpen(true); // Open the modal with the result
        } catch (err) {
            console.log("Error:", err);
            setMsg("Failed to predict, please try again.");
            setIsDanger(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isOpen ? (
                <Modal setIsOpen={setIsOpen} data={data} />
            ) : (
                <div className="xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden">
                    <motion.div
                        variants={slideIn("left", "tween", 0.2, 1)}
                        className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
                    >
                        <h3 className={styles.sectionHeadText}>Let's Identify It Here</h3>

                        <form className="mt-12 flex flex-col gap-8" onSubmit={handleSubmit}>
                            {/* File Upload Section */}
                            <label className={`flex flex-col rounded-xl uppercase ${disable ? 'bg-tertiary' : 'green-pink-gradient'} text-center px-10 py-3 shadow-md shadow-primary cursor-pointer`}>
                                <span className="text-white font-medium">{disable ? 'File Uploaded' : 'Upload File'}</span>
                                <input
                                    disabled={disable}
                                    name="imagefile"
                                    className="hidden"
                                    type="file"
                                    onChange={handleChange}
                                />
                            </label>

                            {/* Message Section */}
                            {msg && (
                                <label className={danger ? "text-red-500" : "text-green-500"}>
                                    {msg}
                                </label>
                            )}

                            {/* Submit Button Section */}
                            <button
                                type="submit"
                                className="bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? "Predicting..." : "Click to Predict"}
                            </button>
                        </form>
                    </motion.div>

                    <motion.div
                        variants={slideIn("right", "tween", 0.2, 1)}
                        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
                    >
                        <CanvasTwo />
                    </motion.div>
                </div>
            )}
        </>
    );
};

export default SectionWrapper(Identification, "identification");
