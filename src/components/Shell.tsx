import React, { useEffect } from 'react'

import { PACKAGE_NAME, PACKAGE_VERSION } from '@duckdb/duckdb-wasm-shell'
import * as duckdbWasmShell from '@duckdb/duckdb-wasm-shell'

import { useDuckDB } from '@jetblack/duckdb-react'

import 'xterm/css/xterm.css'

const JSDELIVR_URL = 'https://cdn.jsdelivr.net/npm'
const SHELL_PKG_URL = `${JSDELIVR_URL}/${PACKAGE_NAME}@${PACKAGE_VERSION}`
const SHELL_WASM_URL = `${SHELL_PKG_URL}/dist/shell_bg.wasm`

export default function Shell() {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const { db, loading, error } = useDuckDB()

  useEffect(() => {
    if (loading || !db || error || !ref.current) {
      return
    }

    const asyncFunc = async () => {
      const response = await fetch(SHELL_WASM_URL)
      const buf = await response.arrayBuffer()

      duckdbWasmShell.embed({
        shellModule: buf,
        container: ref.current!,
        resolveDatabase: async () => db
      })
    }

    asyncFunc().catch(error => console.error(error))
  }, [db, loading, error, ref.current])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '16px',
        overflow: 'hidden',
        backgroundColor: '#333'
      }}
    >
      <div ref={ref} />
    </div>
  )
}
