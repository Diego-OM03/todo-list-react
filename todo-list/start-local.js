const { exec } = require("child_process");
const internalIp = require("internal-ip");

async function startReactApp() {
  const ip = await internalIp.v4();

  if (!ip) {
    console.error("No se pudo obtener la IP local.");
    process.exit(1);
  }

  const command = `set HOST=${ip} && npm run react-start`;
  console.log(`Iniciando React en http://${ip}:3000`);
  exec(command, { stdio: "inherit", shell: true });
}

startReactApp();
