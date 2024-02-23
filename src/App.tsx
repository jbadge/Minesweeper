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
    // console.log(event.target)
    const clickSnapshot = event.currentTarget

    console.log('running handleClickCell in App.tsx--className is:')
    console.log(clickSnapshot.firstElementChild?.className)
    // console.log(event.nativeEvent.button)
    // const revealedButton = event.currentTarget
    // console.log(event.currentTarget.setAttribute('disabled', 'true'))

    if (
      game.id === null ||
      game.state === 'won' ||
      game.state === 'lost' ||
      // event.nativeEvent.button === 'flag'
      clickSnapshot.firstElementChild?.className === '' ||
      //.classList.contains('flag')
      // TAKE CARE OF THIS, needs logic
      (game.board[row][col] !== ' ' && game.board[row][col] !== 'F')
    ) {
      return
    }
    console.log('Got past the guard clauses--className is:')
    console.log(clickSnapshot.firstElementChild?.className)
    // if (clickSnapshot.firstElementChild?.classList.contains('flag') === true) {
    //   console.log('HELP!')
    //   clickSnapshot.setAttribute('disabled', 'true')
    // }

    if (event.nativeEvent.button === 0 && game.board[row][col] !== 'F') {
      console.log('Inside left-click')

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

        // // Trying to disable revealed buttons
        // console.log(revealedButton.classList.contains('revealed'))
        // if (revealedButton.classList.contains('revealed')) {
        //   revealedButton.setAttribute('disabled', 'true')
        // }
        console.log(
          'Left-click and after setGame--event.target is and className is:'
        )
        console.log(clickSnapshot)
        console.log(clickSnapshot.firstElementChild?.className)
      }
    } else if (event.nativeEvent.button === 2) {
      console.log('Inside right-click')
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
        console.log(
          'Right-click and after setGame--event.target is and className is:'
        )
        console.log(clickSnapshot)
        console.log(clickSnapshot.firstElementChild?.className)
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
      return //'Starting new game'
    } else if (game.state === 'playing') {
      return 'Game in progress...'
    } else if (game.state === 'won' || game.state === 'lost') {
      return `You ${game.state}!`
    }
  }

  // think this and checkState are competing
  function isGameOver() {
    //inside isGameOver
    if (game.state === 'won' || game.state === 'lost') {
      return false
    }
    return true
  }

  return (
    <div>
      <h1>Minesweeper</h1>
      <h2>{checkState()}</h2>

      <main>
        <section
          id={`difficulty-${difficulty}`}
          className={isGameOver() ? undefined : 'game-over'}
        >
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
      </main>
      <nav>
        <button onClick={() => handleNewGame(0)}>
          <h3>Easy</h3>
        </button>
        <button onClick={() => handleNewGame(1)}>
          <h3>Medium</h3>
        </button>
        <button onClick={() => handleNewGame(2)}>
          <h3>Hard</h3>
        </button>
      </nav>
    </div>
  )
}

// import React, { useState, useEffect } from 'react'

// type Square =
//   | ' '
//   | '_'
//   | 'F'
//   | '*'
//   | '@'
//   | '1'
//   | '2'
//   | '3'
//   | '4'
//   | '5'
//   | '6'
//   | '7'
//   | '8'
// type Row = [Square, Square, Square, Square, Square, Square, Square, Square]
// type Board = [Row, Row, Row, Row, Row, Row, Row, Row]
// type Difficulty = 0 | 1 | 2
// type Game = {
//   id: null | number
//   board: Board
//   state: null | string
//   mines: null | number
//   difficulty: Difficulty
// }

// export function App() {
//   const [game, setGame] = useState<Game>({
//     id: null,
//     board: [
//       [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//       [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//       [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//       [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//       [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//       [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//       [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//       [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//     ],
//     state: null,
//     mines: null,
//     difficulty: 0,
//   })

//   const [difficulty, setDifficulty] = useState<Difficulty>(0)

//   async function handleClickCell(
//     event: React.MouseEvent,
//     row: number,
//     col: number
//   ) {
//     event.preventDefault()

