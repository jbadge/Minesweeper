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

  async function recordMove(event: React.MouseEvent, row: number, col: number) {
    event.preventDefault()
    // console.log('5')

    const clickSnapshot = event.currentTarget

    if (
      game.id === null ||
      game.state === 'won' ||
      game.state === 'lost' ||
      clickSnapshot.className === 'revealed'
    ) {
      return
    }
    // NEEDS A GUARD CLAUSE TO PREVENT THE QUESTION MARKS
    // FOR COUNTING AS MINES IF YOU CLICK
    // LEFT CLICK WHILE THEY ARE CHOSEN

    // For left click
    // If ‘ ‘ and ‘ ‘ or if ‘ ‘ and null, then reveal
    if (event.nativeEvent.button === 0) {
      if (
        (game.board[row][col] === ' ' &&
          clickSnapshot.firstElementChild === null) ||
        (game.board[row][col] === ' ' &&
          clickSnapshot.firstElementChild?.className === '')
      ) {
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
      }

      // For right click
      // If ‘ ‘ and null then F and flag -- run flag api
      // If F and flag, then ‘ ‘ and question -- run flag api
      // If ‘ ‘ and ‘ ‘ then F and flag -- run flag api
    } else if (event.nativeEvent.button === 2) {
      if (
        (game.board[row][col] === ' ' &&
          clickSnapshot.firstElementChild === null) ||
        (game.board[row][col] === ' ' &&
          clickSnapshot.firstElementChild?.className === '') ||
        (game.board[row][col] === 'F' &&
          clickSnapshot.firstElementChild?.className === 'flag')
      ) {
        if (clickSnapshot.firstElementChild?.className === '') {
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
        } else if (clickSnapshot.firstElementChild?.className === 'flag') {
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
            game.board[row][col] = newGameState.board[row][col]
            clickSnapshot.firstElementChild?.classList.add('question')
          }
        }
      } else {
        // If ‘ ‘ and question, then ‘ ‘ and ‘ ‘ -- do NOT run flag api
        // (I believe api will make ‘ ‘ null after setGame)
        // if (
        //   game.board[row][col] === ' ' &&
        //   clickSnapshot.firstElementChild?.className === 'question'
        // ) {
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

  const isGameOver = () => {
    if (game.state === 'won' || game.state === 'lost') {
      return 'game-over'
    } else {
      return
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

  return (
    <div>
      <h1>Minesweeper</h1>
      <h2>{checkState()}</h2>

      <main>
        <section className={`game-difficulty-${difficulty}`}>
          <section className="mine-info-board">
            <div className="mine-info-wrapper">
              <span className="info-text">Mines remaining: </span>
              <span className="info-number">{game.mines}</span>
            </div>
          </section>
          <section id="game-board" className={`${gameLevel()} ${isGameOver()}`}>
            {game.board.map((row, rowIndex) =>
              row.map((col, colIndex) => (
                <Cell
                  key={colIndex}
                  cell={game.board[rowIndex][colIndex]}
                  cellRowIndex={rowIndex}
                  cellColIndex={colIndex}
                  cellState={game.state}
                  recordMove={recordMove}
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

// Right click puts F in cell
// Right click again put ‘ ‘ in cell
// Total binary behavior,
