window.Drag = function (targetClass) {
    let dragTarget = null;

    function validateHandler(e) {
        var target = e.target;
        if (target && target.className && target.className.indexOf(targetClass) != -1) {
            return target.offsetParent;
        } else {
            return null;
        }
    }

    function mouseHandler(e) {
        switch (e.type) {
            case 'mousedown':
                dragTarget = validateHandler(e);//验证是否为可点击移动区域
                if (dragTarget) {
                    diffX = e.clientX - dragTarget.offsetLeft;
                    diffY = e.clientY - dragTarget.offsetTop;
                }
                break;

            case 'mousemove':
                if (dragTarget) {
                    dragTarget.style.left = (e.clientX - diffX) + 'px';
                    dragTarget.style.top = (e.clientY - diffY) + 'px';
                }
                break;

            case 'mouseup':
                dragTarget = null;
                diffX = 0;
                diffY = 0;
                break;
        }
    };

    return {
        enable: function () {
            document.addEventListener('mousedown', mouseHandler);
            document.addEventListener('mousemove', mouseHandler);
            document.addEventListener('mouseup', mouseHandler);
        },
        disable: function () {
            document.removeEventListener('mousedown', mouseHandler);
            document.removeEventListener('mousemove', mouseHandler);
            document.removeEventListener('mouseup', mouseHandler);
        }
    }
};