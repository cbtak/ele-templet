var Drag = {
    createDrag : function (targetClass) {
        var draggingObj=null; //dragging Dialog
        var diffX=0;
        var diffY=0;

        function validateHandler(e){
            var target=e.target;
            if(!target || !target.className || target.className.indexOf(targetClass)==-1) {
                return null;
            } else {
                return target.offsetParent;
            }
            // while(target && target.className && target.className.indexOf(targetClass)==-1){
            //     target=target.offsetParent;
            // }
            // if(target!=null){
            //     return target.offsetParent;
            // }else{
            //     return null;
            // }
        }

        function mouseHandler(e){
            switch(e.type) {
                case 'mousedown':
                    draggingObj=validateHandler(e);//验证是否为可点击移动区域
                    if(draggingObj!=null){
                        diffX=e.clientX-draggingObj.offsetLeft;
                        diffY=e.clientY-draggingObj.offsetTop;
                    }
                    break;

                case 'mousemove':
                    if(draggingObj){
                        draggingObj.style.left=(e.clientX-diffX)+'px';
                        draggingObj.style.top=(e.clientY-diffY)+'px';
                    }
                    break;

                case 'mouseup':
                    draggingObj =null;
                    diffX=0;
                    diffY=0;
                    break;
            }
        };

        return {
            enable:function(){
                document.addEventListener('mousedown',mouseHandler);
                document.addEventListener('mousemove',mouseHandler);
                document.addEventListener('mouseup',mouseHandler);
            },
            disable:function(){
                document.removeEventListener('mousedown',mouseHandler);
                document.removeEventListener('mousemove',mouseHandler);
                document.removeEventListener('mouseup',mouseHandler);
            }
        }
    }
}