// component/tag/index.js
Component({
        /**
         * 组件的属性列表
         */
        options: {
                // 启用插槽
                multipleSlots: true
        },
        properties: {
                text: String
        },
        externalClasses: ['tag-class'],
        /**
         * 组件的初始数据
         */
        data: {

        },

        /**
         * 组件的方法列表
         */
        methods: {
                onTap(event) {
                        // 发送自定义的事件
                        this.triggerEvent('tapping', {
                                text: this.properties.text
                        });
                }
        }
})
