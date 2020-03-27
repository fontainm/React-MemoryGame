import React from 'react';
import ReactDOM from 'react-dom';
import Tilt from 'react-tilt';
import Flip from 'react-reveal/Flip';
import RubberBand from 'react-reveal/RubberBand';
import Tada from 'react-reveal/Tada';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';

import { memoryImages } from './images';
import bgImg from './images/bg3.jpg';

import './index.css';

const cardStyle = {
  borderRadius: '1rem',
  boxShadow: '2px 2px 10px grey'
}

function MemoryCard(props) {
  return(
    <Grid item xs={4} sm={3} md={3} xl={3}>
        <Tilt className="Tilt" options={{ max: 30, scale: 1.1 }}>
          <Flip right spy={props.card.faceDown}>
          <RubberBand spy={props.card.solved}>
              <Card style={cardStyle} className="memoryCard">
                <CardMedia 
                  image={ props.card.faceDown ? bgImg : memoryImages[props.card.pairId] }
                  className="memoryImg"
                  onClick={props.card.solved || !props.card.faceDown ? null : () => props.onClick(props.card.id)}            
                  />
              </Card>
            </RubberBand>
          </Flip>
        </Tilt>
    </Grid>
  );
}

function GameOverScreen(props) {
  return (
    <div className="gameOver">
      <div className="message">
        <Tada>
          <p className="win">
            you win<br />
            {props.time}<span className="stat"> seconds</span><br />
            {props.moves}<span className="stat"> moves</span>
          </p>
          <Button variant="contained" className="restartBtn" onClick={props.onClick}><SettingsBackupRestoreIcon /> </Button>
        </Tada>
      </div>
    </div>
  );
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openCards: 0,
      memoryCards: shuffleCards(props.count),
      timer: 0,
      staringTime: 0,
      moves: 0,
      won: false
    };
  }
  
  handleClick = id => {
    let newMemoryCards = this.state.memoryCards.slice();
    let newMoves = this.state.moves;
    let clickedCard = newMemoryCards.find((card) => { return card.id === id; } );
    let currentOpenCards = this.state.openCards;

    if (currentOpenCards === 0) {
      this.startTimer();
      currentOpenCards = 1;
    } else if (currentOpenCards === 1) {
      newMoves++;
      currentOpenCards = 2;
      this.checkMatch(clickedCard, this.state.memoryCards.find((card) => { return (!card.faceDown && !card.solved) }));
    } else if (currentOpenCards === 2) {
      currentOpenCards = 1;
      this.allCardsDown();
    }
    clickedCard.faceDown = false;

    // console.log(
    //   "Clicked Pair-ID: " + clickedCard.pairId,
    //   "Clicked ID: " + clickedCard.id,
    //   "Open Cards: " + currentOpenCards,
    //   "Timer: " + newTimer,
    //   "Moves: " + newMoves
    // )
    
    this.setState({
      openCards: currentOpenCards,
      memoryCards: newMemoryCards,
      moves: newMoves
    });    
  }

  startTimer = () => {
    this.setState({
      startingTime: Date.now()
    })
    this.timer = setInterval(() => {
      this.setState({
        timer: ((Date.now() - this.state.startingTime) / 1000).toFixed(0)
      });
    }, 1000)
  }

  stopTimer = () => {
    clearInterval(this.timer);
    console.log("timer stop");
  }

  checkMatch = (card1, card2) => {
    if (card1.pairId === card2.pairId && card1.id !== card2.id) {
      card1.faceDown = false;
      let newMemoryCards = this.state.memoryCards;
      newMemoryCards.find((card) => { return card.id === card1.id }).solved = true;
      newMemoryCards.find((card) => { return card.id === card2.id }).solved = true;
      this.setState({
        openCards: 0,
        memoryCards: newMemoryCards
      });
      this.checkWin();
    }
  }

  checkWin() {
    let win = true;
    this.state.memoryCards.forEach((card) => {
      if (!card.solved) {
        win = false;
        return;
      }
    });
    if (win) {
      this.stopTimer();
      this.setState({
        won: true
      })
    }
  }

  allCardsDown = () => {
    let newMemoryCards = this.state.memoryCards;
    newMemoryCards.forEach((card) => {
      card.faceDown = true;
      if (card.solved) card.faceDown = false;
    });
    this.setState({
      memoryCards: newMemoryCards
    })
  }
  
  restartGame = () => {
    this.setState({
      openCards: 0,
      memoryCards: shuffleCards(6),
      timer: 0,
      staringTime: 0,
      moves: 0,
      won: false
    });
  }

  render() {
    return(
      <Container maxWidth="lg">       
        {this.state.won ? <GameOverScreen onClick={this.restartGame} time={this.state.timer} moves={this.state.moves} /> : null}
        <Grid container className="gameStats">
            <Grid className="gameStatItem" item xs={6}><span className="title">my memory game</span></Grid>
            <Grid className="gameStatItem" item xs={3}>{this.state.timer}<span className="stat"> Seconds</span></Grid>
            <Grid className="gameStatItem" item xs={3}>{this.state.moves}<span className="stat"> Moves</span></Grid>
        </Grid>
        <Grid container spacing={2} className="gameContainer">
            { this.state.memoryCards.map((card) => {
              return <MemoryCard key={card.id} card={card} onClick={(id) => this.handleClick(id)} />
            }) }
        </Grid>
      </Container>
    );
  }
}

function shuffleCards(count) {
  let memoryCards = [];
  for (let i = 0; i < count*2; i++) {
    memoryCards[i] = {
      id: i,
      pairId: Math.floor(i/2),
      faceDown: true,
      solved: false
    };
  }
  memoryCards.sort(() => Math.random() - 0.5);
  return memoryCards;
}

ReactDOM.render(
  <MemoryGame count={6} />,
  document.getElementById('root')
);
