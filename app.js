// Function to delete element from the array
function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}

// An educated guess of how far it is between two points
function heuristic(a, b) {
    var d = dist(a.i, a.j, b.i, b.j);
    return d;
}

// How many columns and rows?
var cols = 62;
var rows = 50;

// This will be the 2D array
var grid = new Array(cols);

// Open and closed set
var openSet = [];
var closedSet = [];


// Start and end
var start;
var end;


// Width and height of each cell of grid
var w, h;

// The road taken
var path = [];
var nopath = false;


//is and js index
var index1 = 0; 
var index2 = 0;
var index3 = 0;
var index4 = 0;

var i1 = undefined;
var j1 = undefined;
var i2 = undefined;
var j2 = undefined;

var counter = 0;


function setup() {
    var canvas = createCanvas(620,500);
    canvas.parent('canvas');

    // Grid cell size
    w = width / cols;
    h = height / rows;

    // Making a 2D array
    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }

    // All the neighbors
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }


    //Am I a wall?
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if (i == is[index1] && j == js[index2]) {
                grid[i][j].wall = true;
                index1++;
                index2++;
            }
            if(i == nis[index3] && j == njs[index4]){
                grid[i][j].wall = false;
                index3++;
                index4++;
            }
        }
    }
}

function mousePressed() {
    //checking the spot clicked
    if (counter < 2) {
        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {               
                if (grid[i][j].contains(mouseX, mouseY)) {
                    if(!grid[i][j].wall){
                        if (counter == 0) {
                            //setting start
                            i1 = i;
                            j1 = j;
                            start = grid[i][j];
                            openSet.push(start);
                            i1++;
                            document.querySelector("p").innerHTML = "select the ending point in the white area of the box";
                        }
                        else if (counter == 1) {
                            //setting end
                            i2 = i;
                            j2 = j;
                            end = grid[i][j];
                            i2++;
                            document.querySelector("p").innerHTML = "length of the shortest path will be displayed here";
                        }
                        counter++;
                    }
                    else{
                        alert("plese select the spot in the white area");
                    }
                }
            }
        }
    }
}

function draw() {
    //drawing the walls, start point and end point
    background(255);
    fill(color(0, 0, 255));
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if(i1 == i && j1 == j){
                grid[i][j].show(color(0, 0, 255));
            }
            else if (i2 == i && j2 == j){
                grid[i][j].show(color(0, 0, 255));
            }
            else{
                grid[i][j].show(color(255));
            }
        }
    }

    if(counter == 2){
        // Am I still searching?
        if (openSet.length > 0) {

            // Best next option
            var winner = 0;
            for (var i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[winner].f) {
                    winner = i;
                }
            }
            var current = openSet[winner];

            // Did I finish?
            if (current === end) {
                noLoop();
                document.querySelector("p").innerHTML = "length of the shortest path = " + path.length;
                document.querySelector("p").style.borderColor = "green";
            }

            // Best option moves from openSet to closedSet
            removeFromArray(openSet, current);
            closedSet.push(current);

            // Check all the neighbors
            var neighbors = current.neighbors;
            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];

                // Valid next spot?
                if (!closedSet.includes(neighbor) && !neighbor.wall) {
                    var tempG = current.g + heuristic(neighbor, current);

                    // Is this a better path than before?
                    var newPath = false;
                    if (openSet.includes(neighbor)) {
                        if (tempG < neighbor.g) {
                            neighbor.g = tempG;
                            newPath = true;
                        }
                    } 
                    else {
                        neighbor.g = tempG;
                        newPath = true;
                        openSet.push(neighbor);
                    }

                    // Yes, it's a better path
                    if (newPath) {
                        neighbor.h = heuristic(neighbor, end);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = current;
                    }
                }

            }
            
        } 
        // no solution
        else {
            document.querySelector("p").innerHTML = "no solution possible";
            document.querySelector("p").style.borderColor = "red";
            noLoop();
            nopath = true;
        }

        // Draw current state of everything
        fill(color(0,0,255));

        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                if ((i == start.i && j == start.j) || (i == end.i && j == end.j)){
                    grid[i][j].show(color(0, 0, 255));
                }
                else{
                    grid[i][j].show(color(255));
                }

            }
        }

        // Find the path by working backwards
        path = [];
        var temp = current;
        path.push(temp);
        if(!nopath){
            while (temp.previous) {
                path.push(temp.previous);
                temp = temp.previous;
            }
        }

        // Drawing path as continuous line
        noFill();
        stroke(255, 0, 200);
        strokeWeight(w / 2);
        if(!nopath){
            beginShape();
            for (var i = 0; i < path.length; i++) {
                vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
            }
            endShape();
            
        }
    }    
}