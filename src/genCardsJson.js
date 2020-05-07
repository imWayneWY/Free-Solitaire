let cards = [];

let id=0;
for(let i=0; i<4; i++){
  for(let j=1;j<=13;j++){
    let type = '';
    let color = '';
    switch(i){
      case 0:
        type='heart';
        color='red';
        break;
      case 1:
        type='spade';
        color='black';
        break;
      case 2:
        type='club';
        color='black';
        break;
      case 3:
        type='diamond';
        color='red';
        break;
      default:
        break;
    }
    cards.push({
      id: ++id,
      type,
      color,
      value: j
    })
  }
}
let cardsJson = JSON.stringify(cards);
export { cardsJson }