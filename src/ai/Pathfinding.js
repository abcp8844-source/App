class Pathfinding {
  // A* pathfinding algorithm implementation
  findPath(grid, start, end) {
    const openSet = [];
    const closedSet = new Set();
    const startNode = { x: start.x, y: start.y, g: 0, h: 0, f: 0, parent: null };
    openSet.push(startNode);

    while (openSet.length > 0) {
      // Find the node with the lowest F score in the open set
      let lowestFIndex = 0;
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < openSet[lowestFIndex].f) {
          lowestFIndex = i;
        }
      }
      const currentNode = openSet.splice(lowestFIndex, 1)[0];

      // Path found
      if (currentNode.x === end.x && currentNode.y === end.y) {
        const path = [];
        let temp = currentNode;
        while (temp !== null) {
          path.push({ x: temp.x, y: temp.y });
          temp = temp.parent;
        }
        return path.reverse();
      }

      closedSet.add(`${currentNode.x},${currentNode.y}`);

      // Get neighbors
      const neighbors = this.getNeighbors(grid, currentNode);

      for (const neighbor of neighbors) {
        if (closedSet.has(`${neighbor.x},${neighbor.y}`)) continue;

        const gScore = currentNode.g + 1; // Assuming cost is 1
        let gScoreIsBest = false;

        const existingNode = openSet.find(n => n.x === neighbor.x && n.y === neighbor.y);
        if (!existingNode) {
          gScoreIsBest = true;
          neighbor.h = this.heuristic(neighbor, end);
          openSet.push(neighbor);
        } else if (gScore < existingNode.g) {
          gScoreIsBest = true;
        }

        if (gScoreIsBest) {
          neighbor.parent = currentNode;
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
        }
      }
    }

    return null; // No path found
  }

  heuristic(a, b) {
    // Manhattan distance
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  getNeighbors(grid, node) {
    const neighbors = [];
    const { x, y } = node;
    // Check in 4 directions
    if (grid[y - 1] && grid[y - 1][x] === 0) neighbors.push({ x, y: y - 1 });
    if (grid[y + 1] && grid[y + 1][x] === 0) neighbors.push({ x, y: y + 1 });
    if (grid[y][x - 1] === 0) neighbors.push({ x: x - 1, y });
    if (grid[y][x + 1] === 0) neighbors.push({ x: x + 1, y });
    return neighbors;
  }
}

const pathfindingInstance = new Pathfinding();
export default pathfindingInstance;
