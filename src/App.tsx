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

  function handleClickCell(row: number, column: number) {
    console.log({ row, column })
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
      const newGameState = await response.json()
      setGame(newGameState)
    }
  }

  return (
    <div>
      <h1>
        Minesweeper - <button onClick={handleNewGame}>New</button>
      </h1>
      <button onClick={() => handleClickCell(0, 0)}>{game.board[1][0]}</button>
      <button>{game.board[0][0]}</button>
      <button>{game.board[0][0]}</button>
      <button>{game.board[0][0]}</button>
      <button>{game.board[0][0]}</button>
      <button>{game.board[0][0]}</button>
      <button>{game.board[0][0]}</button>
      <button>{game.board[0][0]}</button>
    </div>
  )
}
