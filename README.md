# JavaScript-Pacman

Pacman created in JavaScript.

<b>Challenges & Solutions:</b>

1. Creating a working collision system.

    Iterates over each wall object to check for collisions. If so, velocity is reversed for one frame and then set to 0, to avoid the player getting stuck in objects.

    This solution can be defeated if a collision is detected after the player's velocity has become directed away from the wall.

    I improved the system by calculating which diagonal quadrant the player is in when a collision occurs and moving them 1px back in that direction. Now the current velocity can be ignored and the collision is much more reliable.

2. Enemy pathfinding

    Uses Djikstra's algorithm to find the shortest path to the player for each ghost.

    This requires the ghost to skip the first node in sequence when close to it, to avoid getting stuck there.
