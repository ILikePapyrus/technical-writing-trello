import './App.css'
import Board from './components/Board'

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Tablero</h1>
      </header>
      <main>
        <Board />
      </main>
    </div>
  )
}

export default App
