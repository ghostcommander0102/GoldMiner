// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        block_stat: cc.Integer,
        block_flg: cc.Integer
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    onChange(state) {
        if(state == 1 || state == 5 || state == 0) {
            this.block_flg = 1;
        } else if(state == 2 || state == 4) {
            this.block_flg = 2;
        } else if(state == 3 || state == 7) {
            this.block_flg = 3;
        } else if(state == 6 || state == 8) {
            this.block_flg = 4;
        }
        this.block_stat = state == 0 ? 1 : state;
        var self = this;
        cc.loader.loadRes("texture/block" + this.block_stat, cc.SpriteFrame, function(err, spriteFrame){
            self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    onClickBlock() {
        this.node.getParent().getComponent('BlockLine').onClickBlock(this.node.getComponent(cc.Widget).top);
    },
    BlockDown(t_top, t_bottom) {
        cc.tween(this.node.getComponent(cc.Widget)).to(0.2, {top: t_top, bottom: t_bottom},{progress:(start, end, current, ratio)=>this.progresscallback(start, end, ratio)}).to(0.07,{top:t_top - 0.05,bottom:t_bottom + 0.05},{progress:(start, end, current, ratio)=>this.progresscallback(start, end, ratio)}).to(0.04, {top: t_top, bottom: t_bottom},{progress:(start, end, current, ratio)=>this.progresscallback(start, end, ratio)}).start();
    },
    progresscallback(start, end, t) {
        try {
            this.node.getComponent(cc.Widget).enabled = true;
        } catch (e) {

        }
        return start + (end - start) * t;
    }
    // update (dt) {},
});
