//card objects
class Card {
    constructor(suit, number, bonus,isSpecial,setsSuit,isExpansion){
        this.suit = suit;
        this.number = number;
        this.bonus = bonus;
        this.isSpecial = isSpecial;
        this.isSetSuit = setsSuit;
        this.isExpansion = isExpansion;
        this.display = this.suit + ' ' + this.number;
        this.image = 'cards/'+suit + '_' + number +'.png';
        this.playedBy = -1;
        this.played = false;
    };
};

//player objects
class Player {
    constructor(name) {
        this.name = name;
        this.totalScore = 0;
        this.hand = [];
        this.bids = [];
        this.wins = [0,0,0,0,0,0,0,0,0,0];
        this.roundScores = [0,0,0,0,0,0,0,0,0,0];
        this.roundBonuses = [0,0,0,0,0,0,0,0,0,0];
        this.id = 0;
    };
};

//deck object
class Deck {
    constructor(){
        this.cardsInDeck = []
    };

    createDeck(suits) {
        for(var s in suits) {
            for(var i = 1; i <= 14; i++) {
                var bonus = i === 14 ? 10 : 0; //14 has a 10pt bonus
                bonus = suits[s] === 'black' && i === 14 ? 20 : bonus;
                var temp = new Card (suits[s],i,
                    bonus,false,
                    true,false);
                this.cardsInDeck.push(temp);
            }
        }
        return this;
    };

    addPirates(pirates) {
        for (var i = 0; i < pirates; i++){
            var temp = new Card('Pirate',15,0,true,false,false);
            this.cardsInDeck.push(temp);
        }
        return this;
    };

    addEscapes(escapes) {
        for (var i = 0; i < escapes; i++){
            var temp = new Card('Escape',-1,0,true,false,false);
            this.cardsInDeck.push(temp);
        }
        return this;
    };

    addMermaids(mermaids) {
        for (var i = 0; i < mermaids; i++){
            var temp = new Card('Mermaid',-1,0,true,false,true);
            this.cardsInDeck.push(temp);
        }
        return this;
    };

    addSkullKing() {
        this.cardsInDeck.push(new Card('Skull King',16,0,true,false,false));
        return this;
    };

    addTigress() {
        //code TBD
        return this;
    }


    addLoots(loots) {
        for (var i = 0; i < loots; i++){
            var temp = new Card('Loot',-1,0,true,false,true);
            this.cardsInDeck.push(temp);
        }
        return this;
    };

    addKraken(krakens) {
        for (var i = 0; i < krakens; i++){
            var temp = new Card('Kraken',-1,0,true,false,true);
            this.cardsInDeck.push(temp);
        }
        return this;
    };

};

class Round {
    constructor(round_num) {
        this.round_num = round_num;
        this.hands = [];
        this.leader = players[upFirst];
    };
};

class Hand {
    constructor(hand_num) {
        this.hand_num = hand_num;
        this.cards = [];
        this.winner = null;
    };
};

function shuffleCards() {
    let counter = deck.cardsInDeck.length, temp, i;

        while (counter) {
            i = Math.floor(Math.random() * counter--);
            deck.cardsInDeck[counter].played = false; //set card played equal to false
            temp = deck.cardsInDeck[counter];
            deck.cardsInDeck[counter] = deck.cardsInDeck[i];
            deck.cardsInDeck[i] = temp;
            deck.cardsInDeck[i].played = false;
        }
        console.log('Shuffled');
        console.log(deck.cardsInDeck);
};
//Clean up starting UI
function hideStartUIElements(){
    //hide UI elements
    for(var card = 0; card < document.getElementsByClassName('cards').length; card++) {
        document.getElementsByClassName('cards')[card].style.display = 'none';
        document.getElementsByClassName('cards')[card].classList.remove('cards_played');
    }

    //hide all played cards
    hidePlayedCards();

    //Revert labels back to player names
    for(player = 1; player <= players.length; player++) {
        document.getElementById('label_p' + player).textContent = players[player-1].name + ':';
    }

    //Revert names back to normal
     
    document.getElementById('btn_start_game').style.display = 'none';
    document.getElementById('header2').style.display = 'none';

};

