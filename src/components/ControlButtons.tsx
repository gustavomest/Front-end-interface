type Props = {
  onStatusChange: (newStatus: string) => void; // Aceita um argumento do tipo string
};

export default function ControlButtons({ onStatusChange }: Props) {
  const handleAction = async (action: "start" | "stop") => {
    await fetch(`http://localhost:3000/servico/${action}`, { method: "POST" });

    onStatusChange(action === "start" ? "Ativo" : "Inativo");
  };

  return (
    <div className="flex space-x-4">
      <button
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        onClick={() => handleAction("start")}
      >
        Iniciar
      </button>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        onClick={() => handleAction("stop")}
      >
        Parar
      </button>
    </div>
  );
}
