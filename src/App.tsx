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
type GameDifficulty = 0 | 1 | 2
type Game = {
  id: null | number
  board: Board
  state: null | string
  mines: null | number
  difficulty: GameDifficulty
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

  const [difficulty, setDifficulty] = useState<GameDifficulty>(0)

  // useEffect(() => {
  //   handleNewGame(0)
  // }, [])

  useEffect(() => {
    async function loadExistingGame() {
      const existingGameId = localStorage.getItem('game-id')
      const existingDifficulty = localStorage.getItem('game-difficulty')

      if (existingGameId && existingDifficulty) {
        const response = await fetch(
          `https://minesweeper-api.herokuapp.com/games/${existingGameId}`
        )

        if (response.ok) {
          const newGameState = await response.json()
          setGame(newGameState)
          setDifficulty(Number(existingDifficulty) as GameDifficulty)
        }
      }
    }
    loadExistingGame()
  }, [])

  async function handleCheckOrFlagCell(
    event: React.MouseEvent,
    row: number,
    col: number,
    action: 'check' | 'flag'
  ) {
    const clickSnapshot = event.currentTarget

    // Console Check 2
    console.log(
      `Before all checks, the cell on row ${row} in column ${col} currently has a value of '${game.board[row][col]}' and the className is currently '${clickSnapshot.firstElementChild?.className}'`
    )

    if (
      game.id === null ||
      game.state === 'won' ||
      game.state === 'lost' ||
      clickSnapshot.className === 'revealed' ||
      (game.board[row][col] === ' ' &&
        clickSnapshot.firstElementChild?.className === 'flag') ||
      (game.board[row][col] === ' ' &&
        clickSnapshot.firstElementChild?.className === 'question')
    ) {
      return
    }

    if (
      // Left click events
      (event.nativeEvent.button === 0 &&
        ((game.board[row][col] === ' ' &&
          clickSnapshot.firstElementChild === null) ||
          (game.board[row][col] === ' ' &&
            clickSnapshot.firstElementChild?.className === ''))) ||
      // Right click events
      (event.nativeEvent.button === 2 &&
        ((game.board[row][col] === ' ' &&
          clickSnapshot.firstElementChild === null) ||
          (game.board[row][col] === ' ' &&
            clickSnapshot.firstElementChild?.className === '') ||
          (game.board[row][col] === 'F' &&
            clickSnapshot.firstElementChild?.className === '') ||
          (game.board[row][col] === 'F' &&
            clickSnapshot.firstElementChild?.className === 'question')))
    ) {
      const url = `https://minesweeper-api.herokuapp.com/games/${game.id}/${action}`

      const body = { row, col }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const newGameState = (await response.json()) as Game
        setGame(newGameState)

        // Console Check 3
        console.log(
          `In POST event for 'flag', the cell on row ${row} in column ${col} currently has a value of '${game.board[row][col]}' and the className is currently '${clickSnapshot.firstElementChild?.className}'`
        )
      }
    } else if (
      event.nativeEvent.button === 2 &&
      ((game.board[row][col] === 'F' &&
        clickSnapshot.firstElementChild?.className === 'flag') ||
        (game.board[row][col] === ' ' &&
          clickSnapshot.firstElementChild?.className === 'question') ||
        (game.board[row][col] === ' ' &&
          clickSnapshot.firstElementChild?.className === 'flag'))
    ) {
      // Console Check 4
      console.log(
        `Entering GET event, the cell on row ${row} in column ${col} currently has a value of '${game.board[row][col]}' and the className is currently '${clickSnapshot.firstElementChild?.className}'`
      )
      const url = `https://minesweeper-api.herokuapp.com/games/${game.id}`

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      })

      if (response.ok) {
        const newGameState = (await response.json()) as Game
        setGame(newGameState)

        // Console Check 5
        console.log(
          `Leaving GET event, the cell on row ${row} in column ${col} currently has a value of '${game.board[row][col]}' and the className is currently '${clickSnapshot.firstElementChild?.className}'`
        )
      }
    }
  }

  async function handleNewGame(newGameDifficulty: GameDifficulty) {
    const buttons = document.querySelectorAll('button')
    buttons.forEach((button) => {
      if (!button.classList.contains('difficulty-button')) {
        button.removeAttribute('disabled')
      }
    })

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
      const newGameState = await response.json()
      setDifficulty(newGameDifficulty)
      setGame(newGameState)
      localStorage.setItem('game-id', newGameState.id)
      localStorage.setItem('game-difficulty', String(newGameDifficulty))
    }
  }

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
        <section className="difficulty-info-board">
          <span className="difficulty-info-wrapper">
            <button
              className="difficulty-button"
              onClick={() => handleNewGame(0)}
            >
              <h3>New Easy Game</h3>
            </button>
            <button
              className="difficulty-button"
              onClick={() => handleNewGame(1)}
            >
              <h3>New Intermediate Game</h3>
            </button>
            <button
              className="difficulty-button"
              onClick={() => handleNewGame(2)}
            >
              <h3>New Hard Game</h3>
            </button>
          </span>
        </section>
        <section className={`game-difficulty-${difficulty}`}>
          <section className="mine-info-board">
            <div className="mine-info-wrapper">
              <div className="info-text">Mines remaining: </div>
              <div className="info-number">{minesLeft()}</div>
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
                  handleCheckOrFlagCell={handleCheckOrFlagCell}
                />
              ))
            )}
          </section>
        </section>
      </main>
    </div>
  )
}
