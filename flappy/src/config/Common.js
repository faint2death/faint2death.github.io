/**
 * Common variables
 * Created by x on 16/5/10.
 */

var FB = {
    // 屏幕大小
    CANVAS: {
        WIDTH: 640,
        HEIGHT: 1136
    },
    // 图集
    ATLAS: "res/flappy_packer.json",
    // 游戏状态
    STATE: {
        // 游戏准备
        READY: 0,
        // 游戏中
        PLAYING: 1,
        // 死亡效果
        DEAD: 2,
        // 游戏失败
        OVER: -1
    },
    // 鸟的参数
    BIRD: {
        // 初始位置X
        X: 200,
        // 初始位置Y
        Y: 325,
        // 鸟最低高度
        LOWEST: 860
    },
    // 管子的参数
    TUBE: {
        // 管子的速度
        SPEED: 5000,
        // 管子出现间隔
        INTERVAL: 2000,
        // 左侧消失的距离
        LEFT: -180,
        // 管子图片高度
        HEIGHT: -700,
        // 通过的间距
        GAP: 400
    }
};
