var serverUsage = false;
if (typeof exports !== "undefined")
{
	serverUsage = true;
	var worldConsts = require("../GameWorld");
    exports.getAstar = function()
	{
		return astar;
    }

    var GAME_WORLD_CELL_BLOCK = worldConsts.GAME_WORLD_CELL_BLOCK;
    
    var heapFactory = require("./BinaryHeap");
}


var astar = {
    init: function (grid, start, end) {

        //currentId is an important optimization on the client
        //a given browser has a single instance of astar, so instead of 
        //marking a node as closed, we give an init id and use this value
        //as close. This way we only init once. 
        //could we collide, yea, but for now this is okay
        this.currentId = Math.floor(Math.random() * 2147483647);
        if (astar.grid == undefined) {
            astar.grid = [];
            for (var x = 0; x < grid.length; x++) {
                if (serverUsage) {
                    astar.grid.push([]);
                }
                for (var y = 0; y < grid[x].length; y++) {
                    var intVal = 0;
                    if (serverUsage) { //if we're using this on the server, we don't have a object array, just ints. turn our ints into objs.                        
                        intVal = grid[x][y];
                        astar.grid[x][y] = {};
                        astar.grid[x][y].x = x;
                        astar.grid[x][y].y = y;
                        astar.grid[x][y].BlockType = intVal;
                    }

                    var node = grid[x][y];
                    node.f
                    node.f = 0;
                    node.g = 0;
                    node.h = 0;
                    node.visited = 0;
                    node.parent = null;
                }
            }
            
            if (!serverUsage) //if we're not on the server, set our grid to the passed grid.
            {
            	astar.grid = grid;
            }
        }

        start.f
        start.f = 0;
        start.g = 0;
        start.h = 0;
        start.visited = 0;
        start.closed = -1;
        start.parent = null;

        end.f
        end.f = 0;
        end.g = 0;
        end.h = 0;
        end.visited = 0;
        end.closed = -1;

    },
    equals: function (node1, node2) {
        return node1.x == node2.x && node1.y == node2.y;
    },
    nextPoint: function (startPoint, endPoint, distance) {
        //**called: var nextPoint = astar.nextPoint(myPos, seekPos, zom);                
        var fullDistance = Math.round(Math.sqrt((endPoint.x - startPoint.x) * (endPoint.x - startPoint.x) + (endPoint.y - startPoint.y) * (endPoint.y - startPoint.y)));

        //if we're there
        if (fullDistance <= 0 || isNaN(fullDistance)) {
            return undefined;
        }

        //if we're almost there
        if (fullDistance < distance) {
            distance = fullDistance
        }


        var midX = startPoint.x + distance / fullDistance * (endPoint.x - startPoint.x);
        var midY = startPoint.y + distance / fullDistance * (endPoint.y - startPoint.y);
        return { x: Math.round(midX), y: Math.round(midY) };
    },
    pathToPoints: function (paths, model, rate, startPoint) {

        if (rate <= 0) { rate = 1; }
        var points = [];
        if (startPoint == undefined) {
            throw "not having a start point causing skipping.";
        }
        points = points.concat(this.derivePoints(undefined, paths[0], model, rate, startPoint));
        for (var i = 0; i < paths.length; i++) {
            if (i + 1 >= paths.length) { //we're done
                return points;
            }
            else {
                points = points.concat(this.derivePoints(paths[i], paths[i + 1], model, rate));
            }
        }
        return points;
    },
    smoothPath: function (path, width, gameWorldModel) {

        if (path == undefined || path.length == 0) {
            throw "smoothPath requires a path";
        }

        if (astar.grid == undefined) {
            throw "smoothPath requires a grid - try astar.search or astar.init first";
        }

        if (gameWorldModel == undefined) {
            throw "smoothPath requires a world model";
        }

        var newPath = [];
        newPath.push(path[0]);

        var current = 0;

        for (var i = 0; i < path.length; i++) {
            var pos = this.getFurthestBline(i, path, path[i], gameWorldModel, width);
            if (pos != undefined) {
                newPath.push(path[pos]);

                if (pos == path.length - 1) {
                    return newPath;
                }
            }
        }

        return path; //no smoothing..?


    },
    getFurthestBline: function (current, path, startCell, gameWorldModel, width) {
        //check this cell for a bline to the furthest path
        for (var i = path.length - 1; i > current; i--) {
            if (this.blineAvail(startCell, path[i], gameWorldModel, width)) {
                return i;
            }
        }

        return undefined;
    },
    derivePoints: function (startCell, endCell, model, rate, spritePoint) {
        //todo: add sprite to this equation
        var startPoint;
        if (spritePoint == undefined) {
            startPoint = model.getAbsoluteCenterOfWorldCell(startCell.x, startCell.y);
        }
        else {
            startPoint = spritePoint;
        }
        var endPoint = model.getAbsoluteCenterOfWorldCell(endCell.x, endCell.y);
        var points = [];
        points.push(startPoint);
        while (startPoint != undefined) {
            startPoint = this.nextPoint(startPoint, endPoint, rate);
            if (startPoint != undefined) {
                points.push(startPoint);
            }
            /*   startPoint = this.nextPoint(startPoint, endPoint, rate);
            if (startPoint != undefined) { //if not undefined
            if (startPoint.x != points[points.length - 1].x && startPoint.y != points[points.length - 1].y) { //if not the same as the last point
            points.push(startPoint);
            }
            else {
            startPoint = undefined;
            }
            }*/
        }
        return points;

    },
    blineAvail: function (start, end, gameWorldModel, width) {
        //draw a line from start to end
        //move down the line, note the cells that are in there
        //if no blocks, return all the cells.
        var path = [];
        startPoint = gameWorldModel.getWorldCellCenter(start.x, start.y);
        startPointLeft = { "x": startPoint.x - width / 2, "y": startPoint.y };
        startPointRight = { "x": startPoint.x + width / 2, "y": startPoint.y };

        endPoint = gameWorldModel.getWorldCellCenter(end.x, end.y);
        endPointLeft = { "x": endPoint.x - width / 2, "y": endPoint.y };
        endPointRight = { "x": endPoint.x + width / 2, "y": endPoint.y };

        //calculate the slope
        //var m = endPoint.y - startPoint.y/endPoint.x - startPoint.x;

        //break the line in speed segments -  
        //we make a wild assumption that all speed is the same :(
        var speed = gameWorldModel.cellWidth / 2;

        //find the length of the line        
        var distance = Math.sqrt((endPoint.x - startPoint.x) * (endPoint.x - startPoint.x) + (endPoint.y - startPoint.y) * (endPoint.y - startPoint.y));

        var points = distance / speed;

        //given the number of points we chunk our line and using the
        //midpoint function and find cells. We can check if the cells are blockers.
        for (var i = 1; i <= points; i++) {

            if (!this.checkBlock(startPoint, endPoint, speed, i, gameWorldModel, distance)) {
                return false;
            }

            if (!this.checkBlock(startPointLeft, endPointLeft, speed, i, gameWorldModel, distance)) {
                return false;
            }

            if (!this.checkBlock(startPointRight, endPointRight, speed, i, gameWorldModel, distance)) {
                return false;
            }
        }

        return true;
    },
    checkBlock: function (startPoint, endPoint, speed, point, gameWorldModel, distance) {
        var midX = startPoint.x + (speed * point) / distance * (endPoint.x - startPoint.x);
        var midY = startPoint.y + (speed * point) / distance * (endPoint.y - startPoint.y);

        var cell = gameWorldModel.getWorldCellFromScreenCoord(midX, midY);
        if (astar.grid[cell.x] == undefined || astar.grid[cell.x][cell.y] == undefined) {
            return false;
        }
        else if (astar.grid[cell.x][cell.y].BlockType == GAME_WORLD_CELL_BLOCK) {
            return false;
        }

        return true;

    },
    search: function (grid, start, end, gameWorldModel, sprite) {

        astar.init(grid, start, end);

        heuristic = astar.manhattan;

        var openList = [];
        openList.push(start);


        var openHeap;
        if (serverUsage) {
            openHeap = heapFactory.getHeap(function (node) { return node.f; });
        }
        else {
            openHeap = new BinaryHeap(function (node) { return node.f; });
        }

        openHeap.push(start);

        while (openHeap.size() > 0) {

            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            var currentNode = openHeap.pop();

            // End case -- result has been found, return the traced path
            if (this.equals(currentNode, end)) {
                var curr = currentNode;
                var ret = [];
                while (curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                ret[ret.length] = start; //always start with our current spot.
                return ret.reverse();
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors
            currentNode.closed = this.currentId;

            var neighbors = astar.neighbors(currentNode);
            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];

                if (neighbor.closed == this.currentId ||
                	neighbor.BlockType == GAME_WORLD_CELL_BLOCK
                	) {
                    // not a valid node to process, skip to next neighbor
                    continue;
                }

                // g score is the shortest distance from start to current node, we need to check if
                //   the path we have arrived at this neighbor is the shortest one we have seen yet
                // 1 is the distance from a node to it's neighbor.  This could be variable for weighted paths.
                var gScore = currentNode.g + 1;
                var gScoreIsBest = false;
                var beenVisited = neighbor.visited;

                if (beenVisited != this.currentId || gScore < neighbor.g) {

                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.				    
                    neighbor.visited = this.currentId;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor, end);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;

                    if (beenVisited != this.currentId) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    }
                    else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }

        // No result was found -- empty array signifies failure to find path
        return [];
    },
    manhattan: function (pos0, pos1) {
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
    },
    neighbors: function (node) { //manhattan is modded to do corners
        var ret = [];
        var x = node.x;
        var y = node.y;


        if (astar.grid[x - 1] != undefined && astar.grid[x - 1][y] != undefined) {
            ret.push(astar.grid[x - 1][y]);
        }

        if (astar.grid[x + 1] != undefined && astar.grid[x + 1][y] != undefined) {
            ret.push(astar.grid[x + 1][y]);
        }

        if (astar.grid[x] != undefined && astar.grid[x][y - 1] != undefined) {
            ret.push(astar.grid[x][y - 1]);
        }

        if (astar.grid[x] != undefined && astar.grid[x][y + 1] != undefined) {
            ret.push(astar.grid[x][y + 1]);
        }

        return ret;
    }
};
