<template>
  <div>
    <el-upload
            class="upload-demo"
            drag
            action="http://47.102.202.209:8080/upload/image"
            :on-change="onChange"
            :on-success="onSuccess"
            :before-upload="beforeUpload"
            list-type="video"
            accept=".mp4, .mpg, .mpeg, .dat"
            :limit=1>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>
</template>

<script>
  export default {
    name: "VideoUpload",
    data() {
      return {
        param: '',
        fileList: [],
        src: ''
      }
    },
    computed: {

    },
    methods:{
      onChange(file,filesList){
        console.log('文件',file);
        //创建临时的路径来展示图片
        let windowURL = window.URL || window.webkitURL;
        this.src=windowURL.createObjectURL(file.raw);
      },
      // 封装一个判断图片文件后缀名的方法
      isVideo(fileName) {
        if (typeof fileName !== 'string') return;
        let name = fileName.toLowerCase();
        return name.endsWith('.mpg') || name.endsWith('.mpeg') || name.endsWith('.mp4') || name.endsWith('.dat');
      },
      beforeUpload(file) {
        let type = this.isVideo(file.name);
        if (!type) {
          // 若不符合视频类型，则让当前上传的文件去除掉即可，即从上传对列删除本次上传
          this.fileList.splice(0, 1);
          this.$message.error('只允许上传视频');
          return false;
        }
      },
      onSuccess(res, file, fileList) {
        console.log('上传视频成功',res);
      }
    }
  }
</script>

<style scoped>

</style>
