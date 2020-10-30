<template>
  <div>
    <el-upload
            class="upload-demo"
            drag
            action="http://106.15.192.234:8080/upload/image"
            :on-change="onChange"
            :on-success="onSuccess"
            :before-upload="beforeUpload"
            list-type="picture"
            accept=".jpg, .png, .jpeg, .JPG, .JPEG"
            :limit=1>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过5mb</div>
    </el-upload>
  </div>
</template>

<script>
  export default {
    name: "ImageUpload",
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
      isImage(fileName) {
        if (typeof fileName !== 'string') return;
        let name = fileName.toLowerCase();
        return name.endsWith('.png') || name.endsWith('.jpeg') || name.endsWith('.jpg');
      },
      beforeUpload(file) {
        let type = this.isImage(file.name);
        if (!type) {
          // 若不符合图片类型，则让当前上传的文件去除掉即可，即从上传对列删除本次上传
          this.fileList.splice(0, 1);
          this.$message.error('只允许上传图片');
          return false;
        }
      },
      onSuccess(res, file, fileList) {
        console.log('上传成功',res);
      }
    }
  }
</script>

<style scoped>

</style>
