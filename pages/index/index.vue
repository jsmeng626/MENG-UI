<template>
    <view>
        <!-- 图片视频上传组件 -->
        <!-- <ManyImgUpload :showToogle="false" :count="3" @chooseAfter="chooseAfter"></ManyImgUpload> -->
    </view>
</template>

<script>

export default {
    data() {
        return {
        }
    },
    onLoad() {
        // 自己的http工具类
        // this.getInfo()

        // 全局消息组件
        // this.$openInvite()
    },
    methods: {
        async getInfo() {
            const result = await this.$api.getInfo({ id: 'd9fabc6b73b271ea' })
            if(result.code === 200) {
                uni.showToast({
                    title: 'hello jsmeng'
                })
            }
        },
        chooseAfter(res) {
            console.log(res);
        }
    },
}
</script>

<style lang="scss" scoped>
</style>
