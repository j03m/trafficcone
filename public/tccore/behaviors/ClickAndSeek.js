//            ga.addEventBehavior(ga.gameEvents.MouseDown, undefined, undefined, undefined, function (e) {
//                var spriteClick = ga.CheckEventPosition(e.offsetX, e.offsetY);
//                if (spriteClick != undefined) {
//                    if (this.lastClick != undefined) {
//                        this.lastClick.unHighLight();
//                    }
//                    this.lastClick = spriteClick;
//                    spriteClick.highLight(0, 0, 0, 0, 255, 0, 0, 0);
//                    var parentObj = this;
//                    setTimeout(function () {
//                        var seeker = new Seeker("walking", "attacking", 100);
//                        ga.addEventBehavior(ga.gameEvents.MouseDown, "", spriteClick, "walking", function (e, sprite, engine) {
//                            if (sprite == parentObj.lastClick) {
//                                seeker.execute(e, sprite, engine);
//                            }
//                        }, -1);
//                        seeker.setFoundCallback(function (sprite) {
//                            sprite.unHighLight();
//                            ga.removeEventBehavior(ga.gameEvents.MouseDown, sprite);
//                        });
//                    }, 100);
//                }

//            }, 1);