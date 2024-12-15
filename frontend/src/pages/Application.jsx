import React, { useState } from "react";
import Column from "../components/Column";
import JsonBox from "../components/JsonBox";
import Swal from "sweetalert2";
import { TbArrowBigRightFilled } from "react-icons/tb";
import * as XLSX from "xlsx";

const Application = () => {
    const [leftEnabled, setLeftEnabled] = useState(true);
    const [rightEnabled, setRightEnabled] = useState(true);
    const [leftFile, setLeftFile] = useState(null);
    const [rightFile, setRightFile] = useState(null);
    const [textareaContent, setTextareaContent] = useState("");
    const [jsonResult, setJsonResult] = useState(null);

    // File upload handling
    const handleFileSelect = (side, e) => {
        const file = e.target.files[0] || null;
        if (side === "left") setLeftFile(file);
        if (side === "right") setRightFile(file);
    };

    // Function to initiate download
    const initiateDownload = (url) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = ""; // Server-side should specify the file name
        link.click();
    };

    // Generate CSV file
    const generateCSV = () => {
        if (!jsonResult) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No data to export!",
            });
            return;
        }
    
        const flattenJSON = (obj, parentKey = "") => {
            const rows = [];
            const recursiveFlatten = (obj, parentKey = "") => {
                Object.keys(obj).forEach((key) => {
                    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    
                    if (Array.isArray(obj[key])) {
                        if (obj[key].every((item) => typeof item === "string" || typeof item === "number")) {
                            rows.push({ Key: fullKey, Value: obj[key].join(", ") });
                        } else {
                            obj[key].forEach((item, index) => {
                                recursiveFlatten(item, `${fullKey}[${index}]`);
                            });
                        }
                    } else if (typeof obj[key] === "object" && obj[key] !== null) {
                        recursiveFlatten(obj[key], fullKey);
                    } else {
                        rows.push({ Key: fullKey, Value: obj[key] });
                    }
                });
            };
            recursiveFlatten(obj, parentKey);
            return rows;
        };
    
        const data = flattenJSON(jsonResult);
    
        const headers = ["Key", "Value"];
        const csvRows = [headers.join(",")];
    
        data.forEach((row) => {
            let key = row.Key.replace(/^extractedData\./, "");
            const values = [key, row.Value];
            csvRows.push(values.map((v) => `"${v}"`).join(","));
        });
    
        const csvContent = `data:text/csv;charset=utf-8,${csvRows.join("\n")}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Generate XLSX file
    const generateXLSX = () => {
        if (!jsonResult) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No data to export!",
            });
            return;
        }

        const flattenJSON = (obj, parentKey = "") => {
            const rows = [];
            const recursiveFlatten = (obj, parentKey = "") => {
                Object.keys(obj).forEach((key) => {
                    const fullKey = parentKey ? `${parentKey}.${key}` : key;
                    if (typeof obj[key] === "object" && obj[key] !== null) {
                        recursiveFlatten(obj[key], fullKey);
                    } else {
                        rows.push({ Key: fullKey, Value: obj[key] });
                    }
                });
            };
            recursiveFlatten(obj, parentKey);
            return rows;
        };

        const data = flattenJSON(jsonResult);

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Extracted Data");

        XLSX.writeFile(wb, "data.xlsx");
    };

    // Process data
    const handleProcess = async () => {
        if (!textareaContent.trim()) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Textarea content is missing.",
            });
            return;
        }

        if (leftEnabled && !leftFile) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Left file is missing.",
            });
            return;
        }

        if (rightEnabled && !rightFile) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Right file is missing.",
            });
            return;
        }

        Swal.fire({
            title: "Processing...",
            html: `<div class="swal2-loader"></div>`,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const formData = new FormData();
        formData.append("query", textareaContent.trim());
        formData.append("enableExtract", leftEnabled.toString());
        formData.append("enableFill", rightEnabled.toString());

        if (leftEnabled && leftFile) {
            formData.append("files", leftFile);
        }

        if (rightEnabled && rightFile) {
            formData.append("files", rightFile);
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/process/`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setJsonResult(result);

                if (result.downloadLink) {
                    initiateDownload(`${process.env.REACT_APP_API_BASE_URL}${result.downloadLink}`);
                }

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Processing completed!",
                });
            } else {
                const errorText = await response.text();
                Swal.fire({
                    icon: "error",
                    title: "Backend error",
                    text: errorText || "Unknown error!",
                });
            }
        } catch (error) {
            console.error("Request error:", error);
            Swal.fire({
                icon: "error",
                title: "Network error",
                text: "Unable to contact the server.",
            });
        }
    };

    return (
        <div className="w-full h-screen grid lg:grid-cols-[1fr_auto_1fr_auto_1fr] grid-rows-[auto] lg:grid-rows-none lg:gap-0 gap-4 p-4 lg:p-0">
            <Column
                title="Extraction"
                enabled={leftEnabled}
                toggleEnabled={() => setLeftEnabled(!leftEnabled)}
                onFileSelect={(e) => handleFileSelect("left", e)}
                fileName={leftFile?.name || ""}
            />
            <div
                className={`flex items-center justify-center ${
                    leftEnabled ? "text-green-500" : "text-red-500"
                } mx-4`}
            >
                <button
                    onClick={() => setLeftEnabled(!leftEnabled)}
                    className="cursor-pointer hover:scale-110 transition-transform"
                >
                    <TbArrowBigRightFilled
                        size={48}
                        className={`${
                            leftEnabled ? "text-green-500" : "text-red-500"
                        } transform lg:rotate-0 rotate-90`}
                    />
                </button>
            </div>
            <div className="border rounded-lg bg-gray-50 flex flex-col p-6 relative">
                <textarea
                    className="w-full h-2/3 border rounded-lg p-4 text-sm resize-none mb-6"
                    placeholder="Data to extract here..."
                    value={textareaContent}
                    onChange={(e) => setTextareaContent(e.target.value)}
                ></textarea>
                <button
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg mb-6"
                    onClick={handleProcess}
                >
                    Process
                </button>
                <JsonBox
                    jsonContent={jsonResult || {}}
                    onCopy={(e) => {
                        navigator.clipboard.writeText(
                            JSON.stringify(jsonResult || {}, null, 2)
                        );
                        const button = e.target;
                        button.textContent = "Copied!";
                        setTimeout(() => {
                            button.textContent = "Copy";
                        }, 1000);
                    }}
                />
                <div className="flex justify-end space-x-4 mt-4">
                    <img
                        src="/assets/images/csv-file.png"
                        alt="CSV Icon"
                        className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                        title="Download CSV"
                        onClick={generateCSV}
                    />
                    <img
                        src="/assets/images/xlsx.png"
                        alt="XLSX Icon"
                        className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                        title="Download XLSX"
                        onClick={generateXLSX}
                    />
                </div>
            </div>
            <div
                className={`flex items-center justify-center ${
                    rightEnabled ? "text-green-500" : "text-red-500"
                } mx-4`}
            >
                <button
                    onClick={() => setRightEnabled(!rightEnabled)}
                    className="cursor-pointer hover:scale-110 transition-transform"
                >
                    <TbArrowBigRightFilled
                        size={48}
                        className={`${
                            rightEnabled ? "text-green-500" : "text-red-500"
                        } transform lg:rotate-0 rotate-90`}
                    />
                </button>
            </div>
            <Column
                title="Filling"
                enabled={rightEnabled}
                toggleEnabled={() => setRightEnabled(!rightEnabled)}
                onFileSelect={(e) => handleFileSelect("right", e)}
                fileName={rightFile?.name || ""}
            />
        </div>
    );
};

export default Application;
