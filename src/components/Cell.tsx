import React from 'react'

type CellProps = {
  cell: string
  cellRowIndex: number
  cellColIndex: number
  cellState: string | null
  // leftClickMove: () => void
  // rightClickMove: () => void
  // handleClickCell: (event: React.MouseEvent, row: number, col: number) => void
  handleClickCell: (
    _event: React.MouseEvent,
    _row: number,
    _col: number
  ) => void
}

export function Cell({
  cell,
  cellRowIndex,
  cellColIndex,
  cellState,
  handleClickCell,
}: CellProps) {
  // event: React.MouseEvent, row: number, col: number)
  // function handleLeftClick() {}
  // function handleRightClick() {}

  async function handleClick(
    event: React.MouseEvent,
    row: number,
    col: number
  ) {
    const clickSnapshot = event.currentTarget
    console.log('handleClick in Cell.tsx--event.target is and className is:')
    console.log(clickSnapshot)
    console.log(clickSnapshot.firstElementChild?.className)
    // console.log(clickSnapshot.classList.contains('revealed'))
    // if (clickSnapshot.classList.contains('revealed')) {
    //   clickSnapshot.setAttribute('disabled', 'true')
    // }

    await handleClickCell(event, row, col)

    isFlag(event, clickSnapshot)
    isBomb(clickSnapshot)
  }
  function isFlag(event: React.MouseEvent, target: any) {
    if (target.firstElementChild === null || event.nativeEvent.button === 0) {
      return
    }
    if (event.nativeEvent.button === 2) {
      // target.firstElementChild.classList.contains('flag') &&

      target.firstElementChild.classList.toggle('flag')
      return
    }
  }

  function isBomb(target: any) {
    if (target.firstElementChild === null) {
      return
    }

    if (target.firstElementChild.className === 'bomb') {
      target.firstElementChild.classList.add('explosion')
    }
  }

  // needs mines displayed.
  // needs difficulty
  // needs counter of moves

  // console.log(clickSnapshot.firstElementChild?.className)

  // This function goes off twice, in beginning, and at the end.
  // Is it once bc of button and once bc Cell in App "initializing" the button?
  function transformCell(value: string | number) {
    // I believe this is where the disable should happen for buttons
    // Trying to disable revealed buttons
    // if (cellState !== null) {
    if (cellState === 'win' || cellState === 'lost') {
      if (value === '@') {
        return <span className="flag" />
      }
      if (value === 'F') {
        return <span className="false_bomb" />
      }
    } else {
      if (value === 'F') {
        return <span className="" />
      }
    }
    if (value === '*') {
      return <span className="bomb" />
    }
    if (value === '_') {
      return ''
    }
    if (value === 1) {
      return <div className="nr1">1</div>
    }
    if (value === 2) {
      return <span className="nr2">2</span>
    }
    if (value === 3) {
      return <span className="nr3">3</span>
    }
    if (value === 4) {
      return <span className="nr4">4</span>
    }
    if (value === 5) {
      return <span className="nr5">5</span>
    }
    if (value === 6) {
      return <span className="nr6">6</span>
    }
    if (value === 7) {
      return <span className="nr7">7</span>
    }
    if (value === 8) {
      return <span className="nr8">8</span>
    }
    return value
    // }
  }

  return (
    <button
      key={cellColIndex}
      onClick={(e) => handleClick(e, cellRowIndex, cellColIndex)}
      onContextMenu={(e) => handleClick(e, cellRowIndex, cellColIndex)}
      className={
        cell === ' ' || cell === 'F' || cell === '@' ? undefined : 'revealed'
      }
    >
      {transformCell(cell)}
    </button>
  )
}