//Once player names are entered, create list of players - remove blank player elements
function createPlayers(){
    //Creates players for all inputs that aren't null and push to players array
    //Replaces name labels with the player names
    //Hides elements where player name is null

    for(i=1; i<= maxPlayers; i++) {
        if(document.getElementById('inputName_p' + i).value != "") {
            var newPlayer = new Player(document.getElementById('inputName_p' + i).value); //New Player
            newPlayer.id = i;
            players.push(newPlayer); //Push player to global players array

            document.getElementById('label_p' + i).textContent = newPlayer.name + ':'; //display their name
            document.getElementById('inputName_p' + i).style.display = 'none';
        }else {
            var hideElements = document.getElementsByClassName('player'+i);
            for(el = 0; el < hideElements.length; el++) {
                document.getElementById('label_p' + i).textContent = "";
                hideElements[el].style.display = 'none';
            };
        }
    }
};

//Deal out cards
function deal() {
    console.log('Dealing Round:' + roundNum);

    //Hide deal button
    document.getElementById('btn_deal_round').style.display = 'none';
    
    //deal cards
    var counter = deck.cardsInDeck.length;
    for (var player = 0; player < players.length; player++) {
        var randCards = [];
        var cardsDisplay = "";

        //get random cards
        for(var i = 0; i < roundNum; i++){
            deck.cardsInDeck[counter-1].played = false;
            randCards.push(deck.cardsInDeck[counter-1]);
            randCards[i].playedBy = player;
            counter--;
            cardsDisplay = cardsDisplay.concat(randCards[i].display, ', ');
        }

        //add cards to player's hand array
        players[player].hand[roundNum-1] = randCards;
        
        //display cards
        //document.getElementById('cards_p' + (player+1)).textContent = cardsDisplay;

        var currentHand = players[player].hand[roundNum -1];
        for(var card = 1; card <= currentHand.length; card++) {
            document.getElementById('p' + (player+1) + 'c' + card).style.display = 'inline-block';
            document.getElementById('p' + (player+1) + 'c' + card).src = currentHand[card-1].image;
            document.getElementById('p' + (player+1) + 'c' + card).alt = currentHand[card-1].image;
        }
    }

};

//Show Bid Boxes
function showBidBoxes() {
    console.log('Showing Bids for' + players.length + ' players');

    for(player = 0; player < players.length; player++) {
        document.getElementById('bid_p'+(player+1)).value = ""; //clear out old bid if any
        document.getElementById('submit_bid_p'+(player+1)).textContent = 'Submit Bid'; //revert back to submit bid

        // document.getElementById('bid_p'+(player+1)).placeholder = "Round " + roundNum + ' Bid'; //input box
        document.getElementById('bid_p'+(player+1)).value = 0; //input box
        document.getElementById('bid_p'+(player+1)).style.display = 'inline-block'; //input box
        document.getElementById('submit_bid_p'+(player+1)).style.display = 'inline-block'; //submit button
        document.getElementById('submit_bid_p'+(player+1)).disabled = false; //submit button enabled
        document.getElementById('submit_bid_p'+(player+1)).classList.remove('submitted_bid'); //original format

        //Hide the deal round button
        document.getElementById('btn_deal_round').style.display = 'none';

        //Update the play round button
        document.getElementById('btn_play_round').textContent = players.length + ' Bids Needed';
        document.getElementById('btn_play_round').style.display = 'inline-block';
        document.getElementById('btn_play_round').disabled = true; //disable until all bids are submitted
        document.getElementById('btn_play_round').classList.add('bids_needed');
    }
};

//Hide bid boxes after all bids are submitted
function hideBids() {
    console.log('Hiding Bids for ' + players.length + ' players');
    for(player = 0; player < players.length; player++) {
        
        document.getElementById('bid_p'+(player+1)).style.display = 'none';
        document.getElementById('label_p'+(player+1)).textContent = document.getElementById('label_p'+(player+1)).textContent.concat(' (Wants ' + players[player].bids[roundNum-1] +')');
        document.getElementById('submit_bid_p' + (player+1)).style.display = 'none';
    }

};

