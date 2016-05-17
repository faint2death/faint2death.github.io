/**
 * bird
 * Created by x on 2016/5/11.
 */

var Bird = (function () {
    var _bird = null;       // 飞行动画
    var _timeLine = null;   // 玩家点击，鸟的动作
    var _isRise = false;    // 是否玩家点击，往上飞

    var fly = function () {
        if (_bird == null) {
            Laya.loader.load(FB.ATLAS, laya.utils.Handler.create(null, function () {
                _bird = new laya.display.Animation();
                GameLayer.getBirdLayer().addChild(_bird);

                var _atlas = FB.ATLAS.slice(0, -5);
                var _urls = [
                    _atlas + "/bird1.png",
                    _atlas + "/bird2.png",
                    _atlas + "/bird3.png",
                ];
                Laya.Animation.createFrames(_urls, "fly");

                _bird.interval = 60;
                _bird.pos(FB.BIRD.X, FB.BIRD.Y);
                _bird.size(86, 60);
                _bird.pivot(_bird.width / 2, _bird.height / 2);
                _bird.play(0, true, "fly");
            }), null, "atlas");
        } else {
            _bird.pos(FB.BIRD.X, FB.BIRD.Y);
            _bird.rotation = 0;
            _bird.play(0, true, "fly");
        }

    };

    var _createTimeLine = function() {
        if (_timeLine == null) {
            _timeLine = new Laya.TimeLine();
        } else {
            _timeLine.reset();
        }
        _timeLine.add("rise", 0);
        _timeLine.to(_bird, {
            x: _bird.x,
            y: _bird.y-100,
            rotation: -30,
        }, 300);

        _timeLine.add("fall", 0);
        _timeLine.to(_bird, {
            x: _bird.x,
            y: FB.BIRD.LOWEST,
            rotation: 30,
        //}, 700, Laya.Ease.cubicIn);
        }, 700);
    };

    var rise = function() {
        if (_bird == null) {
            return;
        }

        _createTimeLine();
        _isRise = true;
        _timeLine.play("rise");
        _timeLine.on(Laya.Event.COMPLETE, null, function(){
            if (_isRise) {
                fall();
                _isRise = false;
            }
        });
    };

    var fall = function() {
        if (_bird == null) {
            return;
        }

        _createTimeLine();
        _isRise = false;
        _timeLine.play("fall");
        _timeLine.on(Laya.Event.COMPLETE, null, function(){
            if (!_isRise) {
                _timeLine.pause();
                _bird.y = FB.BIRD.LOWEST;
            }
        });
    };

    var dead = function() {
        if (_bird) {
            _bird.stop();
            _bird.rotation = 90;
            laya.utils.Tween.to(_bird, { y : FB.BIRD.LOWEST }, 200, laya.utils.Ease.linearIn);
        }
        if (_timeLine) {
            _timeLine.pause();
        }
    };

    var fallDown = function() {
        if (_bird == null) {
            return false;
        }

        if (_bird.y < FB.BIRD.LOWEST) {
            return false;
        }

        return true;
    };

    var bound = function() {
        if (_bird == null) {
            return null;
        }

        var _bound = new laya.maths.Rectangle(_bird.x-_bird.pivotX, _bird.y-_bird.pivotY, _bird.width, _bird.height);
        return _bound;
    };

    return {
        "fly": fly,
        "rise": rise,
        "fall": fall,
        "dead": dead,
        "fallDown": fallDown,
        "bound": bound,
    };
})();