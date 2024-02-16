import React, { useState } from 'react'

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
type Game = {
  id: null | number
  board: Board
  state: null | string
  mines: null | number
  difficulty: null | number
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
    difficulty: null,
  })

  async function handleClickCell(
    event: React.MouseEvent,
    row: number,
    col: number
  ) {
    event.preventDefault()

    if (
      game.id === null ||
      game.state === 'won' ||
      game.state === 'lost' ||
      game.board[row][col] !== ' '
    ) {
      return
    }

    console.log({ row, col })

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
    }

    // async function handleRightClickCell(row: number, col: number) {
    //   console.log({ row, col })
    else if (event.nativeEvent.button === 2) {
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

  async function handleNewGame() {
    const response = await fetch(
      'https://minesweeper-api.herokuapp.com/games',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      }
    )

    if (response.ok) {
      const newGameState = (await response.json()) as Game
      console.log(newGameState)
      setGame(newGameState)
    }
  }

  // const checkState = () => {
  //   switch (game.state) {
  //     case 'won':
  //       return 'You won!'
  //     case 'lost':
  //       return 'You lost!'
  //     default:
  //       return 'Minesweeper'
  //   }
  // }

  function checkState() {
    if (game.state === 'new') {
      return 'Starting new game'
    } else if (game.state === 'playing') {
      return 'Game in progress...'
    } else if (game.state === 'new' || game.state === 'lost') {
      return `You ${game.state}!`
    }
  }

  // const header = game.state ? checkState() : 'Minesweeper'

  return (
    <div>
      <h1>
        Minesweeper
        {/* {checkState()} - <button onClick={handleNewGame}>New</button> */}
      </h1>
      <h2>{checkState()}</h2>
      <h3>
        <button onClick={handleNewGame}>New</button>
      </h3>
      <main>
        <section className="difficulty-0">
          {game.board.map((row, rowIndex) =>
            row.map((col, colIndex) => (
              <button
                key={colIndex}
                onClick={(e) => handleClickCell(e, rowIndex, colIndex)}
                onContextMenu={(e) => handleClickCell(e, rowIndex, colIndex)}
              >
                {game.board[rowIndex][colIndex]}
              </button>
            ))
          )}
        </section>
      </main>
    </div>
  )
}
