import { spawnSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { existsSync, realpathSync, readFileSync, writeFileSync, mkdirSync, openSync, closeSync, unlinkSync, renameSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir, hostname } from 'node:os';
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

export function validateCliArgs(args) {
  validateArgs(args);
  if (args[0] === 'config' && (args.length !== 2 || !['-q', '--quiet'].includes(args[1]))) {
    throw new Error('Use config -q/--quiet to avoid printing credentials');
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
  const recoveryPath = join(local, 's01-test-recovery.json');
  let lockHeld = false;
  let activeSignal;
  let restoring = false;
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
  const lockPath = daemon => {
    const key = createHash('sha256').update(`${daemon}:${project}`).digest('hex');
    const directory = join(tmpdir(), 'yitverse-s01-locks');
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    return join(directory, `${key}.lock`);
  };
  const acquire = () => {
    const daemon = daemonId();
    const identity = existsSync(statePath) ? record() : null;
    const file = lockPath(daemon);
    const token = randomUUID();
    let fd;
    try { fd = openSync(file, 'wx', 0o600); } catch (error) {
      if (error.code === 'EEXIST') throw new Error(`${project}: lock held by another process; do not remove its lock`);
      throw error;
    }
    writeFileSync(fd, JSON.stringify({ token, pid: process.pid, hostname: hostname(), project, daemonId: daemon, checkoutRealPath: root, ownerId: identity?.ownerId ?? null }));
    closeSync(fd);
    lockHeld = true;
    return () => {
      lockHeld = false;
      if (JSON.parse(readFileSync(file, 'utf8')).token !== token) throw new Error(`${project}: lock ownership changed`);
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
    if (!restoring) activeSignal?.throwIfAborted();
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
    const controller = new AbortController();
    activeSignal = controller.signal;
    const interrupt = signal => controller.abort(new Error(`${project}: interrupted by ${signal}; restoring owned resources`));
    const onInt = () => interrupt('SIGINT');
    const onTerm = () => interrupt('SIGTERM');
    process.on('SIGINT', onInt);
    process.on('SIGTERM', onTerm);
    try {
      const result = await fn({ signal: controller.signal });
      controller.signal.throwIfAborted();
      return result;
    } finally {
      process.off('SIGINT', onInt);
      process.off('SIGTERM', onTerm);
      activeSignal = undefined;
      release();
    }
  };
  const restore = async fn => {
    if (!lockHeld) throw new Error(`${project}: restoration requires the suite lock`);
    assertTestEnvironmentOwned();
    restoring = true;
    try { return await fn(); } finally { restoring = false; }
  };
  const updateRecovery = ({ schema, services: targets = [] }, remove) => locked(() => {
    if (!remove && !restoring) activeSignal?.throwIfAborted();
    const { identity } = assertTestEnvironmentOwned();
    if ((schema && !/^s01_probe_[a-f0-9]{32}$/.test(schema)) || targets.some(name => !services.includes(name))) throw new Error('Invalid recovery target');
    const journal = existsSync(recoveryPath) ? JSON.parse(readFileSync(recoveryPath, 'utf8')) : { ...identity, schemas: [], services: [] };
    if (journal.ownerId !== identity.ownerId || journal.project !== project || journal.daemonId !== identity.daemonId || journal.checkoutRealPath !== root) throw new Error(`${project}: recovery journal identity mismatch`);
    for (const [key, values] of [['schemas', schema ? [schema] : []], ['services', targets]]) {
      journal[key] = remove ? journal[key].filter(value => !values.includes(value)) : [...new Set([...journal[key], ...values])];
    }
    const temporary = `${recoveryPath}.${randomUUID()}.tmp`;
    writeFileSync(temporary, JSON.stringify(journal, null, 2), { flag: 'wx', mode: 0o600 });
    renameSync(temporary, recoveryPath);
  });
  const recoverStaleLock = () => {
    const daemon = daemonId();
    const file = lockPath(daemon);
    const original = readFileSync(file, 'utf8');
    const lock = JSON.parse(original);
    if (lock.hostname !== hostname() || lock.project !== project || lock.daemonId !== daemon || lock.checkoutRealPath !== root || !Number.isSafeInteger(lock.pid) || lock.pid <= 0 || !lock.token) throw new Error(`${project}: stale lock identity cannot be verified`);
    try {
      process.kill(lock.pid, 0);
      throw new Error(`${project}: lock owner is still alive`);
    } catch (error) {
      if (error.code !== 'ESRCH') throw error;
    }
    if (lock.ownerId) {
      if (assertTestEnvironmentOwned().identity.ownerId !== lock.ownerId) throw new Error(`${project}: stale lock owner mismatch`);
    } else if (inspectResources().length) throw new Error(`${project}: unknown resources after interrupted preparation`);
    if (readFileSync(file, 'utf8') !== original) throw new Error(`${project}: stale lock changed during verification`);
    unlinkSync(file);
    return recoveryPath;
  };
  const httpViaProxy = path => {
    if (!path.startsWith('/') || path.startsWith('//')) throw new Error('Invalid probe path');
    const script = 'const response = await fetch(new URL(process.argv[1], "http://frontend"), {signal: AbortSignal.timeout(6000)}); console.log(JSON.stringify({status:response.status,headers:Object.fromEntries(response.headers),body:await response.text()}));';
    const result = compose(['exec', '-T', 'backend', 'node', '--input-type=module', '-e', script, path]);
    return JSON.parse(result.stdout);
  };
  return { root, project, compose, prepareTestEnvironment, assertTestEnvironmentOwned, withLock, restore, httpViaProxy,
    recordRecovery: targets => updateRecovery(targets, false), clearRecovery: targets => updateRecovery(targets, true), recoverStaleLock };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const helper = createHelper();
    const args = process.argv.slice(2);
    if (args.length === 1 && args[0] === 'recover-lock') {
      console.log(`${helper.project}: verified dead process lock released; inspect recovery journal ${helper.recoverStaleLock()}. No Docker resources changed.`);
    } else {
      await helper.withLock(async () => {
        if (args.length === 1 && args[0] === 'prepare') {
          helper.prepareTestEnvironment();
          console.log(`${helper.project}: test identity prepared; no Docker resources changed`);
        } else {
          if (args.shift() !== '--') throw new Error('Usage: node scripts/compose-helper.mjs prepare | recover-lock | -- <Compose args>');
          validateCliArgs(args);
          const result = helper.compose(args, { allowFailure: true });
          process.stdout.write(result.stdout);
          process.stderr.write(result.stderr);
          process.exitCode = result.status ?? 1;
        }
      });
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
