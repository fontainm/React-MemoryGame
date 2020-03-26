import React from 'react';
import ReactDOM from 'react-dom';
import Tilt from 'react-tilt';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';

import { memoryImages } from './images';

import './index.css';

function MemoryCard(props) {
  return(
    <Grid item xs={4} sm={4} md={3} xl={2}>
      <Tilt className="Tilt" options={{ max : 30, scale: 1.1 }}>
        <Card className="memoryCard">
          <CardMedia 
            style={props.faceDown ? { filter: 'grayscale(0%)' } : { filter: 'grayscale(100%)' } }
            image={memoryImages[props.pairId]}
            className="memoryImg"
            onClick={() => props.onClick(props.id)}
          />
        </Card>
      </Tilt>
    </Grid>
  );
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memoryCards: shuffleCards(props.count)
    };
  }
  
  handleClick = id => {
    let newMemoryCards = this.state.memoryCards.slice();
    let matchedCard = newMemoryCards.find(function(card) { return card.id === id; } );
    matchedCard.faceDown = !matchedCard.faceDown;
    this.setState({
      memoryCards: newMemoryCards
    });
  }

  render() {
    return(
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          { this.state.memoryCards.map((card, index) => {
              return <MemoryCard key={card.id} id={card.id} pairId={card.pairId} faceDown={card.faceDown} onClick={(id) => this.handleClick(id)} />
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
      faceDown: true
    };
  }
  memoryCards.sort(() => Math.random() - 0.5);
  return memoryCards;
}

ReactDOM.render(
  <MemoryGame count={6} />,
  document.getElementById('root')
);
