import React, { useState } from "react";
import Column from "./components/Column";
import JsonBox from "./components/JsonBox";
import Swal from "sweetalert2";
import { TbArrowBigRightFilled } from "react-icons/tb";
import * as XLSX from "xlsx";

const App = () => {
    const [leftEnabled, setLeftEnabled] = useState(true);
    const [rightEnabled, setRightEnabled] = useState(true);
    const [leftFile, setLeftFile] = useState(null);
    const [rightFile, setRightFile] = useState(null);
    const [textareaContent, setTextareaContent] = useState("");
    const [jsonResult, setJsonResult] = useState(null);

    // Gestione caricamento file
    const handleFileSelect = (side, e) => {
        const file = e.target.files[0] || null;
        if (side === "left") setLeftFile(file);
        if (side === "right") setRightFile(file);
    };

    // Funzione per avviare il download
    const initiateDownload = (url) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = ""; // Lato server deve specificare il nome del file
        link.click();
    };

    // Generazione file CSV
    const generateCSV = () => {
        if (!jsonResult) {
            Swal.fire({
                icon: "error",
                title: "Errore",
                text: "Nessun dato da esportare!",
            });
            return;
        }
    
        const flattenJSON = (obj, parentKey = "") => {
            const rows = [];
            const recursiveFlatten = (obj, parentKey = "") => {
                Object.keys(obj).forEach((key) => {
                    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    
                    if (Array.isArray(obj[key])) {
                        // Se l'array contiene stringhe o valori scalari, aggiungilo direttamente
                        if (obj[key].every((item) => typeof item === "string" || typeof item === "number")) {
                            rows.push({ Key: fullKey, Value: obj[key].join(", ") }); // Unisci gli elementi dell'array
                        } else {
                            // Altrimenti, itera sugli elementi dell'array
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
    
        // Genera il contenuto CSV
        const headers = ["Key", "Value"];
        const csvRows = [headers.join(",")]; // Header row
    
        data.forEach((row) => {
            let key = row.Key.replace(/^extractedData\./, ""); // Rimuovi 'extractedData.'
            const values = [key, row.Value];
            csvRows.push(values.map((v) => `"${v}"`).join(",")); // Escape valori con virgolette
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
    

    // Generazione file XLSX
    const generateXLSX = () => {
        if (!jsonResult) {
            Swal.fire({
                icon: "error",
                title: "Errore",
                text: "Nessun dato da esportare!",
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
        XLSX.utils.book_append_sheet(wb, ws, "Dati Estratti");

        XLSX.writeFile(wb, "data.xlsx");
    };

    // Funzione per elaborare i dati
    const handleProcess = async () => {
        if (!textareaContent.trim()) {
            Swal.fire({
                icon: "error",
                title: "Errore",
                text: "Manca il testo nella textarea.",
            });
            return;
        }

        if (leftEnabled && !leftFile) {
            Swal.fire({
                icon: "error",
                title: "Errore",
                text: "Manca il file di sinistra.",
            });
            return;
        }

        if (rightEnabled && !rightFile) {
            Swal.fire({
                icon: "error",
                title: "Errore",
                text: "Manca il file di destra.",
            });
            return;
        }

        // Mostra barra di caricamento
        Swal.fire({
            title: "Elaborazione in corso...",
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
            const response = await fetch("http://localhost:3000/process/", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setJsonResult(result);

                // Scarica automaticamente il file se presente un downloadLink
                if (result.downloadLink) {
                    initiateDownload(`http://localhost:3000${result.downloadLink}`);
                }

                Swal.fire({
                    icon: "success",
                    title: "Successo",
                    text: "Elaborazione completata!",
                });
            } else {
                const errorText = await response.text();
                Swal.fire({
                    icon: "error",
                    title: "Errore nel backend",
                    text: errorText || "Errore sconosciuto!",
                });
            }
        } catch (error) {
            console.error("Errore nella richiesta:", error);
            Swal.fire({
                icon: "error",
                title: "Errore di rete",
                text: "Impossibile contattare il server.",
            });
        }
    };

    return (
        <div className="w-full h-screen grid lg:grid-cols-[1fr_auto_1fr_auto_1fr] grid-rows-[auto] lg:grid-rows-none lg:gap-0 gap-4 p-4 lg:p-0">
            <Column
                title="Estrazione"
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
                    placeholder="Dati da estrarre qui..."
                    value={textareaContent}
                    onChange={(e) => setTextareaContent(e.target.value)}
                ></textarea>
                <button
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg mb-6"
                    onClick={handleProcess}
                >
                    Elabora
                </button>
                <JsonBox
                    jsonContent={jsonResult || {}}
                    onCopy={(e) => {
                        navigator.clipboard.writeText(
                            JSON.stringify(jsonResult || {}, null, 2)
                        );
                        const button = e.target;
                        button.textContent = "Copiato!";
                        setTimeout(() => {
                            button.textContent = "Copia";
                        }, 1000);
                    }}
                />
                {/* Pulsanti per il download CSV e XLSX */}
                <div className="flex justify-end space-x-4 mt-4">
                    <img
                        src="https://i.ibb.co/s5vwsZk/csv-file.png"
                        alt="CSV Icon"
                        className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                        title="Scarica CSV"
                        onClick={generateCSV} // Funzione di download CSV
                    />
                    <img
                        src="https://i.ibb.co/8BrYpCy/xlsx.png"
                        alt="XLSX Icon"
                        className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                        title="Scarica XLSX"
                        onClick={generateXLSX} // Funzione di download XLSX
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
                title="Compilazione"
                enabled={rightEnabled}
                toggleEnabled={() => setRightEnabled(!rightEnabled)}
                onFileSelect={(e) => handleFileSelect("right", e)}
                fileName={rightFile?.name || ""}
            />
        </div>
    );
};

export default App;
