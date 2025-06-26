import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  format: ['esm', 'cjs'],
  outDir: 'dist',
  clean: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  target: 'node18',
  shims: false,
});
