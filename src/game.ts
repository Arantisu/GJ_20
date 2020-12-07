import { Dialog, NPC } from '../node_modules/@dcl/npc-utils/index'
import utils from "../node_modules/decentraland-ecs-utils/index"
import { EnemyAction} from "./enemy"


const building = new Entity()
building.addComponent(new GLTFShape('Models/GJ_Building_01.glb'))
building.addComponent(new Transform(
    
    {
    
        position: new Vector3(24, 0, 24)

}))

 engine.addEntity(building)

let cookies = new NPC({
  position: new Vector3(44.2, 1.1, 3.1)},
  "Models/Cookies.glb",
  () => {
    log("activated");
    cookies.talk(NPCTalk)
  }
)


const enemy = new EnemyAction(
new GLTFShape('Models/Thief_01.glb'),

new Transform(
    
    {
    
        position: new Vector3(24, 0, 24),

}))


//runClip.play()
const MOVE_SPEED = 2
const ROT_SPEED = 2

// Intermediate variables
const player = Camera.instance
const transform = enemy.getComponent(Transform)

class EnemyMov implements ISystem {
  update(dt: number) {
    // Rotate to face the player
    let lookAtTarget = new Vector3(player.position.x, transform.position.y, player.position.z)
    let direction = lookAtTarget.subtract(transform.position)
    transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(direction), dt * ROT_SPEED)

    // Continue to move towards the player until it is within 2m away
    let distance = Vector3.DistanceSquared(transform.position, player.position) // Check distance squared as it's more optimized
    if (distance >= 4) { // Note: Distance is squared so a value of 4 is when the enemy is standing 2m away
      enemy.running()
      let forwardVector = Vector3.Forward().rotate(transform.rotation)
      let increment = forwardVector.scale(dt * MOVE_SPEED)
      transform.translate(increment)
    } else {
      enemy.idle()
    }
  }
}

engine.addSystem(new EnemyMov())

const door = new Entity()
door.addComponent(new GLTFShape('Models/Door.glb'))
door.addComponent(new Transform(
    
    {
    
        position: new Vector3(2.1, 0, 30.9)

}))

 engine.addEntity(door)

 
const gltfShape_16 = new GLTFShape('Models/Door.glb')
door.addComponentOrReplace(gltfShape_16)

// Scale and position the gate
const transform_31 = new Transform({
	position: new Vector3(2.1, 0, 30.9),
	rotation: Quaternion.Euler(0, 0, 0),
	scale: new Vector3(1, 1, 1)
})
door.addComponentOrReplace(transform_31)
engine.addEntity(door)

// Define start and end rotations for the gate
let startRot = Quaternion.Euler(0, 0, 0)
let endRot = Quaternion.Euler(0, -90, 0)

// Toggle gate to its open / closed positions
door.addComponent(new utils.ToggleComponent(utils.ToggleState.Off, value => {
	if (value == utils.ToggleState.On) {
		door.addComponentOrReplace(new utils.RotateTransformComponent(startRot, endRot, 0.5))
	}
	else {
		door.addComponentOrReplace(new utils.RotateTransformComponent(endRot, startRot, 0.5))
	}
}))

// Listen for click on the gate and toggle its state
door.addComponent(new OnPointerDown(event => {

	// Adding an intermediate variable
	let doorRotY = door.getComponent(Transform).rotation.y

	// Check if gate is at its start or end positions before toggling
	if (doorRotY == startRot.y || doorRotY == endRot.y)
		door.getComponent(utils.ToggleComponent).toggle()
}))

export let NPCTalk: Dialog[] = [
  {
    text: 'Hi there',
  },
  {
    text: "Yes, I'm a talking cookies plate",
  },
  {
    text: 'You found me before the thief!',
  },
  {
    text: 'You saved Xmas!',
  },
  {
    text: 'Thanks for playing!',
    isEndOfDialog: true
    
  }
]