const FRAME_RATE_SEARCH = 15;
const FRAME_RATE_TRACE = 60;

let canvasSize;
let cellSize;

let grid = [];
let gridRow = 30;
let gridCol = 30;

let lightningCell = [];
let lightningIndex = 0;

let run = false;
let solved = false;
let maxDepth = 0;

function setupButton() {
    select("#doStep").mousePressed(doStep);
    select("#doRun").mousePressed(toggleRun);
    select("#doRestart").mousePressed(resetProgress);
    select("#doShuffle").mousePressed(regenerateGrid);
    select("#openGithub").mousePressed(openGithub);
}

function setup() {
    frameRate(FRAME_RATE_SEARCH);

    canvasSize = min(windowHeight, windowWidth) - 100;
    createCanvas(canvasSize, canvasSize).parent('view');
    cellSize = Math.floor(canvasSize / gridRow);

    setupButton();
    regenerateGrid();
}

function draw() {
    if (!solved && run) {
        doStep();
    } else if (solved && run) {
        drawLightning();
    }
}

function toggleRun(isRunning) {
    run = isRunning ? isRunning : !run;
    if (run) {
        select("#doRun").html('Stop 🤚').addClass('active');
    } else {
        select("#doRun").html('Run 🏃‍♂️').removeAttribute('class');
    }
}

function doStep() {
    if (solved) return;
    if(!solved && lightningCell.length === 0) {
        resetProgress();
    }

    const nextSet = [];
    for (let cell of lightningCell) {
        cell.draw();
        nextSet.push(...cell.findNeighbors());
    }

    lightningCell = nextSet;
    for (let cell of lightningCell) {
        maxDepth = max(maxDepth, cell.x);
        cell.draw(true);
        if (cell.x === gridRow - 1) {
            traceLightningPath(cell);
            break;
        }
    }
}

function traceLightningPath(cell) {
    for (let cell of lightningCell) {
        cell.draw();
    }

    let lastCell = cell;
    lightningCell = [];

    while (lastCell != null && lastCell.x > 0) {
        lightningCell.push(lastCell);
        lastCell = lastCell.parent;
    }

    lightningCell.push(lastCell);
    lightningCell.reverse();

    run = true;
    solved = true;
    frameRate(FRAME_RATE_TRACE);
}

function drawLightning() {
    if (lightningIndex < lightningCell.length) {
        lightningCell[lightningIndex++].draw(true);
    } else {
        toggleRun(false);
    }
}

function regenerateGrid() {
    for (let y = 0; y < gridRow; y++) {
        let columns = [];
        for (let x = 0; x < gridCol; x++) {
            columns.push(new Cell(y, x));
            columns[x].draw();
        }
        grid[y] = columns;
    }
    resetProgress();
}

function resetProgress() {
    maxDepth = 0;
    solved = false;
    lightningIndex = 0;

    for (let y = 0; y < gridRow; y++) {
        for (let x = 0; x < gridCol; x++) {
            grid[y][x].isVisited = false;
            grid[y][x].parent = null;
            grid[y][x].draw();
        }
    }

    let startGrid = grid[Math.floor(Math.random() * gridCol)][0];
    while (startGrid.isObstacle) {
        startGrid = grid[Math.floor(Math.random() * gridCol)][0];
    }
    startGrid.isVisited = true;
    startGrid.draw(true);
    lightningCell = [startGrid];

    frameRate(FRAME_RATE_SEARCH);
}

function openGithub() {
    window.open('https://www.github.com/akbarhps', '_blank');
}