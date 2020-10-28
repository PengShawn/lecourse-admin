<template>
  <div>
    <h1>说说列表</h1>
    <image-upload></image-upload>
    <video-upload></video-upload>
  </div>
</template>

<script>
  import ImageUpload from "../../components/upload/ImageUpload";
  import VideoUpload from "../../components/upload/VideoUpload";
  export default {
    name: "Posts",
    components: {ImageUpload, VideoUpload}
  }
</script>

<style scoped>

</style>
