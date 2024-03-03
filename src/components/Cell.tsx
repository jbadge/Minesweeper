import React from 'react'

type CellProps = {
  cell: string
  cellRowIndex: number
  cellColIndex: number
  cellState: string | null
  handleCheckOrFlagCell: (
    _event: React.MouseEvent,
    _row: number,
    _col: number,
    _action: string
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
    col: number,
    action: string
  ) {
    const clickSnapshot = event.currentTarget

    // Console Check 1
    console.log(
      `BOL - The cell on row ${row} in column ${col} has value '${cell}' and the className is '${clickSnapshot.firstElementChild?.className}'`
    )

    await handleCheckOrFlagCell(event, row, col, action)

    isFlag(event, clickSnapshot)

    isBomb(clickSnapshot)

    // Console Check 6
    console.log(
      `EOL - The cell on row ${row} in column ${col} has a className is '${clickSnapshot.firstElementChild?.className}'`
    )
  }

  function isFlag(event: React.MouseEvent, target: any) {
    if (event.nativeEvent.button === 2) {
      if (target.firstElementChild === null) {
        if (cell) {
          return <i className=""></i>
        }
      }
      if (cell === ' ' && target.firstElementChild.className === '') {
        target.firstElementChild.classList.add('flag')
        // cell = 'F'
        return
      } else if (target.firstElementChild.className === 'flag') {
        target.firstElementChild.classList.remove('flag')
        target.firstElementChild.classList.add('question')
        // cell = 'Q'
        return
      } else if (target.firstElementChild.className === 'question') {
        target.firstElementChild.classList.remove('question')
        // cell = ' '
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
      const buttons = document.querySelectorAll('button')
      buttons.forEach((button) => {
        if (!button.classList.contains('difficulty-button')) {
          button.setAttribute('disabled', 'true')
          button.parentElement?.classList.add('no-click')
          button.style.pointerEvents = 'none'
        }
      })
    }
  }

  function transformCellValue(value: string | number) {
    if (cellState !== null) {
      if (cell === ' ') {
        return <div className="" />
      }
      if (cellState === 'win' || cellState === 'lost') {
        if (value === '@') {
          return <i className="flag" />
        }
        if (value === 'F') {
          return <i className="not-a-mine" />
        }
      } else {
        if (value === 'F') {
          return <i className="" />
        }
      }
      if (value === '*') {
        return <i className="mine" />
      }
      if (value === '_') {
        return ''
      }
      if (value === 1) {
        return <div className="cell-number cell-num1">1</div>
      }
      if (value === 2) {
        return <div className="cell-number cell-num2">2</div>
      }
      if (value === 3) {
        return <div className="cell-number cell-num3">3</div>
      }
      if (value === 4) {
        return <div className="cell-number cell-num4">4</div>
      }
      if (value === 5) {
        return <div className="cell-number cell-num5">5</div>
      }
      if (value === 6) {
        return <div className="cell-number cell-num6">6</div>
      }
      if (value === 7) {
        return <div className="cell-number cell-num7">7</div>
      }
      if (value === 8) {
        return <div className="cell-number cell-num8">8</div>
      }
      return value
    }
  }

  return (
    <button
      key={cellColIndex}
      className={
        cell === ' ' || cell === 'F' || cell === '@' ? undefined : 'revealed'
      }
      onClick={(e) => {
        e.preventDefault()
        handleClickCell(e, cellRowIndex, cellColIndex, 'check')
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        handleClickCell(e, cellRowIndex, cellColIndex, 'flag')
      }}
    >
      {transformCellValue(cell)}
    </button>
  )
}
