import React from 'react';
import ReactDOM from 'react-dom';
import Tilt from 'react-tilt';
import Flip from 'react-reveal/Flip';
import RubberBand from 'react-reveal/RubberBand';
import Tada from 'react-reveal/Tada';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';

import { memoryImages } from './images';
import bgImg from './images/bg.jpg';

import './index.css';

const cardStyle = {
  borderRadius: '8px',
  boxShadow: '2px 2px 10px grey'
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openCards: 0,
      memoryCards: this.shuffleCards(),
      screenHeight: window.innerHeight,
      timer: 0,
      staringTime: 0,
      moves: 0,
      won: false
    };
    this.handleResize = this.handleResize.bind(this);
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

  shuffleCards = () => {
    let memoryCards = [];
    for (let i = 0; i < 12; i++) {
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
      memoryCards: this.shuffleCards(),
      timer: 0,
      staringTime: 0,
      moves: 0,
      won: false
    });
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {
    window.addEventListener("resize", null);
  }
  handleResize(screenHeight, event) {
    this.setState({screenHeight: window.innerHeight})
  }

  render() {
    return(
      <Container maxWidth="lg">       
        <Grid container direction="column" justify="flex-start" alignItems="center">
          <Grid item container className="gameStats" alignItems="stretch" style={{height: this.state.screenHeight/6}}>
              <Grid item xs={6}><span className="title">my memory game</span></Grid>
              <Grid item xs={3}>{this.state.timer}<span className="stat"> Seconds</span></Grid>
              <Grid item xs={3}>{this.state.moves}<span className="stat"> Moves</span></Grid>
          </Grid>
          <Grid item container spacing={2} className="gameContainer" style={{height: this.state.screenHeight/6*5}}>
              { this.state.memoryCards.map((card) => {
                return <MemoryCard key={card.id} card={card} onClick={(id) => this.handleClick(id)} />
              }) }
          </Grid>
        </Grid>
        {this.state.won ? <GameOverScreen onClick={this.restartGame} time={this.state.timer} moves={this.state.moves} /> : null}
      </Container>
    );
  }
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
      <Container maxWidth="lg">
        <Grid container spacing={0} alignItems="center" justify="center">
          <Grid item xs={8} sm={6}>
            <Tada>
              <Card style={cardStyle} className="message">
                <CardContent>
                  <Grid container alignItems="center" justify="center">
                    <Grid item xs={12} className="title">you win</Grid>
                    <Grid item xs={6} className="title">{props.time} <span className="stat"> seconds</span></Grid>
                    <Grid item xs={6} className="title">{props.moves} <span className="stat"> moves</span></Grid>
                    <Grid item xs={10}>
                      <Tilt className="Tilt" options={{ max: 30, scale: 1.1 }}>
                        <Card style={cardStyle} className="restartBtn title" onClick={props.onClick}>
                          restart
                        </Card>
                      </Tilt>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Tada>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

ReactDOM.render(
  <MemoryGame />,
  document.getElementById('root')
);
