"use strict";
let size = 10;
let chanceOfMine = 0.35;
let numberOfMines = 0;
let grid = [];
let digMode = true;
let gameOver = false;
let firstTouch = true;
let checked = [];
loadDefaults();
makeCanvas();
placeMines();
putNumbers();
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
                mark(e.target.getAttribute('id'));
            }
        }
    }
});
$('.navbar-end').click(() => {
    console.log(grid);
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
function loadDefaults() {
    if (digMode) {
        $('.choose-mode-right').addClass('green-background');
    }
    else {
        $('.choose-mode-left').addClass('green-background');
    }
}
function makeCanvas() {
    var temp = 0;
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
function placeMines() {
    for (var i = 0; i < size; i++) {
        let tempArr = [];
        for (var j = 0; j < size; j++) {
            if (Math.random() < chanceOfMine) {
                tempArr.push(-1);
                numberOfMines++;
            }
            else {
                tempArr.push(0);
            }
        }
        grid.push(tempArr);
    }
    $('.number-of-mines-text').text(numberOfMines);
}
function putNumbers() {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (grid[i][j] != -1) {
                grid[i][j] = minesInRadius(i, j);
            }
        }
    }
}
function minesInRadius(i, j) {
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
function show(a) {
    if (typeof a === "string") {
        if ($("#" + a).html() != "M") {
            let t = parseInt(a);
            let j = t % size;
            let i = Math.floor(t / size);
            $("#" + a).text(grid[i][j]);
            if (grid[i][j] == -1) {
                gameOverFunc();
            }
            else if (grid[i][j] == 0) {
                expand(i, j);
            }
            if ($("#" + a).hasClass('green-box')) {
                $("#" + a).addClass('brown-box');
            }
            else {
                $("#" + a).addClass('dark-brown-box');
            }
        }
    }
}
function showUsingCoordinates(i, j) {
    let a = i * size + j;
    if ($("#" + a).html() != "M") {
        $("#" + a).text(grid[i][j]);
        if (grid[i][j] == -1) {
            gameOverFunc();
        }
        if ($("#" + a).hasClass('green-box')) {
            $("#" + a).addClass('brown-box');
        }
        else {
            $("#" + a).addClass('dark-brown-box');
        }
    }
}
function mark(a) {
    if (typeof a === "string") {
        let i = '<img src="Mine.svg" class="mine-logo">';
        if (!($("#" + a).hasClass('dark-brown-box') || $("#" + a).hasClass('brown-box'))) {
            if ($("#" + a).html() != "M" && numberOfMines > 0) {
                $("#" + a).html("M");
                numberOfMines--;
            }
            else if ($("#" + a).html() == "M") {
                $("#" + a).html("");
                numberOfMines++;
            }
        }
        // on inserting a image/SVG you cant change the mine to a number withour logic??
        $('.number-of-mines-text').text(numberOfMines);
    }
}
function gameOverFunc() {
    gameOver = true;
}
function expand(a, b) {
    checked.push((a * size + b));
    for (var i = a - 1; i <= a + 1; i++) {
        for (var j = b - 1; j <= b + 1; j++) {
            if (i >= 0 && i < size) {
                if (j >= 0 && j < size) {
                    if ((!checkin(checked, (i * size + j))) && grid[i][j] == 0) {
                        console.log("Checking");
                        showUsingCoordinates(i, j);
                        expand(i, j);
                    }
                }
            }
        }
    }
}
function checkin(a, b) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] == b) {
            return true;
        }
    }
    return false;
}
function checkValid(a) {
    if (typeof a === "string") {
        let t = parseInt(a);
        let i = Math.floor(t / size);
        let j = t % size;
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
$(".logo").click(map);
function map() {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            let temp = "#" + (i * size + j);
            $(temp).text(grid[i][j]);
        }
    }
}
