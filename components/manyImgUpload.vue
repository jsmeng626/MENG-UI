<template>
  <view class="container">
    <!-- radio group -->
    <view class="radio-group" v-if="showToogle">
      <!-- radio single -->
      <view class="radio-single" v-for="(item, index) in radioList" :key="item.value" @click="radioToogleBtn(index)">
        <view class="radio-icon">
          <image v-show="item.isActive" src="/static/choose.png" mode="aspectFill" lazy-load="true" />
        </view>
        <view class="text">{{ item.name }}</view>
      </view>
    </view>
    <!-- image upload group -->
    <view class="image-group" v-show="imgVideoFlag">
      <!-- single upload container -->
      <view class="image-single" v-for="(item, index) in uploadImgList" :key="index">
        <image v-show="!item.imgUrl" @click="uploadImgBtn(index)" src="/static/shangchuan.png" mode="aspectFill" lazy-load="true" />
        <image v-show="item.imgUrl" :src="item.imgUrl" mode="aspectFill" lazy-load="true" />
        <image v-show="item.showDelImg" @click="delImgBtn(index)" class="del-icon" src="/static/delImg.png" mode="aspectFill" lazy-load="true" />
      </view>
    </view>
    <!-- video upload group -->
    <view class="video-group" v-show="!imgVideoFlag">
      <!-- single upload container -->
      <view class="video-single" v-for="(item, index) in uploadVideoList" :key="index">
        <image v-show="!item.videoUrl" @click="uploadVideoBtn(index)" src="/static/shangchuan.png" mode="aspectFill" lazy-load="true" />
        <video v-show="item.videoUrl" :src="item.videoUrl" />
        <image v-show="item.showDelImg" @click="delVideoBtn(index)" class="del-icon" src="/static/delImg.png" mode="aspectFill" lazy-load="true" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ManyImgUpload', 

  // 使用说明
  // 示例 <ManyImgUpload :showToogle="true" :count="3" @chooseAfter="chooseAfter"></ManyImgUpload>
  // 属性 
  // showToogle 是否显示图片和视频的切换按钮，默认为false
  // count 限制上传数量，默认1张
  // 事件
  // chooseAfter 参数(urlList)，urlList为图片和视频的文件上传后的完整url

  props: {
    // 是否显示图片和视频的切换按钮
    showToogle: {
      type: Boolean,
      default: false
    },
    // 上传单组的数量，默认1
    count: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {
      // 上传图片框组以及显隐由该list控制
      uploadImgList: [
        {
          imgUrl: '',
          showDelImg: false,
        }
      ],
      // 上传视频框组以及显隐由该list控制
      uploadVideoList: [
        {
          videoUrl: '',
          showDelImg: false,
        }
      ],
      // 单选框组
      radioList: [
        { name: '图片', value: 0, isActive: true },
        { name: '视频', value: 1, isActive: false }
      ],
      // 图片和视频的切换标记
      imgVideoFlag: true
    }
  },

  methods: {
    // 单选切换
    radioToogleBtn(index) {
      this.radioList.forEach(item => item.isActive = false)
      this.radioList[index].isActive = true
      this.imgVideoFlag = !this.imgVideoFlag
    },
    // 图片上传按钮
    uploadImgBtn(index) {
      // 选择图片
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
          // console.log('本地', res);
          // 加载
          uni.showLoading({
            title: '正在上传'
          })

          // 上传具体操作
          uni.uploadFile({
            url: 'https://yihu.broing.cn/prod-api/api/file/img',
            files: res.tempFilePaths.map(item => {
              return {
                name: 'file',
                uri: item
              }
            }),
            header: {
              'Authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjBmMjM0YjMyLWZkOTktNDdmZC1hZWQ1LTkwMTQzZmQwNTljYSJ9.FNefBR_Ai_aTCrJ4woYkZPR7QorwN-KwnwNeUim7aRxzSPCHPyFHvVnh5NsKjJJ2EHE6sSthBloMmMT_FLImyw'
            },
            success: (uploadFileJson) => {
              const fileObj = JSON.parse(uploadFileJson.data)
              if(fileObj.code !== 200) return
              // console.log('服务器', fileObj);
              // 关闭加载状态
              uni.hideLoading()
              // 回显
              this.uploadImgList[index].imgUrl = fileObj.data.url
              // 显示单组的删除按钮
              this.uploadImgList[index].showDelImg = true
              // 将图片框组的url传递出去
              this.$emit('chooseAfter', {
                imgUrlList: this.uploadImgList.filter(item => item.imgUrl).map(item => item.imgUrl),
                videoUrlList: this.uploadVideoList.filter(item => item.videoUrl).map(item => item.videoUrl)
              })
              // 加一个上传单组, 超出最大上传数量，不再添加
              if(this.uploadImgList.length >= this.count ) return
              this.uploadImgList.push({ imgUrl: '', showDelImg: false, })
            }
          }) 

        }
      })
    },
    // 删除图片按钮
    delImgBtn(index) {
      // 将这一项干掉
      this.uploadImgList.splice(index, 1)
      // 将图片框组的url传递出去
      this.$emit('chooseAfter', {
        imgUrlList: this.uploadImgList.filter(item => item.imgUrl).map(item => item.imgUrl),
        videoUrlList: this.uploadVideoList.filter(item => item.videoUrl).map(item => item.videoUrl)
      })
      // 如果每个url都有值加一个
      const addFlag = this.uploadImgList.every(item => item.imgUrl !== '')
      if(addFlag) {
        this.uploadImgList.push({ imgUrl: '', delImgShow: false })
      }
      // 如果都删完了，加一个上传的
      if(this.uploadImgList.length > 0) return
      this.uploadImgList.push({ imgUrl: '', delImgShow: false })
    },
    // 视频上传按钮
    uploadVideoBtn(index) {
      // 选择视频
      uni.chooseVideo({
        sourceType: ['camera', 'album'],
        success: (res) => {
          // console.log('本地', res);
          // 加载
          uni.showLoading({
            title: '正在上传'
          })

          // 上传具体操作
          uni.uploadFile({
            url: 'https://yihu.broing.cn/prod-api/api/file/img',
            filePath: res.tempFilePath,
            name: 'file',
            header: {
              'Authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjBmMjM0YjMyLWZkOTktNDdmZC1hZWQ1LTkwMTQzZmQwNTljYSJ9.FNefBR_Ai_aTCrJ4woYkZPR7QorwN-KwnwNeUim7aRxzSPCHPyFHvVnh5NsKjJJ2EHE6sSthBloMmMT_FLImyw'
            },
            success: (uploadFileJson) => {
              const fileObj = JSON.parse(uploadFileJson.data)
              if(fileObj.code !== 200) return
              // console.log('服务器', fileObj);
              // 关闭加载状态
              uni.hideLoading()
              // 回显
              this.uploadVideoList[index].videoUrl = fileObj.data.url
              // 显示单组的删除按钮
              this.uploadVideoList[index].showDelImg = true
              // 将图片和视频框组的url传递出去
              this.$emit('chooseAfter', {
                imgUrlList: this.uploadImgList.filter(item => item.imgUrl).map(item => item.imgUrl),
                videoUrlList: this.uploadVideoList.filter(item => item.videoUrl).map(item => item.videoUrl)
              })
              // 加一个上传单组, 超出最大上传数量，不再添加
              if(this.uploadVideoList.length >= this.count ) return
              this.uploadVideoList.push({ videoUrl: '', showDelImg: false })
            }
          }) 

        }
      })
    },
    // 删除视频按钮
    delVideoBtn(index) {
      // 将这一项干掉
      this.uploadVideoList.splice(index, 1)
      // 将图片和视频框组的url传递出去
      this.$emit('chooseAfter', {
        imgUrlList: this.uploadImgList.filter(item => item.imgUrl).map(item => item.imgUrl),
        videoUrlList: this.uploadVideoList.filter(item => item.videoUrl).map(item => item.videoUrl)
      })
      // 如果每个url都有值加一个
      const addFlag = this.uploadVideoList.every(item => item.videoUrl !== '')
      if(addFlag) {
        this.uploadVideoList.push({ videoUrl: '', delImgShow: false })
      }
      // 如果都删完了，加一个上传的
      if(this.uploadVideoList.length > 0) return
      this.uploadVideoList.push({ videoUrl: '', delImgShow: false })
    },
  }
}
</script>

<style scoped lang='scss'>
image {
  width: 100%;
  height: 100%;
}
video {
  width: 100%;
  height: 100%;
}

.container {
  // 单选框组
  .radio-group {
    display: flex;
    margin-bottom: 20rpx;
    .radio-single {
      display: flex;
      align-items: center;
      margin-right: 20rpx;
      .radio-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30rpx;
        height: 30rpx;
        margin-right: 10rpx;
        border-radius: 50%;
        background-color: #cccccc;
      }
      .text {
        font-size: 28rpx;
        color: #444444;
      }
    }
  }

  // 图片和视频上传框组
  .image-group,.video-group {
    display: flex;
    .image-single,.video-single {
      position: relative;
      width: 208rpx;
      height: 208rpx;
      margin-right: 10rpx;
      .del-icon {
        position: absolute;
        right: 0;
        top: 0;
        width: 36rpx;
        height: 36rpx;
        z-index: 666;
      }
    }
  }
}
</style>