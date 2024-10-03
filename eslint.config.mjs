import globals from 'globals'
import pluginJs from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...new FlatCompat().extends('eslint-config-standard')
]
