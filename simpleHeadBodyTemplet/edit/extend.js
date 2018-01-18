(function(){
    /**
     * 系统对象功能扩展
     */
    Date.prototype.Format = function (fmt) {
        if(fmt) {
            fmt = fmt.replace("H","h").replace("H","h");
        }
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    Date.prototype.dateAdd = function(interval,number) {
        //var cloneDate = JSON.parse(JSON.stringify({date : this}));
        //var d = new Date(cloneDate.date);
        var d = new Date(this);
        var k={'y':'FullYear', 'q':'Month', 'm':'Month', 'w':'Date', 'd':'Date', 'h':'Hours', 'n':'Minutes', 's':'Seconds', 'ms':'MilliSeconds'};
        var n={'q':3, 'w':7};
        eval('d.set'+k[interval]+'(d.get'+k[interval]+'()+'+((n[interval]||1)*number)+')');
        return d;
    };

    Date.prototype.dateDiff = function(interval,objDate2) {
        var d=this, i={}, t=d.getTime(), t2=objDate2.getTime();
        i['y']=objDate2.getFullYear()-d.getFullYear();
        i['q']=i['y']*4+Math.floor(objDate2.getMonth()/4)-Math.floor(d.getMonth()/4);
        i['m']=i['y']*12+objDate2.getMonth()-d.getMonth();
        i['ms']=objDate2.getTime()-d.getTime();
        i['w']=Math.floor((t2+345600000)/(604800000))-Math.floor((t+345600000)/(604800000));
        i['d']=Math.floor(t2/86400000)-Math.floor(t/86400000);
        i['h']=Math.floor(t2/3600000)-Math.floor(t/3600000);
        i['n']=Math.floor(t2/60000)-Math.floor(t/60000);
        i['s']=Math.floor(t2/1000)-Math.floor(t/1000);
        return i[interval];
    };

    /**
     * 取JSON对象的属性长度
     * @param json
     */
    JSON.propertyLength = function(json){
        var length = 0;
        for (key in json) {
            if(json.hasOwnProperty(key)) length++;
        }
        return length;
    }

    /**
     * 序列化JSON为表单提交时的数组格式
     * @param json
     */
    JSON.serializeArray = function(json) {
        var arr = [];
        var func = {};
        func.toArray = function(json, jsonArray, prefix){
            for(var key in json){
                var newKey = (prefix ? prefix + "." : "") + key;
                if(typeof json[key] == "object" && !(json[key] instanceof Array)) {
                    func.toArray(json[key], jsonArray, newKey);
                } else {
                    jsonArray[jsonArray.length] = {
                        name : newKey,
                        value : json[key]
                    };
                }
            }
        };
        func.toArray(json, arr);
        return arr;
    }

    /**
     * 扩展 Storage 增加setJSON方法
     * @param {Object} key
     * @param {Object} value
     */
    Storage.prototype.setJSON = function(key, value) {
        if(value) {
            this.setItem(key, JSON.stringify(value));
        }
    };
    /**
     * 扩展 Storage 增加getJSON方法
     * @param {Object} key
     */
    Storage.prototype.getJSON = function(key) {
        var value = this.getItem(key);
        if(value) {
            return JSON.parse(value);
        } else {
            return null;
        }
    };

    /**
     * 匹配函数（类似orcale 的 decode 函数）
     * 示例：var value = caseValue('1',['1','value1','2','value2','3','value3','default value'])
     * 注：caseKVArray 数组为奇数时，最后一个参数为默认值(未匹配时)
     * @param caseKey
     * @param caseKVArray
     * @returns {*}
     */
    window.caseValue = function(caseKey, caseKVArray){
        var result = null;
        if(caseKey != null && caseKey != undefined && caseKey != '' && caseKVArray && caseKVArray.length > 0) {
            var hasDefault = false;
            var defaultValue = null;
            var isCase = false;
            if(caseKVArray.length%2) {
                hasDefault = true;
                defaultValue = caseKVArray[caseKVArray.length-1];
            }
            var forCount = caseKVArray.length - (hasDefault ? 1 : 0);
            for(var i=0; i<forCount; i++) {
                if(!(i%2) && caseKVArray[i] == caseKey) {
                    result = caseKVArray[i+1];
                    isCase = true;
                    break;
                }
            }
            if(!isCase && hasDefault) {
                result = defaultValue;
            }
        } else {
            result = null;
        }
        return result;
    }

    /**
     * 对象拷贝
     * @param source
     * @returns {{}}
     */
    Object.copy = function(source) {
        var result = source instanceof Array ? [] : {};
        // 日期类型直接返回
        if(source instanceof Date) {
            return source;
        }
        for (var key in source) {
            result[key] = source[key] && typeof source[key]==='object' ? Object.copy(source[key]) : source[key];
        }
        return result;
    }

    /**
     * 清除两边的空格
     * @returns {string}
     */
    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, '');
    };


    /**
     * 数据工具对象
     * @type {{setAttribute: Window.Arrays.setAttribute, setAttributeToAttribute: Window.Arrays.setAttributeToAttribute, getAttributeValues: Window.Arrays.getAttributeValues}}
     */
    window.Arrays = {
        /** 设置数组所有项目指定属性值 */
        setAttribute : function(array, attribute, value, beginIndex, endIndex) {
            if(array) {
                if(isNull(beginIndex)) beginIndex = 0;
                if(isNull(endIndex)) endIndex = array.length;
                for(var i=0; i<array.length; i++) {
                    if(i >= beginIndex && i < endIndex) {
                        array[i][attribute] = value;
                    }
                }
            }
            return array;
        },
        /**  设置数组所有项目指定属性拷贝到指定属性 */
        setAttributeToAttribute : function(array, source, target) {
            if(array) {
                for(var i=0; i<array.length; i++) {
                    var sourceKeys = source.split(".");
                    var targetKeys = target.split(".");
                    var sourceNode = array[i];
                    var targetNode = array[i];
                    if(sourceKeys.length > 1) {
                        for(var ii=0; ii<sourceKeys.length - 1; ii++) {
                            if(sourceNode) {
                                sourceNode = sourceNode[sourceKeys[ii]];
                            }
                        }
                    }
                    if(targetKeys.length > 1) {
                        for(var ii=0; ii<targetKeys.length - 1; ii++) {
                            if(targetNode) {
                                targetNode = targetNode[targetKeys[ii]];
                            }
                        }
                    }
                    if(sourceNode && targetNode) {
                        targetNode[targetKeys[targetKeys.length-1]] = sourceNode[sourceKeys[sourceKeys.length-1]];
                    }
                }
            }
            return array;
        },
        /** 获取数组指定属性值集合 */
        getAttributeValues : function (array, attribute) {
            var tempValues = [];
            if(array) {
                for(var i=0; i<array.length; i++) {
                    tempValues[i] = array[i][attribute];
                }
            }
            return tempValues;
        }
    }

    window.isNull = function(val) {
        return val === null || val === "" || typeof val === "undefined" || (typeof val !== "object" && typeof val !== "function" && !val.length && isNaN(val)) || false;
    }

    window.isNotNull = function(val) {
        return !isNull(val);
    }

    window.buildTree = function (params) {
        if(!params.treeArray) {
            params.treeArray = [];
        }
        if(params.element == null) {
            params.elementArray.forEach(function (item, index, array) {
                if(item[params.parentKey] == params.rootParentValue) {
                    params.treeArray[params.treeArray.length] = item;
                } else {
                    buildTree({
                        element : item,
                        elementArray : params.elementArray,
                        treeArray : params.treeArray,
                        elementKey : params.elementKey,
                        parentKey : params.parentKey,
                        childKey : params.childKey,
                        rootParentValue : params.rootParentValue
                    });
                }
            });
        } else {
            params.elementArray.forEach(function (item, index, array) {
                if(params.element[params.parentKey] == item[params.elementKey]) {
                    item[params.childKey] = item[params.childKey] || [];
                    item[params.childKey][item[params.childKey].length] = params.element;
                    //params.element.parentElement = item;
                }
            });
        }
    }

    window.toThousands = function(num, n) {
        n = (n == 0 || n > 0) && n <= 20 ? n : 2;
        num = parseFloat((num + '').replace(/[^\d\.-]/g, '')) + '';
        var l = num.split('.') [0].split('').reverse(),
            r = num.split('.') [1];
        var t = '';
        for (var i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
        }
        if (!r) {
            r = '0';
        }
        if (r.length < n) {
            for (var i = r.length; i < n; i++) {
                r += '0';
            }
        } else {
            r=r.substr(0,n);
        }
        return t.split('').reverse().join('') + (n ? '.' : '') + r;
    }

})()














