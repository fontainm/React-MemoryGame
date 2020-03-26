import React from 'react';
import ReactDOM from 'react-dom';
import Tilt from 'react-tilt';
import Flip from 'react-reveal/Flip';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';

import { memoryImages } from './images';

import './index.css';

function MemoryCard(props) {
  let styles;
  if (props.card.faceDown && !props.card.solved) {
    styles = { backgroundColor: 'rgba(0, 0, 0, 0.5)' };
  } else if (props.card.solved) {
    styles = { filter: 'grayscale(100%)', opacity: '50%' }
  } else {
    styles = { filter: 'grayscale(100%)' };
  }
  return(
    <Grid item xs={4} sm={4} md={3} xl={2}>
        <Tilt className="Tilt" options={{ max: 30, scale: 1.1 }}>
      <Flip right cascade when={!props.card.solved}>
          <Card className="memoryCard">
            <CardMedia 
              style={ styles }
              image={memoryImages[props.card.pairId]}
              className="memoryImg"
              onClick={props.card.solved || !props.card.faceDown ? null : () => props.onClick(props.card.id)}            
              />
          </Card>
      </Flip>
        </Tilt>
    </Grid>
  );
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openCards: 0,
      memoryCards: shuffleCards(props.count)
    };
  }
  
  handleClick = id => {
    let newMemoryCards = this.state.memoryCards.slice();
    let clickedCard = newMemoryCards.find((card) => { return card.id === id; } );
    let currentOpenCards = this.state.openCards;

    if (currentOpenCards === 0) {
      currentOpenCards = 1;
    } else if (currentOpenCards === 1) {
      currentOpenCards = 2;
      this.checkMatch(clickedCard, this.state.memoryCards.find((card) => { return (card.faceDown === false) }));
    } else if (currentOpenCards === 2) {
      currentOpenCards = 1;
      this.allCardsDown();
    }
    clickedCard.faceDown = false;

    // console.log(
    //   "Clicked Pair-ID: " + clickedCard.pairId,
    //   "Clicked ID: " + clickedCard.id,
    //   "Open Cards: " + currentOpenCards
    // )
    
    this.setState({
      openCards: currentOpenCards,
      memoryCards: newMemoryCards
    });    
  }

  checkMatch = (card1, card2) => {
    if (card1.pairId === card2.pairId && card1.id !== card2.id) {
      let newMemoryCards = this.state.memoryCards;
      newMemoryCards.find((card) => { return card.id === card1.id }).solved = true;
      newMemoryCards.find((card) => { return card.id === card2.id }).solved = true;
      this.setState({
        openCards: 0,
        memoryCards: newMemoryCards
      });
    }
  }

  allCardsDown = () => {
    let newMemoryCards = this.state.memoryCards;
    newMemoryCards.forEach((card) => {
      card.faceDown = true;
    });
    this.setState({
      memoryCards: newMemoryCards
    })
  }

  render() {
    return(
      <Container maxWidth={false}>
        <h1 className="title">Memory Game</h1>
        <Grid container spacing={3}>
          { this.state.memoryCards.map((card, index) => {
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
