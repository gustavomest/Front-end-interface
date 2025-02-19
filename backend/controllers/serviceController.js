const serviceService = require("../domain/service/serviceService");

exports.startService = async (req, res, next) => {
  try {
    const { serviceName } = req.params;
    const success = await serviceService.start(serviceName);
    if (success) {
      res.status(200).json({ message: `Serviço ${serviceName} iniciado.` });
    } else {
      res.status(500).json({ message: `Erro ao iniciar ${serviceName}.` });
    }
  } catch (error) {
    next(error);
  }
};

exports.stopService = async (req, res, next) => {
  try {
    const { serviceName } = req.params;
    const success = await serviceService.stop(serviceName);
    if (success) {
      res.status(200).json({ message: `Serviço ${serviceName} parado.` });
    } else {
      res.status(500).json({ message: `Erro ao parar ${serviceName}.` });
    }
  } catch (error) {
    next(error);
  }
};

exports.getServiceStatus = async (req, res, next) => {
  try {
    const { serviceName } = req.params;
    const isRunning = await serviceService.getStatus(serviceName);
    res.status(200).json({
      status: isRunning ? `O serviço ${serviceName} está ativo.` : `O serviço ${serviceName} não está em execução.`,
    });
  } catch (error) {
    next(error);
  }
};
