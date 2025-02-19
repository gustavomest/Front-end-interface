const windowsService = require("../../infrastructure/windowsService");

exports.start = async (serviceName) => {
  const service = await windowsService.start(serviceName);
  if (!service)
    throw new Error(`Não foi possível iniciar o serviço ${serviceName}`);
};

exports.stop = async (serviceName) => {
  const service = await windowsService.stop(serviceName);
  if (!service)
    throw new Error(`Não foi possível parar o serviço ${serviceName}`);
};

exports.getStatus = async (serviceName) => {
  const service = await windowsService.status(serviceName);
  return service ? "em execução" : "não encontrado";
};
