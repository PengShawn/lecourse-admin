<template>

</template>

<script>
  //组件
  import ImageUpload from "@/components/upload/ImageUpload";
  import VideoUpload from "@/components/upload/VideoUpload";
  import SelectTag from "@/components/selectTag/SelectTag";
  //接口

  export default {
    name: "AddChapter",
    props: ['AddDialogVisible'],
    components: {ImageUpload, VideoUpload,SelectTag},

  }
</script>

<style scoped>

</style>
