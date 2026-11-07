#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { importChapter, recoverImport, importStatus } from '../src/reader/importer.js';
import { unlockStore } from '../src/reader/store.js';
import { ReaderValidationError } from '../src/reader/validation.js';

try {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: Object.fromEntries(['root', 'work', 'number', 'title', 'input', 'rights', 'source', 'authorization', 'transaction', 'action', 'token'].map(key => [key, { type: 'string' }])) });
  const command = positionals[0];
  if (positionals.length !== 1 || !values.root) throw Error('Usage');
  let result;
  if (command === 'import') result = await importChapter({ root: values.root, workId: values.work, number: values.number, title: values.title, input: values.input, rights: values.rights, source: values.source, proof: values.authorization });
  else if (command === 'status') result = await importStatus(values.root);
  else if (command === 'recover') { await recoverImport({ root: values.root, transaction: values.transaction, action: values.action }); result = { recovered: true }; }
  else if (command === 'unlock') { await unlockStore(values.root, values.token); result = { unlocked: true }; }
  else throw Error('Usage');
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  // Operator arguments/proofs may be private; no stack, paths or raw source data in logs.
  console.error('Operación rechazada.' + (error instanceof ReaderValidationError ? ` ${error.message}.` : ' Opciones inválidas o archivo no legible/verificable.') + ' Consulta docs/36-LECTOR-CAPITULOS-LOCALES.md.');
  process.exitCode = 1;
}
