import React from 'react'

type CellProps = {
  cell: string
  cellRowIndex: number
  cellColIndex: number
  cellState: string | null
  handleCheckOrFlagCell: (
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
  handleCheckOrFlagCell,
}: CellProps) {
  async function handleClickCell(
    event: React.MouseEvent,
    row: number,
    col: number
  ) {
    const clickSnapshot = event.currentTarget

    await handleCheckOrFlagCell(event, row, col)

    isFlag(event, clickSnapshot)

    isBomb(clickSnapshot)
  }

  // might go in App.tsx
  function isFlag(event: React.MouseEvent, target: any) {
    if (event.nativeEvent.button === 2) {
      if (target.firstElementChild === null) {
        if (cell) {
          return <i className=""></i>
        }
      }
      if (cell === ' ' && target.firstElementChild.className === '') {
        target.firstElementChild.classList.add('flag')
        return
      } else if (
        cell === 'F' &&
        target.firstElementChild.className === 'flag'
      ) {
        target.firstElementChild.classList.remove('flag')
        target.firstElementChild.classList.add('question')
        return
      } else if (
        cell === 'F' &&
        target.firstElementChild.className === 'question'
      ) {
        target.firstElementChild.classList.remove('question')
        return
      }
    }
  }

  function isBomb(target: any) {
    if (target.firstElementChild === null) {
      return
    }
    if (target.firstElementChild.className === 'mine') {
      target.classList.add('explosion')
    }
  }

  function transformCellValue(value: string | number) {
    if (cellState !== null) {
      if (cell === ' ') {
        return <div className="" />
      }
      if (cellState === 'win' || cellState === 'lost') {
        if (value === '@') {
          return <span className="flag" />
        }
        if (value === 'F') {
          return <i className="not-a-mine" />
        }
      } else {
        if (value === 'F') {
          return <span className="" />
        }
      }
      if (value === '*') {
        return <i className="mine" />
      }
      if (value === '_') {
        return ''
      }
      if (value === 1) {
        return <div className="number num1">1</div>
      }
      if (value === 2) {
        return <div className="number num2">2</div>
      }
      if (value === 3) {
        return <div className="number num3">3</div>
      }
      if (value === 4) {
        return <div className="number num4">4</div>
      }
      if (value === 5) {
        return <div className="number num5">5</div>
      }
      if (value === 6) {
        return <div className="number num6">6</div>
      }
      if (value === 7) {
        return <div className="number num7">7</div>
      }
      if (value === 8) {
        return <div className="number num8">8</div>
      }
      return value
    }
  }

  return (
    <button
      key={cellColIndex}
      onClick={(e) => {
        e.preventDefault()
        handleClickCell(e, cellRowIndex, cellColIndex)
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        handleClickCell(e, cellRowIndex, cellColIndex)
      }}
      className={
        cell === ' ' || cell === 'F' || cell === '@' ? undefined : 'revealed'
      }
    >
      {transformCellValue(cell)}
    </button>
  )
}
