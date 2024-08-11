"use client";

import { useAccount } from "wagmi";
import { useState } from "react";
import { ethers } from "ethers";
import deployedContracts from "../contracts/deployedContracts"; // Ajusta la ruta si es necesario

const Home = () => {
  const { address: connectedAddress } = useAccount();
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [isValidationSuccess, setIsValidationSuccess] = useState(false);

  // Configuración del contrato
  const contractAddress = deployedContracts[31337].YourContract.address; // Usando la red local como ejemplo
  const contractABI = deployedContracts[31337].YourContract.abi;

  // Crear un proveedor y un signer usando ethers.js
  let provider: ethers.BrowserProvider | undefined;
  let signer: ethers.Signer | undefined;
  let contract: ethers.Contract | undefined;

  if (typeof window !== "undefined" && window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
  }

  // Manejar la subida del archivo PDF
  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPdfUploaded(true);
    } else {
      alert("Por favor, sube un archivo PDF válido.");
    }
  };

  // Manejar la validación del certificado
  const handleVerification = async () => {
    try {
      if (field1 && field2 && pdfFile && contract) {
        const hasSBT = await contract.verify(connectedAddress);

        if (hasSBT) {
          setValidationMessage("Validación exitosa: El certificado es válido.");
          setIsValidationSuccess(true);
        } else {
          setValidationMessage("Validación fallida: No posee el certificado requerido.");
          setIsValidationSuccess(false);
        }
      } else {
        setValidationMessage("Validación fallida: Por favor, complete todos los campos.");
        setIsValidationSuccess(false);
      }
    } catch (error) {
      console.error("Error en la verificación:", error);
      setValidationMessage("Error en la verificación. Consulte la consola para más detalles.");
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
