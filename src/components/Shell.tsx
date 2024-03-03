import React, { useEffect } from 'react'

import * as duckdbWasmShell from '@duckdb/duckdb-wasm-shell'

import { useDuckDB } from '@jetblack/duckdb-react'

import 'xterm/css/xterm.css'

const URL =
  'https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm-shell@1.28.1-dev106.0/dist/shell_bg.wasm'

export default function Shell() {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const { db, loading, error } = useDuckDB()

  useEffect(() => {
    if (loading || !db || error || !ref.current) {
      return
    }

    const asyncFunc = async () => {
      const response = await fetch(URL)
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
