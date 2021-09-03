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
        guide_dlg: cc.Node,
        pause_dlg: cc.Node,
        level_dlg: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.guide_dlg.active = true;
    },
    onClose_guid: function() {
        this.guide_dlg.active = false;
    },
    onClose_pause: function() {
        this.pause_dlg.active = false;
    },
    onClose_level: function() {
        this.level_dlg.active = false;
    },
    
    onPause_dlg: function(){
        this.pause_dlg.active = true;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
