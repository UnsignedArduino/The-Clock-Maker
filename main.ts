function make_hand () {
    sprite_hand = sprites.create(assets.image`hand`, SpriteKind.Player)
    sprite_hand.setFlag(SpriteFlag.Ghost, true)
    sprite_hand_pointer = sprites.create(assets.image`hand_pointer`, SpriteKind.Player)
    sprite_hand_pointer.setFlag(SpriteFlag.StayInScreen, true)
    sprite_hand_pointer.setFlag(SpriteFlag.Invisible, true)
    controller.moveSprite(sprite_hand_pointer, 50, 50)
}
function make_plastic_clock () {
	
}
let sprite_hand_pointer: Sprite = null
let sprite_hand: Sprite = null
scene.setBackgroundColor(13)
make_hand()
make_plastic_clock()
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
