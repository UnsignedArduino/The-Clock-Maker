namespace SpriteKind {
    export const Item = SpriteKind.create()
    export const Outline = SpriteKind.create()
    export const Text = SpriteKind.create()
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
function show_image_menu () {
    selected_item = 0
    while (true) {
        if (options[selected_item - 1]) {
            sprite_previous_item = sprites.create(options[selected_item - 1], SpriteKind.Player)
        }
        sprite_current_item = sprites.create(options[selected_item], SpriteKind.Player)
        if (options[selected_item + 1]) {
            sprite_next_item = sprites.create(options[selected_item + 1], SpriteKind.Player)
        }
        sprite_current_item.x = scene.screenWidth() / 2
        sprite_current_item.y = scene.screenHeight() / 2
        if (sprite_previous_item) {
            sprite_previous_item.right = 10
            sprite_previous_item.y = scene.screenHeight() / 2
        }
        if (sprite_next_item) {
            sprite_next_item.left = scene.screenWidth() - 10
            sprite_next_item.y = scene.screenHeight() / 2
        }
        pause(100)
        while (!(controller.left.isPressed() || controller.right.isPressed() || controller.A.isPressed())) {
            pause(50)
        }
        if (sprite_previous_item) {
            sprite_previous_item.destroy()
        }
        if (sprite_current_item) {
            sprite_current_item.destroy()
        }
        if (sprite_next_item) {
            sprite_next_item.destroy()
        }
        if (controller.left.isPressed()) {
            if (selected_item > 0) {
                selected_item += -1
            }
        } else if (controller.right.isPressed()) {
            if (selected_item < options.length - 1) {
                selected_item += 1
            }
        } else if (controller.A.isPressed()) {
            break;
        }
    }
    return selected_item
}
function end_build (ms: number) {
    timer.background(function () {
        story.printDialog("Woo hoo you finished!\\n" + "It took you " + format_ms(ms) + " to finish this clock." + "", scene.screenWidth() / 2, scene.screenHeight() * 0.2 + 7, scene.screenHeight() * 0.4, scene.screenWidth() - 2)
    })
    timer.background(function () {
        story.printDialog("Press any key to continue.", scene.screenWidth() / 2, scene.screenHeight() * 0.85, scene.screenHeight() * 0.3 - 2, scene.screenWidth() - 2)
    })
    while (!(controller.anyButton.isPressed())) {
        pause(100)
    }
    story.clearAllText()
    fade_in(true)
    game.reset()
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
function fade_out (block: boolean) {
    color.startFade(color.Black, color.originalPalette, 1000)
    if (block) {
        color.pauseUntilFadeDone()
    }
}
function fade_in (block: boolean) {
    color.startFade(color.originalPalette, color.Black, 1000)
    if (block) {
        color.pauseUntilFadeDone()
    }
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
    enable_dragging = true
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
    steps.push(make_item(assets.image`plastic_clock_minute_arm`, assets.image`plastic_clock_minute_arm_outline`, scene.screenWidth() - 16, scene.screenHeight() / 2, scene.screenWidth() / 2, scene.screenHeight() / 2, "Drag the minute arm piece on top of the cover.", assets.image`plastic_clock_step_3`))
    steps.push(make_item(assets.image`plastic_clock_hour_arm`, assets.image`plastic_clock_hour_arm_outline`, scene.screenWidth() - 16, scene.screenHeight() / 2, scene.screenWidth() / 2, scene.screenHeight() / 2, "Drag the hour arm piece on top of the minute arm.", assets.image`plastic_clock_step_4`))
    steps.push(make_item(assets.image`plastic_clock_gear_box`, assets.image`plastic_clock_gear_box_outline`, scene.screenWidth() - 16, scene.screenHeight() / 2, scene.screenWidth() / 2, scene.screenHeight() / 2, "Drag the gear box on top of the hour arm.", assets.image`plastic_clock_step_5`))
    steps.push(make_item(assets.image`plastic_clock_backplate`, assets.image`plastic_clock_backplate_outline`, scene.screenWidth() - 16, scene.screenHeight() / 2, scene.screenWidth() / 2, scene.screenHeight() / 2, "Drag the back plate on top of the gear box.", assets.image`plastic_clock_step_6`))
    init_step_bar(steps.length)
    start_time = game.runtime()
    for (let index = 0; index <= steps.length - 1; index++) {
        do_step(index)
        timer.background(function () {
            for (let index2 = 0; index2 < 25; index2++) {
                sprite_step_bar.value += 1
                pause(25)
            }
        })
    }
    pause(1000)
    story.clearAllText()
    pause(1000)
    sprite_combined.setImage(assets.image`plastic_clock_finished`)
    end_time = game.runtime()
    pause(1000)
    end_build(end_time - start_time)
}
function format_ms (ms: number) {
    secs = ms / 1000
    mins = Math.idiv(secs, 60)
    secs = secs - mins * 60
    return "" + mins + "m " + secs + "s"
}
let mins = 0
let secs = 0
let end_time = 0
let start_time = 0
let step_number = 0
let block_object: blockObject.BlockObject = null
let item_dragging: Sprite = null
let sprite_hand_pointer: Sprite = null
let sprite_hand: Sprite = null
let sprite_combined: Sprite = null
let enable_dragging = false
let sprite_outline: Sprite = null
let sprite_item: Sprite = null
let steps: blockObject.BlockObject[] = []
let step_object: blockObject.BlockObject = null
let sprite_step_bar: StatusBarSprite = null
let sprite_next_item: Sprite = null
let sprite_current_item: Sprite = null
let sprite_previous_item: Sprite = null
let selected_item = 0
let options: Image[] = []
let sprite_title: Sprite = null
scene.setBackgroundColor(13)
story.setPagePauseLength(1000, 2000)
timer.background(function () {
    sprite_title = sprites.create(assets.image`title_screen`, SpriteKind.Text)
    sprite_title.top = 0
    sprite_title.left = 0
    sprite_title.setFlag(SpriteFlag.Ghost, true)
    sprite_title.setFlag(SpriteFlag.AutoDestroy, true)
    fade_out(false)
    while (!(controller.anyButton.isPressed())) {
        pause(100)
    }
    sprite_title.ay = -500
    fade_in(true)
    fade_out(false)
    options = [assets.image`plastic_clock_screen`, assets.image`metal_alarm_clock_screen`]
    selected_item = show_image_menu()
    fade_in(true)
    fade_out(false)
    if (selected_item == 0) {
        make_hand()
        make_plastic_clock()
    }
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
