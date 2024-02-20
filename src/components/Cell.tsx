import React from 'react'

type CellProps = {
  cell: string
  cellRowIndex: number
  cellColIndex: number
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
  handleClickCell,
}: CellProps) {
  // event: React.MouseEvent, row: number, col: number)
  // function handleLeftClick() {}
  // function handleRightClick() {}
  function handleClick(event: React.MouseEvent, row: number, col: number) {
    handleClickCell(event, row, col)
  }

  function transformCell(value: string | number) {
    if (value === 'F') {
      return <span className="flag" />
    }
    if (value === '*') {
      return <span className="bomb" />
    }
    if (value === '_') {
      return ''
    }
    if (value === 1) {
      return <span className="nr1">1</span>
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
  }

  return (
    <button
      key={cellColIndex}
      onClick={(e) => handleClick(e, cellRowIndex, cellColIndex)}
      onContextMenu={(e) => handleClick(e, cellRowIndex, cellColIndex)}
      className={cell === ' ' || cell === 'F' ? undefined : 'revealed'}
    >
      {transformCell(cell)}
    </button>
  )
}
