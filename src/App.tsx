import DuckDB from '@jetblack/duckdb-react'
import WeatherForecast from './components/WeatherForecast'
import Shell from './components/Shell'

export default function App() {
  return (
    <DuckDB>
      <WeatherForecast />
      <Shell />
    </DuckDB>
  )
}
