type Props = {
  onStatusChange: (newStatus: string) => void;
  serviceName: string;
};

export default function ControlButtons({ onStatusChange, serviceName }: Props) {
  const handleAction = async (action: "start" | "stop") => {
    const response = await fetch(`/api/service/${serviceName}`, {
      method: "PUT",
      body: JSON.stringify({ action }),
    });

    if (response.ok) {
      onStatusChange(action === "start" ? "Ativo" : "Inativo");
    }
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
