namespace SpriteKind {
    export const Item = SpriteKind.create()
    export const Outline = SpriteKind.create()
}
namespace NumProp {
    export const spawn_x = NumProp.create()
    export const spawn_y = NumProp.create()
    export const target_x = NumProp.create()
    export const target_y = NumProp.create()
}
namespace StrProp {
    export const instructions = StrProp.create()
}
namespace ImageProp {
    export const image = ImageProp.create()
    export const image_outline = ImageProp.create()
    export const combined = ImageProp.create()
}
namespace StatusBarKind {
    export const Steps = StatusBarKind.create()
}
function init_step_bar (max_steps: number) {
    sprite_step_bar = statusbars.create(scene.screenWidth() - 2, 3, StatusBarKind.Steps)
    sprite_step_bar.x = scene.screenWidth() / 2
    sprite_step_bar.top = 2
    sprite_step_bar.value = 0
    sprite_step_bar.max = max_steps * 25
    sprite_step_bar.setColor(7, 2)
    sprite_step_bar.setBarBorder(1, 15)
}
function do_step (index: number) {
    step_object = steps[index]
    timer.background(function () {
        story.clearAllText()
        story.printDialog(blockObject.getStringProperty(step_object, StrProp.instructions), scene.screenWidth() / 2, scene.screenHeight() * 0.2 + 7, scene.screenHeight() * 0.4, scene.screenWidth() - 2)
    })
    sprite_item = sprites.create(blockObject.getImageProperty(step_object, ImageProp.image), SpriteKind.Item)
    sprite_item.setPosition(blockObject.getNumberProperty(step_object, NumProp.spawn_x), blockObject.getNumberProperty(step_object, NumProp.spawn_y))
    sprite_item.z = 1
    sprite_outline = sprites.create(blockObject.getImageProperty(step_object, ImageProp.image_outline), SpriteKind.Outline)
    sprite_outline.setPosition(blockObject.getNumberProperty(step_object, NumProp.target_x), blockObject.getNumberProperty(step_object, NumProp.target_y))
    enable_dragging = true
    while (!(sprite_item.overlapsWith(sprite_outline))) {
        pause(100)
    }
    enable_dragging = false
    story.spriteMoveToLocation(sprite_item, sprite_outline.x, sprite_outline.y, 50)
    sprite_outline.destroy()
    sprite_item.destroy()
    if (sprite_combined) {
        sprite_combined.setImage(blockObject.getImageProperty(step_object, ImageProp.combined))
    } else {
        sprite_combined = sprites.create(blockObject.getImageProperty(step_object, ImageProp.combined), SpriteKind.Player)
    }
    sprite_combined.setPosition(blockObject.getNumberProperty(step_object, NumProp.target_x), blockObject.getNumberProperty(step_object, NumProp.target_y))
    pause(1000)
}
function make_hand () {
    sprite_hand = sprites.create(assets.image`hand`, SpriteKind.Player)
    sprite_hand.setFlag(SpriteFlag.Ghost, true)
    sprite_hand.setFlag(SpriteFlag.ShowPhysics, false)
    sprite_hand.z = 10
    sprite_hand_pointer = sprites.create(assets.image`hand_pointer`, SpriteKind.Player)
    sprite_hand_pointer.setFlag(SpriteFlag.StayInScreen, true)
    sprite_hand_pointer.setFlag(SpriteFlag.Invisible, true)
    sprite_hand_pointer.z = 10
    controller.moveSprite(sprite_hand_pointer, 50, 50)
    item_dragging = [][0]
}
function make_item (image2: Image, image_outline: Image, spawn_x: number, spawn_y: number, target_x: number, target_y: number, instructions: string, combined: Image) {
    block_object = blockObject.create()
    blockObject.setImageProperty(block_object, ImageProp.image, image2)
    blockObject.setImageProperty(block_object, ImageProp.image_outline, image_outline)
    blockObject.setImageProperty(block_object, ImageProp.combined, combined)
    blockObject.setNumberProperty(block_object, NumProp.spawn_x, spawn_x)
    blockObject.setNumberProperty(block_object, NumProp.spawn_y, spawn_y)
    blockObject.setNumberProperty(block_object, NumProp.target_x, target_x)
    blockObject.setNumberProperty(block_object, NumProp.target_y, target_y)
    blockObject.setStringProperty(block_object, StrProp.instructions, instructions)
    return block_object
}
function make_plastic_clock () {
    steps = []
    step_number = 0
    steps.push(make_item(assets.image`plastic_clock_face`, assets.image`plastic_clock_face_outline`, scene.screenWidth() - 16, scene.screenHeight() / 2, scene.screenWidth() / 2, scene.screenHeight() / 2, "Drag the plastic clock cover to the center.", assets.image`plastic_clock_step_1`))
    steps.push(make_item(assets.image`plastic_clock_edge`, assets.image`plastic_clock_edge_outline`, scene.screenWidth() - 16, scene.screenHeight() / 2, scene.screenWidth() / 2, scene.screenHeight() / 2, "Drag the plastic clock edge piece on top of the cover.", assets.image`plastic_clock_step_2`))
    init_step_bar(steps.length)
    for (let index = 0; index <= steps.length - 1; index++) {
        do_step(index)
        timer.background(function () {
            for (let index2 = 0; index2 < 25; index2++) {
                sprite_step_bar.value += 1
                pause(25)
            }
        })
    }
}
let step_number = 0
let block_object: blockObject.BlockObject = null
let item_dragging: Sprite = null
let sprite_hand_pointer: Sprite = null
let sprite_hand: Sprite = null
let sprite_combined: Sprite = null
let sprite_outline: Sprite = null
let sprite_item: Sprite = null
let steps: blockObject.BlockObject[] = []
let step_object: blockObject.BlockObject = null
let sprite_step_bar: StatusBarSprite = null
let enable_dragging = false
scene.setBackgroundColor(13)
story.setPagePauseLength(1000, 2000)
enable_dragging = true
make_hand()
timer.background(function () {
    make_plastic_clock()
})
game.onUpdate(function () {
    if (sprite_hand_pointer && sprite_item) {
        if (controller.A.isPressed()) {
            if (sprite_hand_pointer.overlapsWith(sprite_item)) {
                item_dragging = sprite_item
            }
        } else {
            item_dragging = [][0]
        }
        if (item_dragging && enable_dragging) {
            item_dragging.setPosition(sprite_hand_pointer.x, sprite_hand_pointer.y)
        }
    }
})
game.onUpdate(function () {
    if (sprite_hand && sprite_hand_pointer) {
        if (controller.A.isPressed()) {
            sprite_hand.setImage(assets.image`hand_pressed`)
            sprite_hand.top = sprite_hand_pointer.top - 5
            sprite_hand.left = sprite_hand_pointer.left
        } else {
            sprite_hand.setImage(assets.image`hand`)
            sprite_hand.top = sprite_hand_pointer.top
            sprite_hand.left = sprite_hand_pointer.left - 1
        }
    }
})
