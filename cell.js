/**
 * Akbar Hasadi Putra Siregar
 * 08/25/2021 06:49 AM
 * https://www.github.com/akbarhps
 */

function Cell(y, x, obstacleChance = 0.36) {
    this.y = y;
    this.x = x;
    this.isVisited = false;
    this.isObstacle = Math.random() < obstacleChance;
    this.parent = null;

    this.findNeighbors = () => {
        let neighbors = [];
        let current;
        if (y < gridRow - 1) {
            current = grid[y + 1][x];
            if (!current.isVisited && !current.isObstacle) {
                current.isVisited = true;
                current.parent = this;
                neighbors.push(current);
            }
        }
        if (y > 0) {
            current = grid[y - 1][x];
            if (!current.isVisited && !current.isObstacle) {
                current.isVisited = true;
                current.parent = this;
                neighbors.push(current);
            }
        }
        if (x < gridCol - 1) {
            current = grid[y][x + 1];
            if (!current.isVisited && !current.isObstacle) {
                current.isVisited = true;
                current.parent = this;
                neighbors.push(current);
            }
        }
        if (x > 0) {
            current = grid[y][x - 1];
            if (!current.isVisited && !current.isObstacle) {
                current.isVisited = true;
                current.parent = this;
                neighbors.push(current);
            }
        }
        return neighbors;
    }

    this.draw = (isLightning) => {
        strokeWeight(0);
        fill(0);
        if (this.isObstacle) {
            strokeWeight(1);
            stroke(255);
        }
        if (isLightning && !solved) {
            const depthPercentage = maxDepth === 0 ? 100 : (maxDepth / x) * 100;
            fill(200, 200, 0, (200 / depthPercentage * 100));
        } else if (isLightning) {
            fill(200, 200, 0);
        }
        rect(this.y * cellSize, this.x * cellSize, cellSize, cellSize);
    };
}