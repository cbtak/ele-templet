window.$T = window.$t = (function ($w, $a) {

	return {
		/** create templet */
		createTemplet: function(params){

			/*********************************** 对象定义 ************************************/

			$w.isNull = function(val) {
				return val === null || val === "" || typeof val === "undefined" || (typeof val !== "object" && typeof val !== "function" && !val.length && isNaN(val)) || false;
			}

			$w.isNotNull = function(val) {
				return !isNull(val);
			}

			/** 预置方法模型 */
			let methodModel = {
				setSize : function(size) {
					$app.viewModel.size = size;
					$app.viewModel.head.size = size;
					$app.viewModel.body.size = size;
					$app.viewModel.footer.size = size;
					$app.setSizeAfter($app.viewModel);
				},
				setSizeAfter : function(viewModel) {
					//viewModel.toolbar.class = viewModel.head.size ?  'toolbar-' + viewModel.head.size : 'toolbar';
				},
				/**
				 * 创建项目模型
				 */
				createItemModel : function(itemModel, itemPos) {
					/** 1. 构建通用属性 */
					let commonProperty = {
						key : isNotNull(itemModel.key) ? itemModel.key : null,							// 项目Key
						data_key : isNotNull(itemModel.data_key) ? itemModel.data_key : null,			// 数据Key（v-model绑定）
						label : isNotNull(itemModel.label) ? itemModel.label : itemModel.data_key,		// 项目标题（显示用）
						title : function(appData) {
							if(isNotNull(itemModel.title)) {
								return typeof itemModel.title == "function" ? itemModel.title(appData) : itemModel.title;
							} else {
								return appData.value;
							}
						},																				// 项目提示（显示用）
						type : isNotNull(itemModel.type) ? itemModel.type : 'text',						// 控件类型(string)，为空默认 text
						item_type : isNotNull(itemModel.item_type) ? itemModel.item_type : 1,			// 项目类型：1 表单项目、2 表格项目(暂未用)
						pos : itemPos,																	// 项目位置（1 表头 2 表体 3 表尾）
						sorting : isNotNull(itemModel.sorting) ? itemModel.sorting : 0,					// 项目序号(排序用)
						display : isNotNull(itemModel.display) ? itemModel.display : true,				// 显示属性
						show_label : isNotNull(itemModel.show_label) ? itemModel.show_label : true,		// 显示 label
						item_width : isNotNull(itemModel.item_width) ? itemModel.item_width : null,		// 表单域宽度（控件宽度）
						item_label_width : isNotNull(itemModel.item_label_width) ? itemModel.item_label_width : null,	// 表单域标签的宽度
						class : isNotNull(itemModel.class) ? itemModel.class : '',						// 项目样式表 class
						style : isNotNull(itemModel.style) ? itemModel.style : '',						// 项目样式表
						getsets : itemModel.getsets || [],												// getset（编辑后根据此列表处理赋值）[{get : "name", set : "name", data_type : "date" }]
						value_separator : isNotNull(itemModel.value_separator) ? itemModel.value_separator : ",",		// 多选时值的分隔符 默认：","，默认只对data_value_key使用此分隔符设值
						data_value_key : isNotNull(itemModel.data_value_key) ? itemModel.data_value_key : null,			// 绑定数据对应设值字段（如有多选时，使用此字段设值，控件绑定字段一般为虚属性）,注：对时间范围、日期范围可传递数组值（如：data_value_key = [beginKey,endKey]），如需要将两个值合并，则默认传递字符串值的key即可（如：data_value_key = "daterange_values"）
					}

					


					/** 2. 构建控件属性 */
					let controlProperty = {};
					if(["text","number","textarea","date","month","week","datetime","datetime-local","time","email","url","range","search","color"].indexOf(itemModel.type) != -1 || isNull(itemModel.type)) {
						controlProperty = Object.assign(controlProperty, {
							type : isNotNull(itemModel.type) ? itemModel.type : 'text',								// 类型	string	text / textarea	text
							//value : isNotNull(itemModel.value) ? itemModel.value : null,							// 绑定值	string / number	—	—
							maxlength : isNotNull(itemModel.maxlength) ? itemModel.maxlength : null,				// 最大输入长度	number	—	—
							minlength : isNotNull(itemModel.minlength) ? itemModel.minlength : null,				// 	最小输入长度	number	—	—
							placeholder : isNotNull(itemModel.placeholder) ? itemModel.placeholder : null,			// 输入框占位文本	string	—	—
							clearable : isNotNull(itemModel.clearable) ? itemModel.clearable : true,				// 是否可清空	boolean	—	false
							disabled : isNotNull(itemModel.disabled) ? itemModel.disabled : false,					// 禁用	boolean	—	false
							size : isNotNull(itemModel.size) ? itemModel.size : null,								// 输入框尺寸，只在 type!="textarea" 时有效	string	medium / small / mini	—
							prefix_icon : isNotNull(itemModel.prefix_icon) ? itemModel.prefix_icon : null,			// 输入框头部图标	string	—	—
							suffix_icon : isNotNull(itemModel.suffix_icon) ? itemModel.suffix_icon : null,			// 输入框尾部图标	string	—	—
							rows : isNotNull(itemModel.rows) ? itemModel.rows : 1,									// 输入框行数，只对 type="textarea" 有效	number	—	2
							autosize : isNotNull(itemModel.autosize) ? itemModel.autosize : false,					// 自适应内容高度，只对 type="textarea" 有效，可传入对象，如，{ minRows: 2, maxRows: 6 }	boolean / object	—	false
							auto_complete : isNotNull(itemModel.auto_complete) ? itemModel.auto_complete : "off",	// 原生属性，自动补全	string	on, off	off
							name : isNotNull(itemModel.name) ? itemModel.name : itemModel.data_key,					// 原生属性	string	—	—
							readonly : isNotNull(itemModel.readonly) ? itemModel.readonly : false,					// 原生属性，是否只读	boolean	—	false
							max : isNotNull(itemModel.max) ? itemModel.max : null,									// 原生属性，设置最大值	—	—	—
							min : isNotNull(itemModel.min) ? itemModel.min : null,									// 原生属性，设置最小值	—	—	—
							step : isNotNull(itemModel.step) ? itemModel.step : null,								// 原生属性，设置输入字段的合法数字间隔	—	—	—
							resize : isNotNull(itemModel.resize) ? itemModel.resize : null,							// 控制是否能被用户缩放	string	none, both, horizontal, vertical	—
							autofocus : isNotNull(itemModel.autofocus) ? itemModel.autofocus : false,				// 原生属性，自动获取焦点	boolean	true, false	false
							form : isNotNull(itemModel.form) ? itemModel.form : null,								// 原生属性	string	—	—
							//label : isNotNull(itemModel.label) ? itemModel.label : null,							// 输入框关联的label文字	string	—	—
							tabindex : isNotNull(itemModel.tabindex) ? itemModel.tabindex : null					// 输入框的tabindex	string	-	-
						});
						
					} else if(itemModel.type == "scaler") {
						controlProperty = Object.assign(controlProperty, {
							//value : isNotNull(itemModel.value) ? itemModel.value : null,				// 绑定值	number	—	—
							min : isNotNull(itemModel.min) ? itemModel.min : 0,							// 设置计数器允许的最小值	number	—	0
							max : isNotNull(itemModel.max) ? itemModel.max : Infinity,					// 设置计数器允许的最大值	number	—	Infinity
							step : isNotNull(itemModel.step) ? itemModel.step : 1,						// 计数器步长	number	—	1
							size : isNotNull(itemModel.size) ? itemModel.size : null,					// 计数器尺寸	string	large, small	—
							disabled : isNotNull(itemModel.disabled) ? itemModel.disabled : false,		// 是否禁用计数器	boolean	—	false
							controls : isNotNull(itemModel.controls) ? itemModel.controls : true,		// 是否使用控制按钮	boolean	—	true
							debounce : isNotNull(itemModel.debounce) ? itemModel.debounce : 300,		// 输入时的去抖延迟，毫秒	number	—	300
							controls_position : isNotNull(itemModel.controls_position) ? itemModel.controls_position : null,	// 控制按钮位置	string	right	-
							name : isNotNull(itemModel.name) ? itemModel.name : null,					// 原生属性	string	—	—
							//label : isNotNull(itemModel.label) ? itemModel.label : null,				// 输入框关联的label文字	string	—	—
						});
						
					} else if(itemModel.type == "radio") {
						// 默认使用 Radio-group Attributes
						controlProperty = Object.assign(controlProperty, {
							size : isNotNull(itemModel.size) ? itemModel.size : null,							// 单选框组尺寸，仅对按钮形式的 Radio 或带有边框的 Radio 有效	string	medium / small / mini	—
							disabled : isNotNull(itemModel.disabled) ? itemModel.disabled : false,				// 是否禁用	boolean	—	false
							text_color : isNotNull(itemModel.text_color) ? itemModel.text_color : "#ffffff",	// 按钮形式的 Radio 激活时的文本颜色	string	—	
							fill : isNotNull(itemModel.fill) ? itemModel.fill : "#409EFF",						// 按钮形式的 Radio 激活时的填充色和边框色	string	—	

							options : itemModel.options || [],
							option_key : isNotNull(itemModel.option_key) ? itemModel.option_key : null,
							option_label : isNotNull(itemModel.option_label) ? itemModel.option_label : null,
							option_disabled_key : isNotNull(itemModel.option_disabled_key) ? itemModel.option_disabled_key : null,
							option_hide_key : isNotNull(itemModel.option_hide_key) ? itemModel.option_hide_key : null,
						});
						
					} else if(itemModel.type == "checkbox") {
						// 默认使用 Checkbox-group Attributes
						controlProperty = Object.assign(controlProperty, {
							size : isNotNull(itemModel.size) ? itemModel.size : null,							// 多选框组尺寸，仅对按钮形式的 Checkbox 或带有边框的 Checkbox 有效	string	medium / small / mini	—
							disabled : isNotNull(itemModel.disabled) ? itemModel.disabled : false,				// 是否禁用	boolean	—	false
							min : isNotNull(itemModel.min) ? itemModel.min : null,								// 可被勾选的 checkbox 的最小数量	number	—	—
							max : isNotNull(itemModel.max) ? itemModel.max : Infinity,							// 可被勾选的 checkbox 的最大数量	number	—	—
							text_color : isNotNull(itemModel.text_color) ? itemModel.text_color : "#ffffff",	// 按钮形式的 Checkbox  激活时的文本颜色	string	—	
							fill : isNotNull(itemModel.fill) ? itemModel.fill : "#409EFF",						// 按钮形式的 Checkbox  激活时的填充色和边框色	string	—	

							options : itemModel.options || [],
							option_key : isNotNull(itemModel.option_key) ? itemModel.option_key : null,
							option_label : isNotNull(itemModel.option_label) ? itemModel.option_label : null,
							option_disabled_key : isNotNull(itemModel.option_disabled_key) ? itemModel.option_disabled_key : null,
							option_hide_key : isNotNull(itemModel.option_hide_key) ? itemModel.option_hide_key : null
						});
						
					} else if(itemModel.type == "select") {
						controlProperty = Object.assign(controlProperty, {
							multiple : isNotNull(itemModel.multiple) ? itemModel.multiple : false,					// 是否多选	boolean	—	false
							disabled : isNotNull(itemModel.disabled) ? itemModel.disabled : false,					// 是否禁用	boolean	—	false
							value_key : isNotNull(itemModel.value_key) ? itemModel.value_key : "value",				// 作为 value 唯一标识的键名，绑定值为对象类型时必填	string	—	value
							size : isNotNull(itemModel.size) ? itemModel.size : null,								// 输入框尺寸	string	large/small/mini	—
							clearable : isNotNull(itemModel.clearable) ? itemModel.clearable : true,				// 单选时是否可以清空选项	boolean	—	false
							collapse_tags : isNotNull(itemModel.collapse_tags) ? itemModel.collapse_tags : false,	// 多选时是否将选中值按文字的形式展示	boolean	—	false
							multiple_limit : isNotNull(itemModel.multiple_limit) ? itemModel.multiple_limit : 0,	// 多选时用户最多可以选择的项目数，为 0 则不限制	number	—	0
							name : isNotNull(itemModel.name) ? itemModel.name : null, 								// select input 的 name 属性	string	—	—
							placeholder : isNotNull(itemModel.placeholder) ? itemModel.placeholder : "请选择",		// 占位符	string	—	请选择
							filterable : isNotNull(itemModel.filterable) ? itemModel.filterable : false,			// 是否可搜索	boolean	—	false
							allow_create : isNotNull(itemModel.allow_create) ? itemModel.allow_create : false,		// 是否允许用户创建新条目，需配合 filterable 使用	boolean	—	false
							filter_method : itemModel.filter_method || null,										// 自定义搜索方法	function	—	—
							remote : isNotNull(itemModel.remote) ? itemModel.remote : false,						// 是否为远程搜索	boolean	—	false
							remote_method : itemModel.remote_method || null,										// 远程搜索方法	function	—	—
							loading : isNotNull(itemModel.loading) ? itemModel.loading : false,						// 是否正在从远程获取数据	boolean	—	false
							loading_text : isNotNull(itemModel.loading_text) ? itemModel.loading_text : "加载中",	// 远程加载时显示的文字	string	—	加载中
							no_match_text : isNotNull(itemModel.no_match_text) ? itemModel.no_match_text : "无匹配数据",	// 搜索条件无匹配时显示的文字	string	—	无匹配数据
							no_data_text : isNotNull(itemModel.no_data_text) ? itemModel.no_data_text : "无数据",			// 选项为空时显示的文字	string	—	无数据
							popper_class : isNotNull(itemModel.popper_class) ? itemModel.popper_class : null,				// Select 下拉框的类名	string	—	—
							reserve_keyword : isNotNull(itemModel.reserve_keyword) ? itemModel.reserve_keyword : false,		// 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词	boolean	—	false
							default_first_option : isNotNull(itemModel.default_first_option) ? itemModel.default_first_option : false,	// 在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用	boolean	-

							options : itemModel.options || [],
							option_key : isNotNull(itemModel.option_key) ? itemModel.option_key : null,
							option_label : isNotNull(itemModel.option_label) ? itemModel.option_label : null,
							option_disabled_key : isNotNull(itemModel.option_disabled_key) ? itemModel.option_disabled_key : null,
							option_hide_key : isNotNull(itemModel.option_hide_key) ? itemModel.option_hide_key : null
						});
						
					} else if(itemModel.type == "cascader") {
						controlProperty = Object.assign(controlProperty, {
							options : itemModel.options || [],																// 可选项数据源，键名可通过 props 属性配置	array	—	—
							/** 配置选项，具体见下表	object	—	— */
							props : itemModel.props || {
								value : isNotNull(itemModel.option_key) ? itemModel.option_key : null,						// 指定选项的值为选项对象的某个属性值	string	—	—
								label : isNotNull(itemModel.option_label) ? itemModel.option_label : null,					// 指定选项标签为选项对象的某个属性值	string	—	—
								children : isNotNull(itemModel.option_children) ? itemModel.option_children : null,			// 指定选项的子选项为选项对象的某个属性值	string	—	—
								disabled : isNotNull(itemModel.option_disabled_key) ? itemModel.option_disabled_key : null,	// 指定选项的禁用为选项对象的某个属性值	string	—	—
							},
							//value : itemModel.value || [],																// 选中项绑定值	array	—	—
							separator : isNotNull(itemModel.separator) ? itemModel.separator : "/",							// 选项分隔符	string	—	斜杠'/'
							popper_class : isNotNull(itemModel.popper_class) ? itemModel.popper_class : null,				// 自定义浮层类名	string	—	—
							placeholder : isNotNull(itemModel.placeholder) ? itemModel.placeholder : "请选择",				// 输入框占位文本	string	—	请选择
							disabled : isNotNull(itemModel.disabled) ? itemModel.disabled : false,							// 是否禁用	boolean	—	false
							clearable : isNotNull(itemModel.clearable) ? itemModel.clearable : true,						// 是否支持清空选项	boolean	—	false
							expand_trigger : isNotNull(itemModel.expand_trigger) ? itemModel.expand_trigger : "click",		// 次级菜单的展开方式	string	click / hover	click
							show_all_levels : isNotNull(itemModel.show_all_levels) ? itemModel.show_all_levels : true,		// 输入框中是否显示选中值的完整路径	boolean	—	true
							filterable : isNotNull(itemModel.filterable) ? itemModel.filterable : false,					// 是否可搜索选项	boolean	—	—
							debounce : isNotNull(itemModel.debounce) ? itemModel.debounce : 300,							// 搜索关键词输入的去抖延迟，毫秒	number	—	300
							change_on_select : isNotNull(itemModel.change_on_select) ? itemModel.change_on_select : false,	// 是否允许选择任意一级的选项	boolean	—	false
							size : isNotNull(itemModel.size) ? itemModel.size : null,										// 尺寸	string	medium / small / mini	—
							before_filter : isNotNull(itemModel.before_filter) ? itemModel.before_filter : function(val) {},	// 筛选之前的钩子，参数为输入的值，若返回 false 或者返回 Promise 且被 reject，则停止筛选	function(value)	—	—
						});
						
					} else if(itemModel.type == "switch") {
						controlProperty = Object.assign(controlProperty, {
							disabled : isNotNull(itemModel.disabled) ? itemModel.disabled : false,									// 是否禁用	boolean	—	false
							width : isNotNull(itemModel.width) ? itemModel.width : 40, 												// switch 的宽度（像素）	number	—	40
							active_icon_class : isNotNull(itemModel.active_icon_class) ? itemModel.active_icon_class : null, 		// switch 打开时所显示图标的类名，设置此项会忽略 active-text	string	—	—
							inactive_icon_class : isNotNull(itemModel.inactive_icon_class) ? itemModel.inactive_icon_class : null, 	// switch 关闭时所显示图标的类名，设置此项会忽略 inactive-text	string	—	—
							active_text : isNotNull(itemModel.active_text) ? itemModel.active_text : null, 							// switch 打开时的文字描述	string	—	—
							inactive_text : isNotNull(itemModel.inactive_text) ? itemModel.inactive_text : null, 					// switch 关闭时的文字描述	string	—	—
							active_value : isNotNull(itemModel.active_value) ? itemModel.active_value : true, 						// switch 打开时的值	boolean / string / number	—	true
							inactive_value : isNotNull(itemModel.inactive_value) ? itemModel.inactive_value : false, 				// switch 关闭时的值	boolean / string / number	—	false
							active_color : isNotNull(itemModel.active_color) ? itemModel.active_color : '#409EFF', 					// switch 打开时的背景色	string	—	
							inactive_color : isNotNull(itemModel.inactive_color) ? itemModel.inactive_color : '#C0CCDA', 			// switch 关闭时的背景色	string	—	
							name : isNotNull(itemModel.name) ? itemModel.name : null, 												// switch 对应的 name 属性	string	—	—
						});
						
					} else if(itemModel.type == "slider") {
						controlProperty = Object.assign(controlProperty, {
							min : isNotNull(itemModel.min) ? itemModel.min : 0,														// 最小值	number	—	0
							max : isNotNull(itemModel.max) ? itemModel.max : 100,													// 最大值	number	—	100
							step : isNotNull(itemModel.step) ? itemModel.step : 1,													// 步长	number	—	1
							disabled : isNotNull(itemModel.disabled) ? itemModel.disabled : false,									// 是否为只读	boolean	—	false
							show_input : isNotNull(itemModel.show_input) ? itemModel.show_input : false,							// 是否显示输入框，仅在非范围选择时有效	boolean	—	false
							show_input_controls : isNotNull(itemModel.show_input_controls) ? itemModel.show_input_controls : true,	// 在显示输入框的情况下，是否显示输入框的控制按钮	boolean	—	true
							show_stops : isNotNull(itemModel.show_stops) ? itemModel.show_stops : false,							// 是否显示间断点	boolean	—	false
							show_tooltip : isNotNull(itemModel.show_tooltip) ? itemModel.show_tooltip : true,						// 是否显示 tooltip	boolean	—	true
							format_tooltip : isNotNull(itemModel.format_tooltip) ? itemModel.format_tooltip : null,					// 格式化 tooltip message	function(value)	—	—
							range : isNotNull(itemModel.range) ? itemModel.range : false,											// 是否为范围选择	boolean	—	false
							vertical : isNotNull(itemModel.vertical) ? itemModel.vertical : false,									// 是否竖向模式	boolean	—	false
							height : isNotNull(itemModel.height) ? itemModel.height : null,											// Slider 高度，竖向模式时必填	string	—	—
							//label : isNotNull(itemModel.label) ? itemModel.label : itemModel.data_key,							// 屏幕阅读器标签	string	—	—
							debounce : isNotNull(itemModel.debounce) ? itemModel.debounce : 300										// 输入时的去抖延迟，毫秒，仅在show-input等于true时有效	number	—	300
						});
						
					} else if(itemModel.type == "rate") {
						controlProperty = Object.assign(controlProperty, {
							max : isNotNull(itemModel.max) ? itemModel.max : 5, 											// 最大分值	number	—	5
							disabled : isNotNull(itemModel.disabled) ? itemModel.disabled : false,							// 是否为只读	boolean	—	false
							allow_half : isNotNull(itemModel.allow_half) ? itemModel.allow_half : false, 					// 是否允许半选	boolean	—	false
							low_threshold : isNotNull(itemModel.low_threshold) ? itemModel.low_threshold : 2, 				// 低分和中等分数的界限值，值本身被划分在低分中	number	—	2
							high_threshold : isNotNull(itemModel.high_threshold) ? itemModel.high_threshold : 4, 			// 高分和中等分数的界限值，值本身被划分在高分中	number	—	4
							colors : itemModel.colors || ['#99A9BF', '#F7BA2A', '#FF9900'], 								// icon 的颜色数组，共有 3 个元素，为 3 个分段所对应的颜色	array	—	['#F7BA2A', '#F7BA2A', '#F7BA2A']
							void_color : isNotNull(itemModel.void_color) ? itemModel.void_color : "#C6D1DE", 				// 未选中 icon 的颜色	string	—	#C6D1DE
							disabled_void_color : isNotNull(itemModel.disabled_void_color) ? itemModel.disabled_void_color : "#EFF2F7",		// 只读时未选中 icon 的颜色	string	—	#EFF2F7
							icon_classes : itemModel.icon_classes || ['el-icon-star-on', 'el-icon-star-on','el-icon-star-on'], 				// icon 的类名数组，共有 3 个元素，为 3 个分段所对应的类名	array	—	['el-icon-star-on', 'el-icon-star-on','el-icon-star-on']
							void_icon_class : isNotNull(itemModel.void_icon_class) ? itemModel.void_icon_class : "el-icon-star-off", 		// 未选中 icon 的类名	string	—	el-icon-star-off
							disabled_void_icon_class : isNotNull(itemModel.disabled_void_icon_class) ? itemModel.disabled_void_icon_class : "el-icon-star-on", 				// 只读时未选中 icon 的类名	string	—	el-icon-star-on
							show_text : isNotNull(itemModel.show_text) ? itemModel.show_text : false, 										// 是否显示辅助文字，若为真，则会从 texts 数组中选取当前分数对应的文字内容	boolean	—	false
							show_score : isNotNull(itemModel.show_score) ? itemModel.show_score : false, 									// 是否显示当前分数，show-score 和 show-text 不能同时为真	boolean	—	false
							text_color : isNotNull(itemModel.text_color) ? itemModel.text_color : "#1F2D3D", 								// 辅助文字的颜色	string	—	#1F2D3D
							texts : itemModel.texts || ['极差', '失望', '一般', '满意', '惊喜'], 											// 辅助文字数组	array	—	['极差', '失望', '一般', '满意', '惊喜']
							score_template : isNotNull(itemModel.score_template) ? itemModel.score_template : "{value}", 					// 分数显示模板	string	—	{value}
						});
						
					} else if(["time-select","time-picker"].indexOf(itemModel.type) != -1) {
						controlProperty = Object.assign(controlProperty, {
							readonly : isNotNull(itemModel.readonly) ? itemModel.readonly : false, 								// 完全只读	boolean	—	false
							disabled : isNotNull(itemModel.disabled) ? itemModel.disabled : false, 								// 禁用	boolean	—	false
							editable : isNotNull(itemModel.editable) ? itemModel.editable : true, 								// 文本框可输入	boolean	—	true
							clearable : isNotNull(itemModel.clearable) ? itemModel.clearable : true, 							// 是否显示清除按钮	boolean	—	true
							size : isNotNull(itemModel.size) ? itemModel.size : null, 											// 输入框尺寸	string	medium / small / mini	—
							placeholder : isNotNull(itemModel.placeholder) ? itemModel.placeholder : null, 						// 非范围选择时的占位内容	string	—	—
							start_placeholder : isNotNull(itemModel.start_placeholder) ? itemModel.start_placeholder : null,	// 范围选择时开始日期的占位内容	string	—	—
							end_placeholder : isNotNull(itemModel.end_placeholder) ? itemModel.end_placeholder : null, 			// 范围选择时开始日期的占位内容	string	—	—
							is_range : isNotNull(itemModel.is_range) ? itemModel.is_range : false, 								// 是否为时间范围选择，仅对<el-time-picker>有效	boolean	—	false
							arrow_control : isNotNull(itemModel.arrow_control) ? itemModel.arrow_control : false, 				// 是否使用箭头进行时间选择，仅对<el-time-picker>有效	boolean	—	false
							value : isNotNull(itemModel.value) ? itemModel.value : null, 										// 绑定值	date(TimePicker) / string(TimeSelect)	—	—
							align : isNotNull(itemModel.align) ? itemModel.align : "left", 										// 对齐方式	string	left / center / right	left
							popper_class : isNotNull(itemModel.popper_class) ? itemModel.popper_class : null, 					// TimePicker 下拉框的类名	string	—	—
							picker_options : itemModel.picker_options || {}, 													// 当前时间日期选择器特有的选项参考下表	object	—	{}
							range_separator : isNotNull(itemModel.range_separator) ? itemModel.range_separator : "-", 			// 选择范围时的分隔符	string	-	'-'
							value_format : isNotNull(itemModel.value_format) ? itemModel.value_format : "HH:mm:ss", 			// 可选，仅TimePicker时可用，绑定值的格式，同DatePicker	string	小时 HH，分 mm，秒 ss，AM/PM A	—
							default_value : isNotNull(itemModel.default_value) ? itemModel.default_value : null, 				// 可选，选择器打开时默认显示的时间	Date(TimePicker) / string(TimeSelect)	可被new Date()解析(TimePicker) / 可选值(TimeSelect)	—
							name : isNotNull(itemModel.name) ? itemModel.name : null, 											// 原生属性	string	—	—
						});
					} else if(itemModel.type == "date-picker") {
						let formats = {
							date : "yyyy-MM-dd",
							year : "yyyy年",
							month : "M月",
							week : "yyyy年第W周",
							datetime : "yyyy-MM-dd HH:mm:ss",
							datetimerange : "yyyy-MM-dd HH:mm:ss",
							daterange : "yyyy-MM-dd"
						}
						let valueFormats = {
							date : "yyyy-MM-dd",
							year : "yyyy",
							month : "MM",
							//week : "yyyy-MM-dd",
							datetime : "yyyy-MM-dd HH:mm:ss",
							datetimerange : "yyyy-MM-dd HH:mm:ss",
							daterange : "yyyy-MM-dd"
						}
						controlProperty = Object.assign(controlProperty, {
							readonly : isNotNull(itemModel.readonly) ? itemModel.readonly : false, 									// 完全只读	boolean	—	false
							disabled : isNotNull(itemModel.disabled) ? itemModel.disabled : false,									// 禁用	boolean	—	false
							editable : isNotNull(itemModel.editable) ? itemModel.editable : true, 									// 文本框可输入	boolean	—	true
							clearable : isNotNull(itemModel.clearable) ? itemModel.clearable : true, 								// 是否显示清除按钮	boolean	—	true
							size : isNotNull(itemModel.size) ? itemModel.size : null, 												// 输入框尺寸	string	large, small, mini	—
							placeholder : isNotNull(itemModel.placeholder) ? itemModel.placeholder : null, 							// 非范围选择时的占位内容	string	—	—
							start_placeholder : isNotNull(itemModel.start_placeholder) ? itemModel.start_placeholder : null,		// 范围选择时开始日期的占位内容	string	—	—
							end_placeholder : isNotNull(itemModel.end_placeholder) ? itemModel.end_placeholder : null,				// 范围选择时结束日期的占位内容	string	—	—
							date_type : isNotNull(itemModel.date_type) ? itemModel.date_type : "date", 								// 显示类型（原类型为type）	string	year/month/date/week/ datetime/datetimerange/daterange	date
							format : isNotNull(itemModel.format) ? itemModel.format : 
									 formats[isNotNull(itemModel.date_type) ? itemModel.date_type : "date"],						// 显示在输入框中的格式	string	年 yyyy，月 MM，日 dd，小时 HH，分 mm，秒 ss，AM/PM A	yyyy-MM-dd
							align : isNotNull(itemModel.align) ? itemModel.align : "left",			 								// 对齐方式	string	left, center, right	left
							popper_class : isNotNull(itemModel.popper_class) ? itemModel.popper_class : null,						// DatePicker 下拉框的类名	string	—	—
							picker_options : isNotNull(itemModel.picker_options) ? itemModel.picker_options : {},					// 当前时间日期选择器特有的选项参考下表	object	—	{}
							range_separator : isNotNull(itemModel.range_separator) ? itemModel.range_separator : "-", 				// 选择范围时的分隔符	string	—	'-'
							default_value : isNotNull(itemModel.default_value) ? itemModel.default_value : null, 					// 可选，选择器打开时默认显示的时间	Date	可被new Date()解析	—
							value_format : isNotNull(itemModel.value_format) ? itemModel.value_format : 
										   valueFormats[isNotNull(itemModel.date_type) ? itemModel.date_type : "date"],				// 可选，绑定值的格式。不指定则绑定值为 Date 对象	string	年 yyyy，月 MM，日 dd，小时 HH，分 mm，秒 ss，AM/PM A	—
							name : isNotNull(itemModel.name) ? itemModel.name : null, 												// 原生属性	string	—	—
							unlink_panels : isNotNull(itemModel.unlink_panels) ? itemModel.unlink_panels : false,					// 在范围选择器里取消两个日期面板之间的联动	boolean	—	false
						});

					}  else if(itemModel.type == "color-picker") {
						controlProperty = Object.assign(controlProperty, {
							disabled : isNotNull(itemModel.disabled) ? itemModel.disabled : null, 									// 是否禁用	boolean	—	false
							size : isNotNull(itemModel.size) ? itemModel.size : null, 												// 尺寸	string	—	medium / small / mini
							show_alpha : isNotNull(itemModel.show_alpha) ? itemModel.show_alpha : false, 							// 是否支持透明度选择	boolean	—	false
							color_format : isNotNull(itemModel.color_format) ? itemModel.color_format : null, 						// 写入 v-model 的颜色的格式	string	hsl / hsv / hex / rgb	hex（show-alpha 为 false）/ rgb（show-alpha 为 true）
							popper_class : isNotNull(itemModel.popper_class) ? itemModel.popper_class : null, 						// ColorPicker 下拉框的类名	string	—	—
						});
					} else if(itemModel.type == "ref") {
						controlProperty = Object.assign(controlProperty, {
							type : isNotNull(itemModel.type) ? itemModel.type : 'text',								// 类型	string	text / textarea	text
							value : isNotNull(itemModel.value) ? itemModel.value : null,							// 绑定值	string / number	—	—
							maxlength : isNotNull(itemModel.maxlength) ? itemModel.maxlength : null,				// 最大输入长度	number	—	—
							minlength : isNotNull(itemModel.minlength) ? itemModel.minlength : null,				// 	最小输入长度	number	—	—
							placeholder : isNotNull(itemModel.placeholder) ? itemModel.placeholder : null,			// 输入框占位文本	string	—	—
							clearable : isNotNull(itemModel.clearable) ? itemModel.clearable : true,				// 是否可清空	boolean	—	false
							disabled : isNotNull(itemModel.disabled) ? itemModel.disabled : false,					// 禁用	boolean	—	false
							size : isNotNull(itemModel.size) ? itemModel.size : null,								// 输入框尺寸，只在 type!="textarea" 时有效	string	medium / small / mini	—
							prefix_icon : isNotNull(itemModel.prefix_icon) ? itemModel.prefix_icon : null,			// 输入框头部图标	string	—	—
							suffix_icon : isNotNull(itemModel.suffix_icon) ? itemModel.suffix_icon : null,			// 输入框尾部图标	string	—	—
							rows : isNotNull(itemModel.rows) ? itemModel.rows : 1,									// 输入框行数，只对 type="textarea" 有效	number	—	2
							autosize : isNotNull(itemModel.autosize) ? itemModel.autosize : false,					// 自适应内容高度，只对 type="textarea" 有效，可传入对象，如，{ minRows: 2, maxRows: 6 }	boolean / object	—	false
							auto_complete : isNotNull(itemModel.auto_complete) ? itemModel.auto_complete : "off",	// 原生属性，自动补全	string	on, off	off
							name : isNotNull(itemModel.name) ? itemModel.name : itemModel.data_key,					// 原生属性	string	—	—
							readonly : isNotNull(itemModel.readonly) ? itemModel.readonly : false,					// 原生属性，是否只读	boolean	—	false
							max : isNotNull(itemModel.max) ? itemModel.max : null,									// 原生属性，设置最大值	—	—	—
							min : isNotNull(itemModel.min) ? itemModel.min : null,									// 原生属性，设置最小值	—	—	—
							step : isNotNull(itemModel.step) ? itemModel.step : null,								// 原生属性，设置输入字段的合法数字间隔	—	—	—
							resize : isNotNull(itemModel.resize) ? itemModel.resize : null,							// 控制是否能被用户缩放	string	none, both, horizontal, vertical	—
							autofocus : isNotNull(itemModel.autofocus) ? itemModel.autofocus : false,				// 原生属性，自动获取焦点	boolean	true, false	false
							form : isNotNull(itemModel.form) ? itemModel.form : null,								// 原生属性	string	—	—
							//label : isNotNull(itemModel.label) ? itemModel.label : null,							// 输入框关联的label文字	string	—	—
							tabindex : isNotNull(itemModel.tabindex) ? itemModel.tabindex : null,					// 输入框的tabindex	string	-	-
							ref : itemModel.ref || {}	// 参照对象
						});
						
					}

					/** 3. 构建控件事件处理 */
					let controlEvents = {
						events : {
							/** 值发生变化时触发 */
							change : function(appData) {
								if(itemModel.events && itemModel.events.change) {
									itemModel.events.change(appData);
								}
							},
							
							/** 编辑前触发(参照有效) */
							beforeChange : function (appData) {
								if(itemModel.events && itemModel.events.beforeChange) {
									return itemModel.events.beforeChange(appData);
								} else {
									return true;
								}
							},
							/** 编辑后触发(参照有效) */
							afterChange : function(appData) {
								if(itemModel.events && itemModel.events.afterChange) {
									itemModel.events.afterChange(appData);
								}
							},
							/** 项目过滤(参照有效) */
							optionFilter : function (appData) {
								if(itemModel.events && itemModel.events.optionFilter) {
									return itemModel.events.optionFilter(appData);
								} else {
									return true;
								}
							}
						}
					}

					/** 失去焦点触发 */
					if(["text","number","textarea","date","month","week","datetime","datetime-local","time","email","url","range","search","color","scaler","select","time-select","time-picker","date-picker"].indexOf(itemModel.type) != -1 || isNull(itemModel.type)) {
						controlEvents.events.blur = function(appData) {
							if(itemModel.events && itemModel.events.blur) {
								itemModel.events.blur(appData);
							}
						}
					}
					/** 获得焦点触发 */
					if(["text","number","textarea","date","month","week","datetime","datetime-local","time","email","url","range","search","color","scaler","select","time-select","time-picker","date-picker"].indexOf(itemModel.type) != -1 || isNull(itemModel.type)) {
						controlEvents.events.focus = function(appData) {
							if(itemModel.events && itemModel.events.focus) {
								itemModel.events.focus(appData);
							}
						}
					}
					/** 下拉框出现/隐藏时触发 */
					if(["select"].indexOf(itemModel.type) != -1) {
						controlEvents.events.visibleChange = function(appData) {
							if(itemModel.events && itemModel.events.visibleChange) {
								itemModel.events.visibleChange(appData);
							}
						}
					}
					/** 多选模式下移除tag时触发 */
					if(["select"].indexOf(itemModel.type) != -1) {
						controlEvents.events.removeTag = function(appData) {
							if(itemModel.events && itemModel.events.removeTag) {
								itemModel.events.removeTag(appData);
							}
						}
					}
					/** 清空按钮时触发 */
					if(["select"].indexOf(itemModel.type) != -1) {
						controlEvents.events.clear = function(appData) {
							if(itemModel.events && itemModel.events.clear) {
								itemModel.events.clear(appData);
							}
						}
					}
					/** 当父级选项变化时触发的事件 */
					if(["cascader"].indexOf(itemModel.type) != -1) {
						controlEvents.events.activeItemChange = function(appData) {
							if(itemModel.events && itemModel.events.activeItemChange) {
								itemModel.events.activeItemChange(appData);
							}
						}
					}

					/** 面板中当前显示的颜色发生改变时触发的事件 */
					if(["color-picker"].indexOf(itemModel.type) != -1) {
						controlEvents.events.activechange = function(appData) {
							if(itemModel.events && itemModel.events.activechange) {
								itemModel.events.activechange(appData);
							}
						}
					}

					/** 面板中当前显示的颜色发生改变时触发的事件 */
					if(["ref"].indexOf(itemModel.type) != -1) {
						controlEvents.events.showRefModel = function(appData) {
							if(itemModel.events && itemModel.events.showRefModel) {
								itemModel.events.showRefModel(appData);
								return;
							}

							$app.showRefModel({
								refModel : appData.model.ref
							});
						}
					}

					return Object.assign(commonProperty, controlProperty, controlEvents);
				},

				handleSettings : function(command) {
					if(command == "VIEW_SETING") {
						$app.viewModel.viewSetings.visible = true;
					}
				},
				handleResetViewSetings : function() {
					$app.viewModel.toolbar.display = $app.viewModel.viewSetings.historySetings.toolbar_display;
					$app.viewModel.head.display = $app.viewModel.viewSetings.historySetings.head_display;
					$app.viewModel.body.display = $app.viewModel.viewSetings.historySetings.body_display;
					$app.viewModel.footer.display = $app.viewModel.viewSetings.historySetings.footer_display;
					$app.viewModel.size = $app.viewModel.viewSetings.historySetings.size;
					$app.viewModel.head.size = $app.viewModel.viewSetings.historySetings.head_size;
					$app.viewModel.body.size = $app.viewModel.viewSetings.historySetings.body_size;
					$app.viewModel.footer.size = $app.viewModel.viewSetings.historySetings.footer_size;
				},
				showRefModel : function(appData) {
					if(appData.refModel.type == "table") {
						$app.viewModel.refModels.tableRefModel.show();
					}
				},

			}

			/** build process */

			let viewModel = {
				display : true,					// 界面是否显示
				hasHead : true,					// 是否有表头
				hasBody : true,					// 是否有表体
				hasFooter : false,				// 是否有表尾
				size : 'mini',					// 默认组件尺寸

				form_auto_width : false,		// 表单域自动宽度(默认false)
				form_item_width : 160,			// 表单域默认宽度(控件)
				form_item_label_width : 80,		// 表单域标签默认宽度

				table_column_width : null,		// 表格列项目默认宽度（未启用）
				table_column_min_width : null,	// 表格列项目默认最小宽度（未启用）
				table_column_max_width : null,	// 表格列项目默认最大宽度（未启用）

				viewSetings : {
					visible : false,
					title : "界面设置",
					sizeButtons : [
						{ type : "danger", size : null, text : "偏大", click : function() { $app.setSize(null); } },
						{ type : "primary", size : "medium", text : "正常", click : function() { $app.setSize("medium"); } },
						{ type : "success", size : "small", text : "偏小", click : function() { $app.setSize("small"); } },
						{ type : "warning", size : "mini", text : "迷你", click : function() { $app.setSize("mini"); } }
					],
					historySetings : {}
				},

				refModels : {
					tableRefModel : {
						title : "参照",							// 参照窗口标题
						visible : false,						// 参照窗口显示属性
						width : 560,							// 参照窗口宽度
						show_close : true,						// 显示关闭按钮
						close_on_click_modal : false,			// 点击模态层关闭参照
						class : null,							// 参照的自定义样式表
						search_key : "",						// 搜索属性key(筛选的字段，为空时为所有属性)
						enabled_refresh : true,					// 启用刷新
						enabled_search : true,					// 启用搜索状态
						auto_search : true,						// 自动搜索
						search_clearable : true,				// 搜索框是否启用清除
						search_placeholder : "请输入关键字",	// 搜索框占位符
						// 表格参照配置
						refTable : {
							height : 300,						// 表格高度
							highlight_current_row : true,		// 高亮当前行
							show_selection : true,				// 显示选择列
							show_index : true,					// 显示索引列（行号）
							show_overflow_tooltip : true,		// 单元格内容溢出tips
							loading : false,
							element_loading_text : "正在加载中...",
							// 参照表格列模型
							columnModel : [
								{key : "code", data_key : "code", label : "编码", sortable : true, min_width:200}, 
								{key : "age", data_key : "age", label : "年龄", width : 300}, 
								{key : "name", data_key : "name", label : "名称"}
							]
						},
						// 参照数据模型
						refDataModel : [
							{id : "1001", code : "1001", age : 22, name : "张三"},
							{id : "1002", code : "1002", age : 18, name : "小王"},
							{id : "1003", code : "1003", age : 33, name : "李二"},
						],
						/** 参照初始化 */
						initRefModel : function(appData) {

						},
						
						show : function(appData) {
							$app.viewModel.refModels.tableRefModel.visible = true;
						},
						hide : function(appData) {
							$app.viewModel.refModels.tableRefModel.visible = false;
						},
						events : {
							confirm : function() {
								$app.viewModel.refModels.tableRefModel.hide();
							},
							clear: function() {
								
							},
							close: function() {
								$app.viewModel.refModels.tableRefModel.hide();
							},
							search : function() {

							},
							refresh : function() {
								$app.viewModel.refModels.tableRefModel.refTable.loading = true;
								setTimeout(function() {
									$app.viewModel.refModels.tableRefModel.refTable.loading = false;
								}, 5000);
							}
						}
					},
					treeRefModel : {},
					treeTableRefModel : {}
				},

				toolbar : {
					size : null,
					display : true,
					class : "toolbar-mini" // toolbar-mini、toolbar-small、toolbar-medium
				},


				head : {
					data_model_key : null,
					display : true,
					size : "mini",
					form : {
						key : "headForm",			// 表单KEY 作为ref对象引用 (自定义)
						width : null,				// 表单宽度 (自定义，暂未用)
						item_width : null,			// 表单域默认宽度-控件(自定义)
						items : [],					// 表单域集合 (自定义)
						show_label : true,			// 是否显示表单域标签文本 (自定义)

						model : null,				// 表单数据对象	object	—	—
						rules : null,				// 表单验证规则	object	—	—
						inline : true,				// 行内表单模式	boolean	—	false
						label_position : "right",	// 表单域标签的位置	string	right/left/top	right
						label_width : null,			// 表单域标签的宽度，作为 Form 直接子元素的 form-item 会继承该值	string	—	—
						label_suffix : "",			// 表单域标签的后缀	string	—	—
						show_message : true,		// 是否显示校验错误信息	boolean	—	true
						inline_message : true,		// 是否以行内形式展示校验信息	boolean	—	false
						status_icon : false,		// 是否在输入框中显示校验结果反馈图标	boolean	—	false
						size : "mini",				// (暂不用，使用footer.size)用于控制该表单内组件的尺寸	string	medium / small / mini	-
					}
				},

				body : {
					data_model_key : null,
					display : true,
					content_display : true,
					size : null,
					items : [],
					rules : {}
				},

				footer : {
					data_model_key : null,
					display : true,
					size : "mini",
					form : {
						key : "footerForm",			// 表单KEY 作为ref对象引用 (自定义)
						width : null,				// 表单宽度 (自定义，暂未用)
						item_width : null,			// 表单域默认宽度-控件(自定义)
						items : [],					// 表单域集合 (自定义)
						show_label : true,			// 是否显示表单域标签文本 (自定义)

						model : null,				// 表单数据对象	object	—	—
						rules : null,				// 表单验证规则	object	—	—
						inline : true,				// 行内表单模式	boolean	—	false
						label_position : "right",	// 表单域标签的位置	string	right/left/top	right
						label_width : null,			// 表单域标签的宽度，作为 Form 直接子元素的 form-item 会继承该值	string	—	—
						label_suffix : "",			// 表单域标签的后缀	string	—	—
						show_message : true,		// 是否显示校验错误信息	boolean	—	true
						inline_message : true,		// 是否以行内形式展示校验信息	boolean	—	false
						status_icon : false,		// 是否在输入框中显示校验结果反馈图标	boolean	—	false
						size : "mini",				// (暂不用，使用footer.size)用于控制该表单内组件的尺寸	string	medium / small / mini	-
					}
				}
			};

			const Pos = {
				head : 1,		// 表头
				body : 2,		// 表体
				footer : 3		// 表尾
			}


			/** 参数空对象处理 */
			params.viewModel = params.viewModel || {};
			params.viewModel.toolbar = params.viewModel.toolbar || {};
			params.viewModel.head = params.viewModel.head || {};
			params.viewModel.body = params.viewModel.body || {};
			params.viewModel.footer = params.viewModel.footer || {};
			params.viewModel.head.form = params.viewModel.head.form || {};
			params.viewModel.body.table = params.viewModel.body.table || {};
			params.viewModel.footer.form = params.viewModel.footer.form || {};

			params.dataModel = params.dataModel || {};

			viewModel.display = isNotNull(params.viewModel.display) ? params.viewModel.display : viewModel.display;				// 界面是否显示
			viewModel.hasHead = isNotNull(params.viewModel.hasHead) ? params.viewModel.hasHead : viewModel.hasHead;				// 是否有表头
			viewModel.hasBody = isNotNull(params.viewModel.hasBody) ? params.viewModel.hasBody : viewModel.hasBody;				// 是否有表体
			viewModel.hasFooter = isNotNull(params.viewModel.hasFooter) ? params.viewModel.hasFooter : viewModel.hasFooter;		// 是否有表尾
			viewModel.size = isNotNull(params.viewModel.size) ? params.viewModel.size : viewModel.size;							// 组件尺寸设置

			// 工具条设置
			viewModel.toolbar.size = isNotNull(params.viewModel.toolbar.size) ? params.viewModel.toolbar.size : viewModel.size;

			// 表头设置
			viewModel.head.data_model_key = isNotNull(params.viewModel.head.data_model_key) ? params.viewModel.head.data_model_key : viewModel.head.data_model_key;
			viewModel.head.display = isNotNull(params.viewModel.head.display) ? params.viewModel.head.display : viewModel.head.display;
			viewModel.head.size = isNotNull(params.viewModel.head.size) ? params.viewModel.head.size : viewModel.size;
			viewModel.head.form.key = isNotNull(params.viewModel.head.form.key) ? params.viewModel.head.form.key : viewModel.head.form.key;
			viewModel.head.form.width = isNotNull(params.viewModel.head.form.width) ? params.viewModel.head.form.width : viewModel.head.form.width;
			viewModel.head.form.item_width = isNotNull(params.viewModel.head.form.item_width) ? params.viewModel.head.form.item_width : viewModel.form_item_width;
			viewModel.head.form.show_label = isNotNull(params.viewModel.head.form.show_label) ? params.viewModel.head.form.show_label : viewModel.head.form.show_label;
			viewModel.head.form.model = isNotNull(params.viewModel.head.form.model) ? params.viewModel.head.form.model : viewModel.head.form.model;
			viewModel.head.form.rules = params.viewModel.head.form.rules || viewModel.head.form.rules;
			viewModel.head.form.inline = isNotNull(params.viewModel.head.form.inline) ? params.viewModel.head.form.inline : viewModel.head.form.inline;
			viewModel.head.form.label_position = isNotNull(params.viewModel.head.form.label_position) ? params.viewModel.head.form.label_position : viewModel.head.form.label_position;
			viewModel.head.form.label_width = isNotNull(params.viewModel.head.form.label_width) ? params.viewModel.head.form.label_width : viewModel.form_item_label_width;
			viewModel.head.form.label_suffix = isNotNull(params.viewModel.head.form.label_suffix) ? params.viewModel.head.form.label_suffix : viewModel.head.form.label_suffix;
			viewModel.head.form.show_message = isNotNull(params.viewModel.head.form.show_message) ? params.viewModel.head.form.show_message : viewModel.head.form.show_message;
			viewModel.head.form.inline_message = isNotNull(params.viewModel.head.form.inline_message) ? params.viewModel.head.form.inline_message : viewModel.head.form.inline_message;
			viewModel.head.form.status_icon = isNotNull(params.viewModel.head.form.status_icon) ? params.viewModel.head.form.inline_message : viewModel.head.form.inline_message;
			viewModel.head.form.size = isNotNull(params.viewModel.head.form.size) ? params.viewModel.head.form.size : viewModel.head.size;

			// 表体设置
			viewModel.body.data_model_key = isNotNull(params.viewModel.body.data_model_key) ? params.viewModel.body.data_model_key : viewModel.body.data_model_key;
			viewModel.body.display = isNotNull(params.viewModel.body.display) ? params.viewModel.body.display : viewModel.body.display;
			viewModel.body.size = isNotNull(params.viewModel.body.size) ? params.viewModel.body.size : viewModel.size;
			viewModel.body.rules = params.viewModel.body.rules || viewModel.body.rules;

			// 表尾设置
			viewModel.footer.data_model_key = isNotNull(params.viewModel.footer.data_model_key) ? params.viewModel.footer.data_model_key : viewModel.footer.data_model_key;
			viewModel.footer.display = isNotNull(params.viewModel.footer.display) ? params.viewModel.footer.display : viewModel.footer.display;
			viewModel.footer.size = isNotNull(params.viewModel.footer.size) ? params.viewModel.footer.size : viewModel.size;
			viewModel.footer.form.key = isNotNull(params.viewModel.footer.form.key) ? params.viewModel.footer.form.key : viewModel.footer.form.key;
			viewModel.footer.form.width = isNotNull(params.viewModel.footer.form.width) ? params.viewModel.footer.form.width : viewModel.footer.form.width;
			viewModel.footer.form.item_width = isNotNull(params.viewModel.footer.form.item_width) ? params.viewModel.footer.form.item_width : viewModel.form_item_width;
			viewModel.footer.form.show_label = isNotNull(params.viewModel.footer.form.show_label) ? params.viewModel.footer.form.show_label : viewModel.footer.form.show_label;
			viewModel.footer.form.model = isNotNull(params.viewModel.footer.form.model) ? params.viewModel.footer.form.model : viewModel.footer.form.model;
			viewModel.footer.form.rules = params.viewModel.footer.form.rules || viewModel.footer.form.rules;
			viewModel.footer.form.inline = isNotNull(params.viewModel.footer.form.inline) ? params.viewModel.footer.form.inline : viewModel.footer.form.inline;
			viewModel.footer.form.label_position = isNotNull(params.viewModel.footer.form.label_position) ? params.viewModel.footer.form.label_position : viewModel.footer.form.label_position;
			viewModel.footer.form.label_width = isNotNull(params.viewModel.footer.form.label_width) ? params.viewModel.footer.form.label_width : viewModel.form_item_label_width;
			viewModel.footer.form.label_suffix = isNotNull(params.viewModel.footer.form.label_suffix) ? params.viewModel.footer.form.label_suffix : viewModel.footer.form.label_suffix;
			viewModel.footer.form.show_message = isNotNull(params.viewModel.footer.form.show_message) ? params.viewModel.footer.form.show_message : viewModel.footer.form.show_message;
			viewModel.footer.form.inline_message = isNotNull(params.viewModel.footer.form.inline_message) ? params.viewModel.footer.form.inline_message : viewModel.footer.form.inline_message;
			viewModel.footer.form.status_icon = isNotNull(params.viewModel.footer.form.status_icon) ? params.viewModel.footer.form.inline_message : viewModel.footer.form.inline_message;
			viewModel.footer.form.size = isNotNull(params.viewModel.footer.form.size) ? params.viewModel.footer.form.size : viewModel.footer.size;


			methodModel.setSizeAfter(viewModel);


			// 界面默认设置备份
			viewModel.viewSetings.historySetings.toolbar_display = viewModel.toolbar.display;
			viewModel.viewSetings.historySetings.head_display = viewModel.head.display;
			viewModel.viewSetings.historySetings.body_display = viewModel.body.display;
			viewModel.viewSetings.historySetings.footer_display = viewModel.footer.display;
			viewModel.viewSetings.historySetings.size = viewModel.size;
			viewModel.viewSetings.historySetings.head_size = viewModel.head.size;
			viewModel.viewSetings.historySetings.body_size = viewModel.body.size;
			viewModel.viewSetings.historySetings.footer_size = viewModel.footer.size;


			/** 项目构建 */
			if(params.viewModel.head.form.items && params.viewModel.head.form.items.length) {
				params.viewModel.head.form.items.forEach(function(item, index, array) {
					item.size = isNotNull(item.size) ? item.size : viewModel.head.size;
					item.show_label = isNotNull(item.show_label) ? item.show_label : viewModel.head.form.show_label;
					item.item_width = isNotNull(item.item_width) ? item.item_width : viewModel.head.form.item_width;
					item.item_label_width = isNotNull(item.item_label_width) ? item.item_label_width : viewModel.head.form.item_label_width;
					viewModel.head.form.items.push(methodModel.createItemModel(item, Pos.head));
				});
			}
			if(params.viewModel.body.items && params.viewModel.body.items.length) {
				params.viewModel.body.items.forEach(function(item, index, array) {
					item.size = isNotNull(item.size) ? item.size : viewModel.body.size;
					viewModel.body.items.push(methodModel.createItemModel(item, Pos.body));
				});
			}
			if(params.viewModel.footer.form.items && params.viewModel.footer.form.items.length) {
				params.viewModel.footer.form.items.forEach(function(item, index, array) {
					item.size = isNotNull(item.size) ? item.size : viewModel.footer.size;
					item.show_label = isNotNull(item.show_label) ? item.show_label : viewModel.footer.form.show_label;
					item.item_width = isNotNull(item.item_width) ? item.item_width : viewModel.footer.form.item_width;
					item.item_label_width = isNotNull(item.item_label_width) ? item.item_label_width : viewModel.footer.form.item_label_width;
					viewModel.footer.form.items.push(methodModel.createItemModel(item, Pos.footer));
				});
			}

			return {
				data : function() {
					return {
						/** 界面模型 */
						viewModel : viewModel,
						/** 用户自定义扩展模型 */
						userExtendModel : params.userExtendModel || {},
						data : {
							/** 原始数据模型 */
							rawDataModel : params.dataModel || {body : []},
							/** 数据模型 */
							dataModel : params.dataModel || {body : []},
							/** 数据模型映射 */
							dataModelMate : params.dataModelMate || { head : {}, body : {}}
						},
						/** 服务URL地址 */
						serviceURL : params.serviceURL || {},
						/** 用户定义方法，例如事件拦截 */
						userMethods : params.userMethods || {},
						/** vue events */
						vueEvents : params.vueEvents  || {}
					}
				},

				methods : methodModel || {},

				beforeCreate : function () {
					$w.$app = this;
					if(this.vueEvents && this.vueEvents.beforeCreate) {
						this.vueEvents.beforeCreate(this);
					}
				},
				created : function () {
					if(this.vueEvents && this.vueEvents.created) {
						this.vueEvents.created(this);
					}
				},
				beforeMount : function () {
					if(this.vueEvents && this.vueEvents.beforeMount) {
						this.vueEvents.beforeMount(this);
					}
				},
				mounted : function () {
					if(this.vueEvents && this.vueEvents.mounted) {
						this.vueEvents.mounted(this);
					}
				},
				beforeUpdate : function () {
					if(this.vueEvents && this.vueEvents.beforeUpdate) {
						this.vueEvents.beforeUpdate(this);
					}
				},
				updated : function () {
					if(this.vueEvents && this.vueEvents.updated) {
						this.vueEvents.updated(this);
					}
				},
				beforeDestroy : function () {
					if(this.vueEvents && this.vueEvents.beforeDestroy) {
						this.vueEvents.beforeDestroy(this);
					}
				},
				destroyed : function () {
					if(this.vueEvents && this.vueEvents.destroyed) {
						this.vueEvents.destroyed(this);
					}
				}
			}
		}
	}
})(window, window);