"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useState } from "react";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [isValidationSuccess, setIsValidationSuccess] = useState(false);

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPdfUploaded(true);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleVerification = () => {
    if (field1 && field2 && selectedOption) {
      // Si todos los campos están completos
      setValidationMessage("Validación exitosa");
      setIsValidationSuccess(true);
    } else {
      // Si falta completar algún campo
      setValidationMessage("Validación fallida: Por favor, complete todos los campos.");
      setIsValidationSuccess(false);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        {/* Input para subir PDF */}
        <div className="mt-8">
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
          />
        </div>

        {/* Formulario de verificación, se muestra si un PDF ha sido subido */}
        {pdfUploaded && (
          <div className="mt-8 w-full max-w-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerification();
              }}
              className="bg-base-100 px-8 py-6 rounded-3xl"
            >
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">
                  Nombre del estudiante:
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">
                  CI:
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={field2}
                  onChange={(e) => setField2(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Verificación
              </button>
            </form>
          </div>
        )}

        {/* Mostrar mensaje de validación */}
        {validationMessage && (
          <div
            className={`mt-4 px-4 py-2 rounded text-white w-full max-w-md text-center ${
              isValidationSuccess ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {validationMessage}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
