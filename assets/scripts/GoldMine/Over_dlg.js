cc.Class({
    extends: cc.Component,

    properties: {
        gamescore: cc.Label,
        highscore: cc.Label
    },

    // use this for initialization
    onLoad: function () {

    },
    onHome: function() {
        cc.director.loadScene("Splash");
        this.node.active = false;
    },
    setScore(gamescore, highscore) {
        this.gamescore.string = "Score: " + gamescore;
        this.highscore.string = "Best: " + highscore;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
