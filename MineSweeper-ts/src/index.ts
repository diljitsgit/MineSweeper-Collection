let size: number = 10;
let chanceOfMine: number = 0.1;
let numberOfMines: number = 0;
let checkedAmount: number = 0;
let numberOfMinesPlaced: number = 0;
let grid: number[][] = [];
let digMode: boolean = true;
let gameOver: boolean = false;
let firstTouch: boolean = true;
let gameWon: boolean = false;
let checked: number[] = [];
const IMG: string = '<img src="Mine.svg" class="mine-logo">';

loadDefaults();
makeCanvas();
placeMines();
putNumbers();

$('.restart-btn').click(()=>{
    numberOfMines =0;
    numberOfMinesPlaced=0;
    grid = [];
    digMode = true;
    gameOver = false;
    gameWon = false;
    firstTouch = true;
    checked =[];
    loadDefaults();
    cleanCanvas();
    placeMines();
    putNumbers();
});

$('.mine-box').click((e) => {
    if (!gameOver) {
        if (firstTouch) {
            firstTouch = false;
            checkValid(e.target.getAttribute('id'));
            show(e.target.getAttribute('id'));
        }
        else {
            if (digMode) {
                show(e.target.getAttribute('id'));

            }
            else {
                mark(e.target.getAttribute('id'))
            }
        }
    }
});

$('.choose-mode-right').click(() => {
    if (!digMode) {
        digMode = true;
        $('.choose-mode-right').addClass('green-background');
        $('.choose-mode-left').removeClass('green-background');
    }
});

$('.choose-mode-left').click(() => {
    if (digMode) {
        digMode = false;
        $('.choose-mode-left').addClass('green-background');
        $('.choose-mode-right').removeClass('green-background');
    }
});


function loadDefaults(): void {
    $('.modal-back').hide();
    if (digMode) {
        $('.choose-mode-right').addClass('green-background');
    }
    else {
        $('.choose-mode-left').addClass('green-background');
    }
}

function makeCanvas(): void {
    var temp: number = 0;
    for (var i = 0; i < size; i++) {
        var c = $('<div class="box-row"></div>');
        for (var j = 0; j < size; j++) {
            temp++;
            if (temp % 2 == 0) {
                var a = $('<div class="green-box mine-box"></div>');
            }
            else {
                var a = $('<div class="dark-green-box mine-box"></div>');
            }
            c.append(a);
            a.attr('id', (i * size + j));
        }
        temp++;
        $('.grid').append(c);
    }
}

function cleanCanvas(){
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            $("#"+(i*size+j)).text("").removeClass('brown-box').removeClass('dark-brown-box');
        }
    }
}

function placeMines(): void {
    for (var i = 0; i < size; i++) {
        let tempArr: number[] = [];
        for (var j = 0; j < size; j++) {
            if (Math.random() < chanceOfMine) {
                tempArr.push(-1);
                numberOfMinesPlaced++;
                numberOfMines++;
            }
            else {
                tempArr.push(0);
            }
        }
        grid.push(tempArr);
    }
    $('.number-of-mines-text').text(numberOfMinesPlaced);
}

function putNumbers(): void {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (grid[i][j] != -1) {
                grid[i][j] = minesInRadius(i, j);
            }
        }
    }
}

function minesInRadius(i: number, j: number) {
    let count = 0;
    for (var k = -1; k < 2; k++) {
        if (i + k >= 0 && i + k < size) {
            for (var l = -1; l < 2; l++) {
                if (j + l >= 0 && j + l < size) {
                    if (grid[i + k][j + l] == -1) {
                        count++;
                    }
                }
            }
        }
    }
    return count;
}

function show(a: string | null): void {
    if (typeof a === "string") {
        if ($("#" + a).html() != "M") {
            checkedAmount++;

            let t: number = parseInt(a);
            let j: number = t % size;
            let i: number = Math.floor(t / size);

            $("#" + a).text(grid[i][j]);

            if (grid[i][j] == -1) {
                gameOverFunc();
            }
            else if (grid[i][j] == 0) {
                expand(i, j);
            }
            

            if (checkOpen() == (size*size)-numberOfMines-1) {
                gameWon = true;
                gameOverFunc();
            }


            if ($("#" + a).hasClass('green-box')) {
                $("#" + a).addClass('brown-box')
            }
            else {
                $("#" + a).addClass('dark-brown-box')
            }
        }
    }
}

function showUsingCoordinates(i: number, j: number): void {
    let a = i * size + j;
    if ($("#" + a).html() != "M") {
        $("#" + a).text(grid[i][j]);

        if (grid[i][j] == -1) {
            gameOverFunc();
        }



        if ($("#" + a).hasClass('green-box')) {
            $("#" + a).addClass('brown-box')
        }
        else {
            $("#" + a).addClass('dark-brown-box')
        }

    }
}

function mark(a: string | null): void {
    if (typeof a === "string") {
        if (!($("#" + a).hasClass('dark-brown-box') || $("#" + a).hasClass('brown-box'))) {
            if ($("#" + a).html() != "M" && numberOfMinesPlaced > 0) {
                $("#" + a).html("M");
                numberOfMinesPlaced--;
            }
            else if ($("#" + a).html() == "M") {
                $("#" + a).html("");
                numberOfMinesPlaced++;
            }
        }

        // on inserting a image/SVG you cant change the mine to a number withour logic??

        $('.number-of-mines-text').text(numberOfMinesPlaced);
    }
}

function expand(a: number, b: number): void {
    checked.push((a * size + b));
    for (var i = a - 1; i <= a + 1; i++) {
        for (var j = b - 1; j <= b + 1; j++) {
            if (i >= 0 && i < size) {
                if (j >= 0 && j < size) {
                    showUsingCoordinates(i, j);
                    if ((!checkin(checked, (i * size + j))) && grid[i][j] == 0) {
                        expand(i, j)
                    }
                }
            }
        }
    }
}

function checkin(a: number[], b: number): boolean {
    for (var i = 0; i < a.length; i++) {
        if (a[i] == b) {
            return true;
        }
    }
    return false;
}

function checkValid(a: string | null): void {
    if (typeof a === "string") {
        let t: number = parseInt(a);
        let i: number = Math.floor(t / size);
        let j: number = t % size;

        if (grid[i][j] == -1) {
            for (var k = 0; k < size; k++) {
                if (grid[0][k] != -1) {
                    grid[0][k] = -1;
                    grid[i][j] = 0;
                    break;
                }
            }
            putNumbers();
        }
    }
}

function gameOverFunc(): void {
    gameOver = true;
    if (gameWon) {
        $('.game-over-text').text('You Won!!!');
    }
    else{
        $('.game-over-text').text('You Lost:(');
    }
    $('.modal-back').show();
}

function checkOpen(): number {
    let temp:number = 0;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            let a:number = i*size+j;
            if($("#"+a).hasClass('brown-box') || $("#"+a).hasClass('dark-brown-box')){
                temp++;
            }
        }
    }
    return temp;
}