# HTML-5-Tank-Game
A high performance web application using principles from UDACITY's cs255. It is a simple 2d single-player shooter, where the goal is to eliminate the Spider enemies.

NOTE: RUN ON FIREFOX. Google Chrome will not allow cross-origin requests! Also, zoom out and hit refresh. Please be patient since the app is in Beta phase.

Done:
Randomly generate the map objects for each round.
The boxes are stubs for real objects. Map generation is done using Find-Union with path compression. We add edges as long as they do not form a cycle. 

To do: 
Optimize collision detection using research from: http://www.gamasutra.com/view/feature/131598/advanced_collision_detection_.php?page=2 or using a data structure (eg. splay tree, skip list, etc...).
Include bullets in collision detection.
Create the enemy using Javascript multi-threading (Web Worker), and A* path-finding or Dijkstra's weighted algorithm. This requires the map class mark nodes around the map. We will assume a sparse graph, and thus an adjaceny list.
Create a menu. 
Code Review.
Launch the game after optimizing with Google's closure compiler service.
