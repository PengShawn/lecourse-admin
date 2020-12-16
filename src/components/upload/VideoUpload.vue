<template>
  <div style="margin-bottom: 10px;">
    <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl"
            :on-change="onChange"
            :on-success="onSuccess"
            :before-upload="beforeUpload"
            list-type="video"
            accept=".mp4, .mpg, .mpeg, .dat"
            v-loading.fullscreen.lock="loading"
            element-loading-text="拼命上传中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            name="multipartFile"
            :limit=1>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将视频文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传mp4/mpg/mpeg/dat文件，且不超过1024mb</div>
    </el-upload>
  </div>
</template>

<script>
  import BASE_URL from "@/utils/config";

  export default {
    name: "VideoUpload",
    props: ['id', 'type'],
    data() {
      return {
        param: '',
        fileList: [],
        src: '',
        loading: false,
        videoUrl: '',
        videoDuration: 0
      }
    },
    created() {
      this.uploadUrl = BASE_URL + '/' + this.type + '/' + this.id + '/video';
      console.log('上传视频组件上传是的url', this.uploadUrl)
    },
    methods: {
      onChange(file, filesList) {
        //创建临时的路径来展示图片
        let windowURL = window.URL || window.webkitURL;
        this.src = windowURL.createObjectURL(file.raw);
      },
      // 封装一个判断图片文件后缀名的方法
      isVideo(fileName) {
        if (typeof fileName !== 'string') return;
        let name = fileName.toLowerCase();
        return name.endsWith('.mpg') || name.endsWith('.mpeg') || name.endsWith('.mp4') || name.endsWith('.dat');
      },
      beforeUpload(file) {
        let type = this.isVideo(file.name);
        const size1024M = file.size / 1024 / 1024 < 1024;
        if (!type) {
          // 若不符合视频类型，则让当前上传的文件去除掉即可，即从上传对列删除本次上传
          this.fileList.splice(0, 1);
          this.$message.error('只允许上传视频');
          return false;
        }
        let url = URL.createObjectURL(file);
        let audioElement = new Audio(url);
        this.videoDuration = audioElement.duration; //获取当前视频长度
        // if(size1024M){
        //   this.fileList.splice(0, 1);
        //   this.$message.error('视频大小不能超过1024M');
        //   return false;
        // }
        this.loading = true;
      },
      onSuccess(res, file, fileList) {
        console.log('上传视频成功返回', res);
        if (res.result === 'success') {
          this.loading = false;
          this.videoUrl = res.payload;
          this.$message({
            showClose: true,
            message: '上传视频成功',
            type: 'success',
            duration: 0
          });
        }else{
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.payload.errorMessage,
            type: 'error',
            duration: 0
          });
        }
      },
      onRemove() {

      }
    }
  }
</script>

<style scoped>

</style>
