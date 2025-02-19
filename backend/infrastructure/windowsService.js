const { Service } = require("node-windows");

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    const exec = require("child_process").exec;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Erro ao executar comando: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
};

exports.start = async (serviceName) => {
  try {
    const command = `net start ${serviceName}`;
    await runCommand(command);
    return true;
  } catch (err) {
    return false;
  }
};

exports.stop = async (serviceName) => {
  try {
    const command = `net stop ${serviceName}`;
    await runCommand(command);
    return true;
  } catch (err) {
    return false;
  }
};

exports.status = async (serviceName) => {
  try {
    const command = `sc query ${serviceName}`;
    const result = await runCommand(command);
    return result.includes("RUNNING");
  } catch (err) {
    return false;
  }
};
