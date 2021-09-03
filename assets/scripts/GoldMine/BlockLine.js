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
        block_count: cc.Integer,
        block: cc.Prefab,
        fog: cc.Prefab,
        r_blocks: []
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    initBlocks() {
        var top = 0, bottom = 0.834;
        this.block_count = 6;
        for (var i = 0; i < 6; i++) {
            var blocknode = cc.instantiate(this.block);
            blocknode.getComponent('Block').onChange(Math.round(Math.random() * 8));
            blocknode.getComponent(cc.Widget).isAbsoluteTop = false;
            blocknode.getComponent(cc.Widget).isAbsoluteBottom = false;
            blocknode.getComponent(cc.Widget).top = top;
            blocknode.getComponent(cc.Widget).bottom = bottom;
            top += 0.166;
            bottom -= 0.166;
            this.node.addChild(blocknode);
        }
    },
    onClickBlock(top) {
        // for (var i = (top / 0.166 - 1) >= this.block_count ? this.block_count - 1 : (top / 0.166 - 1) ; i >= 0; i--) {
        // this.node.children[i].getComponent(cc.Widget).enabled = true;
        // this.node.children[i].getComponent(cc.Widget).top += 0.166;
        // this.node.children[i].getComponent(cc.Widget).bottom -= 0.166;
        // }
        // this.block_count --;
        // if(this.block_count == 0) {
        //     this.node.destroy();
        // }
        this.node.getParent().getComponent('blockNode').onBlockClicked(top, this.node.getComponent(cc.Widget).left);
    },
    getBlockState() {
        var row = [];
        var count = this.node.children.length;
        for (var i = count - 1; i >= 0; i--) {
            row[count - i - 1] = this.node.children[i].getComponent('Block').block_flg;
        }
        for (var i = row.length; i < 6; i++) {
            row[i] = 0;
        }
        return row;
    },
    setRemoveBlocks(b_index) {
        this.r_blocks[this.r_blocks.length] = this.node.children.length - b_index - 1;
    },
    startFogBlock() {
        var fognode = cc.instantiate(this.fog);
        fognode.position = this.node.children[this.r_blocks[0]].position;
        fognode.getComponent(cc.Animation).play("fog");
        this.node.addChild(fognode);
        this.r_blocks = [];
    },
    getLineMark() {
        var mark_arr = [];
        for (var i = 0; i < this.r_blocks.length; i++) {
            var t_mark = { "left": 0, "top": 0, "mark": 0, "type": 0, "multi": 0 };
            t_mark.left = this.node.getComponent(cc.Widget).left;
            t_mark.top = this.node.children[this.r_blocks[i]].getComponent(cc.Widget).top;
            var stat = this.node.children[this.r_blocks[i]].getComponent("Block").block_stat;
            if(stat == 4 || stat == 5 || stat == 7) {
                t_mark.mark = 100;
            }else if(stat == 6){
                t_mark.mark = 10;
                t_mark.type = 1;
            }else if(stat == 8) {
                t_mark.mark = 10;
                t_mark.multi = 1;
                t_mark.type = 1;
            }
            mark_arr[mark_arr.length] = t_mark;
        }
        // this.r_blocks = [];
        return mark_arr;
    },
    startRemoveBlocks() {
        console.log(this.r_blocks);
        var t_down = [];
        for (var i = 0; i < this.node.children.length; i++) {
            t_down[i] = { "top": 0, "bottom": 0 };
        }
        for (var i = 0; i < this.r_blocks.length; i++) {
            for (var j = 0; j <= this.r_blocks[i]; j++) {
                t_down[j].top++;
                t_down[j].bottom++;
            }
        }

        for (var i = 0; i < this.r_blocks.length; i++) {
            var fognode = cc.instantiate(this.fog);
            fognode.position = this.node.children[this.r_blocks[i]].position;
            fognode.getComponent(cc.Animation).play("fog");
            this.node.addChild(fognode);
            this.node.children[this.r_blocks[i]].destroy();
            this.block_count--;
        }
        console.log(t_down);
        for (var i = 0; i < t_down.length; i++) {
            if (t_down[i].top != 0) {
                var t_top = this.node.children[i].getComponent(cc.Widget).top + 0.166 * t_down[i].top;
                var t_bottom = this.node.children[i].getComponent(cc.Widget).bottom - 0.166 * t_down[i].bottom;
                console.log(t_top);
                console.log(t_bottom);
                this.node.children[i].getComponent('Block').BlockDown(t_top, t_bottom);
            }
        }
        if (this.block_count == 0) {
            var self = this;
            cc.tween(this.node).delay(0.3).call(() => {
                self.node.destroy();
            }).start();

        }
        this.r_blocks = [];
    },


    // update (dt) {},
});
