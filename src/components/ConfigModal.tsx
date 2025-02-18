"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type Licence = {
  token: string;
  domain: string;
};

type Port = {
  port: string;
  baudrate: number;
  timeout: number;
  driver: string;
};

type Connector = {
  serial: {
    enable: boolean;
    ports: Port[];
  };
  ethernet: {
    enable: boolean;
    port: number;
  };
};

type ConfigForm = {
  licence: Licence;
  connector: Connector;
};

export default function ConfigModal({ isOpen, onClose }: Props) {
  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<ConfigForm>({
    defaultValues: {
      licence: { token: "", domain: "" },
      connector: {
        serial: { enable: false, ports: [] },
        ethernet: { enable: false, port: 0 }
      }
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: "connector.serial.ports",
    control
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/config")
        .then((res) => res.json())
        .then((data) => {
          setValue("licence", data.licence || { token: "", domain: "" });
          setValue("connector", data.connector || {
            serial: { enable: false, ports: [] },
            ethernet: { enable: false, port: 0 },
          });
          setLoading(false);
        });
    }
  }, [isOpen, setValue]);

  const addPort = () => {
    append({ port: "/dev/usb0", baudrate: 9600, timeout: 1000, driver: "ftdi" });
  };

  const onSubmit = async (data: ConfigForm) => {
    try {
      const response = await fetch("/api/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Resposta da API:", result);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-500 opacity-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-[80%] max-w-3xl transform transition-all duration-300 scale-100 hover:scale-105">
        <h2 className="text-2xl font-bold mb-4 text-black animate__animated animate__fadeIn animate__delay-0.5s">Editar Configuração</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Licença */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black mb-2">Licença</h3>
            <label className="block text-sm font-medium text-gray-700 mt-2">Token</label>
            <input
              type="text"
              {...register("licence.token")}
              className="w-full p-3 border border-gray-300 rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
            />
            {errors.licence?.token && <p className="text-red-500 text-sm">{errors.licence.token.message}</p>}

            <label className="block text-sm font-medium text-gray-700 mt-4">Domain</label>
            <input
              type="text"
              {...register("licence.domain")}
              className="w-full p-3 border border-gray-300 rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
            />
            {errors.licence?.domain && <p className="text-red-500 text-sm">{errors.licence.domain.message}</p>}
          </div>

          {/* Connector */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black mb-2">Conector</h3>

            <div className="mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("connector.serial.enable")}
                  className="mr-2 h-5 w-5 text-blue-500"
                />
                Habilitar Serial
              </label>
            </div>

            <label className="block text-sm font-medium text-gray-700 mt-4">Porta Ethernet</label>
            <input
              type="number"
              {...register("connector.ethernet.port")}
              className="w-full p-3 border border-gray-300 rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
            />

            {/* Configurações das Portas Seriais */}
            {watch("connector.serial.enable") && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-black">Portas Seriais</h4>
                {fields.map((item, index) => (
                  <div key={item.id} className="mt-4">
                    <div className="flex space-x-6">
                      <div className="w-1/4">
                        <label className="block text-sm font-medium text-gray-700">Porta</label>
                        <input
                          type="text"
                          {...register(`connector.serial.ports.${index}.port` as const)}
                          className="w-full p-3 border border-gray-300 rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                        />
                      </div>
                      <div className="w-1/4">
                        <label className="block text-sm font-medium text-gray-700">Baudrate</label>
                        <input
                          type="number"
                          {...register(`connector.serial.ports.${index}.baudrate` as const)}
                          className="w-full p-3 border border-gray-300 rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                        />
                      </div>
                      <div className="w-1/4">
                        <label className="block text-sm font-medium text-gray-700">Timeout</label>
                        <input
                          type="number"
                          {...register(`connector.serial.ports.${index}.timeout` as const)}
                          className="w-full p-3 border border-gray-300 rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                        />
                      </div>
                      <div className="w-1/4">
                        <label className="block text-sm font-medium text-gray-700">Driver</label>
                        <input
                          type="text"
                          {...register(`connector.serial.ports.${index}.driver` as const)}
                          className="w-full p-3 border border-gray-300 rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="mt-2 text-red-500 hover:text-red-700"
                    >
                      Remover Porta
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPort}
                  className="mt-4 text-blue-500 hover:text-blue-700"
                >
                  Adicionar Porta
                </button>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-semibold text-gray-700 border rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
