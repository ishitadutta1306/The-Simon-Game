const headingH2=document.querySelector("h2");
const displayLevel=document.querySelector("#display-level");
const displayGameOver=document.querySelector("#display-game-over");
const displayScore=document.querySelector("#display-score");

const quarters=document.querySelectorAll(".quarters");
const red=document.querySelector("#red");    //top-left
const blue=document.querySelector("#blue");  //bottom-left
const green=document.querySelector("#green");    //top-right
const yellow=document.querySelector("#yellow");  //bottom-right

let isPlaying=false;
let isDisplayingSequence=false;   //flag to disable clicks during sequence display
let gameSequence=[];    //store sequence generated by simon
let userSequence=[];
let level=1;

//'click anywhere to start' game functionality
document.addEventListener("click",(e)=>{
    if (!e.target.classList.contains("quarters")){
        if(!isPlaying){
            startGame();
        }
        console.log("user clicked on the page");
        headingH2.style.display="none";     //hide the start msg as soon as the user clicks on the document
    }
});

const startGame=()=>{
    isPlaying=true;
    showSequence();
    displayLevel.innerText=`Level: ${level}`;
    displayLevel.style.display="block";
    displayGameOver.style.display="none";
    displayScore.style.display="none";
};

let clickSound=new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");

//show game sequence to user
const showSequence=(()=>{
    isDisplayingSequence=true;
    quarters.forEach((quarter)=>{
        quarter.style.cursor="default";
    });

    //generate sequence
    gameSequence.push(getRandomQuarter());
    console.log(gameSequence);

    //show sequence on screen
    let index=0;
    const interval=setInterval(()=>{   //displays game sequence to the user one step at a time
        if (index>=gameSequence.length){
            clearInterval(interval);    //stop display
            isDisplayingSequence=false;

            quarters.forEach((quarter)=>{
                quarter.style.cursor="pointer";
            });
            return;
        }
        const quarter=gameSequence[index];  //current quarter
        clickSound.play();
        changeBgColor(quarter);
        index++;
    },1000);   //play each quarter's sound and change bg col with 1s interval
});

const getRandomQuarter=()=>{
    const gameSequence=[red,blue,green,yellow];
    return gameSequence[Math.floor(Math.random()*4)];
};

quarters.forEach((quarter)=>{
    quarter.addEventListener("click",()=>{
        if (!isPlaying || isDisplayingSequence) return;  //ignore clicks if game isn't active/sequence is being displayed
        const clicked=quarter.getAttribute("id");
        console.log(clicked," was clicked");

        //add clicking sound
        clickSound.play(clicked);

        //change background color of the quarter on click
        changeBgColor(quarter);
        userSequence.push(quarter);

        //check if the user is correctly clicking quarters in order
        if (!checkUserSequence()){
            gameOver();
        }
    });
});

//chnage background col of quarter
const changeBgColor=(quarter)=>{
    const orgCol=window.getComputedStyle(quarter).backgroundColor;
    let newCol;
    switch (orgCol) {
        case "rgb(123, 24, 44)":    //#7b182c
            newCol = "rgb(255, 77, 77)";    //#ff4d4d
            break;
        case "rgb(26, 83, 25)":     //#1A5319
            newCol = "rgb(51, 204, 51)";    //#33cc33
            break;
        case "rgb(181, 158, 28)":   //#b59e1c
            newCol = "rgb(255, 255, 102)";  //#ffff66
            break;
        case "rgb(12, 79, 135)":    //#0c4f87
            newCol = "rgb(51, 153, 255)";   //#3399ff
            break;
        default:
            newCol = orgCol;
            break;
    }
    quarter.style.backgroundColor=newCol;
    setTimeout(()=>{
        quarter.style.backgroundColor=orgCol; // Revert to original color after 0.5s
    },500);
};

const checkUserSequence=()=>{
    for (let i=0;i<userSequence.length;i++){
        if (userSequence[i]!==gameSequence[i]){
            console.log("Incorrect sequence!");
            displayScore.innerText=`Score: ${level-1}`;
            return false;
        }
    }
    if (userSequence.length===gameSequence.length){
        console.log("Correct sequence!");
        level++;
        displayLevel.innerText=`Level: ${level}`;
        displayScore.innerText=`Score: ${level-1}`;
        userSequence=[];
        setTimeout(()=>{
            showSequence();
        },1000);   //1s delay before showing the next sequence
    }
    return true;    //correct seq so far
};

let gameOverSound=new Audio("audio/gameOver.mp3");

const gameOver=()=>{
    gameOverSound.play();

    displayLevel.style.display="none";
    displayGameOver.style.display="block";
    displayScore.style.display="block";
    displayScore.innerText=`Score: ${level-1}`;

    //reset game
    gameSequence=[];
    userSequence=[];
    isPlaying=false;
    level=1;
};
