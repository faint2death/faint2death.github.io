/**
 * tube
 * Created by x on 2016/5/15.
 */

var Tube = (function () {
    var _upTubePool = [];   // 缓存
    var _downTubePool = [];

    var _randOf = function (min, max) {
        return Math.random()*(max-min+1)+min | 0;
    };

    var _getUpTube = function() {
        var _tube = null;
        for (var i = 0, l = _upTubePool.length; i<l; i++) {
            _tube = _upTubePool[i];
            if (_tube.x <= FB.TUBE.LEFT) {
                _tube.count = false;
                return _tube;
            }
        }

        _tube = new laya.display.Sprite();
        GameLayer.getTubeLayer().addChild(_tube);

        var _atlas = FB.ATLAS.slice(0, -5);
        _tube.loadImage(_atlas+"/holdback2.png");
        _tube.count = false;
        _upTubePool.push(_tube);

        return _tube;
    };

    var _getDownTube = function() {
        var _tube = null;
        for (var i = 0, l = _downTubePool.length; i<l; i++) {
            _tube = _downTubePool[i];
            if (_tube.x <= FB.TUBE.LEFT) {
                return _tube;
            }
        }

        _tube = new laya.display.Sprite();
        GameLayer.getTubeLayer().addChild(_tube);

        var _atlas = FB.ATLAS.slice(0, -5);
        _tube.loadImage(_atlas+"/holdback1.png");
        _tube.count = false;
        _downTubePool.push(_tube);

        return _tube;
    };

    var _tubeMoving = function() {
        if (GameLayer.getGameState() != FB.STATE.PLAYING) {
            return;
        }

        var _upHeight = _randOf(0, 400) + FB.TUBE.HEIGHT;
        var _downHeight = _upHeight + FB.TUBE.GAP - FB.TUBE.HEIGHT;

        var _upTube = _getUpTube();
        _upTube.pos(FB.CANVAS.WIDTH, _upHeight);
        _upTube.count = true; // 计数
        _upTube.tween = laya.utils.Tween.to(_upTube, { x : FB.TUBE.LEFT }, FB.TUBE.SPEED, laya.utils.Ease.linearIn);
        var _downTube = _getDownTube();
        _downTube.pos(FB.CANVAS.WIDTH, _downHeight);
        _downTube.tween = laya.utils.Tween.to(_downTube, { x : FB.TUBE.LEFT }, FB.TUBE.SPEED, laya.utils.Ease.linearIn);
    };

    var move = function() {
        Laya.loader.load(FB.ATLAS, laya.utils.Handler.create(null, function () {
            Laya.timer.loop(FB.TUBE.INTERVAL, null, _tubeMoving);
        }), null, "atlas");
    };

    var pause = function() {
        for (var i = 0, l = _upTubePool.length; i<l; i++) {
            _upTubePool[i].tween.pause();
            _downTubePool[i].tween.pause();
        }
    };

    var reset = function() {
        for (var i = 0, l = _upTubePool.length; i<l; i++) {
            _upTubePool[i].x = FB.TUBE.LEFT;
            _downTubePool[i].x = FB.TUBE.LEFT;
        }
    };

    var pool = function () {
        return _upTubePool.concat(_downTubePool);
    };

    return {
        "move": move,
        "pause": pause,
        "reset": reset,
        "pool": pool,
    };
})();