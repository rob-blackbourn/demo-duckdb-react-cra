import { Table, DataType } from 'apache-arrow'

const reviveRow = (
  row: Record<string, unknown>,
  reviver: (key: string, value: unknown) => unknown
) =>
  Object.entries(row).reduce(
    (obj, [key, value]) => ({
      ...obj,
      [key]: reviver(key, value)
    }),
    {}
  )

export function* arrowRowGenerator<
  TTable extends Record<string, DataType>,
  TRow
>(
  table: Table<TTable>,
  reviver?: (key: string, value: unknown) => unknown
): Generator<TRow, void, unknown> {
  for (let i = 0; i < table.numRows; ++i) {
    // Get the row as JSON.
    const row = table.get(i)?.toJSON() as Record<string, unknown> | null

    if (row === null) {
      // I'm not sure if rows can be null, or if this is an artifact of the
      // implementation.
      continue
    }

    const value = reviver ? reviveRow(row, reviver) : row
    yield value as TRow
  }
}
