'use client';

import { useState } from "react";
import StatusDisplay from "@/components/StatusDisplay";
import ControlButtons from "@/components/ControlButtons";
import ConfigModal from "@/components/ConfigModal";
import { Settings } from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("Ativo");
  const serviceName = "NomeDoSeuServico"; // Ajuste para o nome correto

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6">
      <div className="relative w-full max-w-4xl mx-auto p-6 bg-white bg-opacity-20 rounded-lg shadow-2xl backdrop-blur-md">
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-blue-500 transform hover:scale-110"
        >
          <Settings size={24} />
        </button>

        <h1 className="text-4xl font-bold mb-8">Painel de Controle</h1>

        {/* Exibição do Status */}
        <StatusDisplay status={status} />

        {/* Botões de Controle */}
        <ControlButtons serviceName={serviceName} onStatusChange={handleStatusChange} />

        {/* Modal de Configurações */}
        <ConfigModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </main>
  );
}