import React, { useState, useEffect } from 'react'
import { Cell } from './components/Cell'

type Square =
  | ' '
  | '_'
  | 'F'
  | '*'
  | '@'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
type Row = [Square, Square, Square, Square, Square, Square, Square, Square]
type Board = [Row, Row, Row, Row, Row, Row, Row, Row]
type Difficulty = 0 | 1 | 2
type Game = {
  id: null | number
  board: Board
  state: null | string
  mines: null | number
  difficulty: Difficulty
}

export function App() {
  const [game, setGame] = useState<Game>({
    id: null,
    board: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
    state: null,
    mines: null,
    difficulty: 0,
  })

  const [difficulty, setDifficulty] = useState<Difficulty>(0)

  async function handleClickCell(
    event: React.MouseEvent,
    row: number,
    col: number
  ) {
    event.preventDefault()

    const clickSnapshot = event.currentTarget

    if (
      game.id === null ||
      game.state === 'won' ||
      game.state === 'lost' ||
      clickSnapshot.className === 'revealed' ||
      clickSnapshot.firstElementChild?.className === 'flag' ||
      clickSnapshot.firstElementChild?.className === 'question'
    ) {
      return
    }
    if (event.nativeEvent.button === 0) {
      const url = `https://minesweeper-api.herokuapp.com/games/${game.id}/check`
      const body = { row, col }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const newGameState = (await response.json()) as Game
        setGame(newGameState)
      }
    } else if (event.nativeEvent.button === 2 && game.board[row][col] !== 'F') {
      const url = `https://minesweeper-api.herokuapp.com/games/${game.id}/flag`
      const body = { row, col }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const newGameState = (await response.json()) as Game
        setGame(newGameState)
      }
    }
  }

  async function handleNewGame(newGameDifficulty: Difficulty) {
    const diff = { difficulty: newGameDifficulty }

    const response = await fetch(
      'https://minesweeper-api.herokuapp.com/games',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(diff),
      }
    )

    if (response.ok) {
      const newGameState = (await response.json()) as Game
      setDifficulty(newGameDifficulty)
      setGame(newGameState)
    }
  }

  useEffect(() => {
    handleNewGame(0)
  }, [])

  function checkState() {
    if (game.state === 'new') {
      return
    } else if (game.state === 'playing') {
      return 'Game in progress...'
    } else if (game.state === 'won' || game.state === 'lost') {
      return `You ${game.state}!`
    }
  }

  function minesLeft() {
    return game.mines
  }

  const isGameOver = () => {
    if (game.state === 'won' || game.state === 'lost') {
      return 'game-over'
    } else {
      return ''
    }
  }

  const gameLevel = () => {
    if (difficulty === 0) {
      return 'easy'
    }
    if (difficulty === 1) {
      return 'medium'
    }
    if (difficulty === 2) {
      return 'hard'
    }
  }

  const classes = `${gameLevel()} ${isGameOver()}`

  return (
    <div>
      <h1>Minesweeper</h1>
      <h2>{checkState()}</h2>

      <main>
        <section className={`game-difficulty-${difficulty}`}>
          <section className="mine-info-board">
            <div className="mine-info-wrapper">
              <span className="info-text">Mines remaining: </span>
              <span className="info-number">{minesLeft()}</span>
            </div>
          </section>
          <section id="game-board" className={classes}>
            {game.board.map((row, rowIndex) =>
              row.map((col, colIndex) => (
                <Cell
                  key={colIndex}
                  cell={game.board[rowIndex][colIndex]}
                  cellRowIndex={rowIndex}
                  cellColIndex={colIndex}
                  cellState={game.state}
                  handleClickCell={handleClickCell}
                />
              ))
            )}
          </section>
          <section className="difficulty-info-board">
            <span className="difficulty-info-wrapper">
              <button
                className="difficulty-button"
                onClick={() => handleNewGame(0)}
              >
                <h3>Easy</h3>
              </button>
              <button
                className="difficulty-button"
                onClick={() => handleNewGame(1)}
              >
                <h3>Medium</h3>
              </button>
              <button
                className="difficulty-button"
                onClick={() => handleNewGame(2)}
              >
                <h3>Hard</h3>
              </button>
            </span>
          </section>
        </section>
      </main>
    </div>
  )
}
