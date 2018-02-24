window.$T = window.$t = (function ($w, $a) {
    /**
     * 预置方法模型
     */
    let methodModel = {
        /**
         * 设置界面组件大小事件处理
         * @param size
         */
        setSize: function (size) {
            // $app.viewModel.size = size;
            // $app.viewModel.head.size = size;
            // $app.viewModel.body.size = size;
            // $app.viewModel.footer.size = size;
            $app.setSizeAfter($app.viewModel);
        },

        /**
         * 设置界面组件大小事件后处理
         * @param viewModel
         */
        setSizeAfter: function (viewModel) {
            //viewModel.toolbar.class = viewModel.head.size ?  'toolbar-' + viewModel.head.size : 'toolbar';
        },
        /**
         * 获取属性值
         * @param $model
         * @param attr
         * @returns {*}
         */
        getValue : function ($model, attr) {
            if(!$model || isNull(attr)) {
                return null;
            }
            if(attr.indexOf(".") == -1) {
                return $model[attr];
            }
            let attrs = attr.split("."), tempNode = $model;
            for(var i = 0; i < attrs.length - 1; i++) {
                if(tempNode) {
                    tempNode = tempNode[attrs[i]];
                } else {
                    break;
                }
            }
            return isNotNull(tempNode) ? tempNode[attrs[attrs.length-1]] : null;
        },
        /**
         * 获取属性值（多个数据对象）
         * @param $array
         * @param attr
         * @returns {*}
         */
        getValues : function ($array, attr) {
            if(!$array) {
                return null;
            }
            let values = [];
            $array.forEach(function (item) {
                values.push($app.getValue(item, attr));
            });
            return values;
        },
        /**
         * 设置属性值
         * @param $model
         * @param attr
         * @param val
         */
        setValue : function ($model, attr, val) {
            if(!$model || isNull(attr)) {
                return;
            }
            if(attr.indexOf(".") == -1) {
                $model[attr] = val;
                return;
            }
            let attrs = attr.split("."), tempNode = $model;
            for(var i = 0; i < attrs.length - 1; i++) {
                // 上级属性为空时补全
                if(!tempNode[attrs[i]]) {
                    tempNode[attrs[i]] = {};
                }
                tempNode = tempNode[attrs[i]];
            }
            tempNode[attrs[attrs.length-1]] = val;
        },

        refShow : function (appData) {
            return $app.getValue(appData.$model,appData.data_key);
        },
        /**
         * 创建项目模型
         * @param itemModel 项目模型
         * @param itemType  项目类型：form: 表单项目、2 table: 表格项目  (暂未用属性)
         */
        createItemModel: function (itemModel, itemType) {
            /** 1. 构建通用属性 */
            let commonProperty = {
                key: isNotNull(itemModel.key) ? itemModel.key : null,							// 项目Key
                data_key: isNotNull(itemModel.data_key) ? itemModel.data_key : null,			// 数据Key（v-model绑定）
                label: isNotNull(itemModel.label) ? itemModel.label : itemModel.data_key,		// 项目标题（显示用）
                title: function (appData) {
                    if (isNotNull(itemModel.title)) {
                        return typeof itemModel.title == "function" ? itemModel.title(appData) : itemModel.title;
                    } else {
                        return appData.value;
                    }
                },																				// 项目提示（显示用）
                type: isNotNull(itemModel.type) ? itemModel.type : 'text',						// 控件类型(string)，为空默认 text
                item_type: isNotNull(itemType) ? itemType : null,			                    // 项目类型：form: 表单项目、2 table: 表格项目  (暂未用属性)
                sorting: isNotNull(itemModel.sorting) ? itemModel.sorting : 0,					// 项目序号(排序用)
                display: isNotNull(itemModel.display) ? itemModel.display : true,				// 显示属性
                show_label: isNotNull(itemModel.show_label) ? itemModel.show_label : true,		// 显示 label
                width: isNotNull(itemModel.width) ? itemModel.width : null,		                // 表单域宽度（控件宽度）
                label_width: isNotNull(itemModel.label_width) ? itemModel.label_width : null,	// 表单域标签的宽度
                class: isNotNull(itemModel.class) ? itemModel.class : '',						// 项目样式表 class
                style: isNotNull(itemModel.style) ? itemModel.style : '',						// 项目样式表
                getsets: itemModel.getsets || [],												// getset（编辑后根据此列表处理赋值）[{get : "name", set : "name", data_type : "date" }]
                value_separator: isNotNull(itemModel.value_separator) ? itemModel.value_separator : ",",		// 多选时值的分隔符 默认：","，默认只对data_value_key使用此分隔符设值
                data_value_key: isNotNull(itemModel.data_value_key) ? itemModel.data_value_key : null,			// 绑定数据对应设值字段（如有多选时，使用此字段设值，控件绑定字段一般为虚属性）,注：对时间范围、日期范围可传递数组值（如：data_value_key = [beginKey,endKey]），如需要将两个值合并，则默认传递字符串值的key即可（如：data_value_key = "daterange_values"）
                common_data_key: isNotNull(itemModel.common_data_key) ? itemModel.common_data_key : null,       // 公共数据集KEY，如传入此属性则从 commonDataModel 中取对应公共数据集
                sortable: isNotNull(itemModel.sortable) ? itemModel.sortable : false,           // 表格列启用排序
            }


            /** 2. 构建控件属性 */
            let controlProperty = {};
            if (["text", "number", "textarea", "date", "month", "week", "datetime", "datetime-local", "time", "email", "url", "range", "search", "color"].indexOf(itemModel.type) != -1 || isNull(itemModel.type)) {
                controlProperty = Object.assign(controlProperty, {
                    type: isNotNull(itemModel.type) ? itemModel.type : 'text',								// 类型	string	text / textarea	text
                    //value : isNotNull(itemModel.value) ? itemModel.value : null,							// 绑定值	string / number	—	—
                    maxlength: isNotNull(itemModel.maxlength) ? itemModel.maxlength : null,				// 最大输入长度	number	—	—
                    minlength: isNotNull(itemModel.minlength) ? itemModel.minlength : null,				// 	最小输入长度	number	—	—
                    placeholder: isNotNull(itemModel.placeholder) ? itemModel.placeholder : null,			// 输入框占位文本	string	—	—
                    clearable: isNotNull(itemModel.clearable) ? itemModel.clearable : true,				// 是否可清空	boolean	—	false
                    disabled: isNotNull(itemModel.disabled) ? itemModel.disabled : false,					// 禁用	boolean	—	false
                    size: isNotNull(itemModel.size) ? itemModel.size : null,								// 输入框尺寸，只在 type!="textarea" 时有效	string	medium / small / mini	—
                    prefix_icon: isNotNull(itemModel.prefix_icon) ? itemModel.prefix_icon : null,			// 输入框头部图标	string	—	—
                    suffix_icon: isNotNull(itemModel.suffix_icon) ? itemModel.suffix_icon : null,			// 输入框尾部图标	string	—	—
                    rows: isNotNull(itemModel.rows) ? itemModel.rows : 1,									// 输入框行数，只对 type="textarea" 有效	number	—	2
                    autosize: isNotNull(itemModel.autosize) ? itemModel.autosize : false,					// 自适应内容高度，只对 type="textarea" 有效，可传入对象，如，{ minRows: 2, maxRows: 6 }	boolean / object	—	false
                    auto_complete: isNotNull(itemModel.auto_complete) ? itemModel.auto_complete : "off",	// 原生属性，自动补全	string	on, off	off
                    name: isNotNull(itemModel.name) ? itemModel.name : itemModel.data_key,					// 原生属性	string	—	—
                    readonly: isNotNull(itemModel.readonly) ? itemModel.readonly : false,					// 原生属性，是否只读	boolean	—	false
                    max: isNotNull(itemModel.max) ? itemModel.max : null,									// 原生属性，设置最大值	—	—	—
                    min: isNotNull(itemModel.min) ? itemModel.min : null,									// 原生属性，设置最小值	—	—	—
                    step: isNotNull(itemModel.step) ? itemModel.step : null,								// 原生属性，设置输入字段的合法数字间隔	—	—	—
                    resize: isNotNull(itemModel.resize) ? itemModel.resize : null,							// 控制是否能被用户缩放	string	none, both, horizontal, vertical	—
                    autofocus: isNotNull(itemModel.autofocus) ? itemModel.autofocus : false,				// 原生属性，自动获取焦点	boolean	true, false	false
                    form: isNotNull(itemModel.form) ? itemModel.form : null,								// 原生属性	string	—	—
                    //label : isNotNull(itemModel.label) ? itemModel.label : null,							// 输入框关联的label文字	string	—	—
                    tabindex: isNotNull(itemModel.tabindex) ? itemModel.tabindex : null					// 输入框的tabindex	string	-	-
                });

            } else if (itemModel.type == "scaler") {
                controlProperty = Object.assign(controlProperty, {
                    //value : isNotNull(itemModel.value) ? itemModel.value : null,				// 绑定值	number	—	—
                    min: isNotNull(itemModel.min) ? itemModel.min : 0,							// 设置计数器允许的最小值	number	—	0
                    max: isNotNull(itemModel.max) ? itemModel.max : Infinity,					// 设置计数器允许的最大值	number	—	Infinity
                    step: isNotNull(itemModel.step) ? itemModel.step : 1,						// 计数器步长	number	—	1
                    size: isNotNull(itemModel.size) ? itemModel.size : null,					// 计数器尺寸	string	large, small	—
                    disabled: isNotNull(itemModel.disabled) ? itemModel.disabled : false,		// 是否禁用计数器	boolean	—	false
                    controls: isNotNull(itemModel.controls) ? itemModel.controls : true,		// 是否使用控制按钮	boolean	—	true
                    debounce: isNotNull(itemModel.debounce) ? itemModel.debounce : 300,		// 输入时的去抖延迟，毫秒	number	—	300
                    controls_position: isNotNull(itemModel.controls_position) ? itemModel.controls_position : null,	// 控制按钮位置	string	right	-
                    name: isNotNull(itemModel.name) ? itemModel.name : null,					// 原生属性	string	—	—
                    //label : isNotNull(itemModel.label) ? itemModel.label : null,				// 输入框关联的label文字	string	—	—
                });

            } else if (itemModel.type == "radio") {
                // 默认使用 Radio-group Attributes
                controlProperty = Object.assign(controlProperty, {
                    size: isNotNull(itemModel.size) ? itemModel.size : null,							// 单选框组尺寸，仅对按钮形式的 Radio 或带有边框的 Radio 有效	string	medium / small / mini	—
                    disabled: isNotNull(itemModel.disabled) ? itemModel.disabled : false,				// 是否禁用	boolean	—	false
                    text_color: isNotNull(itemModel.text_color) ? itemModel.text_color : "#ffffff",	// 按钮形式的 Radio 激活时的文本颜色	string	—
                    fill: isNotNull(itemModel.fill) ? itemModel.fill : "#409EFF",						// 按钮形式的 Radio 激活时的填充色和边框色	string	—

                    options: itemModel.options || [],
                    option_key: isNotNull(itemModel.option_key) ? itemModel.option_key : null,
                    option_label: isNotNull(itemModel.option_label) ? itemModel.option_label : null,
                    option_disabled_key: isNotNull(itemModel.option_disabled_key) ? itemModel.option_disabled_key : null,
                    option_hide_key: isNotNull(itemModel.option_hide_key) ? itemModel.option_hide_key : null,
                });

            } else if (itemModel.type == "checkbox") {
                // 默认使用 Checkbox-group Attributes
                controlProperty = Object.assign(controlProperty, {
                    size: isNotNull(itemModel.size) ? itemModel.size : null,							// 多选框组尺寸，仅对按钮形式的 Checkbox 或带有边框的 Checkbox 有效	string	medium / small / mini	—
                    disabled: isNotNull(itemModel.disabled) ? itemModel.disabled : false,				// 是否禁用	boolean	—	false
                    min: isNotNull(itemModel.min) ? itemModel.min : null,								// 可被勾选的 checkbox 的最小数量	number	—	—
                    max: isNotNull(itemModel.max) ? itemModel.max : Infinity,							// 可被勾选的 checkbox 的最大数量	number	—	—
                    text_color: isNotNull(itemModel.text_color) ? itemModel.text_color : "#ffffff",	// 按钮形式的 Checkbox  激活时的文本颜色	string	—
                    fill: isNotNull(itemModel.fill) ? itemModel.fill : "#409EFF",						// 按钮形式的 Checkbox  激活时的填充色和边框色	string	—

                    options: itemModel.options || [],
                    option_key: isNotNull(itemModel.option_key) ? itemModel.option_key : null,
                    option_label: isNotNull(itemModel.option_label) ? itemModel.option_label : null,
                    option_disabled_key: isNotNull(itemModel.option_disabled_key) ? itemModel.option_disabled_key : null,
                    option_hide_key: isNotNull(itemModel.option_hide_key) ? itemModel.option_hide_key : null
                });
            } else if (itemModel.type == "select") {
                controlProperty = Object.assign(controlProperty, {
                    multiple: isNotNull(itemModel.multiple) ? itemModel.multiple : false,					// 是否多选	boolean	—	false
                    disabled: isNotNull(itemModel.disabled) ? itemModel.disabled : false,					// 是否禁用	boolean	—	false
                    value_key: isNotNull(itemModel.value_key) ? itemModel.value_key : "value",				// 作为 value 唯一标识的键名，绑定值为对象类型时必填	string	—	value
                    size: isNotNull(itemModel.size) ? itemModel.size : null,								// 输入框尺寸	string	large/small/mini	—
                    clearable: isNotNull(itemModel.clearable) ? itemModel.clearable : true,				// 单选时是否可以清空选项	boolean	—	false
                    collapse_tags: isNotNull(itemModel.collapse_tags) ? itemModel.collapse_tags : false,	// 多选时是否将选中值按文字的形式展示	boolean	—	false
                    multiple_limit: isNotNull(itemModel.multiple_limit) ? itemModel.multiple_limit : 0,	// 多选时用户最多可以选择的项目数，为 0 则不限制	number	—	0
                    name: isNotNull(itemModel.name) ? itemModel.name : null, 								// select input 的 name 属性	string	—	—
                    placeholder: isNotNull(itemModel.placeholder) ? itemModel.placeholder : "请选择",		// 占位符	string	—	请选择
                    filterable: isNotNull(itemModel.filterable) ? itemModel.filterable : false,			// 是否可搜索	boolean	—	false
                    allow_create: isNotNull(itemModel.allow_create) ? itemModel.allow_create : false,		// 是否允许用户创建新条目，需配合 filterable 使用	boolean	—	false
                    filter_method: itemModel.filter_method || null,										// 自定义搜索方法	function	—	—
                    remote: isNotNull(itemModel.remote) ? itemModel.remote : false,						// 是否为远程搜索	boolean	—	false
                    remote_method: itemModel.remote_method || null,										// 远程搜索方法	function	—	—
                    loading: isNotNull(itemModel.loading) ? itemModel.loading : false,						// 是否正在从远程获取数据	boolean	—	false
                    loading_text: isNotNull(itemModel.loading_text) ? itemModel.loading_text : "加载中",	// 远程加载时显示的文字	string	—	加载中
                    no_match_text: isNotNull(itemModel.no_match_text) ? itemModel.no_match_text : "无匹配数据",	// 搜索条件无匹配时显示的文字	string	—	无匹配数据
                    no_data_text: isNotNull(itemModel.no_data_text) ? itemModel.no_data_text : "无数据",			// 选项为空时显示的文字	string	—	无数据
                    popper_class: isNotNull(itemModel.popper_class) ? itemModel.popper_class : null,				// Select 下拉框的类名	string	—	—
                    reserve_keyword: isNotNull(itemModel.reserve_keyword) ? itemModel.reserve_keyword : false,		// 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词	boolean	—	false
                    default_first_option: isNotNull(itemModel.default_first_option) ? itemModel.default_first_option : false,	// 在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用	boolean	-

                    options: itemModel.options || [],
                    option_key: isNotNull(itemModel.option_key) ? itemModel.option_key : null,
                    option_label: isNotNull(itemModel.option_label) ? itemModel.option_label : null,
                    option_disabled_key: isNotNull(itemModel.option_disabled_key) ? itemModel.option_disabled_key : null,
                    option_hide_key: isNotNull(itemModel.option_hide_key) ? itemModel.option_hide_key : null
                });
            } else if (itemModel.type == "cascader") {
                controlProperty = Object.assign(controlProperty, {
                    options: itemModel.options || [],																// 可选项数据源，键名可通过 props 属性配置	array	—	—
                    /** 配置选项，具体见下表    object    —    — */
                    props: itemModel.props || {
                        value: isNotNull(itemModel.option_key) ? itemModel.option_key : null,						// 指定选项的值为选项对象的某个属性值	string	—	—
                        label: isNotNull(itemModel.option_label) ? itemModel.option_label : null,					// 指定选项标签为选项对象的某个属性值	string	—	—
                        children: isNotNull(itemModel.option_children) ? itemModel.option_children : null,			// 指定选项的子选项为选项对象的某个属性值	string	—	—
                        disabled: isNotNull(itemModel.option_disabled_key) ? itemModel.option_disabled_key : null,	// 指定选项的禁用为选项对象的某个属性值	string	—	—
                    },
                    //value : itemModel.value || [],																// 选中项绑定值	array	—	—
                    separator: isNotNull(itemModel.separator) ? itemModel.separator : "/",							// 选项分隔符	string	—	斜杠'/'
                    popper_class: isNotNull(itemModel.popper_class) ? itemModel.popper_class : null,				// 自定义浮层类名	string	—	—
                    placeholder: isNotNull(itemModel.placeholder) ? itemModel.placeholder : "请选择",				// 输入框占位文本	string	—	请选择
                    disabled: isNotNull(itemModel.disabled) ? itemModel.disabled : false,							// 是否禁用	boolean	—	false
                    clearable: isNotNull(itemModel.clearable) ? itemModel.clearable : true,						// 是否支持清空选项	boolean	—	false
                    expand_trigger: isNotNull(itemModel.expand_trigger) ? itemModel.expand_trigger : "click",		// 次级菜单的展开方式	string	click / hover	click
                    show_all_levels: isNotNull(itemModel.show_all_levels) ? itemModel.show_all_levels : true,		// 输入框中是否显示选中值的完整路径	boolean	—	true
                    filterable: isNotNull(itemModel.filterable) ? itemModel.filterable : false,					// 是否可搜索选项	boolean	—	—
                    debounce: isNotNull(itemModel.debounce) ? itemModel.debounce : 300,							// 搜索关键词输入的去抖延迟，毫秒	number	—	300
                    change_on_select: isNotNull(itemModel.change_on_select) ? itemModel.change_on_select : false,	// 是否允许选择任意一级的选项	boolean	—	false
                    size: isNotNull(itemModel.size) ? itemModel.size : null,										// 尺寸	string	medium / small / mini	—
                    before_filter: isNotNull(itemModel.before_filter) ? itemModel.before_filter : function (val) {
                        },	// 筛选之前的钩子，参数为输入的值，若返回 false 或者返回 Promise 且被 reject，则停止筛选	function(value)	—	—
                });
            } else if (itemModel.type == "switch") {
                controlProperty = Object.assign(controlProperty, {
                    disabled: isNotNull(itemModel.disabled) ? itemModel.disabled : false,									// 是否禁用	boolean	—	false
                    switch_width: isNotNull(itemModel.switch_width) ? itemModel.switch_width : 40, 							// switch 的宽度（像素）（与项目的width字段冲突，此处更改为 switch_width）	number	—	40
                    active_icon_class: isNotNull(itemModel.active_icon_class) ? itemModel.active_icon_class : null, 		// switch 打开时所显示图标的类名，设置此项会忽略 active-text	string	—	—
                    inactive_icon_class: isNotNull(itemModel.inactive_icon_class) ? itemModel.inactive_icon_class : null, 	// switch 关闭时所显示图标的类名，设置此项会忽略 inactive-text	string	—	—
                    active_text: isNotNull(itemModel.active_text) ? itemModel.active_text : null, 							// switch 打开时的文字描述	string	—	—
                    inactive_text: isNotNull(itemModel.inactive_text) ? itemModel.inactive_text : null, 					// switch 关闭时的文字描述	string	—	—
                    active_value: isNotNull(itemModel.active_value) ? itemModel.active_value : true, 						// switch 打开时的值	boolean / string / number	—	true
                    inactive_value: isNotNull(itemModel.inactive_value) ? itemModel.inactive_value : false, 				// switch 关闭时的值	boolean / string / number	—	false
                    active_color: isNotNull(itemModel.active_color) ? itemModel.active_color : '#409EFF', 					// switch 打开时的背景色	string	—
                    inactive_color: isNotNull(itemModel.inactive_color) ? itemModel.inactive_color : '#C0CCDA', 			// switch 关闭时的背景色	string	—
                    name: isNotNull(itemModel.name) ? itemModel.name : null, 												// switch 对应的 name 属性	string	—	—
                });
            } else if (itemModel.type == "slider") {
                controlProperty = Object.assign(controlProperty, {
                    min: isNotNull(itemModel.min) ? itemModel.min : 0,														// 最小值	number	—	0
                    max: isNotNull(itemModel.max) ? itemModel.max : 100,													// 最大值	number	—	100
                    step: isNotNull(itemModel.step) ? itemModel.step : 1,													// 步长	number	—	1
                    disabled: isNotNull(itemModel.disabled) ? itemModel.disabled : false,									// 是否为只读	boolean	—	false
                    show_input: isNotNull(itemModel.show_input) ? itemModel.show_input : false,							// 是否显示输入框，仅在非范围选择时有效	boolean	—	false
                    show_input_controls: isNotNull(itemModel.show_input_controls) ? itemModel.show_input_controls : true,	// 在显示输入框的情况下，是否显示输入框的控制按钮	boolean	—	true
                    show_stops: isNotNull(itemModel.show_stops) ? itemModel.show_stops : false,							// 是否显示间断点	boolean	—	false
                    show_tooltip: isNotNull(itemModel.show_tooltip) ? itemModel.show_tooltip : true,						// 是否显示 tooltip	boolean	—	true
                    format_tooltip: isNotNull(itemModel.format_tooltip) ? itemModel.format_tooltip : null,					// 格式化 tooltip message	function(value)	—	—
                    range: isNotNull(itemModel.range) ? itemModel.range : false,											// 是否为范围选择	boolean	—	false
                    vertical: isNotNull(itemModel.vertical) ? itemModel.vertical : false,									// 是否竖向模式	boolean	—	false
                    height: isNotNull(itemModel.height) ? itemModel.height : null,											// Slider 高度，竖向模式时必填	string	—	—
                    //label : isNotNull(itemModel.label) ? itemModel.label : itemModel.data_key,							// 屏幕阅读器标签	string	—	—
                    debounce: isNotNull(itemModel.debounce) ? itemModel.debounce : 300										// 输入时的去抖延迟，毫秒，仅在show-input等于true时有效	number	—	300
                });
            } else if (itemModel.type == "rate") {
                controlProperty = Object.assign(controlProperty, {
                    max: isNotNull(itemModel.max) ? itemModel.max : 5, 											// 最大分值	number	—	5
                    disabled: isNotNull(itemModel.disabled) ? itemModel.disabled : false,							// 是否为只读	boolean	—	false
                    allow_half: isNotNull(itemModel.allow_half) ? itemModel.allow_half : false, 					// 是否允许半选	boolean	—	false
                    low_threshold: isNotNull(itemModel.low_threshold) ? itemModel.low_threshold : 2, 				// 低分和中等分数的界限值，值本身被划分在低分中	number	—	2
                    high_threshold: isNotNull(itemModel.high_threshold) ? itemModel.high_threshold : 4, 			// 高分和中等分数的界限值，值本身被划分在高分中	number	—	4
                    colors: itemModel.colors || ['#99A9BF', '#F7BA2A', '#FF9900'], 								// icon 的颜色数组，共有 3 个元素，为 3 个分段所对应的颜色	array	—	['#F7BA2A', '#F7BA2A', '#F7BA2A']
                    void_color: isNotNull(itemModel.void_color) ? itemModel.void_color : "#C6D1DE", 				// 未选中 icon 的颜色	string	—	#C6D1DE
                    disabled_void_color: isNotNull(itemModel.disabled_void_color) ? itemModel.disabled_void_color : "#EFF2F7",		// 只读时未选中 icon 的颜色	string	—	#EFF2F7
                    icon_classes: itemModel.icon_classes || ['el-icon-star-on', 'el-icon-star-on', 'el-icon-star-on'], 				// icon 的类名数组，共有 3 个元素，为 3 个分段所对应的类名	array	—	['el-icon-star-on', 'el-icon-star-on','el-icon-star-on']
                    void_icon_class: isNotNull(itemModel.void_icon_class) ? itemModel.void_icon_class : "el-icon-star-off", 		// 未选中 icon 的类名	string	—	el-icon-star-off
                    disabled_void_icon_class: isNotNull(itemModel.disabled_void_icon_class) ? itemModel.disabled_void_icon_class : "el-icon-star-on", 				// 只读时未选中 icon 的类名	string	—	el-icon-star-on
                    show_text: isNotNull(itemModel.show_text) ? itemModel.show_text : false, 										// 是否显示辅助文字，若为真，则会从 texts 数组中选取当前分数对应的文字内容	boolean	—	false
                    show_score: isNotNull(itemModel.show_score) ? itemModel.show_score : false, 									// 是否显示当前分数，show-score 和 show-text 不能同时为真	boolean	—	false
                    text_color: isNotNull(itemModel.text_color) ? itemModel.text_color : "#1F2D3D", 								// 辅助文字的颜色	string	—	#1F2D3D
                    texts: itemModel.texts || ['极差', '失望', '一般', '满意', '惊喜'], 											// 辅助文字数组	array	—	['极差', '失望', '一般', '满意', '惊喜']
                    score_template: isNotNull(itemModel.score_template) ? itemModel.score_template : "{value}", 					// 分数显示模板	string	—	{value}
                });
            } else if (["time-select", "time-picker"].indexOf(itemModel.type) != -1) {
                controlProperty = Object.assign(controlProperty, {
                    readonly: isNotNull(itemModel.readonly) ? itemModel.readonly : false, 								// 完全只读	boolean	—	false
                    disabled: isNotNull(itemModel.disabled) ? itemModel.disabled : false, 								// 禁用	boolean	—	false
                    editable: isNotNull(itemModel.editable) ? itemModel.editable : true, 								// 文本框可输入	boolean	—	true
                    clearable: isNotNull(itemModel.clearable) ? itemModel.clearable : true, 							// 是否显示清除按钮	boolean	—	true
                    size: isNotNull(itemModel.size) ? itemModel.size : null, 											// 输入框尺寸	string	medium / small / mini	—
                    placeholder: isNotNull(itemModel.placeholder) ? itemModel.placeholder : null, 						// 非范围选择时的占位内容	string	—	—
                    start_placeholder: isNotNull(itemModel.start_placeholder) ? itemModel.start_placeholder : null,	// 范围选择时开始日期的占位内容	string	—	—
                    end_placeholder: isNotNull(itemModel.end_placeholder) ? itemModel.end_placeholder : null, 			// 范围选择时开始日期的占位内容	string	—	—
                    is_range: isNotNull(itemModel.is_range) ? itemModel.is_range : false, 								// 是否为时间范围选择，仅对<el-time-picker>有效	boolean	—	false
                    arrow_control: isNotNull(itemModel.arrow_control) ? itemModel.arrow_control : false, 				// 是否使用箭头进行时间选择，仅对<el-time-picker>有效	boolean	—	false
                    value: isNotNull(itemModel.value) ? itemModel.value : null, 										// 绑定值	date(TimePicker) / string(TimeSelect)	—	—
                    align: isNotNull(itemModel.align) ? itemModel.align : "left", 										// 对齐方式	string	left / center / right	left
                    popper_class: isNotNull(itemModel.popper_class) ? itemModel.popper_class : null, 					// TimePicker 下拉框的类名	string	—	—
                    picker_options: itemModel.picker_options || {}, 													// 当前时间日期选择器特有的选项参考下表	object	—	{}
                    range_separator: isNotNull(itemModel.range_separator) ? itemModel.range_separator : "-", 			// 选择范围时的分隔符	string	-	'-'
                    value_format: isNotNull(itemModel.value_format) ? itemModel.value_format : "HH:mm:ss", 			// 可选，仅TimePicker时可用，绑定值的格式，同DatePicker	string	小时 HH，分 mm，秒 ss，AM/PM A	—
                    default_value: isNotNull(itemModel.default_value) ? itemModel.default_value : null, 				// 可选，选择器打开时默认显示的时间	Date(TimePicker) / string(TimeSelect)	可被new Date()解析(TimePicker) / 可选值(TimeSelect)	—
                    name: isNotNull(itemModel.name) ? itemModel.name : null, 											// 原生属性	string	—	—
                });
            } else if (itemModel.type == "date-picker") {
                let formats = {
                    date: "yyyy-MM-dd",
                    year: "yyyy年",
                    month: "M月",
                    week: "yyyy年第W周",
                    datetime: "yyyy-MM-dd HH:mm:ss",
                    datetimerange: "yyyy-MM-dd HH:mm:ss",
                    daterange: "yyyy-MM-dd"
                }
                let valueFormats = {
                    date: "yyyy-MM-dd",
                    year: "yyyy",
                    month: "MM",
                    //week : "yyyy-MM-dd",
                    datetime: "yyyy-MM-dd HH:mm:ss",
                    datetimerange: "yyyy-MM-dd HH:mm:ss",
                    daterange: "yyyy-MM-dd"
                }
                controlProperty = Object.assign(controlProperty, {
                    readonly: isNotNull(itemModel.readonly) ? itemModel.readonly : false, 									// 完全只读	boolean	—	false
                    disabled: isNotNull(itemModel.disabled) ? itemModel.disabled : false,									// 禁用	boolean	—	false
                    editable: isNotNull(itemModel.editable) ? itemModel.editable : true, 									// 文本框可输入	boolean	—	true
                    clearable: isNotNull(itemModel.clearable) ? itemModel.clearable : true, 								// 是否显示清除按钮	boolean	—	true
                    size: isNotNull(itemModel.size) ? itemModel.size : null, 												// 输入框尺寸	string	large, small, mini	—
                    placeholder: isNotNull(itemModel.placeholder) ? itemModel.placeholder : null, 							// 非范围选择时的占位内容	string	—	—
                    start_placeholder: isNotNull(itemModel.start_placeholder) ? itemModel.start_placeholder : null,		// 范围选择时开始日期的占位内容	string	—	—
                    end_placeholder: isNotNull(itemModel.end_placeholder) ? itemModel.end_placeholder : null,				// 范围选择时结束日期的占位内容	string	—	—
                    date_type: isNotNull(itemModel.date_type) ? itemModel.date_type : "date", 								// 显示类型（原类型为type）	string	year/month/date/week/ datetime/datetimerange/daterange	date
                    format: isNotNull(itemModel.format) ? itemModel.format :
                        formats[isNotNull(itemModel.date_type) ? itemModel.date_type : "date"],						// 显示在输入框中的格式	string	年 yyyy，月 MM，日 dd，小时 HH，分 mm，秒 ss，AM/PM A	yyyy-MM-dd
                    align: isNotNull(itemModel.align) ? itemModel.align : "left",			 								// 对齐方式	string	left, center, right	left
                    popper_class: isNotNull(itemModel.popper_class) ? itemModel.popper_class : null,						// DatePicker 下拉框的类名	string	—	—
                    picker_options: isNotNull(itemModel.picker_options) ? itemModel.picker_options : {},					// 当前时间日期选择器特有的选项参考下表	object	—	{}
                    range_separator: isNotNull(itemModel.range_separator) ? itemModel.range_separator : "-", 				// 选择范围时的分隔符	string	—	'-'
                    default_value: isNotNull(itemModel.default_value) ? itemModel.default_value : null, 					// 可选，选择器打开时默认显示的时间	Date	可被new Date()解析	—
                    value_format: isNotNull(itemModel.value_format) ? itemModel.value_format :
                        valueFormats[isNotNull(itemModel.date_type) ? itemModel.date_type : "date"],				// 可选，绑定值的格式。不指定则绑定值为 Date 对象	string	年 yyyy，月 MM，日 dd，小时 HH，分 mm，秒 ss，AM/PM A	—
                    name: isNotNull(itemModel.name) ? itemModel.name : null, 												// 原生属性	string	—	—
                    unlink_panels: isNotNull(itemModel.unlink_panels) ? itemModel.unlink_panels : false,					// 在范围选择器里取消两个日期面板之间的联动	boolean	—	false
                });
            } else if (itemModel.type == "color-picker") {
                controlProperty = Object.assign(controlProperty, {
                    disabled: isNotNull(itemModel.disabled) ? itemModel.disabled : null, 									// 是否禁用	boolean	—	false
                    size: isNotNull(itemModel.size) ? itemModel.size : null, 												// 尺寸	string	—	medium / small / mini
                    show_alpha: isNotNull(itemModel.show_alpha) ? itemModel.show_alpha : false, 							// 是否支持透明度选择	boolean	—	false
                    color_format: isNotNull(itemModel.color_format) ? itemModel.color_format : null, 						// 写入 v-model 的颜色的格式	string	hsl / hsv / hex / rgb	hex（show-alpha 为 false）/ rgb（show-alpha 为 true）
                    popper_class: isNotNull(itemModel.popper_class) ? itemModel.popper_class : null, 						// ColorPicker 下拉框的类名	string	—	—
                });
            } else if (itemModel.type == "ref") {
                controlProperty = Object.assign(controlProperty, {
                    multiple: isNotNull(itemModel.multiple) ? itemModel.multiple : false,					// 是否多选	boolean	—	false
                    type: isNotNull(itemModel.type) ? itemModel.type : 'text',								// 类型	string	text / textarea	text
                    value: isNotNull(itemModel.value) ? itemModel.value : null,							    // 绑定值	string / number	—	—
                    maxlength: isNotNull(itemModel.maxlength) ? itemModel.maxlength : null,				    // 最大输入长度	number	—	—
                    minlength: isNotNull(itemModel.minlength) ? itemModel.minlength : null,				    // 	最小输入长度	number	—	—
                    placeholder: isNotNull(itemModel.placeholder) ? itemModel.placeholder : null,			// 输入框占位文本	string	—	—
                    clearable: isNotNull(itemModel.clearable) ? itemModel.clearable : true,				    // 是否可清空	boolean	—	false
                    disabled: isNotNull(itemModel.disabled) ? itemModel.disabled : false,					// 禁用	boolean	—	false
                    size: isNotNull(itemModel.size) ? itemModel.size : null,								// 输入框尺寸，只在 type!="textarea" 时有效	string	medium / small / mini	—
                    prefix_icon: isNotNull(itemModel.prefix_icon) ? itemModel.prefix_icon : null,			// 输入框头部图标	string	—	—
                    suffix_icon: isNotNull(itemModel.suffix_icon) ? itemModel.suffix_icon : null,			// 输入框尾部图标	string	—	—
                    rows: isNotNull(itemModel.rows) ? itemModel.rows : 1,									// 输入框行数，只对 type="textarea" 有效	number	—	2
                    autosize: isNotNull(itemModel.autosize) ? itemModel.autosize : false,					// 自适应内容高度，只对 type="textarea" 有效，可传入对象，如，{ minRows: 2, maxRows: 6 }	boolean / object	—	false
                    auto_complete: isNotNull(itemModel.auto_complete) ? itemModel.auto_complete : "off",	// 原生属性，自动补全	string	on, off	off
                    name: isNotNull(itemModel.name) ? itemModel.name : itemModel.data_key,					// 原生属性	string	—	—
                    readonly: isNotNull(itemModel.readonly) ? itemModel.readonly : true,					// 原生属性，是否只读	boolean	—	false
                    max: isNotNull(itemModel.max) ? itemModel.max : null,									// 原生属性，设置最大值	—	—	—
                    min: isNotNull(itemModel.min) ? itemModel.min : null,									// 原生属性，设置最小值	—	—	—
                    step: isNotNull(itemModel.step) ? itemModel.step : null,								// 原生属性，设置输入字段的合法数字间隔	—	—	—
                    resize : isNotNull(itemModel.resize) ? itemModel.resize : null,							// 控制是否能被用户缩放	string	none, both, horizontal, vertical	—
                    autofocus : isNotNull(itemModel.autofocus) ? itemModel.autofocus : false,				// 原生属性，自动获取焦点	boolean	true, false	false
                    form: isNotNull(itemModel.form) ? itemModel.form : null,								// 原生属性	string	—	—
                    //label : isNotNull(itemModel.label) ? itemModel.label : null,							// 输入框关联的label文字	string	—	—
                    tabindex: isNotNull(itemModel.tabindex) ? itemModel.tabindex : null,					// 输入框的tabindex	string	-	-
                    refModel : itemModel.refModel || {}	// 参照对象
                });
                controlProperty.refModel.getsets = controlProperty.refModel.getsets || [];					// getset（编辑后根据此列表从选择的项目取相应属性处理赋值）
            }

            /**
             * 如传入 common_data_key，则从 commonDataModel 中取对应公共数据集
             */
            if(isNotNull(itemModel.common_data_key)) {
                if(itemModel.type == "ref") {
                    controlProperty.refModel.model = commonDataModel[itemModel.common_data_key] || [];
                } else {
                    controlProperty.options = commonDataModel[itemModel.common_data_key] || [];
                }
            }

            /** 3. 构建控件事件处理 */
            let controlEvents = {
                events: {
                    /** 值发生变化时触发 */
                    change: function (appData) {
                        if (itemModel.events && itemModel.events.change) {
                            itemModel.events.change(appData);
                            return;
                        }

                        console.log("## event[change]: {data_key:" + appData.data_key+",value:" +appData.value+ "}");

                        /** change：参照类型处理 */
                        if (["ref"].indexOf(appData.itemModel.type) != -1) {
                            // 参照的 change 事件 value 为空时即为点击清除内容操作，此时按参照的取值设值处理进行清空操作
                            if(isNull(appData.value)) {
                                /** 1. 参照赋值处理 */
                                if(isNotNull(appData.itemModel.data_value_key)) {
                                    appData.app.setValue(appData.$model, appData.itemModel.data_value_key, null);
                                }
                                /** 2. 参照的 getsets 处理 */
                                if(appData.itemModel.refModel.getsets && appData.itemModel.refModel.getsets.length) {
                                    appData.itemModel.refModel.getsets.forEach(function (item) {
                                        if(item.get && item.set) {
                                            appData.app.setValue(appData.$model, item.set, null);
                                        }
                                    });
                                }
                            }
                        }

                        /**
                         * 通用 getsets 处理
                         */
                        if(appData.itemModel.getsets && appData.itemModel.getsets.length) {
                            appData.itemModel.getsets.forEach(function (item) {
                                if(item.get && item.set) {
                                    $app.setValue(appData.$model, item.set, $app.getValue(appData.$model, item.get));
                                }
                            });
                        }
                    },

                    /** 编辑前触发(参照有效) */
                    beforeChange: function (appData) {
                        if (itemModel.events && itemModel.events.beforeChange) {
                            return itemModel.events.beforeChange(appData);
                        } else {
                            return true;
                        }
                    },
                    /** 编辑后触发(参照有效) */
                    afterChange: function (appData) {
                        if (itemModel.events && itemModel.events.afterChange) {
                            itemModel.events.afterChange(appData);
                        }
                    },
                    /** 项目过滤(参照有效) */
                    optionFilter: function (appData) {
                        if (itemModel.events && itemModel.events.optionFilter) {
                            return itemModel.events.optionFilter(appData);
                        } else {
                            return true;
                        }
                    }
                }
            }

            /** 失去焦点触发 */
            if (["text", "number", "textarea", "date", "month", "week", "datetime", "datetime-local", "time", "email", "url", "range", "search", "color", "scaler", "select", "time-select", "time-picker", "date-picker"].indexOf(itemModel.type) != -1 || isNull(itemModel.type)) {
                controlEvents.events.blur = function (appData) {
                    if (itemModel.events && itemModel.events.blur) {
                        itemModel.events.blur(appData);
                    }
                }
            }
            /** 获得焦点触发 */
            if (["text", "number", "textarea", "date", "month", "week", "datetime", "datetime-local", "time", "email", "url", "range", "search", "color", "scaler", "select", "time-select", "time-picker", "date-picker"].indexOf(itemModel.type) != -1 || isNull(itemModel.type)) {
                controlEvents.events.focus = function (appData) {
                    if (itemModel.events && itemModel.events.focus) {
                        itemModel.events.focus(appData);
                    }
                }
            }
            /** 下拉框出现/隐藏时触发 */
            if (["select"].indexOf(itemModel.type) != -1) {
                controlEvents.events.visibleChange = function (appData) {
                    if (itemModel.events && itemModel.events.visibleChange) {
                        itemModel.events.visibleChange(appData);
                    }
                }
            }
            /** 多选模式下移除tag时触发 */
            if (["select"].indexOf(itemModel.type) != -1) {
                controlEvents.events.removeTag = function (appData) {
                    if (itemModel.events && itemModel.events.removeTag) {
                        itemModel.events.removeTag(appData);
                    }
                }
            }
            /** 清空按钮时触发 */
            if (["select"].indexOf(itemModel.type) != -1) {
                controlEvents.events.clear = function (appData) {
                    if (itemModel.events && itemModel.events.clear) {
                        itemModel.events.clear(appData);
                    }
                }
            }
            /** 当父级选项变化时触发的事件 */
            if (["cascader"].indexOf(itemModel.type) != -1) {
                controlEvents.events.activeItemChange = function (appData) {
                    if (itemModel.events && itemModel.events.activeItemChange) {
                        itemModel.events.activeItemChange(appData);
                    }
                }
            }

            /** 面板中当前显示的颜色发生改变时触发的事件 */
            if (["color-picker"].indexOf(itemModel.type) != -1) {
                controlEvents.events.activechange = function (appData) {
                    if (itemModel.events && itemModel.events.activechange) {
                        itemModel.events.activechange(appData);
                    }
                }
            }

            /** 点击参照按钮时触发的事件 */
            if (["ref"].indexOf(itemModel.type) != -1) {
                controlEvents.events.showRefModel = function (appData) {
                    if (itemModel.events && itemModel.events.showRefModel) {
                        itemModel.events.showRefModel(appData);
                        return;
                    }
                    let value_key = appData.itemModel.data_value_key || appData.itemModel.data_key;
                    let value = appData.app.getValue(appData.$model, value_key);
                    $app.showRefModel({
                        source : appData.itemModel,
                        $model : appData.$model,
                        values : isNotNull(value) ? value.split(appData.itemModel.value_separator) : [],
                    });
                }
            }

            return Object.assign(commonProperty, controlProperty, controlEvents);
        },

        /**
         * 设置菜单事件处理（全局）
         * @param command   菜单项目命令
         */
        handleSettings: function (command) {
            if (command == "VIEW_SETING") {
                $app.viewModel.viewSetings.visible = true;
            }
        },
        /**
         * 折叠菜单项内容设置菜单事件处理
         * @param command   菜单项目命令
         */
        handleCollapseItemSettings : function (command) {

        },
        /**
         * 重置界面视图设置
         */
        handleResetViewSetings: function () {
            $app.viewModel.toolbar.display = $app.viewModel.viewSetings.historySetings.toolbar_display;
            $app.viewModel.head.display = $app.viewModel.viewSetings.historySetings.head_display;
            $app.viewModel.body.display = $app.viewModel.viewSetings.historySetings.body_display;
            $app.viewModel.footer.display = $app.viewModel.viewSetings.historySetings.footer_display;
            $app.viewModel.size = $app.viewModel.viewSetings.historySetings.size;
            $app.viewModel.head.size = $app.viewModel.viewSetings.historySetings.head_size;
            $app.viewModel.body.size = $app.viewModel.viewSetings.historySetings.body_size;
            $app.viewModel.footer.size = $app.viewModel.viewSetings.historySetings.footer_size;
        },
        /**
         * 显示参照
         * @param appData   参照数据模型参数
         */
        showRefModel : function (appData) {
            if (appData.source.refModel.type == "table") {
                $app.viewModel.refModels.tableRefModel.show();
                $app.viewModel.refModels.tableRefModel.initRefModel(appData);
            }
        },

        /**
         * 服务请求处理
         * @param appData   请求参数及回调
         */
        request: function (appData) {
            if (!appData.url) {
                throw "url is null.";
            }
            if (appData.type && appData.type.toLowerCase() === "post") {
                $a.post(
                    appData.url,
                    appData.data,
                    {
                        headers: appData.headers || {}
                    }
                ).then(function (response) {
                    if (appData.success) appData.success(response);
                }).catch(function (err) {
                    if (appData.success) appData.success(err);
                });
            } else {
                $a.get(
                    appData.url,
                    {
                        params: appData.data || {}
                    }
                ).then(function (response) {
                    if (appData.success) appData.success(response);
                }).catch(function (err) {
                    if (appData.success) appData.success(err);
                });
            }
        }
    };

    /**
     * 视图模型
     * @type {{display: boolean, size: string, form_auto_width: boolean, form_item_width: number, form_item_label_width: number, table_column_width: null, table_column_min_width: null, table_column_max_width: null, viewSetings: {visible: boolean, title: string, sizeButtons: [*], historySetings: {}}, refModels: {tableRefModel: {title: string, visible: boolean, width: number, show_close: boolean, close_on_click_modal: boolean, class: null, search_key: string, enabled_refresh: boolean, enabled_search: boolean, auto_search: boolean, search_clearable: boolean, keyword: null, search_placeholder: string, loading: boolean, element_loading_text: string, refTable: {height: number, max_height: number, highlight_current_row: boolean, show_selection: boolean, show_index: boolean, multiple: boolean, multiple_limit: number, show_overflow_tooltip: boolean, columnModel: [*], pagination: {enabled: boolean, page: {total: number, pageNo: number, pageSize: number}, page_sizes: [*], layout: string}}, refDataModel: Array, selectionModel: Array, show_ref_selection: boolean, selection_width: number, selection_colspan: number, initRefModel: initRefModel, show: show, hide: hide, events: {confirm: confirm, clear: clear, close: close, search: search, keywordChange: keywordChange, refresh: refresh, showRefSelection: showRefSelection, handleSizeChange: handleSizeChange, handleCurrentChange: handleCurrentChange, setShowRefData: setShowRefData, rowClick: rowClick, rowDblclick: rowDblclick, select: select, selectAll: selectAll, cancelSelect: cancelSelect}}, treeRefModel: {}, treeTableRefModel: {}}, collapseModel: {accordion: boolean, value: null, spreadall: boolean, events: {change: change}, items: Array}, toolbar: {size: null, display: boolean, class: string}}}
     */
    let viewModel = {
        display: true,					// 界面是否显示
        size: 'mini',					// 默认组件尺寸

        form_auto_width: false,		    // 表单域自动宽度(默认false)
        form_item_width: 160,			// 表单域默认宽度(控件)
        form_item_label_width: 80,		// 表单域标签默认宽度

        table_column_width: null,		// 表格列项目默认宽度（未启用）
        table_column_min_width: null,	// 表格列项目默认最小宽度（未启用）
        table_column_max_width: null,   // 表格列项目默认最大宽度（未启用）
        table_editable_mode : 1,        // 表格编辑模式：1：单行编辑(单行呈现编辑样式，默认方式，节省视图开销)、2：多行编辑（所有行都呈现为编辑样式，不推荐）

        /**
         * 界面设置模型
         */
        viewSetings: {
            visible: false,             // 是否显示界面设置窗口
            title: "界面设置",           // 界面设置窗口标题
            /**
             * 界面控件尺寸设置按钮集合
             */
            sizeButtons: [
                {
                    type: "danger", size: null, text: "偏大", click: function () {
                        $app.setSize(null);
                    }
                },
                {
                    type: "primary", size: "medium", text: "正常", click: function () {
                        $app.setSize("medium");
                    }
                },
                {
                    type: "success", size: "small", text: "偏小", click: function () {
                        $app.setSize("small");
                    }
                },
                {
                    type: "warning", size: "mini", text: "迷你", click: function () {
                        $app.setSize("mini");
                    }
                }
            ],
            /**
             * 历史(默认)界面控件尺寸设置
             */
            historySetings: {}
        },

        /**
         * 工具条模型
         */
        toolbar: {
            size: null,
            display: true,
            class: "toolbar-mini" // toolbar-mini、toolbar-small、toolbar-medium
        },

        /**
         * 折叠面板模型
         */
        collapseModel : {
            accordion : false,      // 是否手风琴模式	boolean	—	false
            value : null,           // 当前激活的面板(如果是手风琴模式，绑定值类型需要为string，否则为array)	string/array	—	—
            spreadall : true,       // 展开所有项（自定义属性）
            events : {
                /**
                 * 当前激活面板改变时触发(如果是手风琴模式，参数 activeNames 类型为string，否则为array)
                 * @param activeNames (activeNames: array|string)
                 */
                change : function (activeNames) {

                }
            },
            items : []              // 折叠面板项目集合
        },

        /**
         * 参照模型
         */
        refModels: {
            tableRefModel: {
                title: "参照",                          // 参照窗口标题
                visible: false,						    // 参照窗口显示属性
                width: 560,							    // 参照窗口宽度
                show_close: true,						// 显示关闭按钮
                close_on_click_modal: false,			// 点击模态层关闭参照
                class: null,							// 参照的自定义样式表
                search_key: "",						    // 搜索属性key(筛选的字段，为空时为所有属性)
                enabled_refresh: false,					// 启用刷新
                enabled_search: true,					// 启用搜索状态
                auto_search: true,						// 自动搜索
                search_clearable: true,				    // 搜索框是否启用清除
                keyword: null,
                search_placeholder: "请输入关键字",	    // 搜索框占位符

                loading: false,						    // 加载状态
                element_loading_text: "正在加载中...",	// 加载提示文本



                // 表格参照配置
                refTable: {
                    height: 300,						// 表格高度
                    // width : 460,						// 表格宽度
                    max_height: 300,					// 表格最大高度
                    highlight_current_row: true,		// 高亮当前行
                    show_selection: true,				// 显示选择列
                    show_index: true,					// 显示索引列（行号）
                    multiple: true,					    // 是否多选
                    multiple_limit: 0,					// 最大可选择行（暂未启用）
                    show_overflow_tooltip: true,		// 单元格内容溢出tips

                    // 参照表格列模型
                    columnModel: [],

                    // 分页控件
                    pagination: {
                        enabled: false,		// 启用分页
                        page: {
                            total: 0,		// 总记录数
                            pageNo: 1,		// 当前页码
                            pageSize: 20	// 每页显示条数
                        },
                        page_sizes: [20, 30, 50, 100],		// 每页显示个数选择器的选项设置
                        layout: "total, sizes, prev, pager, next"	// 组件布局，子组件名用逗号分隔 total, sizes, prev, pager, next, jumper
                    }
                },
                // 参照数据模型
                refDataModel: [],
                // 参照已选择数据模型
                selectionModel: [],
                show_ref_selection: true,
                selection_width: 300,
                selection_colspan: 10,

                ref_key : "id",

                $model : null,
                source : null,
                getsets : [],

                /** 参照初始化 */
                initRefModel : function (appData) {
                    $app.viewModel.refModels.tableRefModel.refDataModel = appData.source.refModel.model || [];
                    $app.viewModel.refModels.tableRefModel.refTable.columnModel = appData.source.refModel.columns || [];
                    $app.viewModel.refModels.tableRefModel.$model = appData.$model;
                    $app.viewModel.refModels.tableRefModel.source = appData.source;
                    $app.viewModel.refModels.tableRefModel.refTable.multiple = appData.source.refModel.multiple;
                    $app.viewModel.refModels.tableRefModel.show_ref_selection = isNotNull(appData.source.refModel.show_ref_selection) ? appData.source.refModel.show_ref_selection : appData.source.refModel.multiple;
                    $app.viewModel.refModels.tableRefModel.ref_key = isNotNull(appData.source.refModel.ref_key) ? appData.source.refModel.ref_key : "id";

                    /** 默认值处理 */
                    if(appData.values && appData.values.length) {
                        $app.viewModel.refModels.tableRefModel.selectionModel = $app.viewModel.refModels.tableRefModel.refDataModel.filter(function (item) {
                            return appData.values.indexOf(item[$app.viewModel.refModels.tableRefModel.ref_key]) != -1;
                        });
                    } else {
                        $app.viewModel.refModels.tableRefModel.selectionModel = [];
                    }

                    /** 分页属性设置 */
                    $app.viewModel.refModels.tableRefModel.refTable.pagination.enabled = appData.source.refModel.pagination && isNotNull(appData.source.refModel.pagination.enabled) ? appData.source.refModel.pagination.enabled : false;
                    $app.viewModel.refModels.tableRefModel.refTable.pagination.page_sizes = appData.source.refModel.pagination && appData.source.refModel.pagination.page_sizes ? appData.source.refModel.pagination.page_sizes : [20, 30, 50, 100];
                    $app.viewModel.refModels.tableRefModel.refTable.pagination.layout = appData.source.refModel.pagination && isNotNull(appData.source.refModel.pagination.layout) ? appData.source.refModel.pagination.layout : "total, sizes, prev, pager, next";
                    // 指定 total、pageNo 暂无意义
                    //$app.viewModel.refModels.tableRefModel.refTable.pagination.page.total = appData.source.refModel.pagination && appData.source.refModel.pagination.page && isNotNull(appData.source.refModel.pagination.page.total) ? appData.source.refModel.pagination.page.total : 0;
                    //$app.viewModel.refModels.tableRefModel.refTable.pagination.page.pageNo = appData.source.refModel.pagination && appData.source.refModel.pagination.page && isNotNull(appData.source.refModel.pagination.page.pageNo) ? appData.source.refModel.pagination.page.pageNo : 1;
                    $app.viewModel.refModels.tableRefModel.refTable.pagination.page.pageSize = appData.source.refModel.pagination && appData.source.refModel.pagination.page && isNotNull(appData.source.refModel.pagination.page.pageSize) ? appData.source.refModel.pagination.page.pageSize : 20;

                    /** 启用分页时处理 */
                    if (viewModel.refModels.tableRefModel.refTable.pagination.enabled) {
                        $app.viewModel.refModels.tableRefModel.refTable.pagination.page.total = $app.viewModel.refModels.tableRefModel.refDataModel.length;
                        $app.viewModel.refModels.tableRefModel.refTable.pagination.page.pageNo = 1;
                    }

                    if($app.$refs.refTable) {
                        $app.$refs.refTable.clearSelection();
                    }
                    $app.viewModel.refModels.tableRefModel.events.setShowRefData();
                },
                /**
                 * 表型参照：显示
                 * @param appData
                 */
                show: function (appData) {
                    $app.viewModel.refModels.tableRefModel.visible = true;
                },
                /**
                 * 表型参照：隐藏
                 * @param appData
                 */
                hide: function (appData) {
                    $app.viewModel.refModels.tableRefModel.visible = false;
                    // 显示参照窗口直接更新columnModel集合时，列宽会记录前一次窗口的设置，此处进行清空，以避免此种情况
                    $app.viewModel.refModels.tableRefModel.refTable.columnModel = [];
                },

                /**
                 * 表型参照：事件集合
                 */
                events: {
                    /**
                     * 表型参照：确认按钮事件处理
                     */
                    confirm: function () {
                        try {
                            let tableRefModel = $app.viewModel.refModels.tableRefModel;
                            let source = tableRefModel.source;

                            /** 1. 参照赋值处理 */
                            let values = $app.getValues(tableRefModel.selectionModel, tableRefModel.ref_key);
                            let value_key = source.data_value_key || source.data_key;
                            $app.setValue(tableRefModel.$model, value_key, values.join(source.value_separator));

                            /** 2. 参照的getsets 处理 */
                            if(source.refModel.getsets && source.refModel.getsets.length) {
                                source.refModel.getsets.forEach(function (item) {
                                    if(item.get && item.set) {
                                        let tempValues = $app.getValues(tableRefModel.selectionModel, item.get);
                                        $app.setValue(tableRefModel.$model, item.set, tempValues.join(source.value_separator));
                                    }
                                });
                            }

                            /** 3. 通用 getsets 处理 */
                            if(source.getsets && source.getsets.length) {
                                source.getsets.forEach(function (item) {
                                    if(item.get && item.set) {
                                        let tempValue = $app.getValue(tableRefModel.$model, item.get);
                                        $app.setValue(tableRefModel.$model, item.set, tempValue);
                                    }
                                });
                            }

                            /** 4. 隐藏参照窗口 */
                            $app.viewModel.refModels.tableRefModel.hide();
                        } catch (err) {
                            // 异常消息
                        }
                    },
                    /**
                     * 表型参照：清空按钮事件处理
                     */
                    clear: function () {
                        // 清空参照表格选择行
                        $app.$refs.refTable.clearSelection();
                        // 清空参照已选择数据模型
                        $app.viewModel.refModels.tableRefModel.selectionModel = [];
                    },
                    /**
                     * 表型参照：关闭按钮事件处理
                     */
                    close: function () {
                        $app.viewModel.refModels.tableRefModel.hide();
                    },
                    /**
                     * 表型参照：搜索事件处理
                     */
                    search: function () {
                        let keyword = $app.viewModel.refModels.tableRefModel.keyword;
                        let search_key = $app.viewModel.refModels.tableRefModel.search_key;
                        let filterResult = isNull(keyword) ? $app.viewModel.refModels.tableRefModel.refDataModel : $app.viewModel.refModels.tableRefModel.refDataModel.filter(function (item) {
                                if (isNotNull(search_key)) {
                                    return isNotNull(item[search_key]) && String(item[search_key]).indexOf(keyword) != -1;
                                } else {
                                    let isEquals = false;
                                    $app.viewModel.refModels.tableRefModel.refTable.columnModel.forEach(function (column) {
                                        if (isNotNull(item[column.data_key]) && String(item[column.data_key]).indexOf(keyword) != -1) {
                                            isEquals = true;
                                        }
                                    });
                                    return isEquals;
                                }
                            });

                        if (viewModel.refModels.tableRefModel.refTable.pagination.enabled) {
                            $app.viewModel.refModels.tableRefModel.refTable.pagination.page.total = filterResult.length;
                            $app.viewModel.refModels.tableRefModel.refTable.pagination.page.pageNo = 1;

                            var startIndex = ($app.viewModel.refModels.tableRefModel.refTable.pagination.page.pageNo - 1) * $app.viewModel.refModels.tableRefModel.refTable.pagination.page.pageSize;
                            var endIndex = startIndex + $app.viewModel.refModels.tableRefModel.refTable.pagination.page.pageSize;
                            $app.viewModel.refModels.tableRefModel.refTable.data = filterResult.slice(startIndex, endIndex);

                            // 设置表格数据时无法同步设置选中状态，此处作延迟处理
                            setTimeout(function () {
                                $app.viewModel.refModels.tableRefModel.refTable.data.forEach(function (item) {
                                    if ($app.viewModel.refModels.tableRefModel.selectionModel.indexOf(item) != -1) {
                                        $app.$refs.refTable.toggleRowSelection(item);
                                    }
                                });
                            }, 100);
                        } else {
                            $app.viewModel.refModels.tableRefModel.refTable.data = filterResult;
                        }
                    },
                    /**
                     * 表型参照：关键字输入框值变更事件处理
                     */
                    keywordChange: function () {
                        console.log("## keyword: " + $app.viewModel.refModels.tableRefModel.keyword);
                        if (!$app.viewModel.refModels.tableRefModel.auto_search) {
                            return;
                        }
                        $app.viewModel.refModels.tableRefModel.events.search();
                    },
                    /**
                     * 表型参照：刷新事件处理
                     */
                    refresh: function () {
                        $app.viewModel.refModels.tableRefModel.loading = true;
                        setTimeout(function () {
                            $app.viewModel.refModels.tableRefModel.loading = false;
                        }, 5000);
                    },
                    /**
                     * 表型参照：显示已选择的参照数据列表事件处理
                     */
                    showRefSelection: function () {
                        $app.viewModel.refModels.tableRefModel.show_ref_selection = !$app.viewModel.refModels.tableRefModel.show_ref_selection;
                        //$app.viewModel.refModels.tableRefModel.width += $app.viewModel.refModels.tableRefModel.selection_width * (!$app.viewModel.refModels.tableRefModel.show_ref_selection ? -1 : 1);
                    },
                    /**
                     * 表型参照：隐藏已选择的参照数据列表事件处理
                     */
                    handleSizeChange: function (val) {
                        $app.viewModel.refModels.tableRefModel.refTable.pagination.page.pageSize = val;
                        if ($app.viewModel.refModels.tableRefModel.refTable.pagination.page.total) {
                            $app.viewModel.refModels.tableRefModel.events.setShowRefData();
                        }
                    },
                    /**
                     * 表型参照：分页时页码变更事件处理
                     * @param val
                     */
                    handleCurrentChange: function (val) {
                        $app.viewModel.refModels.tableRefModel.refTable.pagination.page.pageNo = val;
                        $app.viewModel.refModels.tableRefModel.events.setShowRefData();
                    },
                    /**
                     * 表型参照：参照窗口数据显示处理
                     * @param val
                     */
                    setShowRefData: function () {
                        if (viewModel.refModels.tableRefModel.refTable.pagination.enabled) {
                            var startIndex = ($app.viewModel.refModels.tableRefModel.refTable.pagination.page.pageNo - 1) * $app.viewModel.refModels.tableRefModel.refTable.pagination.page.pageSize;
                            var endIndex = startIndex + $app.viewModel.refModels.tableRefModel.refTable.pagination.page.pageSize;
                            $app.viewModel.refModels.tableRefModel.refTable.data = $app.viewModel.refModels.tableRefModel.refDataModel.slice(startIndex, endIndex);
                        } else {
                            $app.viewModel.refModels.tableRefModel.refTable.data = $app.viewModel.refModels.tableRefModel.refDataModel;
                        }
                        // 设置表格数据时无法同步设置选中状态，此处作延迟处理
                        setTimeout(function () {
                            $app.viewModel.refModels.tableRefModel.refTable.data.forEach(function (item) {
                                if ($app.viewModel.refModels.tableRefModel.selectionModel.indexOf(item) != -1) {
                                    $app.$refs.refTable.toggleRowSelection(item);
                                }
                            });
                        }, 100);
                    },
                    /**
                     * 表型参照：数据表格行点击事件处理
                     * @param row
                     * @param event
                     * @param column
                     */
                    rowClick: function (row, event, column) {
                    },
                    /**
                     * 表型参照：数据表格行双击事件处理
                     * @param row
                     * @param event
                     * @param column
                     */
                    rowDblclick: function (row, event) {
                        // 选择/取消选择当前行
                        $app.$refs.refTable.toggleRowSelection(row);
                        // 调用选择事件处理
                        $app.viewModel.refModels.tableRefModel.events.select($app.$refs.refTable.selection, row);
                        if (!$app.viewModel.refModels.tableRefModel.refTable.multiple && $app.viewModel.refModels.tableRefModel.selectionModel.length) {
                            $app.viewModel.refModels.tableRefModel.events.confirm();
                        }
                    },
                    /**
                     * 表型参照：数据表格行选择事件处理
                     * @param selection
                     * @param row
                     */
                    select: function (selection, row) {
                        if ($app.viewModel.refModels.tableRefModel.refTable.multiple) {
                            // 多选处理
                            if ($app.$refs.refTable.selection.indexOf(row) != -1) {
                                if ($app.viewModel.refModels.tableRefModel.selectionModel.indexOf(row) == -1) {
                                    $app.viewModel.refModels.tableRefModel.selectionModel.push(row);
                                }
                            } else {
                                $app.viewModel.refModels.tableRefModel.selectionModel.forEach(function (item, index, rows) {
                                    if (item == row) {
                                        $app.viewModel.refModels.tableRefModel.selectionModel.splice(index, 1);
                                    }
                                });
                            }
                        } else {
                            // 单选处理
                            if ($app.$refs.refTable.selection.indexOf(row) != -1) {
                                $app.$refs.refTable.clearSelection();
                                $app.$refs.refTable.toggleRowSelection(row);
                                $app.viewModel.refModels.tableRefModel.selectionModel = [row];
                            } else {
                                $app.$refs.refTable.clearSelection();
                                $app.viewModel.refModels.tableRefModel.selectionModel = [];
                            }
                        }
                    },
                    /**
                     * 表型参照：数据表格行选择全部事件处理
                     * @param selection
                     */
                    selectAll: function (selection) {
                        if (selection.length) {
                            selection.forEach(function (row) {
                                if ($app.viewModel.refModels.tableRefModel.selectionModel.indexOf(row) == -1) {
                                    $app.viewModel.refModels.tableRefModel.selectionModel.push(row);
                                }
                            });
                        } else if ($app.$refs.refTable.data.length && $app.viewModel.refModels.tableRefModel.selectionModel.length) {
                            $app.viewModel.refModels.tableRefModel.selectionModel = $app.viewModel.refModels.tableRefModel.selectionModel.filter(function (item) {
                                return $app.$refs.refTable.data.indexOf(item) == -1;
                            });
                        }
                    },
                    /**
                     * 表型参照：数据表格取消选择行事件处理
                     * @param row
                     */
                    cancelSelect: function (row) {
                        if ($app.$refs.refTable.selection.indexOf(row) != -1) {
                            $app.$refs.refTable.toggleRowSelection(row);
                        }

                        $app.viewModel.refModels.tableRefModel.selectionModel.forEach(function (item, index, rows) {
                            if (item == row) {
                                $app.viewModel.refModels.tableRefModel.selectionModel.splice(index, 1);
                            }
                        });
                    }
                }
            },
            treeRefModel: {},
            treeTableRefModel: {}
        }
    };

    /**
     * 数据模型
     * @type {{}}
     */
    let dataModel = {};

    /**
     * 公共数据模型
     * @type {{KEY: [*]}}   KEY数据集取值标识，[*] 对应值数据集为数组类型
     */
    let commonDataModel = {
        YES_NO : [{label : "是", value : true}, {label : "否",value : false}]
    };

    /**
     * 扩展模型对象（提供用户自行扩展，数据存储或绑定视图）
     * @type {{}}
     */
    let extendModel = {};

    return {
        /**
         * 创建及初始化模板对象
         * @param params    构建参数
         * @returns {{data: data, methods: ({setSize: setSize, setSizeAfter: setSizeAfter, createItemModel: createItemModel, handleSettings: handleSettings, handleCollapseItemSettings: handleCollapseItemSettings, handleResetViewSetings: handleResetViewSetings, showRefModel: showRefModel, request: request}|{}), beforeCreate: beforeCreate, created: created, beforeMount: beforeMount, mounted: mounted, beforeUpdate: beforeUpdate, updated: updated, beforeDestroy: beforeDestroy, destroyed: destroyed}}
         */
        createTemplet: function (params) {

            /********************************** 1. 参数对象空属性处理 begin ********************************/
            params = params || {};
            params.dataModel = params.dataModel || {};
            params.commonDataModel = params.commonDataModel || {};
            params.viewModel = params.viewModel || {};
            params.viewModel.toolbar = params.viewModel.toolbar || {};
            params.viewModel.collapseModel = params.viewModel.collapseModel || {};
            params.viewModel.collapseModel.items = params.viewModel.collapseModel.items || [];
            /********************************** 参数对象空属性处理 end ********************************/



            /********************************** 2. 数据模型处理 begin ********************************/
            /**
             * 数据模型（默认接收外部传入）
             */
           dataModel = params.dataModel;
            /**
             * 公共数据模型（默认接收外部传入进行合并）
             */
            commonDataModel = Object.assign(commonDataModel, params.commonDataModel);
            /**
             * 扩展模型对象（提供用户自行扩展，数据存储或绑定视图）
             * @type {*}
             */
            extendModel = params.extendModel || {};
            /********************************** 数据模型处理 end ********************************/



            /********************************** 3. 界面模型公共配置 begin ********************************/
            viewModel.display = isNotNull(params.viewModel.display) ? params.viewModel.display : viewModel.display;				// 界面是否显示
            viewModel.size = isNotNull(params.viewModel.size) ? params.viewModel.size : viewModel.size;							// 界面组件尺寸设置
            viewModel.toolbar.size = isNotNull(params.viewModel.toolbar.size) ? params.viewModel.toolbar.size : viewModel.size; // 工具条组件尺寸设置(没有时取 viewModel.size)
            /********************************** 界面模型公共配置 end ********************************/



            /********************************** 4. 工具条配置 begin ********************************/
            viewModel.toolbar.size = isNotNull(params.viewModel.toolbar.size) ? params.viewModel.toolbar.size : viewModel.size; // 工具条组件尺寸设置(没有时取 viewModel.size)
            /********************************** 工具条配置 end ********************************/



            /********************************** 5. 折叠面板模型属性配置 begin ********************************/
            viewModel.collapseModel.accordion = isNotNull(params.viewModel.collapseModel.accordion) ? params.viewModel.collapseModel.accordion : viewModel.collapseModel.accordion;     // 是否手风琴模式
            viewModel.collapseModel.spreadall = viewModel.collapseModel.accordion ? false : isNotNull(params.viewModel.collapseModel.spreadall) ? params.viewModel.collapseModel.spreadall : viewModel.collapseModel.spreadall;     // 展开所有项（自定义属性）
            viewModel.collapseModel.value = viewModel.collapseModel.spreadall ? [] : (isNotNull(params.viewModel.collapseModel.value) ? params.viewModel.collapseModel.value : viewModel.collapseModel.value);
            /********************************** 折叠面板模型属性配置 begin ********************************/



            /********************************** 6. 折叠面板项目内容（Form/Table）模型构建 begin ********************************/
            params.viewModel.collapseModel.items.forEach(function (collapseItemModel) {
                /**
                 * 类型：（table\TABLE, form\FORM）统一转换为小写，后续以小写方式判断
                 */
                collapseItemModel.type = collapseItemModel.type ? collapseItemModel.type.toLowerCase() : null;
                /**
                 * 展开所有时将所有折叠面板项目的name设置到value集合中
                 */
                if(viewModel.collapseModel.spreadall) {
                    viewModel.collapseModel.value.push(collapseItemModel.name);
                }

                /**
                 * 构建折叠面板项目模型
                 * @type {{key: null, data_model_key: null, $model: (*), type: null, title: null, name: *, size: string, display: boolean}}
                 */
                var newCollapseItemModel = {
                    key: isNotNull(collapseItemModel.key) ? collapseItemModel.key : null,				                                          // KEY 作为ref对象引用 (自定义)
                    data_model_key: isNotNull(collapseItemModel.data_model_key) ? collapseItemModel.data_model_key : null,                        // 数据模型绑定KEY
                    $model : isNotNull(collapseItemModel.data_model_key) ? dataModel[collapseItemModel.data_model_key] : dataModel, // 关联数据模型
                    type: isNotNull(collapseItemModel.type) ? collapseItemModel.type : null,                                                      // 类型（呈现为表格/表单）
                    title : isNotNull(collapseItemModel.title) ? collapseItemModel.title : null,                                                  // 显示标题
                    name : isNotNull(collapseItemModel.name) ? collapseItemModel.name : collapseItemModel.key,                                    // 作为 collapse-item 的 name
                    size: isNotNull(collapseItemModel.size) ? collapseItemModel.size : viewModel.size,                                            // 组件显示尺寸（为空时取viewModel.size）
                    display: isNotNull(collapseItemModel.display) ? collapseItemModel.display : true                                              // 是否显示
                }

                /**
                 * 按类型处理: 构建折叠面板项目内容（Form）模型
                 */
                if(collapseItemModel.type == "form") {
                    collapseItemModel.formModel = collapseItemModel.formModel || {};
                    collapseItemModel.formModel.items = collapseItemModel.formModel.items || [];
                    newCollapseItemModel = Object.assign(newCollapseItemModel, {
                        formModel : {
                            items : [],
                            //items: collapseItemModel.formModel.items || [],					                                                                // 表单域/表格列模型集合 (自定义)
                            width: isNotNull(collapseItemModel.formModel.width) ? collapseItemModel.formModel.width : null,				                        // 表单宽度 (自定义，暂未用)
                            item_width: isNotNull(collapseItemModel.formModel.item_width) ? collapseItemModel.formModel.item_width : viewModel.form_item_width, // 表单域默认宽度-控件(自定义)
                            show_label: isNotNull(collapseItemModel.formModel.show_label) ? collapseItemModel.formModel.show_label : true,			            // 是否显示表单域标签文本 (自定义)
                            /** 表单属性 */
                            model: newCollapseItemModel.$model,				                                                                    // 表单数据对象	object	—	—
                            rules: collapseItemModel.formModel.rules || {},				                                                        // 表单验证规则	object	—	—
                            inline: isNotNull(collapseItemModel.formModel.inline) ? collapseItemModel.formModel.inline : true,				        // 行内表单模式	boolean	—	false
                            label_position: isNotNull(collapseItemModel.formModel.label_position) ? collapseItemModel.formModel.label_position : "right",	                    // 表单域标签的位置	string	right/left/top	right
                            label_width: isNotNull(collapseItemModel.formModel.label_width) ? collapseItemModel.formModel.label_width : viewModel.form_item_label_width,      // 表单域标签的宽度，作为 Form 直接子元素的 form-item 会继承该值	string	—	—
                            label_suffix: isNotNull(collapseItemModel.formModel.label_suffix) ? collapseItemModel.formModel.label_suffix : "",			    // 表单域标签的后缀	string	—	—
                            show_message: isNotNull(collapseItemModel.formModel.show_message) ? collapseItemModel.formModel.show_message : true,		        // 是否显示校验错误信息	boolean	—	true
                            inline_message: isNotNull(collapseItemModel.formModel.inline_message) ? collapseItemModel.formModel.inline_message : true,		// 是否以行内形式展示校验信息	boolean	—	false
                            status_icon: isNotNull(collapseItemModel.formModel.status_icon) ? collapseItemModel.formModel.inline_message : false,		        // 是否在输入框中显示校验结果反馈图标	boolean	—	false
                            size: isNotNull(collapseItemModel.formModel.size) ? collapseItemModel.formModel.size : viewModel.size,				            // (暂不用，使用footer.size)用于控制该表单内组件的尺寸	string	medium / small / mini	-
                        }
                    });

                    /** 表单域项目模型构建 */
                    collapseItemModel.formModel.items.forEach(function (item, index, array) {
                        item.size = isNotNull(item.size) ? item.size : newCollapseItemModel.size;
                        item.show_label = isNotNull(item.show_label) ? item.show_label : newCollapseItemModel.show_label;
                        item.width = isNotNull(item.width) ? item.width : newCollapseItemModel.formModel.item_width;
                        item.label_width = isNotNull(item.label_width) ? item.label_width : newCollapseItemModel.formModel.label_width;
                        newCollapseItemModel.formModel.items.push(methodModel.createItemModel(item, newCollapseItemModel.type));
                    });
                }

                /**
                 * 按类型处理: 构建折叠面板项目内容（Table）模型
                 */
                else if(collapseItemModel.type == "table") {
                    collapseItemModel.tableModel = collapseItemModel.tableModel || {};
                    collapseItemModel.tableModel.items = collapseItemModel.tableModel.items || [];
                    newCollapseItemModel = Object.assign(newCollapseItemModel, {
                        tableModel: {
                            items : [],
                            //items: collapseItemModel.tableModel.items || [],					                                                                        // 表单域/表格列模型集合 (自定义)
                            width: isNotNull(collapseItemModel.tableModel.width) ? collapseItemModel.tableModel.width : null,				                            // 表格宽度 (自定义，暂未用)
                            item_width: isNotNull(collapseItemModel.tableModel.item_width) ? collapseItemModel.tableModel.item_width : null,                            // 表格列默认宽度(自定义)
                            /** 表格属性 */
                            data : collapseItemModel.tableModel.data || [],					                                                        // 显示的数据	array	—	—
                            height : isNotNull(collapseItemModel.tableModel.height) ? collapseItemModel.tableModel.height : null,					// Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则 Table 的高度受控于外部样式。	string/number	—	—
                            max_height : isNotNull(collapseItemModel.tableModel.max_height) ? collapseItemModel.tableModel.max_height : null,       // Table 的最大高度	string/number	—	—
                            stripe : isNotNull(collapseItemModel.tableModel.stripe) ? collapseItemModel.tableModel.stripe : false,				    // 是否为斑马纹 table	boolean	—	false
                            border : isNotNull(collapseItemModel.tableModel.border) ? collapseItemModel.tableModel.border : true,					// 是否带有纵向边框	boolean	—	false
                            size : isNotNull(collapseItemModel.tableModel.size) ? collapseItemModel.tableModel.size : "mini",					    // Table 的尺寸	string	medium / small / mini	—
                            fit : isNotNull(collapseItemModel.tableModel.fit) ? collapseItemModel.tableModel.fit : true,						    // 列的宽度是否自撑开	boolean	—	true
                            show_header : isNotNull(collapseItemModel.tableModel.show_header) ? collapseItemModel.tableModel.show_header : true,				                        // 是否显示表头	boolean	—	true
                            highlight_current_row : isNotNull(collapseItemModel.tableModel.highlight_current_row) ? collapseItemModel.tableModel.highlight_current_row : true,	        // 是否要高亮当前行	boolean	—	false
                            current_row_key : isNotNull(collapseItemModel.tableModel.current_row_key) ? collapseItemModel.tableModel.current_row_key : null,			                // 当前行的 key，只写属性	String,Number	—	—
                            row_class_name : isNotNull(collapseItemModel.tableModel.row_class_name) ? collapseItemModel.tableModel.row_class_name : null,			                    // 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。	Function({row, rowIndex})/String	—	—
                            row_style : isNotNull(collapseItemModel.tableModel.row_style) ? collapseItemModel.tableModel.row_style : null,				                                // 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。	Function({row, rowIndex})/Object	—	—
                            cell_class_name : isNotNull(collapseItemModel.tableModel.cell_class_name) ? collapseItemModel.tableModel.cell_class_name : null,			                // 单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。	Function({row, column, rowIndex, columnIndex})/String	—	—
                            cell_style : isNotNull(collapseItemModel.tableModel.cell_style) ? collapseItemModel.tableModel.cell_style : null,				                            // 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。	Function({row, column, rowIndex, columnIndex})/Object	—	—
                            header_row_class_name : isNotNull(collapseItemModel.tableModel.header_row_class_name) ? collapseItemModel.tableModel.header_row_class_name : null,	        // 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。	Function({row, rowIndex})/String	—	—
                            header_row_style : isNotNull(collapseItemModel.tableModel.header_row_style) ? collapseItemModel.tableModel.header_row_style : null,		                    // 表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style。	Function({row, rowIndex})/Object	—	—
                            header_cell_class_name : isNotNull(collapseItemModel.tableModel.header_cell_class_name) ? collapseItemModel.tableModel.header_cell_class_name : null,	    // 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。	Function({row, column, rowIndex, columnIndex})/String	—	—
                            header_cell_style : isNotNull(collapseItemModel.tableModel.header_cell_style) ? collapseItemModel.tableModel.header_cell_style : null,		    // 表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。	Function({row, rowIndex, rowIndex, columnIndex})/Object	—	—
                            row_key : isNotNull(collapseItemModel.tableModel.row_key) ? collapseItemModel.tableModel.row_key : null,					                    // 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能的情况下，该属性是必填的。类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。	Function(row)/String	—	—
                            empty_text : isNotNull(collapseItemModel.tableModel.row_key) ? collapseItemModel.tableModel.row_key : "暂无数据",		                        // 空数据时显示的文本内容，也可以通过 slot="empty" 设置	String	—	暂无数据
                            default_expand_all : isNotNull(collapseItemModel.tableModel.default_expand_all) ? collapseItemModel.tableModel.default_expand_all : false,      // 是否默认展开所有行，当 Table 中存在 type="expand" 的 Column 的时候有效	Boolean	—	false
                            expand_row_keys : isNotNull(collapseItemModel.tableModel.expand_row_keys) ? collapseItemModel.tableModel.expand_row_keys : null,		        // 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。	Array	—
                            default_sort: collapseItemModel.tableModel.default_sort || {},			                                                                        // 默认的排序列的prop和顺序。它的prop属性指定默认的排序的列，order指定默认排序的顺序	Object	order: ascending, descending	如果只指定了prop, 没有指定order, 则默认顺序是ascending
                            tooltip_effect : isNotNull(collapseItemModel.tableModel.tooltip_effect) ? collapseItemModel.tableModel.tooltip_effect : null,			        // tooltip effect 属性	String	dark/light
                            show_summary : isNotNull(collapseItemModel.tableModel.show_summary) ? collapseItemModel.tableModel.show_summary : null,			                // 是否在表尾显示合计行	Boolean	—	false
                            sum_text : isNotNull(collapseItemModel.tableModel.sum_text) ? collapseItemModel.tableModel.sum_text : "合计",				                    // 合计行第一列的文本	String	—	合计
                            summary_method : collapseItemModel.tableModel.summary_method || null,			                                                                // 自定义的合计计算方法	Function({ columns, data })	—	—
                            span_method : collapseItemModel.tableModel.span_method || null,				                                                                    // 合并行或列的计算方法	Function({ row, column, rowIndex, columnIndex })	—
                            show_selection : isNotNull(collapseItemModel.tableModel.show_selection) ? collapseItemModel.tableModel.show_selection : true,                   // 显示选择列
                            show_index : isNotNull(collapseItemModel.tableModel.show_index) ? collapseItemModel.tableModel.show_index : true,				                // 显示索引列

                            events: {
                                /**
                                 * 当用户手动勾选数据行的 Checkbox 时触发的事件
                                 */
                                select: function (selection, row) {
                                },
                                /**
                                 * 当用户手动勾选全选 Checkbox 时触发的事件
                                 */
                                selectAll: function (selection) {
                                },
                                /**
                                 * 当选择项发生变化时会触发该事件
                                 */
                                selectionChange: function (selection) {
                                },
                                /**
                                 * 当单元格 hover 进入时会触发该事件
                                 */
                                cellMouseEnter: function (row, column, cell, event) {
                                },
                                /**
                                 * 当单元格 hover 退出时会触发该事件
                                 */
                                cellMouseLeave: function (row, column, cell, event) {
                                },
                                /**
                                 * 当某个单元格被点击时会触发该事件
                                 */
                                cellClick: function (row, column, cell, event) {
                                },
                                /**
                                 * 当某个单元格被双击击时会触发该事件
                                 */
                                cellDblclick: function (row, column, cell, event) {
                                },
                                /**
                                 * 当某一行被点击时会触发该事件
                                 */
                                rowClick: function (row, event, column) {
                                },
                                /**
                                 * 当某一行被鼠标右键点击时会触发该事件
                                 */
                                rowContextmenu: function (row, event) {
                                },
                                /**
                                 * 当某一行被双击时会触发该事件
                                 */
                                rowDblclick: function (row, event) {
                                },
                                /**
                                 * 当某一列的表头被点击时会触发该事件
                                 */
                                headerClick: function (column, event) {
                                },
                                /**
                                 * 当表格的排序条件发生变化的时候会触发该事件
                                 */
                                sortChange: function (appData) {
                                },
                                /**
                                 * 当表格的筛选条件发生变化的时候会触发该事件，参数的值是一个对象，对象的 key 是 column 的 columnKey，对应的 value 为用户选择的筛选条件的数组。
                                 */
                                filterChange: function (filters) {
                                },
                                /**
                                 * 当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性
                                 */
                                currentChange: function (currentRow, oldCurrentRow) {
                                },
                                /**
                                 * 当拖动表头改变了列的宽度的时候会触发该事件
                                 */
                                headerDragend: function (newWidth, oldWidth, column, event) {
                                },
                                /**
                                 * 当用户对某一行展开或者关闭的时候会触发该事件
                                 */
                                expandChange: function (row, expandedRows) {
                                },
                            }
                        }
                    });

                    /** 表格列项目模型构建 */
                    collapseItemModel.tableModel.items.forEach(function (item, index, array) {
                        item.size = isNotNull(item.size) ? item.size : newCollapseItemModel.size;
                        item.width = isNotNull(item.width) ? item.width : newCollapseItemModel.tableModel.item_width;
                        newCollapseItemModel.tableModel.items.push(methodModel.createItemModel(item, newCollapseItemModel.type));
                    });
                }

                /**
                 * 将构建的折叠面板项目内容（Form/Table）模型添加到折叠面板项目集合中
                 */
                viewModel.collapseModel.items.push(newCollapseItemModel);
            });
            /********************************** 折叠面板项目内容（Form/Table）模型构建 end ********************************/

            methodModel.setSizeAfter(viewModel);


            // 界面默认设置备份
            // viewModel.viewSetings.historySetings.toolbar_display = viewModel.toolbar.display;
            // viewModel.viewSetings.historySetings.head_display = viewModel.head.display;
            // viewModel.viewSetings.historySetings.body_display = viewModel.body.display;
            // viewModel.viewSetings.historySetings.footer_display = viewModel.footer.display;
            // viewModel.viewSetings.historySetings.size = viewModel.size;
            // viewModel.viewSetings.historySetings.head_size = viewModel.head.size;
            // viewModel.viewSetings.historySetings.body_size = viewModel.body.size;
            // viewModel.viewSetings.historySetings.footer_size = viewModel.footer.size;

            return {
                /**
                 * 数据对象
                 * @returns {{viewModel: {display: boolean, size: string, form_auto_width: boolean, form_item_width: number, form_item_label_width: number, table_column_width: null, table_column_min_width: null, table_column_max_width: null, viewSetings: {visible: boolean, title: string, sizeButtons: *[], historySetings: {}}, refModels: {tableRefModel: {title: string, visible: boolean, width: number, show_close: boolean, close_on_click_modal: boolean, class: null, search_key: string, enabled_refresh: boolean, enabled_search: boolean, auto_search: boolean, search_clearable: boolean, keyword: null, search_placeholder: string, loading: boolean, element_loading_text: string, refTable: {height: number, max_height: number, highlight_current_row: boolean, show_selection: boolean, show_index: boolean, multiple: boolean, multiple_limit: number, show_overflow_tooltip: boolean, columnModel: *[], pagination: {enabled: boolean, page: {total: number, pageNo: number, pageSize: number}, page_sizes: *[], layout: string}}, refDataModel: Array, selectionModel: Array, show_ref_selection: boolean, selection_width: number, selection_colspan: number, initRefModel: initRefModel, show: show, hide: hide, events: {confirm: confirm, clear: clear, close: close, search: search, keywordChange: keywordChange, refresh: refresh, showRefSelection: showRefSelection, handleSizeChange: handleSizeChange, handleCurrentChange: handleCurrentChange, setShowRefData: setShowRefData, rowClick: rowClick, rowDblclick: rowDblclick, select: select, selectAll: selectAll, cancelSelect: cancelSelect}}, treeRefModel: {}, treeTableRefModel: {}}, collapseModel: {accordion: boolean, value: null, spreadall: boolean, events: {change: change}, items: Array}, toolbar: {size: null, display: boolean, class: string}}, userExtendModel: {}, data: {rawDataModel: (*|{}|{body: Array}), dataModel: (*|{}|{body: Array}), dataModelMate: {head: {}, body: {}}}, serviceURL: {}, userMethods: {}, vueEvents: {}}}
                 */
                data: function () {
                    return {
                        /** 界面模型 */
                        viewModel: viewModel,
                        /** 用户自定义扩展模型 */
                        extendModel: extendModel,
                        data: {
                            /** 数据模型 */
                            dataModel: dataModel,
                            /** 原始数据模型 */
                            rawDataModel: Object.copy(dataModel),
                            /** 数据模型映射 */
                            dataModelMate: params.dataModelMate || {head: {}, body: {}},
                            /** 公共数据模型 */
                            commonDataModel : commonDataModel
                        },
                        /** 服务URL地址 */
                        serviceURL: params.serviceURL || {},
                        /** 用户定义方法，例如事件拦截 */
                        userMethods: params.userMethods || {},
                        /** vue events */
                        vueEvents: params.vueEvents || {}
                    }
                },

                /**
                 * 事件模型绑定
                 */
                methods: methodModel || {},


                beforeCreate: function () {
                    $w.$app = this;
                    if (this.vueEvents && this.vueEvents.beforeCreate) {
                        this.vueEvents.beforeCreate(this);
                    }
                },
                created: function () {
                    if (this.vueEvents && this.vueEvents.created) {
                        this.vueEvents.created(this);
                    }
                    document.getElementById("page_loading").className += " hide";
                    document.getElementById("app").className = document.getElementById("app").className.replace("hide","")
                },
                beforeMount: function () {
                    if (this.vueEvents && this.vueEvents.beforeMount) {
                        this.vueEvents.beforeMount(this);
                    }
                },
                mounted: function () {
                    if (this.vueEvents && this.vueEvents.mounted) {
                        this.vueEvents.mounted(this);
                    }
                },
                beforeUpdate: function () {
                    if (this.vueEvents && this.vueEvents.beforeUpdate) {
                        this.vueEvents.beforeUpdate(this);
                    }
                },
                updated: function () {
                    if (this.vueEvents && this.vueEvents.updated) {
                        this.vueEvents.updated(this);
                    }
                },
                beforeDestroy: function () {
                    if (this.vueEvents && this.vueEvents.beforeDestroy) {
                        this.vueEvents.beforeDestroy(this);
                    }
                },
                destroyed: function () {
                    if (this.vueEvents && this.vueEvents.destroyed) {
                        this.vueEvents.destroyed(this);
                    }
                }
            }
        }
    }
})(window, axios);