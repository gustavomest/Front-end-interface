import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Caminho para o JSON fora da pasta `public`
const filePath = path.resolve(process.cwd(), "data", "interface.json");

// Definir o tipo para as portas
type PortConfig = {
  port: string;
  baudrate: number;
  timeout: number;
  driver: string;
};

// Função para obter os dados do JSON
export async function GET() {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    console.error("Erro ao ler o arquivo JSON", err);
    return NextResponse.json({ error: "Erro ao ler o arquivo JSON" }, { status: 500 });
  }
}

// Função para salvar os dados no JSON sem sobrescrever tudo
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // Validação: Verificar se o corpo da requisição contém os dados necessários
    if (!body || !body.connector) {
      return NextResponse.json({ error: "Dados inválidos ou incompletos" }, { status: 400 });
    }

    // Ler o JSON atual antes de modificar
    const currentData = JSON.parse(await fs.promises.readFile(filePath, "utf-8"));

    // Atualiza apenas os campos desejados, mantendo a estrutura original
    const updatedData = {
      ...currentData,
      ...body, // Atualiza apenas os campos enviados na requisição
      connector: {
        ...currentData.connector,
        ...body.connector,
        serial: {
          ...currentData.connector.serial,
          ...body.connector?.serial,
          ports: body.connector?.serial?.ports
            ? body.connector.serial.ports.map((portConfig: PortConfig) => ({
                ...portConfig,
                port: portConfig.port || "/dev/ttyUSB0" // Atualiza apenas o campo `port` com valor padrão
              }))
            : currentData.connector.serial.ports
        }
      }
    };

    // Remover a configuração de FTP se existir
    if (updatedData.connector?.ftp) {
      delete updatedData.connector.ftp;
    }

    // Salvar o JSON atualizado
    await fs.promises.writeFile(filePath, JSON.stringify(updatedData, null, 2));

    return NextResponse.json({ message: "Configuração atualizada com sucesso!", data: updatedData });
  } catch (err) {
    console.error("Erro ao salvar o arquivo JSON", err);
    return NextResponse.json({ error: "Erro ao salvar o arquivo JSON" }, { status: 500 });
  }
}
