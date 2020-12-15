<template>
  <div>
    <el-upload
            :before-upload="beforeAlbumUpload"
            :on-success="handleAlbumSuccess"
            :show-file-list="false"
            accept="image/*"
            action="http://106.15.192.234/course/1/video"
            class="avatar-uploader"
            name="file">
      <img :src="imageUrl" alt="专辑图片" class="avatar" v-if="imageUrl">
      <i class="el-icon-plus avatar-uploader-icon" v-else></i>
    </el-upload>

  </div>
</template>

<script>
  import SelectTag from "../../components/selectTag/SelectTag";

  export default {
    name: "Posts",
    components: {SelectTag},
    data() {
      return {
        fileList: []
      };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      }
    }
  }
</script>

<style scoped>

</style>