//     if (
//       game.id === null ||
//       game.state === 'won' ||
//       game.state === 'lost' ||
//       game.board[row][col] !== ' '
//     ) {
//       return
//     }

//     if (event.nativeEvent.button === 0) {
//       const url = `https://minesweeper-api.herokuapp.com/games/${game.id}/check`

//       const body = { row, col }

//       const response = await fetch(url, {
//         method: 'POST',
//         headers: { 'content-type': 'application/json' },
//         body: JSON.stringify(body),
//       })

//       if (response.ok) {
//         const newGameState = (await response.json()) as Game
//         setGame(newGameState)
//       }
//     } else if (event.nativeEvent.button === 2) {
//       const url = `https://minesweeper-api.herokuapp.com/games/${game.id}/flag`
//       const body = { row, col }

//       const response = await fetch(url, {
//         method: 'POST',
//         headers: { 'content-type': 'application/json' },
//         body: JSON.stringify(body),
//       })

//       if (response.ok) {
//         const newGameState = (await response.json()) as Game
//         setGame(newGameState)
//       }
//     }
//   }

//   async function handleNewGame(newGameDifficulty: Difficulty) {
//     const diff = { difficulty: newGameDifficulty }

//     const response = await fetch(
//       'https://minesweeper-api.herokuapp.com/games',
//       {
//         method: 'POST',
//         headers: { 'content-type': 'application/json' },
//         body: JSON.stringify(diff),
//       }
//     )

//     if (response.ok) {
//       const newGameState = (await response.json()) as Game
//       setDifficulty(newGameDifficulty)
//       setGame(newGameState)
//     }
//   }

//   useEffect(() => {
//     handleNewGame(0)
//   }, [])

//   function checkState() {
//     if (game.state === 'new') {
//       return //'Starting new game'
//     } else if (game.state === 'playing') {
//       return 'Game in progress...'
//     } else if (game.state === 'won' || game.state === 'lost') {
//       return `You ${game.state}!`
//     }
//   }

//   function isGameOver() {
//     if (game.state === 'won' || game.state === 'lost') {
//       return false
//     }
//     return true
//   }

//   function changeCellValue(value: string | number) {
//     if (value === 'F') {
//       return <span className="flag" />
//     }
//     if (value === '*') {
//       return <span className="bomb" />
//     }
//     if (value === '_') {
//       return ''
//     }
//     if (value === 1) {
//       return <span className="nr1 pressed">1</span>
//     }
//     if (value === 2) {
//       return <span className="nr2">2</span>
//     }
//     if (value === 3) {
//       return <span className="nr3">3</span>
//     }
//     if (value === 4) {
//       return <span className="nr4">4</span>
//     }
//     if (value === 5) {
//       return <span className="nr5">5</span>
//     }
//     if (value === 6) {
//       return <span className="nr6">6</span>
//     }
//     if (value === 7) {
//       return <span className="nr7">7</span>
//     }
//     if (value === 8) {
//       return <span className="nr8">8</span>
//     }
//     return value
//   }

//   return (
//     <div>
//       <h1>Minesweeper</h1>
//       <h2>{checkState()}</h2>

//       <main>
//         <section
//           id={`difficulty-${difficulty}`}
//           className={isGameOver() ? undefined : 'game-over'}
//         >
//           {game.board.map((row, rowIndex) =>
//             row.map((col, colIndex) => (
//               <button
//                 key={colIndex}
//                 className={
//                   game.board[rowIndex][colIndex] === ' ' ||
//                   game.board[rowIndex][colIndex] === 'F'
//                     ? undefined
//                     : 'revealed'
//                 }
//                 onClick={(e) => handleClickCell(e, rowIndex, colIndex)}
//                 onContextMenu={(e) => handleClickCell(e, rowIndex, colIndex)}
//               >
//                 {changeCellValue(game.board[rowIndex][colIndex])}
//               </button>
//             ))
//           )}
//         </section>
//       </main>
//       <h3>
//         <button onClick={() => handleNewGame(0)}>Easy</button>
//         <button onClick={() => handleNewGame(1)}>Medium</button>
//         <button onClick={() => handleNewGame(2)}>Hard</button>
//       </h3>
//     </div>
//   )
// }
