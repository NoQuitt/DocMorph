import React, { useState } from "react";
import Column from "./components/Column";
import JsonBox from "./components/JsonBox";
import Swal from "sweetalert2";
import { TbArrowBigRightFilled } from "react-icons/tb";

const App = () => {
    const [leftEnabled, setLeftEnabled] = useState(true);
    const [rightEnabled, setRightEnabled] = useState(true);
    const [leftFile, setLeftFile] = useState(null);
    const [rightFile, setRightFile] = useState(null);
    const [textareaContent, setTextareaContent] = useState("");
    const [jsonResult, setJsonResult] = useState(null);

    // Gestione del caricamento file
    const handleFileSelect = (side, e) => {
        const file = e.target.files[0] || null;
        if (side === "left") setLeftFile(file);
        if (side === "right") setRightFile(file);
    };

    // Funzione per inviare i dati al backend
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

        // Mostra il SweetAlert con la barra di caricamento
        Swal.fire({
            title: "Elaborazione in corso...",
            html: '<div class="w-full bg-gray-200 rounded-full"><div class="bg-blue-500 text-xs font-medium text-blue-100 text-center p-1 leading-none rounded-full" style="width: 0%;" id="loading-bar">0%</div></div>',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        // Simula il progresso
        const updateProgress = (progress) => {
            const loadingBar = document.getElementById("loading-bar");
            if (loadingBar) {
                loadingBar.style.width = `${progress}%`;
                loadingBar.textContent = `${progress}%`;
            }
        };

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            updateProgress(progress);
            if (progress >= 100) clearInterval(interval);
        }, 300);

        try {
            const response = await fetch("http://localhost:3000/process/", {
                method: "POST",
                body: new FormData(),
            });

            if (response.ok) {
                const result = await response.json();
                setJsonResult(result);
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
        } finally {
            clearInterval(interval); // Ferma l'intervallo
            Swal.close(); // Chiude la finestra di caricamento
        }
    };

    const toggleZone = (zone) => {
        if (zone === "left") {
            setLeftEnabled(!leftEnabled);
        } else if (zone === "right") {
            setRightEnabled(!rightEnabled);
        }
    };

    return (
        <div className="w-full h-screen grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-0">
            {/* Colonna sinistra */}
            <Column
                title="Estrazione"
                enabled={leftEnabled}
                toggleEnabled={() => setLeftEnabled(!leftEnabled)}
                onFileSelect={(e) => handleFileSelect("left", e)}
                fileName={leftFile?.name || ""}
            />

            {/* Freccia tra sinistra e centro */}
            <div
                className={`flex items-center justify-center ${
                    leftEnabled ? "text-green-500" : "text-red-500"
                } mx-4`}
            >
                <button
                    onClick={() => toggleZone("left")}
                    className="cursor-pointer hover:scale-110 transition-transform"
                >
                    <TbArrowBigRightFilled
                        size={48}
                        className={leftEnabled ? "text-green-500" : "text-red-500"}
                    />
                </button>
            </div>

            {/* Colonna centrale */}
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
                        const originalText = button.textContent;
                        button.textContent = "Copiato!";
                        setTimeout(() => {
                            button.textContent = originalText;
                        }, 1000);
                    }}
                />
                <div className="flex justify-end space-x-4 mt-4">
                    <img
                        src="https://i.ibb.co/s5vwsZk/csv-file.png"
                        alt="CSV Icon"
                        className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                        title="Scarica CSV"
                    />
                    <img
                        src="https://i.ibb.co/8BrYpCy/xlsx.png"
                        alt="XLSX Icon"
                        className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                        title="Scarica XLSX"
                    />
                </div>
            </div>

            {/* Freccia tra centro e destra */}
            <div
                className={`flex items-center justify-center ${
                    rightEnabled ? "text-green-500" : "text-red-500"
                } mx-4`}
            >
                <button
                    onClick={() => toggleZone("right")}
                    className="cursor-pointer hover:scale-110 transition-transform"
                >
                    <TbArrowBigRightFilled
                        size={48}
                        className={rightEnabled ? "text-green-500" : "text-red-500"}
                    />
                </button>
            </div>

            {/* Colonna destra */}
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
