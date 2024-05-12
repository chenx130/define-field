import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/main'],
  clean: true,
  declaration: 'compatible',
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  outDir: 'dist',
})
