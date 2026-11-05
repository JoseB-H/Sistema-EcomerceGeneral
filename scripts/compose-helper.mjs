import { spawnSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { existsSync, realpathSync, readFileSync, writeFileSync, mkdirSync, openSync, closeSync, unlinkSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const purpose = 'io.yitverse.s01.purpose';
const owner = 'io.yitverse.s01.owner';
const services = ['frontend', 'backend', 'database'];
const networks = ['app', 'data'];
const dataPath = '/var/lib/postgresql/data';

export function validateProject(value) {
  if (!/^yitverse-s01(?:-[a-z0-9][a-z0-9-]*)?$/.test(value ?? '')) throw new Error('Invalid S01_COMPOSE_PROJECT');
  return value;
}

export function validateArgs(args) {
  if (!args.length || args.some(arg => /^(?:-p|-f|--project-name(?:=|$)|--file(?:=|$)|--project-directory(?:=|$)|--env-file(?:=|$)|--context(?:=|$)|--host(?:=|$))/.test(arg))) {
    throw new Error('Identity override is forbidden');
  }
  if (!['config', 'up', 'ps', 'exec', 'stop', 'start', 'restart', 'logs', 'build'].includes(args[0]) || args.includes('--remove-orphans')) {
    throw new Error('Destructive or unsupported Compose operation');
  }
}

function runDocker(args, { input, cwd } = {}) {
  const result = spawnSync('docker', args, { input, cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  if (result.error) throw new Error(`Docker unavailable: ${result.error.code}`);
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

export function createHelper({ root = resolve(import.meta.dirname, '..'), env = process.env, run = runDocker, inventoryReader, daemonReader } = {}) {
  root = realpathSync(root);
  const project = validateProject(env.S01_COMPOSE_PROJECT === undefined ? 'yitverse-s01' : env.S01_COMPOSE_PROJECT);
  const local = join(root, '.local');
  const statePath = join(local, 's01-test-environment.json');
  const overlay = join(local, 'compose.s01-tests.yml');
  let lockHeld = false;
  const raw = args => {
    const result = run(args, { cwd: root });
    if (result.status !== 0) throw new Error(`Docker ${args[0]} failed (${result.status}); inspect daemon/access before retrying`);
    return result.stdout.trim();
  };
  const daemonId = () => daemonReader ? daemonReader() : raw(['info', '--format', '{{.ID}}']);
  const record = () => {
    if (!existsSync(statePath)) throw new Error(`${project}: ownership record missing`);
    const value = JSON.parse(readFileSync(statePath, 'utf8'));
    if (value.project !== project || value.checkoutRealPath !== root || value.daemonId !== daemonId() || !value.ownerId) {
      throw new Error(`${project}: identity mismatch (checkout/daemon/project)`);
    }
    return value;
  };
  const inspectResources = () => {
    if (inventoryReader) return inventoryReader(project);
    const resources = [];
    const patterns = {
      container: `^/${project}[-_](frontend|backend|database)[-_][0-9]+$`,
      network: `^${project}_(app|data)$`, volume: `^${project}_postgres_data$`,
    };
    for (const kind of ['container', 'network', 'volume']) {
      const base = [kind, 'ls', ...(kind === 'container' ? ['-a'] : []), '-q'];
      const ids = new Set([
        ...raw([...base, '--filter', `label=com.docker.compose.project=${project}`]).split(/\s+/),
        ...raw([...base, '--filter', `name=${patterns[kind]}`]).split(/\s+/),
      ].filter(Boolean));
      for (const id of ids) {
        const format = kind === 'container'
          ? '{"id":{{json .Id}},"name":{{json .Name}},"labels":{{json .Config.Labels}},"mounts":{{json .Mounts}},"state":{{json .State}},"networks":{{json .NetworkSettings.Networks}}}'
          : '{"id":{{json .Name}},"name":{{json .Name}},"labels":{{json .Labels}}}';
        const value = JSON.parse(raw([kind, 'inspect', '--format', format, id]));
        resources.push({ ...value, kind, name: value.name.replace(/^\//, '') });
      }
    }
    return resources;
  };
  const assertTestEnvironmentOwned = () => {
    const identity = record();
    const resources = inspectResources();
    for (const resource of resources) {
      const labels = resource.labels ?? {};
      if (labels[purpose] !== 'test' || labels[owner] !== identity.ownerId || labels['com.docker.compose.project'] !== project) {
        throw new Error(`${project}: ownership mismatch for ${resource.kind} ${resource.name}`);
      }
      if (resource.kind === 'container') {
        const service = labels['com.docker.compose.service'];
        if (!services.includes(service)) throw new Error(`${project}: unexpected service ${resource.name}`);
        const mounts = resource.mounts ?? [];
        if (service === 'database') {
          if (mounts.length !== 1 || mounts[0].Type !== 'volume' || mounts[0].Name !== `${project}_postgres_data` || mounts[0].Destination !== dataPath) {
            throw new Error(`${project}: foreign volume/mount for ${resource.name}`);
          }
        } else if (mounts.length) throw new Error(`${project}: unexpected mount for ${resource.name}`);
      } else {
        const component = labels[`com.docker.compose.${resource.kind}`];
        const expected = resource.kind === 'network' ? networks : ['postgres_data'];
        if (!expected.includes(component) || resource.name !== `${project}_${component}`) throw new Error(`${project}: unexpected ${resource.kind} ${resource.name}`);
      }
    }
    return { identity, resources };
  };
  const acquire = () => {
    const daemon = daemonId();
    const key = createHash('sha256').update(`${daemon}:${project}`).digest('hex');
    const directory = join(tmpdir(), 'yitverse-s01-locks');
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    const file = join(directory, `${key}.lock`);
    const token = randomUUID();
    let fd;
    try { fd = openSync(file, 'wx', 0o600); } catch (error) {
      if (error.code === 'EEXIST') throw new Error(`${project}: lock held by another process; do not remove its lock`);
      throw error;
    }
    writeFileSync(fd, token);
    closeSync(fd);
    lockHeld = true;
    return () => {
      lockHeld = false;
      if (readFileSync(file, 'utf8') !== token) throw new Error(`${project}: lock ownership changed`);
      unlinkSync(file);
    };
  };
  const locked = fn => {
    if (lockHeld) return fn();
    const release = acquire();
    try { return fn(); } finally { release(); }
  };
  const files = () => [join(root, 'docker-compose.yml'), ...(existsSync(join(local, 'compose.cloud.yml')) ? [join(local, 'compose.cloud.yml')] : []), overlay];
  const prefix = () => ['compose', '--project-directory', root, '--env-file', join(root, '.env'), '-p', project, ...files().flatMap(file => ['-f', file])];
  const assertModel = identity => {
    const model = JSON.parse(raw([...prefix(), 'config', '--format', 'json']));
    if (Object.keys(model.services ?? {}).sort().join() !== [...services].sort().join()) throw new Error(`${project}: unexpected Compose services`);
    if (Object.keys(model.networks ?? {}).sort().join() !== 'app,data' || Object.keys(model.volumes ?? {}).join() !== 'postgres_data') throw new Error(`${project}: unexpected Compose resources`);
    for (const [kind, names] of [['networks', networks], ['volumes', ['postgres_data']]]) {
      for (const name of names) {
        const entry = model[kind][name];
        if (entry.external || entry.name !== `${project}_${name}`) throw new Error(`${project}: foreign resource in Compose model`);
      }
    }
    for (const name of services) {
      const service = model.services[name];
      if (service.labels?.[owner] !== identity.ownerId || service.labels?.[purpose] !== 'test') throw new Error(`${project}: missing test identity in model`);
      const mounts = service.volumes ?? [];
      if (name === 'database') {
        if (mounts.length !== 1 || mounts[0].type !== 'volume' || mounts[0].source !== 'postgres_data' || mounts[0].target !== dataPath) throw new Error(`${project}: foreign volume in Compose model`);
      } else if (mounts.length) throw new Error(`${project}: unexpected service mount`);
    }
    return model;
  };
  const prepareTestEnvironment = () => locked(() => {
    const resources = inspectResources();
    let identity;
    if (existsSync(statePath)) {
      identity = assertTestEnvironmentOwned().identity;
    } else {
      if (resources.length) throw new Error(`${project}: ownership unknown; existing environment will not be adopted`);
      identity = { project, checkoutRealPath: root, daemonId: daemonId(), ownerId: randomUUID() };
      mkdirSync(local, { recursive: true, mode: 0o700 });
      writeFileSync(statePath, JSON.stringify(identity, null, 2), { flag: 'wx', mode: 0o600 });
    }
    const labels = { [purpose]: 'test', [owner]: identity.ownerId };
    const entries = names => Object.fromEntries(names.map(name => [name, { labels }]));
    writeFileSync(overlay, JSON.stringify({ services: entries(services), networks: entries(networks), volumes: entries(['postgres_data']) }, null, 2));
    return identity;
  });
  const compose = (args, { input, allowFailure = false } = {}) => {
    validateArgs(args);
    return locked(() => {
      const { identity } = assertTestEnvironmentOwned();
      assertModel(identity);
      // Recheck the live inventory immediately before the operation, not only before config expansion.
      assertTestEnvironmentOwned();
      const result = run([...prefix(), ...args], { input, cwd: root });
      if (result.status !== 0 && !allowFailure) throw new Error(`${project}: Compose ${args[0]} failed (${result.status})`);
      return result;
    });
  };
  const withLock = async fn => {
    if (lockHeld) throw new Error(`${project}: nested suite lock is not allowed`);
    const release = acquire();
    try { return await fn(); } finally { release(); }
  };
  const httpViaProxy = path => {
    if (!path.startsWith('/') || path.startsWith('//')) throw new Error('Invalid probe path');
    const script = 'const response = await fetch(new URL(process.argv[1], "http://frontend"), {signal: AbortSignal.timeout(6000)}); console.log(JSON.stringify({status:response.status,headers:Object.fromEntries(response.headers),body:await response.text()}));';
    const result = compose(['exec', '-T', 'backend', 'node', '--input-type=module', '-e', script, path]);
    return JSON.parse(result.stdout);
  };
  return { root, project, compose, prepareTestEnvironment, assertTestEnvironmentOwned, withLock, httpViaProxy };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const helper = createHelper();
    const args = process.argv.slice(2);
    if (args.length === 1 && args[0] === 'prepare') {
      helper.prepareTestEnvironment();
      console.log(`${helper.project}: test identity prepared; no Docker resources changed`);
    } else {
      if (args.shift() !== '--') throw new Error('Usage: node scripts/compose-helper.mjs prepare | -- <Compose args>');
      if (args[0] === 'config' && args.some(a => a !== 'config' && a !== '-q' && a !== '--quiet')) throw new Error('Use config -q to avoid printing credentials');
      const result = helper.compose(args, { allowFailure: true });
      process.stdout.write(result.stdout);
      process.stderr.write(result.stderr);
      process.exitCode = result.status ?? 1;
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
