/**
 * Main entry
 * Created by x on 2016/5/10.
 */

var Main = (function() {
    // 第一次启动游戏需要加载的资源
    var _res = [
        { url:"res/bg.png", type:laya.net.Loader.IMAGE },
    ];

    // 初始化屏幕
    var _initStage = function() {
        Laya.init(FB.CANVAS.WIDTH, FB.CANVAS.HEIGHT, laya.webgl.WebGL);
        if (laya.utils.Browser.onMobile) {
            Laya.stage.screenMode = laya.display.Stage.SCREEN_VERTICAL;
            Laya.stage.scaleMode = laya.display.Stage.SCALE_NOBORDER;
        } else {
            console.log("PC width:" + laya.utils.Browser.width + " height:" + laya.utils.Browser.height);
            Laya.stage.alignH = laya.display.Stage.ALIGN_CENTER;
            Laya.stage.scaleMode = laya.display.Stage.SCALE_SHOWALL;
        }
        Laya.stage.bgColor = "black";
        if (location.hostname == "localhost" || location.search.indexOf("debug") != -1) {
            laya.utils.Stat.show();
        }
    };

    // 初始化基本游戏资源，加载完后，回调游戏层初始化
    var _initResources = function() {
        Laya.loader.load(_res, laya.utils.Handler.create(this, GameLayer.init()));
    };

    // 公共方法
	var entry = function() {
		_initStage();
        _initResources();
	};

    return {
        "entry": entry
    };
})();
