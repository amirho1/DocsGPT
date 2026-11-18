import { execFileSync } from 'node:child_process';
import {
  copyFile,
  mkdir,
  readdir,
  writeFile,
  mkdtemp,
  rm,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const frontend = fileURLToPath(new URL('../', import.meta.url));
const repo = path.dirname(frontend);
const revision = execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: repo,
  encoding: 'utf8',
}).trim();
if (
  execFileSync('git', ['status', '--porcelain'], {
    cwd: repo,
    encoding: 'utf8',
  }).trim()
)
  throw new Error('Commit the tested source before packaging.');
const destination = path.resolve(
  process.argv[2] ?? path.join(frontend, 'dist-customer'),
);
const stage = await mkdtemp(path.join(tmpdir(), 'docsgpt-customer-'));
try {
  await mkdir(path.join(stage, 'assets'));
  const assets = (await readdir(path.join(frontend, 'dist-customer/assets')))
    .filter((name) => /\.(js|css)$/.test(name))
    .sort();
  for (const asset of assets)
    await copyFile(
      path.join(frontend, 'dist-customer/assets', asset),
      path.join(stage, 'assets', asset),
    );
  await copyFile(
    path.join(frontend, 'dist-customer/customer.html'),
    path.join(stage, 'index.html'),
  );
  await copyFile(path.join(repo, 'LICENSE'), path.join(stage, 'LICENSE'));
  await writeFile(
    path.join(stage, 'revision.json'),
    JSON.stringify({
      repository: 'https://github.com/amirho1/DocsGPT',
      revision,
      entry: 'customer.html',
    }) + '\n',
  );
  await mkdir(destination, { recursive: true });
  const archive = `docsgpt-customer-${revision}.tar.gz`;
  execFileSync(
    'tar',
    [
      '-czf',
      path.join(destination, archive),
      './index.html',
      './LICENSE',
      './revision.json',
      ...assets.map((name) => `./assets/${name}`),
    ],
    { cwd: stage, env: { ...process.env, COPYFILE_DISABLE: '1' } },
  );
  const sha256 = createHash('sha256')
    .update(await readFile(path.join(destination, archive)))
    .digest('hex');
  await writeFile(
    path.join(destination, 'supportPanel.json'),
    JSON.stringify(
      {
        repository: 'https://github.com/amirho1/DocsGPT',
        revision,
        archive,
        sha256,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(JSON.stringify({ archive, revision, sha256 }));
} finally {
  await rm(stage, { recursive: true, force: true });
}
