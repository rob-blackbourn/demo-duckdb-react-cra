import { useEffect, useState } from 'react'

import { useDuckDB } from '@jetblack/duckdb-react'

import { arrowRowGenerator } from '../utils'
import weatherData from '../assets/data.json'
import { DataType, Type } from 'apache-arrow'

interface Observation {
  time: Date
  temperature: number
}

interface ObservationTable extends Record<string, DataType> {
  time: DataType<Type.Timestamp>
  temperature: DataType<Type.Float>
}

export default function WeatherForecast() {
  const { db } = useDuckDB()
  const [isTableLoaded, setIsTableLoaded] = useState(false)
  const [observations, setObservations] = useState<Observation[]>([])

  useEffect(() => {
    if (!db) {
      return
    }
    const asyncFunc = async () => {
      const text = JSON.stringify(weatherData)
      await db.registerFileText('observations.json', text)
      const con = await db.connect()
      await con.insertJSONFromPath('observations.json', {
        name: 'observations'
      })

      return true
    }

    asyncFunc().then(setIsTableLoaded).catch(console.error)
  }, [db])

  useEffect(() => {
    if (!(isTableLoaded && db)) {
      return
    }

    const asyncFunc = async () => {
      const con = await db.connect()
      const table = await con.query<ObservationTable>(
        'SELECT * FROM observations LIMIT 10;'
      )
      const rows = Array.from(
        arrowRowGenerator<ObservationTable, Observation>(
          table,
          (key: string, value: unknown) =>
            key === 'time' && typeof value === 'number'
              ? new Date(value)
              : value
        )
      ) as Observation[]
      return rows
    }

    asyncFunc().then(setObservations).catch(console.error)
  }, [isTableLoaded, db])

  return (
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th style={{ textAlign: 'right' }}>Temperature</th>
        </tr>
      </thead>
      <tbody>
        {observations.map(({ time, temperature }) => (
          <tr key={time.valueOf()}>
            <td>{time.toISOString()}</td>
            <td style={{ textAlign: 'right' }}>{temperature.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
