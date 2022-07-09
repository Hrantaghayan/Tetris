const container= document.getElementById('container')
const scoreel = document.getElementById('score')
const rowsCount = 10
const columnsCount =5 
const shapes = getShapes()
let usedSquares = []
let score = 0
const start = document.getElementById('btnstart')
const pause = document.getElementById('btnpause')
const left = document.getElementById('left')
const right= document.getElementById('right')
const buttom = document.getElementById('buttom')
right.addEventListener('click',MoveRight)
left.addEventListener('click',moveLeft)
buttom.addEventListener('click',moveDown)
draw()
const squares =Array.from(document.getElementsByClassName('square'))
let activeShape = getRandomShape()
setActiveElements(activeShape)
let interval;
start.addEventListener('click',setTetrisInterval)
pause.addEventListener('click',function (){
    clearInterval(interval)
})
// setTetrisInterval()
function draw(){
    for(let i = 0;i<rowsCount;i++){
        const row = document.createElement('div')
        row.classList.add('row')
        for(let j = 0;j<columnsCount;j++){
            const square = document.createElement('div')
            square.classList.add('square')
            square.innerHTML = i*columnsCount+j
            row.appendChild(square)
        }
        container.appendChild(row)
    }
}
function moveLeft(){
    const first = activeShape[0];
    if (first % columnsCount - 1 < 0)
        return;

    for (let i = 0; i < activeShape.length; i++)
        activeShape[i]--;

    setActiveElements(activeShape);
}
function MoveRight(){
    let max = 0;
    for (let i = 0; i < activeShape.length; i++) {
        if (max < activeShape[i] % columnsCount) {
            max = activeShape[i] % columnsCount;
        }
    }

    if (max >= columnsCount - 1)
        return;

    for (let i = 0; i < activeShape.length; i++)
        activeShape[i]++;

    setActiveElements(activeShape);
}
function moveDown(){

    const lastRowsIndex = rowsCount * columnsCount - 1 - columnsCount;
    const max = activeShape[activeShape.length - 1];
    if (lastRowsIndex - columnsCount + 1 <= max && max <= lastRowsIndex) {
        freeze(columnsCount);
        return;
    }

    for (let i = 0; i < activeShape.length; i++) {
        activeShape[i] = activeShape[i] + columnsCount;
    }

    for (let i = 0; i < activeShape.length; i++) {
        const temp = activeShape[i] + columnsCount;
        if (usedSquares.includes(temp)) {
            freeze();
        }
    }

    setActiveElements(activeShape);
}
function freeze(n = 0) {
    for (let i = 0; i < activeShape.length; i++) {
        squares[activeShape[i] + n].classList.add('used');
        usedSquares.push(activeShape[i] + n);
    }
    checkLines()
    activeShape = getRandomShape();
    setActiveElements(activeShape);
    checkGameOver();
}
function checkGameOver() {
    for (let i = 0; i < activeShape.length; i++) {
        if (usedSquares.includes(activeShape[i])) {
            clearInterval(interval);
        //     let div1 = document.createElement('div')
        //     div1.classList.add('modal')
        //     div1.innerHTML = `<div class="modal-content">
        //     <span class="close">&times;</span>
        //     <p class = "paragraph">Game over</p>
        //   </div>`
        //   document.body.prepend(div1)
            alert('Game over');
                location.reload()  
            break
        }
    }
}
function getShapes(){
    return[
        [1,2,3],
        [1,2,7],
        [1,2,6],
        [2,7,12],
        [2,7,8],
        [2,6,7]
    ]
}
function checkLines() {
    usedSquares.sort((a, b) => a - b);
    let start;
    for (let i = 0; i < rowsCount; i++) {
        let contains = true;
        for (let j = 0; j < columnsCount; j++) {
            if (!usedSquares.includes(i * columnsCount + j)) {
                contains = false;
                break;
            }
        }

        if (contains) {
            start = i * columnsCount;
        }
    }

    if (start) {
        for (let i = 0; i < columnsCount; i++) {
            usedSquares.splice(usedSquares.indexOf(start + i), 1);
            squares[start + i].classList.remove('used');
        }

        squares.forEach(x => x.classList.remove('used'));
        for (let i = 0; i < usedSquares.length; i++) {
            if (usedSquares[i] < start) {
                usedSquares[i] += columnsCount;
            }
            squares[usedSquares[i]].classList.add('used');
        }

        score += columnsCount;
        scoreel.innerHTML = score;
    }
}
function setTetrisInterval() {
    clearInterval(interval)
    interval = setInterval(() => {
        moveDown();
    }, 1000)
}
function getRandomShape(){
    let random = Math.floor(Math.random()*shapes.length)
    return [...shapes[random]]
}
function setActiveElements(arr){
    squares.forEach(element => {
        element.classList.remove('active')
    });
    for(let i = 0;i<arr.length;i++){
        squares[arr[i]].classList.add('active')
    }
}
window.addEventListener('keyup',function(e){
    if(e.key === 'ArrowDown'){
        moveDown()
    }
   else if(e.key === 'ArrowRight'){
        MoveRight()
    }
    else if(e.key === 'ArrowLeft'){
        moveLeft()
    }
})