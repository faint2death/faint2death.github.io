/**
 * layer for game
 * Created by x on 2016/5/10.
 */

var GameLayer = (function () {
    var _backgroundLayer = null;     // 背景层，最底层
    var _groundLayer = null;         // 移动的大地
    var _groundTween = null;         // 大地移动的缓动
    var _birdLayer = null;           // 小鸟层
    var _tubeLayer = null;           // 水管
    var _readyLayer = null;          // 开始菜单
    var _gameOverLayer = null;       // 结束菜单
    var _scoreLayer = null;          // 分数层
    var _scoreText = null;           // 分数
    var _scoreCount = 0;              // 分数
    var _clickLayer = null;          // 点击层，面积有限制
    var _gameState = FB.STATE.READY;  // 当前游戏状态

    var _backgroundLayerInit = function () {
        _backgroundLayer = new laya.display.Sprite();
        Laya.stage.addChild(_backgroundLayer);

        _backgroundLayer.loadImage("res/bg.png", 0,0,0,0, laya.utils.Handler.create(null, function() {
            // 放大一点是为了屏幕震动不露黑边
            _backgroundLayer.scale(1.05, 1.05);
            _backgroundLayer.pos(-_backgroundLayer.width*0.05, -_backgroundLayer.height*0.05);
        }));
    };

    var _groundMoving = function() {
        _groundTween = laya.utils.Tween.to(_groundLayer, { x : -180 }, 2000, laya.utils.Ease.linearIn, laya.utils.Handler.create(null, function() {
            _groundLayer.x = 0;
            _groundMoving();
        }));
    };

    var _groundLayerInit = function () {
        _groundLayer = new laya.display.Sprite();
        _backgroundLayer.addChild(_groundLayer);

        _groundLayer.loadImage("res/ground.png");
        _groundLayer.pos(0, 900);
        _groundMoving();
    };

    var _readyLayerInit = function () {
        _readyLayer = new laya.display.Sprite();
        Laya.stage.addChild(_readyLayer);

        Laya.loader.load(FB.ATLAS, laya.utils.Handler.create(null, function () {
            var _atlas = FB.ATLAS.slice(0, -5);
            var _readyImg = new laya.display.Sprite();
            _readyLayer.addChild(_readyImg);
            _readyImg.loadImage(_atlas+"/getready.png", 0,0,0,0, laya.utils.Handler.create(null, function() {
                _readyImg.pos(FB.CANVAS.WIDTH/2, 200);
                _readyImg.pivot(_readyImg.width/2, _readyImg.height/2);
            }));

            var _clickImg = new laya.display.Sprite();
            _readyLayer.addChild(_clickImg);
            _clickImg.loadImage(_atlas+"/click.png", 0,0,0,0, laya.utils.Handler.create(null, function() {
                _clickImg.pos(FB.CANVAS.WIDTH/2, 420);
                _clickImg.pivot(_clickImg.width/2, _clickImg.height/2);
            }));
        }), null, "atlas");

        Bird.fly();
    };

    var _gameOverLayerInit = function () {
        _gameOverLayer = new laya.display.Sprite();
        _gameOverLayer.visible = false;
        Laya.stage.addChild(_gameOverLayer);

        Laya.loader.load(FB.ATLAS, laya.utils.Handler.create(null, function () {
            var _atlas = FB.ATLAS.slice(0, -5);
            var _gameOverImg = new laya.display.Sprite();
            _gameOverLayer.addChild(_gameOverImg);
            _gameOverImg.loadImage(_atlas+"/gameover.png", 0,0,0,0, laya.utils.Handler.create(null, function() {
                _gameOverImg.pos(FB.CANVAS.WIDTH/2, 200);
                _gameOverImg.pivot(_gameOverImg.width/2, _gameOverImg.height/2);
            }));

            var _startImg = new laya.display.Sprite();
            _gameOverLayer.addChild(_startImg);
            _startImg.loadImage(_atlas+"/start.png", 0,0,0,0, laya.utils.Handler.create(null, function() {
                _startImg.pos(FB.CANVAS.WIDTH/2, 350);
                _startImg.pivot(_startImg.width/2, _startImg.height/2);
            }));
        }), null, "atlas");
    };

    var _birdLayerInit = function() {
        _birdLayer = new laya.display.Sprite();
        Laya.stage.addChild(_birdLayer);
    };

    var _tubeLayerInit = function() {
        _tubeLayer = new laya.display.Sprite();
        _backgroundLayer.addChild(_tubeLayer);

        Tube.move();
    };

    var _scoreLayerInit = function() {
        _scoreLayer = new laya.display.Sprite();
        Laya.stage.addChild(_scoreLayer);

        var _bitmapFont = new laya.display.BitmapFont();
        _bitmapFont.loadFont("res/flappy.fnt", laya.utils.Handler.create(null, function() {
            Laya.Text.registerBitmapFont("flappy", _bitmapFont);

            _scoreText = new Laya.Text();
            _scoreLayer.addChild(_scoreText);
            _scoreText.text = _scoreCount.toString();
            _scoreText.font = "flappy";
            _scoreText.pos(FB.CANVAS.WIDTH/2, 60);
        }));
    };

    var _shake = function (obj, shakeTimes, shakeXRange, shakeYRange) {
        if (!obj) {
            return;
        }
        if (obj.onShake) {
            return;
        }
        obj.onShake = true;

        var shakeTimes = parseInt(shakeTimes) || 4; // 次数，第一次传入一定要偶数，否则会错位
        var shakeTime = 40,                         // 80ms，时间越短，震动越快
            shakeXRange = parseInt(shakeXRange) || 10,
            shakeYRange = parseInt(shakeYRange) || 10;

        laya.utils.Tween.to(obj, {x:obj.x+shakeXRange, y:obj.y+shakeYRange}, shakeTime, laya.utils.Ease.elasticOut, laya.utils.Handler.create(null, function() {
            obj.onShake = false;
            if (--shakeTimes > 0) {
                _shake(obj, shakeTimes, -shakeXRange, -shakeYRange);
            }
        }));
    };

    var _gameReady = function() {
        _readyLayer.visible = true;
        _gameOverLayer.visible = false;
        _tubeLayer.visible = false;
        _scoreLayer.visible = false;
        _scoreCount = 0;
        _scoreText.text = _scoreCount.toString();
        _gameState = FB.STATE.READY;
        _groundTween.resume();
        Bird.fly();
    };

    var _gameStart = function() {
        _readyLayer.visible = false;
        _gameOverLayer.visible = false;
        _tubeLayer.visible = true;
        _scoreLayer.visible = true;
        _gameState = FB.STATE.PLAYING;
        _groundTween.resume();
        Bird.fall();
        Tube.reset();
    };

    var _gameOver = function() {
        _readyLayer.visible = false;
        _gameOverLayer.visible = true;
        _tubeLayer.visible = true;
        _scoreLayer.visible = true;
        _gameState = FB.STATE.DEAD;
        _groundTween.pause();
        Tube.pause();
        _shake(_backgroundLayer);
        Bird.dead();
        Laya.timer.once(1000, null, function() {
            _gameState = FB.STATE.OVER;
        });
    };

    var _clickLayerInit = function () {
        _clickLayer = new laya.display.Sprite();
        Laya.stage.addChild(_clickLayer);

        _clickLayer.size(FB.CANVAS.WIDTH, FB.CANVAS.HEIGHT);
        _clickLayer.on(laya.events.Event.MOUSE_DOWN, null, function (e) {
            if (_gameState == FB.STATE.READY) {
                _gameStart();
            }
            else if (_gameState == FB.STATE.PLAYING) {
                Bird.rise();
            }
            else if (_gameState == FB.STATE.OVER) {
                _gameReady();
            }
        });
    };

    var _checkCollision = function () {
        if (_gameState != FB.STATE.PLAYING) {
            return;
        }

        if (Bird.fallDown()) {
            _gameOver();
            return;
        }

        var _birdBound = Bird.bound();
        if (_birdBound == null) {
            return;
        }

        var _tubePool = Tube.pool();
        for (var i = 0, l = _tubePool.length; i < l; i++) {
            var _tube = _tubePool[i];
            if (_tube.x < 0) {
                continue;
            }
            var _tubeBound = new laya.maths.Rectangle(_tube.x, _tube.y, _tube.width, _tube.height)
            // 计算一下通过的水管数
            if (_tube.count == true && (_tube.x+_tube.width/2) < _birdBound.x) {
                _tube.count = false;
                _scoreCount++;
                _scoreText.text = _scoreCount.toString();
            }
            if (_birdBound.intersects(_tubeBound)) {
                _gameOver();
                return;
            }
        }
    };

    var _timerInit = function () {
        Laya.timer.frameLoop(1, null, _checkCollision);
    };

    // 对外公共方法
    var init = function () {
        _backgroundLayerInit();
        _tubeLayerInit();
        _groundLayerInit();
        _readyLayerInit();
        _birdLayerInit();
        _gameOverLayerInit();
        _scoreLayerInit();
        _timerInit();
        // click放到最外面
        _clickLayerInit();
    };

    var getBirdLayer = function () {
        return _birdLayer;
    };

    var getTubeLayer = function () {
        return _tubeLayer;
    };

    var getGameState = function() {
        return _gameState;
    };

    return {
        "init": init,
        "getBirdLayer": getBirdLayer,
        "getTubeLayer": getTubeLayer,
        "getGameState": getGameState,
    };
})();