function hideRoundPoints(){
    for(player in players) {
        document.getElementById('round_points_p'+players[player].id).style.display = 'none';
    }
}

//Deal cards & get ready to collect bids
function startRound(){
    roundNum++; //increment round

    hideStartUIElements();
    hideRoundPoints();
    
    upFirst = (upFirst == (players.length-1)) ? 0 : upFirst + 1; //increment active player
    upNext = upFirst; // set active player to be up next
    
     //Update header
    document.getElementById('header').textContent = 'Round ' + roundNum + ': ' + players[upFirst].name + ' is up first.';
    
    //Highlight player to show they're up next
    document.getElementById('label_p' + (upFirst+1)).classList.add('up_next');

    shuffleCards();

    deal(); //deal cards, save to player object, and display cards
    
    showBidBoxes(); //collect bids

};

function newRoundUI() {
    //get ready to deal a new round
    document.getElementById('btn_deal_round').style.display = 'block';
    document.getElementById('header').textContent = 'Round ' + (roundNum+1) + ': ' + players.length + ' Players';
};

function hidePlayedCards(){
    //hide all played cards
    var playedCards = document.getElementsByClassName('played_cards');
    for(el = 0; el < playedCards.length; el++) {
       playedCards[el].style.display = 'none';
    }
    document.getElementById('played_cards_header').style.display = 'none';
};

//global variables
var roundNum = 0;
var roundLeader = 0;
var upFirst = -1;
var upNext;
var currentRoundBids = 0;
var players = [];
const suits = ['Yellow','Green','Purple','Black'];
const maxPlayers = 6;
var deck = new Deck();
var readyToPlay = false;
var currentTricksPlayed = [];
var currentRoundTricks = [];
var rounds = [];
var handNum =0;
const winPoints = 20;
const zeroPoints = 10;
const wrongPoints = -10;

//Invoke immediately
(function init(){
    
    //hide all bids
    var bidBoxes = document.getElementsByClassName('bid');
    for(bid = 0; bid < bidBoxes.length; bid++) {
        bidBoxes[bid].style.display = 'none';
    }

    //hide points
    var pointsUI = document.getElementsByClassName('points');
    for(el = 0; el < pointsUI.length; el++) {
        pointsUI[el].style.display = 'none';
    }

    //hide all played cards
    hidePlayedCards();

    //Set names to make it faster
    document.getElementById('inputName_p1').value = 'Samir';
    document.getElementById('inputName_p2').value = 'Zain';
    document.getElementById('inputName_p3').value = 'Hiral';

    //hide deal button
    document.getElementById('btn_deal_round').style.display = 'none';
    //hide round button
    document.getElementById('btn_play_round').style.display = 'none';

})();


//Start game
document.getElementById('btn_start_game').addEventListener('click',function(){
    console.log('clicked go');

    //Add cards to the deck
    deck.createDeck(suits);
    //.addPirates(4)
    //.addEscapes(3)
    //.addLoots(2)
    //.addMermaids(2)
    //.addKraken(1)
    //.addLoots(2)
    //.addSkullKing()
    shuffleCards();
    
    //Get player names + create player list + update UI
    createPlayers();

    console.log('Ready to start game with ' + players.length + ' players.');
    console.log(players);

    //Hide start button & show deal button
    hideStartUIElements();

    //Update the UI for starting a new round
    newRoundUI();

});


//Start round
document.getElementById('btn_deal_round').addEventListener('click',startRound);

//Submit bids -- creating listeners
var submitBidButtons = document.getElementsByClassName('submit_bid_button');
    for(bb = 0; bb < submitBidButtons.length; bb++) {
        submitBidButtons[bb].addEventListener('click',saveBid);
    }

