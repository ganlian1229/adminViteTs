function isEquipment() {
    if (
        navigator.userAgent.match(
            /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        )
    ) {
        /*移动*/
        return 'move';
    } else {
        /*PC*/
        return 'pc';
    }
}

function defaultEvent(e) {
    e.preventDefault();
}

let drag = {
    mounted(el, { value }) {
        let dragDom;
        let { type, callback } = value;
        let boundary = value?.boundary || false;
        if (typeof value === 'function') {
            dragDom = el;
            callback = value;
        } else if (value?.dom) {
            let dom = value.dom;
            if (dom) {
                let rawNameArr = dom.split('.');
                if (rawNameArr.length > 1) {
                    for (let i = 1; i < rawNameArr.length; i++) {
                        if (i == 1) {
                            dragDom = el.parentElement;
                        } else {
                            dragDom = dragDom.parentElement;
                        }
                    }
                } else {
                    dragDom = el;
                }
            } else {
                dragDom = el;
            }
        } else {
            dragDom = el;
        }

        dragDom.style.position = 'absolute';

        if (isEquipment() == 'pc') {
            el.onmousedown = function (ev) {
                let x = ev.clientX - dragDom.offsetLeft;
                let y = ev.clientY - dragDom.offsetTop;
                let endX, endY;

                if (type === 'start' || !type) {
                    callback &&
                        callback({
                            type: 'start',
                            location: { x, y }
                        });
                }

                document.onmousemove = function (ev) {
                    endX = ev.clientX - x;
                    endY = ev.clientY - y;
                    dragDom.style.left = endX + 'px';
                    dragDom.style.top = endY + 'px';

                    if (boundary) {
                        if (endX <= 0) {
                            dragDom.style.left = 0;
                        } else if (endX >= window.innerWidth - dragDom.offsetWidth) {
                            dragDom.style.left = window.innerWidth - dragDom.offsetWidth + 'px';
                        }
                        if (endY <= 0) {
                            dragDom.style.top = 0;
                        } else if (endY >= window.innerHeight - dragDom.offsetHeight) {
                            dragDom.style.top = window.innerHeight - dragDom.offsetHeight + 'px';
                        }
                    }

                    document.onmouseup = function () {
                        if (type === 'end' || !type) {
                            callback &&
                                callback({
                                    type: 'end',
                                    location: { x: endX, y: endY }
                                });
                        }
                        document.onmousemove = null;
                    };
                };

                return false;
            };
        } else {
            let lenX; //定义x轴相对手指点击位置距离盒子元素左边框距离
            let lenY; //定义y轴相对手指点击位置距离盒子元素上边框距离
            let maxW; //定义盒子在x轴上可移动的最大值
            let maxH; //定义盒子在y轴上可移动的最大值
            let endX, endY;
            dragDom.addEventListener('touchstart', function (e) {
                //按下去时
                maxW = e.srcElement.offsetParent.clientWidth - dragDom.offsetWidth;
                maxH = e.srcElement.offsetParent.clientHeight - dragDom.offsetHeight;
                let ev = e || window.event;
                let touch = (ev.targetTouches && ev.targetTouches[0]) || e;
                lenX = touch.clientX - dragDom.offsetLeft;
                lenY = touch.clientY - dragDom.offsetTop;
                if (type === 'start' || !type) {
                    callback &&
                        callback({
                            type: 'start',
                            location: {
                                x: lenX,
                                y: lenY
                            }
                        });
                }
                dragDom.addEventListener('touchmove', defaultEvent, false); //注释后 靠边弹性返回
            });
            dragDom.addEventListener('touchmove', function (e) {
                //拖动时
                let ev = e || window.event;
                let touch = ev.targetTouches[0] || e;
                endX = touch.clientX - lenX;
                endY = touch.clientY - lenY;

                if (boundary) {
                    if (endX < 0) {
                        endX = 0;
                    } else if (endX >= maxW) {
                        endX = maxW;
                    }
                    if (endY < 0) {
                        endY = 0;
                    } else if (endY >= maxH) {
                        endY = maxH;
                    }
                }

                dragDom.style.left = endX + 'px';
                dragDom.style.top = endY + 'px';
            });
            dragDom.addEventListener('touchend', function () {
                //松开时
                if (type === 'end' || !type) {
                    callback &&
                        callback({
                            type: 'end',
                            location: {
                                x: endX,
                                y: endY
                            }
                        });
                }
                document.removeEventListener('touchmove', defaultEvent);
            });
        }
    }
};
export default drag;
