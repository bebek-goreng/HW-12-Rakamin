import * as React from 'react';
import {
  ChakraProvider,
  Button,
  Flex,
  Text,
  Switch,
  useColorMode,
  ColorModeProvider,
} from '@chakra-ui/react';

function Board() {
  const [history, setHistory] = React.useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = React.useState(0);
  const [nextValue, setNextValue] = React.useState('X');

  function selectSquare(square) {
    if (calculateWinner(history[stepNumber]) || history[stepNumber][square]) {
      return;
    }
    const newHistory = history.slice(0, stepNumber + 1);
    const currentSquares = newHistory[newHistory.length - 1];
    const newSquares = [...currentSquares];
    newSquares[square] = nextValue;
    setHistory([...newHistory, newSquares]);
    setStepNumber(newHistory.length);
    setNextValue(calculateNextValue(newSquares));
  }

  function restart() {
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
    setNextValue('X');
  }

  function undo() {
    if (stepNumber > 0) {
      setStepNumber(stepNumber - 1);
      setNextValue(calculateNextValue(history[stepNumber - 1]));
    }
  }

  function redo() {
    if (stepNumber < history.length - 1) {
      setStepNumber(stepNumber + 1);
      setNextValue(calculateNextValue(history[stepNumber + 1]));
    }
  }

  function renderSquare(i) {
    return (
      <Button
        className="square"
        variant="outline"
        size="lg"
        fontSize="2xl"
        fontWeight="bold"
        width="100px"
        height="100px"
        onClick={() => selectSquare(i)}
      >
        {history[stepNumber][i]}
      </Button>
    );
  }

  function Title() {
    return (
      <div>
        <h2>Tic Tac Toe</h2>
      </div>
    )
  }

  const currentSquares = history[stepNumber];
  const winner = calculateWinner(currentSquares);
  const status = calculateStatus(winner, currentSquares, nextValue);

  return (
    <Flex direction="column" alignItems="center" justifyContent="center">
      <Text fontSize="3xl" fontWeight="bold" mb="4" textAlign="center">
        <Title />
      </Text>
      <Text fontSize="xl" fontWeight="bold" mb="4" textAlign="center">
        {status}
      </Text>
      <Flex className="board" direction="column" alignItems="center" justifyContent="center">
        <Flex className="board-row" mb="2">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </Flex>
        <Flex className="board-row" mb="2">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </Flex>
        <Flex className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </Flex>
      </Flex>
      <Flex direction="row" alignItems="center" justifyContent="center" mt="4">
        <Button
          onClick={undo}
          colorScheme="blue"
          variant="solid"
          size="md"
          disabled={stepNumber === 0}
          mr="2"
          opacity={stepNumber === 0 ? '0.5' : '1'}
          width="100px"
        >
          Undo
        </Button>
        <Button
          onClick={redo}
          colorScheme="blue"
          variant="solid"
          size="md"
          disabled={stepNumber === history.length - 1 || winner}
          mr="2"
          opacity={stepNumber === history.length - 1 || winner ? '0.5' : '1'}
          width="100px"
        >
          Redo
        </Button>
        <Button
          onClick={restart}
          colorScheme="blue"
          variant="solid"
          size="md"
          width="100px"
        >
          Restart
        </Button>
      </Flex>
    </Flex>
  );
}

function Game() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex direction="column" alignItems="center" justifyContent="center" minHeight="100vh">
      <Flex
        position="absolute"
        top="2"
        right="2"
        mr="4"
        mt="4"
      >
        <Switch
          colorScheme="blue"
          isChecked={colorMode === 'dark'}
          onChange={toggleColorMode}
          size="md"
        />
      </Flex>
      <Board />
    </Flex>
  );
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `${nextValue} Turn`;
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return (
    <ChakraProvider>
      <ColorModeProvider>
        <Game />
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default App;
