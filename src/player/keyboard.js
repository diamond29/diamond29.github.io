import { world } from '../world'

//The `keyboard` helper function
function keyboard(keyCode) {
    const key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) {
                key.press();
            }
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) {
                key.release();
            }
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener("keydown", key.downHandler.bind(key), false);
    window.addEventListener("keyup", key.upHandler.bind(key), false);
    return key;
}

const leftKey = keyboard(37),
    upKey = keyboard(38),
    rightKey = keyboard(39),
    downKey = keyboard(40),
    spaceKey = keyboard(32);

leftKey.press = function () {
    world.player.direction = 'left'
};

//Right
rightKey.press = function () {
    world.player.direction = 'right'
};

//Up
upKey.press = function () {
    world.player.direction = 'up'
};

//Down
downKey.press = function () {
    world.player.direction = 'down'
};

spaceKey.press = () => { world.player.attacking = true }

export { leftKey, upKey, rightKey, downKey, spaceKey }
