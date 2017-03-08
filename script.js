var CONWAYS_GAME_OF_LIFE = (function () {

    var gridOffset = 20;

    var numberColumns = 100;
    var numberRows = 100;

    var cellWidth = 7;
    var cellHeight = 7;

    var gridWidth = numberColumns * cellWidth;
    var gridHeight = numberRows * cellHeight;

    this.thisGeneration = [];
    this.nextGeneration = [];

    var Cell = function (alive, x, y) {
        var isAlive = alive;

        this.isAlive = function () {
            return isAlive === true;
        };

        this.setAlive = function (isLiving) {
            isAlive = isLiving;
        };
    };

    return {
        initialize: function () {

            // Initialize two grids (one for this generation and one for the next generation)
            for (var x = 0; x < numberColumns; x++) {

                var thisGenerationCellColumn = [];
                var nextGenerationCellColumn = [];

                for (var y = 0; y < numberRows; y++) {
                    var thisGenerationCell;
                    var nextGenerationCell;

                    if (Math.round(Math.random()) === 1) {
                        thisGenerationCell = new Cell(true, x, y);
                        nextGenerationCell = new Cell(true, x, y);
                    }
                    else {
                        thisGenerationCell = new Cell(false, x, y);
                        nextGenerationCell = new Cell(false, x, y);
                    }

                    thisGenerationCellColumn.push(thisGenerationCell);
                    nextGenerationCellColumn.push(nextGenerationCell);
                }
                thisGeneration.push(thisGenerationCellColumn);
                nextGeneration.push(nextGenerationCellColumn);
            }

            this.renderGrid();

            document.getElementById('canvas').addEventListener('mousemove', this.regenerate.bind(this), false);
        },

        regenerate: function () {
            /*
            var clickedXCoord = event.offsetX - gridOffset;
            var clickedYCoord = event.offsetY - gridOffset;

            var xIndex = Math.floor(clickedXCoord / cellWidth);
            var yIndex = Math.floor(clickedYCoord / cellHeight);
            */

            // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
            // Any live cell with two or three live neighbours lives on to the next generation.
            // Any live cell with more than three live neighbours dies, as if by overcrowding.
            // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

            for (var x = 0; x < numberColumns; x++) {
                for (var y = 0; y < numberRows; y++) {

                    var numberLivingNeighbors = this.getNumberAliveNeighbors(x, y);

                    if (thisGeneration[x][y].isAlive()) {
                        if (numberLivingNeighbors < 2) {
                            nextGeneration[x][y].setAlive(false);
                        }
                        else if (numberLivingNeighbors === 2 || numberLivingNeighbors === 3) {
                            nextGeneration[x][y].setAlive(true);
                        }
                        else if (numberLivingNeighbors > 3) {
                            nextGeneration[x][y].setAlive(false);
                        }
                    }
                    else {
                        if (numberLivingNeighbors === 3) {
                            nextGeneration[x][y].setAlive(true);
                        }
                    }
                }
            }

            for (var x = 0; x < numberColumns; x++) {
                for (var y = 0; y < numberRows; y++) {
                    thisGeneration[x][y].setAlive(nextGeneration[x][y].isAlive());
                }
            }

            this.renderGrid();
        },

        renderGrid: function () {
            var context = document.getElementById('canvas').getContext('2d');
            context.clearRect(gridOffset, gridOffset, gridWidth, gridHeight);

            for (var x = 0; x < numberColumns; x++) {
                var cellColumn = [];

                for (var y = 0; y < numberRows; y++) {
                    if (thisGeneration[x][y].isAlive()) {
                        context.fillStyle = 'green';
                        context.fillRect(gridOffset + (x * cellWidth), gridOffset + (y * cellHeight), cellWidth, cellHeight)
                    }
                }
            }
        },

        /**
         * Hopefully this is close to a table lookup (O(1))
         */
        getNumberAliveNeighbors: function (x, y) {
            switch(x) {
                // Top row
                case 0:
                    switch(y) {
                        case 0:
                            // Top left corner
                            return thisGeneration[0][1].isAlive() +
                                   thisGeneration[1][1].isAlive() +
                                   thisGeneration[1][0].isAlive();
                            break;
                        case numberColumns - 1:
                            // Top right corner
                            return thisGeneration[0][numberColumns - 2].isAlive() +
                                   thisGeneration[1][numberColumns - 2].isAlive() +
                                   thisGeneration[1][numberColumns - 1].isAlive();
                            break;
                        default:
                            // Top row, middle
                            return thisGeneration[0][y - 1].isAlive() +
                                   thisGeneration[1][y - 1].isAlive() +
                                   thisGeneration[1][y].isAlive() +
                                   thisGeneration[1][y + 1].isAlive() +
                                   thisGeneration[0][y + 1].isAlive();
                            break;
                    }
                    break;
                // Bottom row
                case numberRows - 1:
                    switch(y) {
                        case 0:
                            // Bottom left corner
                            return thisGeneration[numberRows - 2][0].isAlive() +
                                   thisGeneration[numberRows - 2][1].isAlive() +
                                   thisGeneration[numberRows - 1][1];
                            break;
                        case numberColumns - 1:
                            // Bottom right corner
                            return thisGeneration[numberRows - 1][numberColumns - 2].isAlive() +
                                   thisGeneration[numberRows - 2][numberColumns - 2].isAlive() +
                                   thisGeneration[numberRows - 2][numberColumns - 1].isAlive();
                            break;
                        default:
                            // Bottom row in the middle
                            return thisGeneration[numberRows - 1][y - 1].isAlive() +
                                   thisGeneration[numberRows - 2][y - 1].isAlive() +
                                   thisGeneration[numberRows - 2][y].isAlive() +
                                   thisGeneration[numberRows - 2][y + 1].isAlive() +
                                   thisGeneration[numberRows - 1][y + 1].isAlive();
                            break;
                    }
                    break;
                // Middle rows
                default:
                    switch(y) {
                        case 0:
                            return thisGeneration[x - 1][0].isAlive() +
                                   thisGeneration[x - 1][1].isAlive() +
                                   thisGeneration[x][1].isAlive() +
                                   thisGeneration[x + 1][1].isAlive() +
                                   thisGeneration[x + 1][0].isAlive();
                            break;
                        case numberColumns - 1:
                            return thisGeneration[x - 1][numberColumns - 1].isAlive() +
                                   thisGeneration[x - 1][numberColumns - 2].isAlive() +
                                   thisGeneration[x][numberColumns - 2].isAlive() +
                                   thisGeneration[x + 1][numberColumns - 2].isAlive() +
                                   thisGeneration[x + 1][numberColumns - 1].isAlive();
                            break;
                        default:
                            return thisGeneration[x - 1][y - 1].isAlive() +
                                   thisGeneration[x - 1][y].isAlive() +
                                   thisGeneration[x - 1][y + 1].isAlive() +
                                   thisGeneration[x][y - 1].isAlive() +
                                   thisGeneration[x][y + 1].isAlive() +
                                   thisGeneration[x + 1][y - 1].isAlive() +
                                   thisGeneration[x + 1][y].isAlive() +
                                   thisGeneration[x + 1][y + 1].isAlive();
                            break;
                    }
                    break;
            }
        }
    }
})();
