<template>
  <div style="margin-bottom: 10px;">
    <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl"
            :on-change="onChange"
            :on-success="onSuccess"
            :on-remove="onRemove"
            :before-upload="beforeUpload"
            list-type="picture"
            accept=".jpg, .jpeg, .JPG, .JPEG"
            :limit=1>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip" style="margin-bottom: 10px;">只能上传jpg/jpeg文件，且不超过10mb</div>
    </el-upload>
  </div>
</template>

<script>
  import BASE_URL from "@/utils/config";
  export default {
    name: "ImageUpload",
    props: ['id','type'],
    data() {
      return {
        param: '',
        fileList: [],
        src: '',
        phoneUrl: '',
        uploadUrl: ''
      }
    },
    created(){
       console.log('上传图片组件被创建',this.id);
       this.uploadUrl = BASE_URL + '/' + this.type + '/' + this.id + '/photo';
       console.log('上传图片组件上传是的url',this.uploadUrl)
    },
    methods:{
      onChange(file,filesList){
        //创建临时的路径来展示图片
        let windowURL = window.URL || window.webkitURL;
        this.src=windowURL.createObjectURL(file.raw);
      },
      // 判断图片文件后缀名的方法
      isImage(fileName) {
        if (typeof fileName !== 'string') return;
        let name = fileName.toLowerCase();
        return name.endsWith('.png') || name.endsWith('.jpeg') || name.endsWith('.jpg');
      },
      beforeUpload(file) {
        let type = this.isImage(file.name);
        const size10M = file.size / 1024 /1024 < 10 ;
        if (!type) {
          // 若不符合图片类型，则让当前上传的文件去除掉即可，即从上传对列删除本次上传
          this.fileList.splice(0, 1);
          this.$message.error('只允许上传图片');
          return false;
        }
        if(!size10M){
          this.fileList.splice(0, 1);
          this.$message.error('图片大小不能超过10M');
          return false;
        }

      },
      onSuccess(res, file, fileList) {
        console.log('上传图片返回',res);
        if (res.result === 'success') {
          this.phoneUrl = res.payload;
          this.$message.success('上传图片成功');
        }else{
          this.$message.error('上传图片失败');
        }
        this.fileList.splice(0, 1);
      },
      onRemove() {

      }
    },
    watch: {
      'id': {
        handler(val) {
          console.log('父组件的pid变了',val);
          if(val!=='') {
            this.uploadUrl = BASE_URL + '/' + this.type + '/' + this.id + '/photo';
            console.log('上传图片的url改变', this.uploadUrl)
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