function saveBid() {
    console.log('Submitting Bid');

    //Add bid to the players Bid array
    var playerID = this.id.charAt(this.id.length - 1);
    var bid = parseInt(document.getElementById('bid_p'+playerID).value);
    players[playerID - 1].bids.push(bid);

    //Update button
    this.classList.add('submitted_bid');
    this.disabled = true;
    this.textContent = 'Submitted';

    console.log('Player ' + playerID + ' submitted ' + bid + '. All bids:');
    console.log(players[playerID - 1].bids);

    currentRoundBids++;

    if(currentRoundBids === players.length) {
        document.getElementById('btn_play_round').classList.remove('bids_needed');
        document.getElementById('btn_play_round').textContent = "Play round!";
        document.getElementById('btn_play_round').disabled = false;
        currentRoundBids = 0;
    } else {
        document.getElementById('btn_play_round').textContent = (players.length - currentRoundBids) + ' Bids Needed!';
    };


}

//Play Round
document.getElementById('btn_play_round').addEventListener('click',playRound);

function playRound() {
    //Enable the readay to play variable
    readyToPlay = true;
    console.log('Bids submitted, ready to play round!');

    //Hide play round button
    document.getElementById('btn_play_round').style.display = 'none';

    //make a new round if this is the first hand of the round
    if (handNum === 0) {
        //Hide bid boxes
        hideBids();

        //Create round object
        var newRound = new Round(roundNum);

        //add empty hands to round object
        for(var i = 1; i <= roundNum; i++) {
            var newHand = new Hand(i);
            newRound.hands.push(newHand);
        }

        //push to global rounds array
        rounds.push(newRound);
        
    } else {
        hidePlayedCards();
        document.getElementById('label_p'+(upNext+1)).classList.add('up_next');
        document.getElementById('header').textContent = 'Round ' + roundNum + ', Hand ' + (handNum+1) +': ' + players[upNext].name + ' is up next.';
    }

    //Update header
    document.getElementById('header2').style.display = 'block';
    document.getElementById('header2').textContent = 'Hand ' + (handNum + 1) + ' of ' + roundNum;

    //Moving on to listeners for cardPlayed
}

function cardPlayed(id) {

    //get player that clicked
    var player = players[id.charAt(1) - 1];

    //only want to care about clicks from who's turn it is and the round is ready to play
    if (!readyToPlay) {
        console.log('Not ready to play round');
        return;
    } else if(player !== players[upNext]) {
        console.log('Not ' + player.name + '\'s turn.');
        console.log(id);
        return;
    };

    //AFTER we know it's the right player, now we want to get the card that was played and update the UI
    var cardClicked = player.hand[roundNum-1][id.charAt(id.length-1) -1];
    if (cardClicked.played == true) {
        console.log('Card already played');
        return;
    } else {
        cardClicked.played = true;
    };


    console.log(cardClicked);
    var currentHand = rounds[roundNum-1].hands[handNum].cards;

    //add the card to the current hand
    currentHand.push(cardClicked);

    //Remove card from the players UI
    document.getElementById(id).classList.add('cards_played'); // fade out the card in the UI

    //display the card played in the cards played panel
    document.getElementById('played_cards_header').style.display = 'block';
    document.getElementById('played_card_' + currentHand.length).style.display = 'inline-block';
    document.getElementById('played_card_' + currentHand.length).src = cardClicked.image;

    //if all cards have been played
    if(currentHand.length === players.length) {
        document.getElementById('header').textContent = 'Round ' + roundNum + ': ' + players[upNext].name + ' ended the hand.';
        document.getElementById('label_p'+(upNext+1)).classList.remove('up_next');
        
        //find out winner
        var winningCard = getWinner(currentHand);
        var handWinner = players[winningCard.playedBy];

        //record wins
        handWinner.wins[roundNum-1] = handWinner.wins[roundNum-1] + 1;

        //set the winner to be up next
        upNext = handWinner.id-1;

        //Update UI
        updateWins(handWinner, winningCard);

        //check if this was the last hand of the round
        if((handNum + 1) === roundNum) {
            document.getElementById('btn_deal_round').style.display = 'block';
            document.getElementById('btn_deal_round').textContent = 'Deal Round ' + (roundNum+1);
            handNum = 0;
            readyToPlay = false;
            calculateScores();
            updatePointsUI();
            return;
        } else {
            handNum++;
            document.getElementById('btn_play_round').style.display = 'block';
            document.getElementById('btn_play_round').textContent = 'Play hand ' + (handNum +1) + ' of ' + roundNum;
        };
        
        

    } else {
        //Increment next player
        var lastPlayer = upNext;
        upNext = upNext === players.length-1 ? 0 : upNext + 1;

        if(currentHand.length === (players.length - 1) ) {
            document.getElementById('header').textContent = 'Round ' + roundNum + ': ' + players[upNext].name + ' is last.';
        } else {
            document.getElementById('header').textContent = 'Round ' + roundNum + ': ' + players[upNext].name + ' is up next.';
        }
        
        //add to up next
        document.getElementById('label_p'+(upNext+1)).classList.add('up_next');
        //remove old up next
        document.getElementById('label_p'+(lastPlayer+1)).classList.remove('up_next');
    }
        
}

