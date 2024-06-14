# JavaScript-Pacman

Pacman created in JavaScript.

Challenges & Solutions:

1. Creating a working collision system.

    Iterates over each wall object to check for collisions. If so, velocity is reversed for one frame and then set to 0, to avoid the player getting stuck in objects.

    This solution can be defeated when a collision is detected while the player's velocity is directed away from the wall.
