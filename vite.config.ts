import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({

  plugins: [
    dts({
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.build.json',
    }),
  ],

  build: {
    reportCompressedSize: false,
    lib: {
      entry: {
        field: 'src/field.ts',
      },
      formats: ['es'],
    },
  },
})
