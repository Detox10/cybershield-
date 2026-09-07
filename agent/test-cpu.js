const os = require('os');

let prevCpuIdle = 0;
let prevCpuTotal = 0;

const initialCpus = os.cpus();
for (const core of initialCpus) {
  for (const type in core.times) {
    prevCpuTotal += core.times[type];
  }
  prevCpuIdle += core.times.idle;
}

function test() {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;
  for (const core of cpus) {
    for (const type in core.times) {
      total += core.times[type];
    }
    idle += core.times.idle;
  }
  
  let loadPercent = 0;
  if (prevCpuTotal !== 0) {
    const idleDelta = idle - prevCpuIdle;
    const totalDelta = total - prevCpuTotal;
    if (totalDelta > 0) {
      loadPercent = Math.round(100 - (100 * idleDelta / totalDelta));
    }
    console.log(`totalDelta: ${totalDelta}, idleDelta: ${idleDelta}, loadPercent: ${loadPercent}`);
  }
  prevCpuIdle = idle;
  prevCpuTotal = total;
}

setInterval(test, 1500);
