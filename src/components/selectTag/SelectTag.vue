<template>
  <div>
    <el-transfer v-model="selectValue" :props="{key: 'id',label: 'name'}"
                 :data="tagList" :titles="titles" @change="selectChange"></el-transfer>
  </div>
</template>

<script>
  import {fetchTagList} from "@/api/tag";

  export default {
    name: "SelectTag",
    data() {
      return {
        titles: ['全部标签', '选中标签'],
        tagList: [],
        selectValue: []
      };
    },
    created() {
      fetchTagList().then(res => {
        console.log('返回tag列表',res);
        this.tagList = res.payload;

      })
    },
    methods: {
      selectChange() {
        this.$emit('selectValue', this.selectValue);
      }
    }
  }
</script>

<style scoped>

</style>
