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
        loadingBar: cc.ProgressBar,
        SpriteMain: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.loadingBar.progress = 0;
        this.schedule(function(){
            if(this.loadingBar.progress >= 1){
                this.SpriteMain.active = true;
            }
            this.loadingBar.progress += 0.1;
            
        }, 0.3);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
