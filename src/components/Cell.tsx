import React from 'react'

type CellProps = {
  cell: string
  cellRowIndex: number
  cellColIndex: number
  cellState: string | null
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
  console.log('Running')
  async function handleClick(
    event: React.MouseEvent,
    row: number,
    col: number
  ) {
    const clickSnapshot = event.currentTarget

    await handleClickCell(event, row, col)

    isFlag(event, clickSnapshot)
    isBomb(clickSnapshot)
  }

  function isFlag(event: React.MouseEvent, target: any) {
    if (event.nativeEvent.button === 2) {
      if (cell === ' ') {
        target.firstElementChild.classList.add('flag')
        cell = 'F'
        return
      } else if (cell === 'F') {
        target.firstElementChild.classList.remove('flag')
        target.firstElementChild.classList.add('question')
        cell = 'Q'
        return
      } else if (cell === 'Q') {
        target.firstElementChild.classList.remove('question')
        cell = ' '
        return
      }
    }
  }

  function isBomb(target: any) {
    if (target.firstElementChild === null) {
      return
    }
    if (target.firstElementChild.className === 'mine') {
      target.firstElementChild.classList.add('explosion')
    }
  }

  function transformCell(value: string | number) {
    if (cellState !== null) {
      if (cellState === 'win' || cellState === 'lost') {
        if (value === '@') {
          return <span className="flag" />
        }
        if (value === 'F') {
          return <span className="not-a-mine" />
        }
      } else {
        if (value === 'F') {
          return <span className="" />
        }
      }
      if (value === '*') {
        return <span className="mine" />
      }
      if (value === '_') {
        return ''
      }
      if (value === 1) {
        return <div className="number num1">1</div>
      }
      if (value === 2) {
        return <span className="number num2">2</span>
      }
      if (value === 3) {
        return <span className="number num3">3</span>
      }
      if (value === 4) {
        return <span className="number num4">4</span>
      }
      if (value === 5) {
        return <span className="number num5">5</span>
      }
      if (value === 6) {
        return <span className="number num6">6</span>
      }
      if (value === 7) {
        return <span className="number num7">7</span>
      }
      if (value === 8) {
        return <span className="number num8">8</span>
      }
      return value
    }
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