function getWinner(cardsPlayed) {

    //eventually... look through cards in the array and determine a winner
    var winningCard = cardsPlayed[0];
    
    //only number cards
    for(var card = 1; card < cardsPlayed.length; card++) {
        console.log('Winning card: ' + winningCard.display);
        console.log('Challenging card: ' + cardsPlayed[card].display);
        //same suite higher number
        if(cardsPlayed[card].suit == winningCard.suit && cardsPlayed[card].number > winningCard.number) {
            winningCard = cardsPlayed[card];
        }

        if(cardsPlayed[card].suit == 'Black') {
            //black beats other suit colors
            if (winningCard.suit != 'Black') {
                console.log(cardsPlayed[card].display + ' beats ' + winningCard.display);
                winningCard = cardsPlayed[card];
            }
            //if both cards are black, then the highest number wins
            else if (winningCard.number < cardsPlayed[card].number) {
                winningCard = cardsPlayed[card];
            }
            else {
                console.log(cardsPlayed[card].display + ' does not beat ' + winningCard.display);
            }
        } else {
            console.log(cardsPlayed[card].display + ' does not beat ' + winningCard.display);
        }
    }
    console.log('Final winning card is: ' + winningCard.display);

    return winningCard;
}

function updateWins(winner, card) {
    console.log('update wins called');

    document.getElementById('hand_winner').style.display = 'inline-block';
    document.getElementById('hand_winner').textContent = winner.name + ' wins with a ' + card.display;


    for(player = 0; player < players.length; player++) {
        document.getElementById('label_p'+(player+1)).textContent = 
            players[player].name + ': (Wants ' +
            + players[player].bids[roundNum-1] + ', Won ' +
            players[player].wins[roundNum-1] + ')'
    }
}

function calculateScores() {
    for(player = 0; player < players.length; player++) {

        //If they guessed 0
        if(players[player].bids[roundNum-1] === 0) {
            if(players[player].wins[roundNum-1] === 0) {
                players[player].roundScores[roundNum-1] = roundNum * zeroPoints; //round times 10
            } else {
                players[player].roundScores[roundNum-1] = roundNum * zeroPoints * -1; //negative points
            }
        }
        // Any other guess
        else if(players[player].bids[roundNum-1] === players[player].wins[roundNum-1]) {
            players[player].roundScores[roundNum-1] = players[player].wins[roundNum-1] * winPoints;
        } else {
            players[player].roundScores[roundNum-1] = Math.abs((players[player].bids[roundNum-1] - players[player].wins[roundNum-1])) * wrongPoints;
        }

        //Update player total score
        players[player].totalScore = players[player].roundScores.reduce((a,b) => a + b,0);

    }
};

function updatePointsUI() {
    for(player = 1; player <= players.length; player++) {
        document.getElementById('round_points_p' + player).style.display = 'inline-block';
        document.getElementById('round_points_p' + player).textContent = 'Round pts: ' + players[player-1].roundScores[roundNum-1];

        document.getElementById('total_points_p' + player).style.display = 'inline-block';
        document.getElementById('total_points_p' + player).textContent = ' | Total pts: ' + players[player-1].totalScore;

    }
};