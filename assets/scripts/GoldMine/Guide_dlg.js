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
        guide_text: [cc.Node],
        index: 0
    },

    // use this for initialization
    onLoad: function () {
        this.guide_text[0].active = true;
        this.guide_text[1].active = false;
        this.index = 0;
    },
    onPrev: function() {
        this.guide_text[this.index].active = false;
        if(this.index === 0) {
            this.index = this.guide_text.length - 1;
        }else{
            this.index --;
        }
        this.guide_text[this.index].active = true;
    },
    onNext: function(){
        this.guide_text[this.index].active = false;
        if(this.index === this.guide_text.length - 1) {
            this.index = 0;
        }else{
            this.index ++;
        }
        this.guide_text[this.index].active = true;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
