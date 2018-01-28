// An object to describe a spot in the grid
function Spot(i, j) {

    // Location
    this.i = i;
    this.j = j;

    // f, g, and h values for A*
    this.f = 0;
    this.g = 0;
    this.h = 0;

    // Am I a wall?
    this.wall = false;

    // Neighbors
    this.neighbors = [];

    // Where did I come from?
    this.previous = undefined;

    // Display me
    this.show = function (col) {
        noStroke();
        if (this.wall) {
            fill(50);
        } else if (col) {
            fill(col);
        }
        rect(this.i * 10, this.j * 10, 10, 10);
    }

    // checking the spot where it is clicked 
    this.contains = function(i, j){
        return (i > this.i * 10 && i < this.i * 10 + 10 && j > this.j * 10 && j < this.j * 10 + 10);
    }

    // Figure out who my neighbors the spot have
    this.addNeighbors = function (grid) {
        var i = this.i;
        var j = this.j;
        if (i < cols - 1) {
            this.neighbors.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbors.push(grid[i - 1][j]);
        }
        if (j < rows - 1) {
            this.neighbors.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.neighbors.push(grid[i][j - 1]);
        }
        if (i > 0 && j > 0) {
            this.neighbors.push(grid[i - 1][j - 1]);
        }
        if (i < cols - 1 && j > 0) {
            this.neighbors.push(grid[i + 1][j - 1]);
        }
        if (i > 0 && j < rows - 1) {
            this.neighbors.push(grid[i - 1][j + 1]);
        }
        if (i < cols - 1 && j < rows - 1) {
            this.neighbors.push(grid[i + 1][j + 1]);
        }
    }
}