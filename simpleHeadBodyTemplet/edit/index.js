var Templet = Vue.extend(
    $T.createTemplet({
        dataModel: {
            name: "张三",
            age: 200,
            checkbox_item: [],
            date_picker_week: new Date("2018-05-14"),
            body: [
                {name: "张三", age: 20, remark: "备注说明1",radio_item : "01",checkbox_item : ['2']},
                {name: "李四", age: 22, remark: "备注说明2"}
            ]
        },
        viewModel: {

            size: "mini",
            head: {
                data_model_key: null,
                form: {
                    label_suffix: "：",
                    items: [
                        {
                            key: "name",
                            data_key: "name",
                            label: "名称",
                            prefix_icon: "el-icon-search",
                            type: "text",
                            item_type: 1,
                            placeholder: "名称", disabled: true
                        },
                        {
                            key: "age",
                            data_key: "age",
                            label: "年龄",
                            type: "number",
                            item_type: 1,
                            placeholder: "年龄"
                        },
                        {
                            key: "remark",
                            data_key: "remark",
                            label: "备注说明",
                            show_label: true,
                            style: "color:yellow",
                            rows: 1,
                            type: "textarea",
                            item_type: 1,
                            placeholder: "备注说明"
                        },
                        {
                            key: "count",
                            data_key: "count",
                            label: "数量",
                            type: "scaler",
                            item_type: 1,
                            placeholder: "数量",
                            min: 1,
                            max: 10,
                            step: 1,
                            controls: true,
                            controls_position: null
                        },
                        {
                            key: "selectitem",
                            data_key: "selectitem",
                            label: "下拉选择",
                            type: "select",
                            item_type: 1,
                            placeholder: "请选择",
                            multiple: true,
                            filterable: true,
                            collapse_tags: false,
                            separator: ",",
                            options: [{value: 1, name: "项1"}, {value: 2, name: "项2"}, {value: 3, name: "项3"}, {
                                value: 4,
                                name: "项目4"
                            }],
                            option_key: "value",
                            option_label: "name",
                            option_disabled_key: "desabled",
                        },
                        {
                            key: "cascaderitem",
                            data_key: "cascaderitem",
                            label: "级联选择",
                            type: "cascader",
                            item_type: 1,
                            placeholder: "请选择",
                            show_separator: "\\",
                            filterable: true,
                            options: [
                                {
                                    id: 1, name: "项目", desabled: false, body: [
                                    {id: 11, name: "项目1", desabled: false},
                                    {id: 12, name: "项目2", desabled: true},
                                    {
                                        id: 13, name: "项目3", body: [
                                        {id: 131, name: "项目3-1"},
                                        {id: 132, name: "项目3-2"}
                                    ]
                                    }
                                ]
                                },
                                {id: 2, name: "工程"}
                            ],
                            option_key: "id",
                            option_label: "name",
                            option_children: "body",
                            option_disabled_key: "desabled"
                        },
                        {
                            key: "switchitem",
                            data_key: "switchitem",
                            label: "是否活动",
                            type: "switch",
                            item_type: 1,
                            active_value: "on",
                            inactive_value: "off",
                            active_text: "on",
                            inactive_text: "off"
                        },
                        {
                            key: "slideritem",
                            data_key: "slideritem",
                            label: "滑块控件",
                            type: "slider",
                            item_type: 1

                        },
                        {
                            key: "radio_item",
                            data_key: "radio_item",
                            label: "单选框",
                            type: "radio",
                            item_type: 1,
                            options: [{id: "01", name: "无早", hideitem: false}, {
                                id: "02",
                                name: "单早",
                                desabled: true
                            }, {id: "03", name: "双早"}],
                            option_key: "id",
                            option_label: "name",
                            option_disabled_key: "desabled",
                            option_hide_key: "hideitem"
                        },
                        {
                            key: "checkbox_item",
                            data_key: "checkbox_item",
                            label: "复选框",
                            type: "checkbox",
                            item_type: 1,
                            options: [{id: '1', name: '上海'}, {id: '2', name: '北京', desabled: true}, {
                                id: '3',
                                name: '广州',
                                hide: true
                            }, {id: '4', name: '深圳'}],
                            option_key: "id",
                            option_label: "name",
                            option_disabled_key: "desabled",
                            option_hide_key: "hide"
                        },
                        {
                            key: "rate_item",
                            data_key: "rate_item",
                            label: "评分",
                            type: "rate",
                            show_text: true,
                            item_type: 1

                        },
                        {
                            key: "time_select",
                            data_key: "time_select",
                            label: "时间下拉",
                            type: "time-select",
                            item_type: 1
                        },
                        {
                            key: "time_picker",
                            data_key: "time_picker",
                            label: "时间控件",
                            type: "time-picker",
                            is_range: true,
                            picker_options: {
                                selectableRange: ['10:30:00 - 12:00:00', '14:30:00 - 15:30:00'], // 暂无效果，待详细测试
                                format: "HH:mm"
                            },
                            item_type: 1
                        },
                        {
                            key: "date_picker",
                            data_key: "date_picker",
                            label: "日期控件",
                            type: "date-picker",
                            item_type: 1
                        },
                        {
                            key: "date_picker_year",
                            data_key: "date_picker_year",
                            label: "年度",
                            type: "date-picker",
                            date_type: "year",
                            item_type: 1
                        },
                        {
                            key: "date_picker_month",
                            data_key: "date_picker_month",
                            label: "月份",
                            type: "date-picker",
                            date_type: "month",
                            title: function (appData) {
                                return isNotNull(appData.value) ? Number(appData.value) + "月" : appData.value;
                            },
                            item_type: 1
                        },
                        {
                            key: "date_picker_week",
                            data_key: "date_picker_week",
                            label: "周",
                            type: "date-picker",
                            date_type: "week",
                            title: function (appData) {
                                return isNotNull(appData.value) ? moment(appData.value).format("YYYY年第W周") : appData.value;
                            },
                            item_type: 1
                        },
                        {
                            key: "date_picker_datetime",
                            data_key: "date_picker_datetime",
                            label: "完整时间",
                            type: "date-picker",
                            date_type: "datetime",
                            item_type: 1
                        },
                        {
                            key: "date_picker_datetimerange",
                            data_key: "date_picker_datetimerange",
                            label: "时间范围",
                            type: "date-picker",
                            range_separator: "至", start_placeholder: "开始日期", end_placeholder: "结束日期",
                            date_type: "datetimerange",
                            item_type: 1
                        },
                        {
                            key: "date_picker_daterange",
                            data_key: "date_picker_daterange",
                            label: "日期范围",
                            type: "date-picker",
                            range_separator: "至", start_placeholder: "开始日期", end_placeholder: "结束日期",
                            date_type: "daterange",
                            item_type: 1
                        },
                        {
                            key: "color_item",
                            data_key: "color_item",
                            label: "H5颜色控件",
                            type: "color",
                            item_type: 1
                        },
                        {
                            key: "color_item2",
                            data_key: "color_item2",
                            label: "Ele颜色控件",
                            type: "color-picker",
                            item_type: 1
                        },
                        {
                            key: "ref_item",
                            data_key: "ref_item",
                            label: "参照",
                            type: "ref",
                            ref: {
                                type: "table"
                            },
                            item_type: 1,
                            readonly: true,
                            placeholder: "参照"
                        }
                    ]
                }
            },
            body: {
                data_model_key: "body",
                bodyModel: {
                    items: [
                        {
                            key: "text",
                            data_key: "text",
                            label: "text",
                            type: "text",
                            item_type: 2,
                            sortable: true,
                            placeholder: "text"
                        },
                        {
                            key: "number",
                            data_key: "number",
                            label: "number",
                            type: "number",
                            item_type: 2,
                            sortable: true,
                            placeholder: "number"
                        },
                        {
                            key: "scaler",
                            data_key: "scaler",
                            label: "scaler",
                            type: "scaler",
                            item_type: 2,
                            sortable: true,
                            width : 100,
                            placeholder: "scaler"
                        },
                        {
                            key: "textarea",
                            data_key: "textarea",
                            label: "textarea",
                            type: "textarea",
                            item_type: 2,
                            placeholder: "textarea"
                        },
                        {
                            key: "radio_item",
                            data_key: "radio_item",
                            label: "单选框",
                            type: "radio",
                            item_type: 1,
                            disabled : true,
                            options: [{id: "01", name: "无早", hideitem: false}, {
                                id: "02",
                                name: "单早",
                                desabled: true
                            }, {id: "03", name: "双早"}],
                            option_key: "id",
                            option_label: "name",
                            option_disabled_key: "desabled",
                            option_hide_key: "hideitem"
                        },
                        {
                            key: "checkbox_item",
                            data_key: "checkbox_item",
                            label: "复选框",
                            type: "checkbox",
                            item_type: 1,
                            options: [{id: '1', name: '上海'}, {id: '2', name: '北京', desabled: true}, {
                                id: '3',
                                name: '广州',
                                hide: true
                            }, {id: '4', name: '深圳'}],
                            option_key: "id",
                            option_label: "name",
                            option_disabled_key: "desabled",
                            option_hide_key: "hide"
                        },
                        {
                            key: "selectitem",
                            data_key: "selectitem",
                            label: "下拉选择",
                            type: "select",
                            item_type: 1,
                            placeholder: "请选择",
                            multiple: false,
                            filterable: true,
                            collapse_tags: false,
                            separator: ",",
                            options: [{value: 1, name: "项1"}, {value: 2, name: "项2"}, {value: 3, name: "项3"}, {
                                value: 4,
                                name: "项目4"
                            }],
                            option_key: "value",
                            option_label: "name",
                            option_disabled_key: "desabled",
                        },
                        {
                            key: "cascaderitem",
                            data_key: "cascaderitem",
                            label: "级联选择",
                            type: "cascader",
                            item_type: 1,
                            placeholder: "请选择",
                            show_separator: "\\",
                            filterable: true,
                            options: [
                                {
                                    id: 1, name: "项目", desabled: false, body: [
                                    {id: 11, name: "项目1", desabled: false},
                                    {id: 12, name: "项目2", desabled: true},
                                    {
                                        id: 13, name: "项目3", body: [
                                        {id: 131, name: "项目3-1"},
                                        {id: 132, name: "项目3-2"}
                                    ]
                                    }
                                ]
                                },
                                {id: 2, name: "工程"}
                            ],
                            option_key: "id",
                            option_label: "name",
                            option_children: "body",
                            option_disabled_key: "desabled"
                        },
                        {
                            key: "switchitem",
                            data_key: "switchitem",
                            label: "是否活动",
                            type: "switch",
                            item_type: 1,
                            active_value: "on",
                            inactive_value: "off",
                        },
                        {
                            key: "slideritem",
                            data_key: "slideritem",
                            label: "滑块控件",
                            type: "slider",
                            item_type: 1

                        },
                        {
                            key: "rate_item",
                            data_key: "rate_item",
                            label: "评分",
                            type: "rate",
                            show_text: true,
                            item_type: 1

                        },
                        {
                            key: "time_select",
                            data_key: "time_select",
                            label: "时间下拉",
                            type: "time-select",
                            item_type: 1
                        },
                        {
                            key: "time_picker",
                            data_key: "time_picker",
                            label: "时间控件",
                            type: "time-picker",
                            is_range: true,
                            picker_options: {
                                selectableRange: ['10:30:00 - 12:00:00', '14:30:00 - 15:30:00'], // 暂无效果，待详细测试
                                format: "HH:mm"
                            },
                            item_type: 1
                        },
                        {
                            key: "date_picker",
                            data_key: "date_picker",
                            label: "日期控件",
                            type: "date-picker",
                            item_type: 1
                        },
                        {
                            key: "date_picker_year",
                            data_key: "date_picker_year",
                            label: "年度",
                            type: "date-picker",
                            date_type: "year",
                            item_type: 1
                        },
                        {
                            key: "date_picker_month",
                            data_key: "date_picker_month",
                            label: "月份",
                            type: "date-picker",
                            date_type: "month",
                            title: function (appData) {
                                return isNotNull(appData.value) ? Number(appData.value) + "月" : appData.value;
                            },
                            item_type: 1
                        },
                        {
                            key: "date_picker_week",
                            data_key: "date_picker_week",
                            label: "周",
                            type: "date-picker",
                            date_type: "week",
                            title: function (appData) {
                                return isNotNull(appData.value) ? moment(appData.value).format("YYYY年第W周") : appData.value;
                            },
                            item_type: 1
                        },
                        {
                            key: "date_picker_datetime",
                            data_key: "date_picker_datetime",
                            label: "完整时间",
                            type: "date-picker",
                            date_type: "datetime",
                            item_type: 1
                        },
                        {
                            key: "date_picker_datetimerange",
                            data_key: "date_picker_datetimerange",
                            label: "时间范围",
                            type: "date-picker",
                            range_separator: "至", start_placeholder: "开始日期", end_placeholder: "结束日期",
                            date_type: "datetimerange",
                            item_type: 1
                        },
                        {
                            key: "date_picker_daterange",
                            data_key: "date_picker_daterange",
                            label: "日期范围",
                            type: "date-picker",
                            range_separator: "至", start_placeholder: "开始日期", end_placeholder: "结束日期",
                            date_type: "daterange",
                            item_type: 1
                        },
                        {
                            key: "color_item",
                            data_key: "color_item",
                            label: "H5颜色控件",
                            type: "color",
                            item_type: 1
                        },
                        {
                            key: "color_item2",
                            data_key: "color_item2",
                            label: "Ele颜色控件",
                            type: "color-picker",
                            item_type: 1
                        },
                        {
                            key: "ref_item",
                            data_key: "ref_item",
                            label: "参照",
                            type: "ref",
                            ref: {
                                type: "table"
                            },
                            // disabled:true,
                            item_type: 2,
                            readonly: true,
                            placeholder: "参照"
                        }
                    ],
                }
            }
        }
    })
);
new Templet().$mount('#app');