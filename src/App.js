import { useState } from "react";
import { animated, useSpring } from '@react-spring/web'

function calculateWinner(squares, className) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a]?.props?.value && squares[a]?.props?.value === squares[b]?.props?.value && squares[a]?.props?.value === squares[c]?.props?.value) {

      if (squares[a]?.props?.value === "X") {return <Mark className={className} value="X"/>}
      else if (squares[a]?.props?.value === "O") {return <Mark className={className} value="O"/>}
    }
  }
  return null;
}

function Mark({className, value}) {
  const oSprings = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
  })

  const leftXSprings = useSpring({
    from: { transform: "rotate(-45deg) scale(0)" },
    to: { transform: "rotate(-45deg) scale(1)" },
  })

  const rightXSprings = useSpring({
    from: { transform: "rotate(45deg) scale(0)" },
    to: { transform: "rotate(45deg) scale(1)" },
  })

  if (value === "X") {
    return (
      <>
        <animated.div style={leftXSprings} className={`${className} left X`}></animated.div>
        <animated.div style={rightXSprings} className={`${className} right X`}></animated.div>
      </>
    )
  } else if (value === "O") {
    return (
      <animated.div style={oSprings} className={`${className} O`}></animated.div>
    )
  }
}

function Square({id, value, active, onSquareClick}) {
  return (
    <button onClick={onSquareClick} className={`square id${id+1} ${active ? "active" : ""}`}>{value}</button>
  )
}

function SubBoard({id, value, xIsNext, setXIsNext, activeBoard, setActiveBoard, onBoardWin, mainWinner}) {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const active = ((activeBoard === id) || activeBoard === null) && (!calculateWinner(squares)) && (!mainWinner)

  function handleClick(i) {
    if (calculateWinner(squares)) {
      return
    }
    if (active && !squares[i]) {
      const nextSquares = squares.slice()
      if (xIsNext) {
        nextSquares[i] = <Mark value="X"/>
      } else {
        nextSquares[i] = <Mark value="O"/>
      }
      setActiveBoard(i)
      setSquares(nextSquares)
      setXIsNext(!xIsNext)
      if (calculateWinner(nextSquares, "sub-board-winner")) {
        onBoardWin(id, calculateWinner(nextSquares, "sub-board-winner"))
      }
    } 
  }

  return (
    <div id={id} className={`sub-board id${id+1} ${active ? "active" : ""}`}>
      {[...Array(3).keys()].map(row => {
        return <div key={row} className="sub-board-row">
          {[...Array(3).keys()].map(id => 
            <Square 
            id={3*row+id} 
            active={active} 
            value={squares[3*row+id]}
            onSquareClick={() => handleClick(3*row+id)
            }/>
            
          )}
        </div>
      })}
      {value}
    </div>
  )
}

function MainBoard() {
  const [xIsNext, setXIsNext] = useState(true);
  const [boards, setBoards] = useState(Array(9).fill(null));
  const [activeBoard, setActiveBoard] = useState(null)
 
  function onBoardWin(id, subWinner) {
    const nextBoards = boards.slice()
    nextBoards[id] = subWinner
    console.log('ah')
    setBoards(nextBoards)
    setActiveBoard(null)
    console.log(nextBoards)
  }

  if (activeBoard) {
    if (boards[activeBoard] !== null) {
      setActiveBoard(null)
    }
  }

  let mainWinner;
  mainWinner = calculateWinner(boards, "main-board-winner")

  return (
    <div className="main-board">
      {[...Array(3).keys()].map(row => {
        return <div key={row} className="main-board-row">
          {[...Array(3).keys()].map(id => 
            <SubBoard 
            id={3*row+id} 
            key={3*row+id}
            value={boards[3*row+id]}
            xIsNext={xIsNext}
            setXIsNext={setXIsNext}
            activeBoard={activeBoard} 
            setActiveBoard={setActiveBoard}
            onBoardWin={onBoardWin}
            mainWinner={mainWinner}
            /> 
          )}
        </div>
      })}
      {mainWinner}
    </div>
  )
}



function Game() {
  const [history, setHistory] = useState(null)
  
  return(
    <>
    <div class="game">
      <h1>Super Tic-Tac-Toe</h1>
      <div class="game-content">
        <MainBoard/>
      </div>
    
      <div class="game-info">
        <h2>X to Move</h2>
      </div>
     
    </div>

    </>
  )
}

export default Game
