const net = require("net");
const { spawn } = require("child_process");

const DEFAULT_PORT = 4200;
const MAX_PORT = 65535;

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, "127.0.0.1");
  });
}

async function findAvailablePort(startPort) {
  for (let port = startPort; port <= MAX_PORT; port += 1) {
    // Busca el siguiente puerto libre si el predeterminado esta ocupado.
    if (await isPortAvailable(port)) {
      return port;
    }
  }

  throw new Error("No se encontro ningun puerto disponible.");
}

async function run() {
  const selectedPort = await findAvailablePort(DEFAULT_PORT);

  if (selectedPort !== DEFAULT_PORT) {
    console.log(
      `El puerto ${DEFAULT_PORT} esta ocupado. Arrancando en ${selectedPort}...`
    );
  } else {
    console.log(`Arrancando en puerto ${selectedPort}...`);
  }

  const extraArgs = process.argv.slice(2);
  const ngCliPath = require.resolve("@angular/cli/bin/ng.js");
  const args = [ngCliPath, "serve", "--port", String(selectedPort), ...extraArgs];

  const child = spawn(process.execPath, args, {
    stdio: "inherit",
    shell: false,
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

run().catch((error) => {
  console.error("No se pudo arrancar la app:", error.message);
  process.exit(1);
});
