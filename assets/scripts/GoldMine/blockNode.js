var storageManager = require("../storageManager");
cc.Class({
    extends: cc.Component,

    properties: {
        blockline: cc.Prefab,
        moveTimer: cc.Integer,
        floor: cc.Node,
        ceil: cc.Node,
        level: cc.Label,
        sublevel: cc.Label,
        mark: cc.Label,
        over_dlg: cc.Node,
        level_dlg: cc.Node,
        complete_dlg: cc.Node,
        finish_move: 0,
        movecount: 0,
        dig: cc.Node,
        mousePos: cc.v2,
        digSpeed: cc.v2,
        digmoveflg: 0,
        selectedx: 0,
        selectedy: 0,
        mark_pre: cc.Prefab,
        mark_pos: cc.Node,
        Scene_node: cc.Node,
        mark_count: cc.Object,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        var self = this;
        this.node.on("mousedown", function (event) {
            if (self.digmoveflg == 0)
                self.mousePos = cc.v2(event.getLocation().x, event.getLocation().y);
        });
        this.onGameInit();
    },
    onGameInit() {
        this.dig.zIndex = 999999;
        this.cloneBlockLine(0);
        this.onGameStart();
        Global.gamesublevel = 1;
        this.sublevel.string = Global.gamesublevel + "/" + (14 + Global.gamelevel * 4);
        this.level.string = "LEVEL" + Global.gamelevel;
    },
    onGameStart() {
        this.schedule(this.callback, 8);
    },
    callback() {
        this.moveBlock();
    },
    moveBlock() {
        if(this.checkFinish()) return;
        this.finish_move = 1;
        this.moveTimer = 0;
        this.cloneBlockLine(-100);
        console.log(this.node.children);
        this.movecount = 0;
        this.schedule(this.setMoveCount, 0.1);

    },
    setMoveCount() {
        this.unschedule(this.setMoveCount);
        for (var i = this.node.children.length - 1; i >= 0; i--) {

            if (this.node.children[i].name != "dig") {
                if (this.node.children[i].getComponent(cc.Widget).left <= this.node.children[this.movecount].getComponent(cc.Widget).left + 100) {
                    this.movecount = i;
                }
            }
        }
        this.schedule(this.moveCallback, 0.05);
        this.floor.getComponent(cc.Animation).play('floor');
        this.ceil.getComponent(cc.Animation).play('shake');
    },
    moveCallback() {
        if (this.moveTimer == 100) {
            this.unschedule(this.moveCallback);
            Global.gamesublevel++;
            this.sublevel.string = Global.gamesublevel + "/" + (14 + Global.gamelevel * 4);
            this.checkGameOver();
            this.finish_move = 0;
            return;
        }

        for (var i = this.node.children.length - 1; i >= this.movecount; i--) {
            if (this.node.children[i].name != "dig") {
                this.node.children[i].getComponent(cc.Widget).enabled = true;
                this.node.children[i].getComponent(cc.Widget).left += 20;
            }
        }
        this.moveTimer += 20;
    },
    cloneBlockLine(left) {
        var blocknode = cc.instantiate(this.blockline);
        // this.blocklines[0] = this.blocknode;
        blocknode.getComponent(cc.Widget).left = left;

        blocknode.getComponent('BlockLine').initBlocks();
        this.node.addChild(blocknode);
    },
    onForceMove() {
        if (this.finish_move == 0) {
            this.finish_move = 1;
            this.unschedule(this.callback);
            this.schedule(this.callback, 8);
            this.moveBlock();
        }
    },
    checkGameOver() {
        for (var i = 0; i < this.node.children.length - 1; i++) {
            var childnode = this.node.children[i];
            if (childnode.getComponent(cc.Widget).left >= 1000) {
                Global.gameover = 1;
                this.unschedule(this.callback);
                this.over_dlg.active = true;
                this.over_dlg.getComponent("Over_dlg").setScore(Global.gamescore, storageManager.getHighestScore());
            }
        }
    },
    onCloseOver() {
        
        for (var i = this.node.children.length - 2; i >= 0; i--) {

            this.node.children[i].destroy();
        }
        this.onGameInit();
    },
    onRestartGame() {
        this.onCloseOver();
        this.over_dlg.active = false;
        this.level_dlg.active = false;
        this.mark.string = Global.gamelevelscore;
        
    },
    onBlockClicked(blocktop, lineleft) {
        if (this.digmoveflg == 0) {
            this.dig.x = 1065
            this.dig.y = 385;
            this.dig.setRotation(90);
            this.dig.active = true;
            this.dig.zIndex = 999999;
            this.digSpeed = cc.v2((this.mousePos.x - this.dig.x) / 10, (this.mousePos.y - this.dig.y) / 10);
            this.digmoveflg = 0;
            this.schedule(this.digmove, 0.01);
            this.selectedx = lineleft / 100;
            this.selectedy = 5 - blocktop / 0.166;
            // console.log(this.selectedx + ":" + this.selectedy);
        }
    },
    digmove() {
        this.digmoveflg++;
        this.dig.x += this.digSpeed.x;
        this.dig.y += this.digSpeed.y;
        this.dig.setRotation(Math.abs(this.dig.rotation) - 10);
        if (this.digmoveflg == 10) {
            cc.tween(this).to(0.5, { digmoveflg: 0 }).start();
            // this.digmoveflg = 0;
            this.unschedule(this.digmove);
            this.dig.setRotation(90);
            this.dig.active = false;
            this.getRemovable();
        }
    },
    getRemovable() {
        var column = [];
        console.log(this.node.children);
        for (var i = this.node.children.length - 2; i >= 0; i--) {
            if (i != this.node.children.length - 2 && !this.node.children[i].getComponent(cc.Widget).left <= this.node.children[i + 1].getComponent(cc.Widget).left + 100) {
                console.log("aasdf");
                for (var j = 0; j < parseInt((this.node.children[i].getComponent(cc.Widget).left - this.node.children[i + 1].getComponent(cc.Widget).left - 100) / 100); j++) {
                    column[column.length] = [];
                }
            }
            column[column.length] = this.node.children[i].getComponent('BlockLine').getBlockState();
        }
        var d_arr = this.computeDestroy(this.selectedx, this.selectedy, column);
        console.log(column);
        console.log("columns:");
        console.log(d_arr);
        var line_arr = [];
        for (var i = 0; i < d_arr.length; i++) {
            var t_cnt = 0;
            for (var j = 0; j <= d_arr[i].x; j++) {
                if (column[j].length == 0) {
                    t_cnt++;
                }
            }
            d_arr[i].x -= t_cnt;
        }

        for (var i = 0; i < d_arr.length; i++) {
            var line_flg = 0;
            for (var j = 0; j < line_arr.length; j++) {
                if (line_arr[j] == d_arr[i].x) {
                    line_flg++;
                }
            }
            if (line_flg == 0) {
                line_arr[line_arr.length] = d_arr[i].x;
            }
            this.node.children[this.node.children.length - 2 - d_arr[i].x].getComponent('BlockLine').setRemoveBlocks(d_arr[i].y);
        }
        if (d_arr.length == 1) {
            this.node.children[this.node.children.length - 2 - line_arr[0]].getComponent('BlockLine').startFogBlock();
            return;
        }
        var mark_arr = [];
        for (var i = 0; i < line_arr.length; i++) {
            var line_mar = this.node.children[this.node.children.length - 2 - line_arr[i]].getComponent("BlockLine").getLineMark();
            for (var j = 0; j < line_mar.length; j++) {
                mark_arr[mark_arr.length] = line_mar[j];
            }
        }
        console.log("mark_arr");
        console.log(mark_arr);
        this.showMark(mark_arr);
        for (var i = 0; i < line_arr.length; i++) {
            this.node.children[this.node.children.length - 2 - line_arr[i]].getComponent('BlockLine').startRemoveBlocks();
        }
    },
    showMark(mark_arr) {
        var total_mark = parseInt(this.mark.string);
        for (var i = 0; i < mark_arr.length; i++) {
            if (mark_arr[i].mark != 0) {
                var marknode = cc.instantiate(this.mark_pre);

                var ma = mark_arr[i].mark;
                if (mark_arr[i].type == 1) {
                    ma = mark_arr[i].mark * mark_arr.length;
                }
                if (mark_arr[i].multi == 1) {
                    ma = ma * 2;
                }

                marknode.getComponent('mark').setmark(ma);
                this.Scene_node.addChild(marknode);
                marknode.getComponent(cc.Widget).enabled = true;
                marknode.getComponent(cc.Widget).left = mark_arr[i].left;
                marknode.getComponent(cc.Widget).isAbsoluteTop = false;
                marknode.getComponent(cc.Widget).top = mark_arr[i].top / 0.166 * 0.116 + 0.1;
                console.log(marknode.getComponent(cc.Widget));
                marknode.getComponent('mark').movePos(this.mark_pos.position);
                total_mark += ma;
            }
        }
        this.mark_count = { count: 0 };
        this.mark_count.count = parseInt(this.mark.string);
        cc.tween(this.mark_count).delay(0.3).to(0.2, { count: total_mark }, { progress: (start, end, current, ratio) => this.updateMark(start, end, current, ratio) }).start();
        Global.gamescore = total_mark;
        if(storageManager.getHighestScore() < total_mark)
            storageManager.setHighestScore(total_mark);
    },
    updateMark(start, end, current, ratio) {
        var cu = parseInt(start + (end - start) * ratio);
        this.mark.string = cu.toString();
        return cu;
    },
    computeDestroy(x, y, columns) {

        var computed = [];
        var exists = function (x, y) {
            var column = columns[x];
            if (column == null) return false;
            var value = column[y];
            if (value == null) return false;
            return true;
        };
        var recCompute = function (x, y, numFilter) {
            if (!exists(x, y) || columns[x][y] != numFilter)
                return; // Brick not found or not the same color

            for (var i = 0; i < computed.length; ++i)
                if (computed[i].x == x && computed[i].y == y)
                    return; // already in computed list
            computed.push({ x: x, y: y });
            recCompute(x, y - 1, numFilter);
            recCompute(x, y + 1, numFilter);
            recCompute(x - 1, y, numFilter);
            recCompute(x + 1, y, numFilter);
        };

        recCompute(x, y, columns[x][y]);
        return computed;
    },
    checkFinish(){
        if(Global.gamesublevel == Global.gamelevel * 4 + 14) {
            this.unschedule(this.callback);
            this.complete_dlg.active = true;
            this.complete_dlg.getComponent(cc.Animation).play("layerout");
            return true;
        }
    },
    completedlg_over() {
        this.complete_dlg.getComponent(cc.Animation).play("layerin");
        var self = this;
        cc.tween(this.node).delay(0.4).call(()=>{self.level_dlg.active = true;}).start();
        
    },
    onLevelDlgover() {
        this.level_dlg.active = false;
        Global.gamelevelscore = Global.gamescore;
        this.mark.string = Global.gamescore;
        Global.gamelevel ++;
        this.onCloseOver();
    }

    // update (dt) {},
});
