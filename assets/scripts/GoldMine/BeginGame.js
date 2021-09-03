cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        Info_dlg: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        Global.gameover = 0;
        Global.gamepause = 0;
        Global.gamelevel = 1;
        Global.gamescore = 0;
        Global.gamesublevel = 1;
        Global.gamelevelscore = 0;
    },
    onStart: function() {
        cc.director.loadScene("Game");
    },
    onInfo: function() {
        var anim = this.Info_dlg.getComponent(cc.Animation);
        anim.play("layerout");
    },
    onDlg: function() {
        this.Info_dlg.getComponent(cc.Animation).play("layerin");
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
