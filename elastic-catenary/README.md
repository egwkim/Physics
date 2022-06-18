# elastic-catenary
Simulate elastic catenary with html5 canvas and javascript

[Github page](https://egwkim.github.io/physics/elastic-catenary)


* * *
## Control panel desciprtion

### distance between two points when no force is applied

Distance when the spring is not deformed



## gravity constant

This actually refers to the Gravitational acceleration

F = mg

where g is the gravity constant(or gravitational acceleration)

[Gravitational acceleration - Wikipedia](https://en.wikipedia.org/wiki/Gravitational_acceleration)

### toggleStretchOnly

Turn on to apply elastic force only when the spring is stretched, not compressed



### toggleMovement

Turn on to calculate the sum of velocities and the average velocity

This helps you identify if the points are still moving


### export coordinates to json 

gives you a 2d array which is saved as "coords.json"

[[x0, y0],[x1, y1],[x2, y2]...]

* * *

## Physical description

Hooke's law applies when calculating the elastic force

> Let x be the amount by which the free end of the spring was displaced from its "relaxed" position (when it is not being stretched). Hooke's law states that F = kx

[Hooke's law - Wikipedia](https://en.wikipedia.org/wiki/Hooke%27s_law#For_linear_springs)


