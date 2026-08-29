import { spawn } from 'child_process';

console.log('================================================================');
console.log('  🚀 Launching InternX Zenith Real-Time Platform (Full-Stack)');
console.log('  🔗 Backend Port : 8080 (REST API & Real-Time Stream)');
console.log('  💻 Frontend Port: 3000 / 5173 (React 18 + Vite)');
console.log('================================================================\n');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

const server = spawn('node', ['internx-server/src/server.js'], {
  stdio: 'inherit',
  shell: isWin
});

const frontend = spawn(npmCmd, ['run', 'dev', '--workspace=internx-frontend'], {
  stdio: 'inherit',
  shell: isWin
});

const cleanup = () => {
  console.log('\n🛑 Shutting down InternX development servers...');
  server.kill();
  frontend.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
