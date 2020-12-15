<template>

</template>

<script>
  import {inspectChapter} from "@/api/chapters";
  let {inspectTypeOptions} = require('../../../config/inspect');
  export default {
    name: "InspectChapter",
    props: ['CourseInfo', 'InspectDialogVisible'],
  }
</script>

<style scoped>

</style>
