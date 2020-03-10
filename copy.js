let btn = document.querySelector('.menu__btn');
let colors_1 = ['red', 'deeppink', 'dodgerblue', 'yellow', 'black', 'yellowgreen', 'coral', 'aquamarine']
let colors = [...colors_1, ...colors_1];


btn.addEventListener('click', change);

function change(){

    btn.classList.toggle('menu__btn_active');
    console.log('gggg');
}
const checkColor = checker();
let cardsContainer = document.querySelectorAll('.card');

cardsContainer.forEach(function(elem){

    elem.addEventListener('click', function (){

        elem.classList.add('card_active');
        checkColor(elem);
        
    });
})

function checker(){

    const cards = [];
    return function(card){

        if (cards.length < 2){
            cards.push(card);
        } 
        if (cards.length === 2) {
            if (cards[0].querySelector('.back').style.background === cards[1].querySelector('.back').style.background){
                cards.forEach(transparent);
                cards.length = 0;
                console.log(cards, 'fffff')
                return true;
            } else{
                cards.forEach(delCl);
                cards.length = 0;
                return false;
                
            }
           
        }
        return false;
    }

}
function delCl(card){ 
    setTimeout(function(){
        card.classList.remove('card_active');
        console.log(card);
    }, 1000)

}

(function (){ 
    cardsContainer.forEach((elem) => {
        elem.classList.add('card_active')
    })
    setTimeout(function(){
        cardsContainer.forEach((elem) => {
            elem.classList.remove('card_active')
        })
    }, 1000)
    
})();

function transparent(card){

    card.style.opacity = '0';
}



function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    while (0 !== currentIndex) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}

colors = shuffle(colors);

cardsContainer.forEach(function(elem, i){

    elem.querySelector('.back').style.background = colors[i];
    
})
