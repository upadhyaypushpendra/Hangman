
class Model{
    constructor(wordList) {
        this.wordsList=wordList;
        this.images=[
            './images/initial.png',
            './images/1.png',
            './images/2.png',
            './images/3.png',
            './images/4.png',
            './images/5.png',
            './images/6.png',
            './images/7.png'
        ];
        this.score=0;
        this.bestScore=0;
        this.currentWord="";
        this.answer=Array(this.currentWord.length).fill("");
        this.wrongAns=0;
        this.correctAns=0;
        this.maxWrongAns=this.images.length-2;
        this.init();
    };
    init=()=>{
        let best=localStorage.getItem('bestScore');
        if(best) this.bestScore=Number(best);
        else this.bestScore=0;
    };
    startGame = ( isStart )=>{
        this.createKeyboardListener();
        this.keyboardLisetnerAdder();
        if(isStart)
        {
            this.wrongAns=0;
            this.score=0;
            this.canvasImageUpdateHandler(this.images[0]);
        }
        this.scoreUpdateHandler(this.score);
        this.bestScoreUpdateHandler(this.bestScore);
        let w=this.wordsList[Math.round(Math.random()*this.wordsList.length)];
        this.currentWord=w.word;
        let spaces= this.currentWord.split(' ').length-1;
        if(spaces>=0) this.correctAns=spaces;
        else this.correctAns=0;
        this.answer=Array(this.currentWord.length);
        this.inputContainerUpdateHandler(this.answer,this.currentWord);
        this.hintUpdateHandler(w.hint);
    };
    gameOver = () => {
            this.checkBestScore();
            this.showResultHandler(`<h1>Game Over</h1><h2>Score : ${this.score}</h2>`);
            this.startGame(true);
    }
    checkBestScore = () => {
        if(this.score > this.bestScore ) {
            localStorage.setItem('bestScore',this.bestScore);
            this.bestScore=this.score;
            this.bestScoreUpdateHandler(this.bestScore);
        }
    };
    updateScore = () => {
        this.scoreUpdateHandler(this.score);
    };
    onInput =(value)=>{
        let correct= 0;
        for(let i = 0;i<this.currentWord.length;i++){
            if(value === this.currentWord[i]) {
                this.answer[i] = value;
                correct++;
            }
            }

        if(correct>0) {
            this.score+=5*correct;
            this.checkBestScore();
            this.updateScore();
            this.inputContainerUpdateHandler(this.answer,this.currentWord);
            this.correctAns+=correct;
            if(this.correctAns === this.currentWord.length) {
                this.startGame(false);
            }
        } else {
            this.wrongAns++;
            if(this.wrongAns >= this.maxWrongAns) {
                this.gameOver();
            } else {
                this.canvasImageUpdateHandler(this.images[this.wrongAns]);
            }
        }
    };
    bindCreateKeyboardListener = (handler) =>{
        this.createKeyboardListener=handler;
    };
    bindHintUpdateHandler=(handler)=>{
        this.hintUpdateHandler=handler;
    };
    bindCanvasImageUpdateHandler = (handler) => {
        this.canvasImageUpdateHandler=handler;
    };
    bindBestScoreUpdateHandler = (handler) =>{
        this.bestScoreUpdateHandler=handler;
    };
    bindScoreUpdateHandler = (handler) =>{
        this.scoreUpdateHandler=handler;
    };
    bindInputContainerUpdateHandler = (handler) =>{
        this.inputContainerUpdateHandler=handler;
    };
    bindShowResultHandler = (handler) =>{
        this.showResultHandler = handler;
    };
    bindKeyboardListener = (handler) =>{
        this.keyboardLisetnerAdder=handler;
    };

}
class View {
    constructor() {
        this.score = document.getElementById("score");
        this.best = document.getElementById('best');
        this.canvasImage = document.getElementById('image');
        this.inputContainer = document.getElementById('inputContainer');
        this.startButton = document.getElementById('startButton');
        this.keyboard = document.getElementById('keyboard');
        this.hintContainer=document.getElementById('hintContainer');
        this.resultContainer = document.getElementById('resultContainer');
        this.result = document.getElementById('result');
        this.resultCloseButton = document.getElementById('closeButton');
        this.startGameHandler=null;


        this.init();
    };
    init = () =>{
        this.score.innerHTML="0";
        this.startButton.addEventListener('click',this.handleButtonClick);
        this.resultCloseButton.addEventListener('click',()=>{
            this.resultContainer.style.display='none';
        })
        this.createKeyboard();
    }
    addListenerToKeyboard = () =>{
        this.keyboard.childNodes.forEach((value,index)=>{
            value.onclick = () =>{
                this.disableKey(value.getAttribute('text'));
                this.onInputHandler(value.getAttribute('text'));
            };
        });
    };
    showResult = (result) =>{
      this.resultContainer.style.display='flex';
      this.result.innerHTML=result;
        setTimeout(()=>{
            this.resultContainer.style.display='none';
        },5000);
    };
    disableKey = (char) =>{
        let key = document.getElementById(`button${char}`);
        let strike = document.createElement('s');
        strike.innerHTML = char;
        key.innerHTML="";
        key.appendChild(strike);
        key.onclick = ()=>{};
        key.style.cursor = 'not-allowed';
    };
    createButtonDiv = (char) => {
        let buttonDiv = document.createElement('div');
        buttonDiv.className='button';
        buttonDiv.id='button'+char;
        buttonDiv.innerHTML=char;
        buttonDiv.innerText=char;
        ///console.log(`${buttonDiv.innerHTML} , ${buttonDiv.innerText}`);
        buttonDiv.setAttribute('text',char);
        return buttonDiv;
    };
    createKeyboard = () =>{
        this.keyboard.innerHTML="";
        for(let charCode = 65 ; charCode <= 90;charCode++)
        {
            this.keyboard.appendChild(this.createButtonDiv(String.fromCharCode(charCode)));
        }
    };
    handleButtonClick = () =>{
        this.startGameHandler(true);
    };
    bindStartGameHandler=(handler) => {
        this.startGameHandler=handler;
    };
    bindOnInputHandler=(handler) => {
        this.onInputHandler=handler;
    };
    updateScore = (score) =>{
        this.score.innerHTML=score;
    };
    updateBestScore = (bestScore)=>{
        this.best.innerHTML=bestScore;
    };
    updateCanvasImage=(src) => {
        this.canvasImage.src=src;
    };
    createInput = (char) =>{
        let span = document.createElement('span');
        span.innerText=char;
        if(char === String.fromCodePoint(32)) span.className='other';
        else span.className='char'
        return span;
    };
    updateHint = (hint) =>{
        this.hintContainer.innerHTML=`${hint}`;
    };
    updateInputContainer = (word,answer) =>{
        this.inputContainer.innerHTML="";
        for(let i=0;i<word.length;i++)
        {
            let char=word[i];
            //console.log(char);
            if(char!== undefined) {
                if(answer[i] === String.fromCodePoint(32)) this.inputContainer.appendChild(this.createInput(String.fromCodePoint(32)));
                else this.inputContainer.appendChild(this.createInput(char));
            }
            else {
                if(answer[i] === String.fromCodePoint(32)) this.inputContainer.appendChild(this.createInput(String.fromCodePoint(32)));
                else this.inputContainer.appendChild(this.createInput(""));
            }
        }
    };
}
class Controller {
    constructor(model,view) {
        this.model=model;
        this.view=view;
        this.bind();
        this.view.updateBestScore(this.model.bestScore);
    };
    bind = () => {
        this.model.bindBestScoreUpdateHandler(this.view.updateBestScore);
        this.model.bindScoreUpdateHandler(this.view.updateScore);
        this.model.bindInputContainerUpdateHandler(this.view.updateInputContainer);
        this.model.bindCanvasImageUpdateHandler(this.view.updateCanvasImage);
        this.model.bindCreateKeyboardListener(this.view.createKeyboard);
        this.model.bindKeyboardListener(this.view.addListenerToKeyboard);
        this.model.bindHintUpdateHandler(this.view.updateHint);
        this.model.bindShowResultHandler(this.view.showResult);
        this.view.bindStartGameHandler(this.model.startGame);
        this.view.bindOnInputHandler(this.model.onInput);

    };
}
let controller=null;
window.addEventListener('load',()=>{
    //{word:'',hint:''},

   const  words=[{word:'RAINBOW',hint:'Contains all colors'},
       {word:'SACHIN TENDULKAR',hint:'Made 100 centuries'},
       {word:'JUNGLE',hint:'Animals live here'},
       {word:'MANGO',hint:'King of fruits'},
       {word:'TIGER',hint:'National animal of india'},
       {word:'TEMPLATE' ,hint:'Something that establishes or serves as a pattern'},
       {word:'ETHICS',hint: 'deciding what is morally right and wrong in computing -- and in life'},
       {word:'PRIVACY' ,hint:'keeping yourself and your personal information data safe when off and online'},
       {word:'TEAMWORK',hint:'working together cooperatively, pulling together, turning a group into a team'},
       {word:'BINARY',hint:'numbers expressed in the base of two, using 0 and 1 only'},
       {word:'TERNARY',hint:'numbers expressed in the base of three, instead of 10, using 0, 1 and 2 only'},
       {word:'OCTAL', hint:'numbers expressed in the base of eight, instead of 10, using 0, 1, 2,3 4, 5, 6 and 7 only'}];
    controller=new Controller(new Model(words),new View());
});