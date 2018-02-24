
var Templet = Vue.extend(
    $T.createTemplet({
        dataModel : {
            name : "张三",
            age : 200,
            checkbox_item : [],
            date_picker_week : new Date("2018-05-14"),
            body : [
                {name : "张三", age : 20, remark : "备注说明1",radio_item : "01",checkbox_item : ['2'],psn:{id:null,name:null}},
                {name : "李四", age : 22, remark : "备注说明2"}
            ]
        },
        commonDataModel : {
            regions : [{id : "0101",name : "华南区"},{id : "0102",name : "华东区"},{id : "0103",name : "华北区"}],
            psndocs : [
                {id : "1001", code : "1001", age : 22,name : "张三"},
                {id : "1002", code : "1002", age : 23,name : "李明"},
                {id : "1003", code : "1003", age : 33,name : "王二"},
                {id : "1004", code : "1004", age : 21,name : "小李"}
            ]
        },
        viewModel : {
            size : "mini",
            collapseModel : {
                // accordion : true,
                // spreadall : false,
                value : ["dataForm2","dataTable"],
                items : [
                    {
                        data_model_key : null,
                        key : "dataForm",				// KEY 作为ref对象引用 (自定义)
                        //$model : null,                  // 关联数据模型
                        type : "form",                   // 类型（呈现为表格/表单）
                        title : "表单",                  // 显示标题
                        name : "dataForm",              // 作为 collapse-item 的 name
                        size : "mini",
                        display : true,
                        formModel : {
                            items : [
                                {
                                    key : "ref_item",
                                    data_key : "ref_item",
                                    data_value_key : "ref_item_key",
                                    label : "省份",
                                    //common_data_key : "psndocs",   // 公共数据KEY（与 ref.model 提供一个属性即可,如传入此属性，则ref.model属性无效）
                                    type : "ref",
                                    refModel : {
                                        type : "table",
                                        ref_key : "id",
                                        model : [
                                            {id : "1001",code : "1001",name : "广东"},
                                            {id : "1002",code : "1002",name : "湖南"}
                                        ],             // 参照数据模型（与 common_data_key 提供一个属性即可）
                                        columns : [
                                            {key : "code", data_key : "code", label : "编码", sortable : true, width : 80},
                                            {key : "name", data_key : "name", label : "名称"}
                                        ],
                                        pagination : {
                                            enabled : false				// 启用分页
                                        },
                                        getsets : [
                                            {get:"name",set:"ref_item"}
                                        ]
                                    },
                                    getsets : [
                                        {get:"ref_item_key",set:"ref_item_key2"}
                                    ],
                                    // disabled : true,
                                    placeholder : "选择省份"
                                }
                            ],						// 表单域/表格列模型集合 (自定义)
                            width : null,				// 表单宽度 (自定义，暂未用)
                            item_width : null,			// 表单域默认宽度-控件(自定义)
                            show_label : true,			// 是否显示表单域标签文本 (自定义)

                            model : null,				// 表单数据对象	object	—	—
                            rules : null,				// 表单验证规则	object	—	—
                            inline : true,				// 行内表单模式	boolean	—	false
                            label_position : "right",	// 表单域标签的位置	string	right/left/top	right
                            label_width : null,			// 表单域标签的宽度，作为 Form 直接子元素的 form-item 会继承该值	string	—	—
                            label_suffix : "",			// 表单域标签的后缀	string	—	—
                            show_message : true,		    // 是否显示校验错误信息	boolean	—	true
                            inline_message : true,		// 是否以行内形式展示校验信息	boolean	—	false
                            status_icon : false,		    // 是否在输入框中显示校验结果反馈图标	boolean	—	false
                            size : "mini",				// (暂不用，使用footer.size)用于控制该表单内组件的尺寸	string	medium / small / mini	-
                        }
                    },
                    {
                        data_model_key : "body",
                        key : "dataTable",				// KEY 作为ref对象引用 (自定义)
                        //$model : null,                  // 关联数据模型
                        type : "table",                  // 类型（呈现为表格/表单）
                        title : "表格",                  // 显示标题
                        name : "dataTable",             // 作为 collapse-item 的 name
                        size : "mini",
                        display : true,
                        tableModel : {
                            items : [
                                {
                                    key : "psn.id",
                                    data_key : "psn.name",
                                    data_value_key : "psn.id",
                                    label : "人员参照",
                                    common_data_key : "psndocs",   // 公共数据KEY（与 ref.model 提供一个属性即可,如传入此属性，则ref.model属性无效）
                                    type : "ref",
                                    refModel : {
                                        type : "table",
                                        ref_key : "id",
                                        multiple : true,
                                        //model : [],             // 参照数据模型（与 common_data_key 提供一个属性即可）
                                        columns : [
                                            {key : "code", data_key : "code", label : "编码", sortable : true, width : 120},
                                            {key : "age", data_key : "age", label : "年龄", width : 120},
                                            {key : "name", data_key : "name", label : "名称"}
                                        ],
                                        pagination : {
                                            enabled : false				// 启用分页
                                        },
                                        getsets : [
                                            {get : "name", set : "psn.name"}
                                        ]
                                    },
                                    value : function (a,b,c,d) {
                                        return "value";
                                    },
                                    getsets : [
                                        {get : "psn.id", set : "psn.id2"}
                                    ],
                                    // disabled : true,
                                    width : 120,
                                    placeholder : "人员参照"
                                }
                            ],						// 表单域/表格列模型集合 (自定义)
                            /** 表格属性 */
                            data : null,					    // 显示的数据	array	—	—
                            height : null,					// Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则 Table 的高度受控于外部样式。	string/number	—	—
                            max_height : null,				// Table 的最大高度	string/number	—	—
                            stripe : false,					// 是否为斑马纹 table	boolean	—	false
                            border : true,					// 是否带有纵向边框	boolean	—	false
                            size : "mini",					// Table 的尺寸	string	medium / small / mini	—
                            fit : true,						// 列的宽度是否自撑开	boolean	—	true
                            show_header : true,				// 是否显示表头	boolean	—	true
                            highlight_current_row : true,	// 是否要高亮当前行	boolean	—	false
                            current_row_key : null,			// 当前行的 key，只写属性	String,Number	—	—
                            row_class_name : null,			// 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。	Function({row, rowIndex})/String	—	—
                            row_style : null,				// 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。	Function({row, rowIndex})/Object	—	—
                            cell_class_name : null,			// 单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。	Function({row, column, rowIndex, columnIndex})/String	—	—
                            cell_style : null,				// 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。	Function({row, column, rowIndex, columnIndex})/Object	—	—
                            header_row_class_name : null,	// 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。	Function({row, rowIndex})/String	—	—
                            header_row_style : null,		// 表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style。	Function({row, rowIndex})/Object	—	—
                            header_cell_class_name : null,	// 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。	Function({row, column, rowIndex, columnIndex})/String	—	—
                            header_cell_style : null,		// 表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。	Function({row, rowIndex, rowIndex, columnIndex})/Object	—	—
                            row_key : null,					// 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能的情况下，该属性是必填的。类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。	Function(row)/String	—	—
                            empty_text : "暂无数据",		// 空数据时显示的文本内容，也可以通过 slot="empty" 设置	String	—	暂无数据
                            default_expand_all : false,		// 是否默认展开所有行，当 Table 中存在 type="expand" 的 Column 的时候有效	Boolean	—	false
                            expand_row_keys : null,			// 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。	Array	—
                            default_sort : {},			// 默认的排序列的prop和顺序。它的prop属性指定默认的排序的列，order指定默认排序的顺序	Object	order : ascending, descending	如果只指定了prop, 没有指定order, 则默认顺序是ascending
                            tooltip_effect : null,			// tooltip effect 属性	String	dark/light
                            show_summary : null,			// 是否在表尾显示合计行	Boolean	—	false
                            sum_text : "合计",				// 合计行第一列的文本	String	—	合计
                            summary_method : null,			// 自定义的合计计算方法	Function({ columns, data })	—	—
                            span_method : null,				// 合并行或列的计算方法	Function({ row, column, rowIndex, columnIndex })	—

                            show_selection : true,			// 显示选择列
                            show_index : true,				// 显示索引列

                            events : {
                                /**
                                 * 当用户手动勾选数据行的 Checkbox 时触发的事件
                                 */
                                select : function (selection, row) {
                                },
                                /**
                                 * 当用户手动勾选全选 Checkbox 时触发的事件
                                 */
                                selectAll : function (selection) {
                                },
                                /**
                                 * 当选择项发生变化时会触发该事件
                                 */
                                selectionChange : function (selection) {
                                },
                                /**
                                 * 当单元格 hover 进入时会触发该事件
                                 */
                                cellMouseEnter : function (row, column, cell, event) {
                                },
                                /**
                                 * 当单元格 hover 退出时会触发该事件
                                 */
                                cellMouseLeave : function (row, column, cell, event) {
                                },
                                /**
                                 * 当某个单元格被点击时会触发该事件
                                 */
                                cellClick : function (row, column, cell, event) {
                                },
                                /**
                                 * 当某个单元格被双击击时会触发该事件
                                 */
                                cellDblclick : function (row, column, cell, event) {
                                },
                                /**
                                 * 当某一行被点击时会触发该事件
                                 */
                                rowClick : function (row, event, column) {
                                },
                                /**
                                 * 当某一行被鼠标右键点击时会触发该事件
                                 */
                                rowContextmenu : function (row, event) {
                                },
                                /**
                                 * 当某一行被双击时会触发该事件
                                 */
                                rowDblclick : function (row, event) {
                                },
                                /**
                                 * 当某一列的表头被点击时会触发该事件
                                 */
                                headerClick : function (column, event) {
                                },
                                /**
                                 * 当表格的排序条件发生变化的时候会触发该事件
                                 */
                                sortChange : function (appData) {
                                },
                                /**
                                 * 当表格的筛选条件发生变化的时候会触发该事件，参数的值是一个对象，对象的 key 是 column 的 columnKey，对应的 value 为用户选择的筛选条件的数组。
                                 */
                                filterChange : function (filters) {
                                },
                                /**
                                 * 当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性
                                 */
                                currentChange : function (currentRow, oldCurrentRow) {
                                },
                                /**
                                 * 当拖动表头改变了列的宽度的时候会触发该事件
                                 */
                                headerDragend : function (newWidth, oldWidth, column, event) {
                                },
                                /**
                                 * 当用户对某一行展开或者关闭的时候会触发该事件
                                 */
                                expandChange : function (row, expandedRows) {
                                },
                            }
                        }
                    },
                    {
                        data_model_key : null,
                        key : "dataForm2",				// KEY 作为ref对象引用 (自定义)
                        //$model : null,                  // 关联数据模型
                        type : "form",                   // 类型（呈现为表格/表单）
                        title : "表单2",                  // 显示标题
                        name : "dataForm2",              // 作为 collapse-item 的 name
                        size : "mini",
                        display : true,
                        formModel : {
                            items : [
                                {
                                    key : "ref_item",
                                    data_key : "ref_item",
                                    label : "参照",
                                    type : "ref",
                                    refModel : {
                                        type : "table"
                                    },
                                    item_type : 1,
                                    readonly : true,
                                    placeholder : "参照"
                                }
                            ],						// 表单域/表格列模型集合 (自定义)
                            width : null,				// 表单宽度 (自定义，暂未用)
                            item_width : null,			// 表单域默认宽度-控件(自定义)
                            show_label : true,			// 是否显示表单域标签文本 (自定义)

                            model : null,				// 表单数据对象	object	—	—
                            rules : null,				// 表单验证规则	object	—	—
                            inline : true,				// 行内表单模式	boolean	—	false
                            label_position : "right",	// 表单域标签的位置	string	right/left/top	right
                            label_width : null,			// 表单域标签的宽度，作为 Form 直接子元素的 form-item 会继承该值	string	—	—
                            label_suffix : "",			// 表单域标签的后缀	string	—	—
                            show_message : true,		    // 是否显示校验错误信息	boolean	—	true
                            inline_message : true,		// 是否以行内形式展示校验信息	boolean	—	false
                            status_icon : false,		    // 是否在输入框中显示校验结果反馈图标	boolean	—	false
                            size : "mini",				// (暂不用，使用footer.size)用于控制该表单内组件的尺寸	string	medium / small / mini	-
                        }
                    },
                ]
            }
        }
    })
);
new Templet().$mount('#app');