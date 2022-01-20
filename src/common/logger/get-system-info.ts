import OS from "os";
import { execSync } from "child_process";

export function getSystemInfo () : string {
  return `System Information:
    OS: ${OS.release()} ${OS.type()} ${OS.arch()}
    Node Version: ${process.version}
    NPM Version: v${execSync("npm -v").toString().trim()}
    System RAM: ${Math.round((OS.totalmem()/Math.pow(2,10*3)*10))/10} GB
    CPU: ${parseCPUInfo()}`;
}

function parseCPUInfo () : string {
  const cpus = OS.cpus();
  const parsedInfo : { cores : number, model : string }[] = [];
  cpus.forEach(cpu => {
    const model = parsedInfo.find(info => cpu.model === info.model);
    if(model === undefined) parsedInfo.push({ model: cpu.model, cores: 1 });
    else model.cores++;
  });
  const infoArray = parsedInfo.map(value => `${value.cores}x ${value.model}`);
  return infoArray.join(" | ");
}
