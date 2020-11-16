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
    props: ['tagIdList'],
    data() {
      return {
        titles: ['全部标签', '选中标签'],
        tagList: [],
        selectValue: []
      };
    },
    created() {
      this.selectValue = this.tagIdList;
      fetchTagList().then(res => {
        console.log('返回tag列表',res);
        this.tagList = res.payload;
      })
    },
    methods: {
      selectChange(event) {
        this.$emit('selectValue', this.selectValue);
      }
    },
    watch: {
      'tagIdList': {
        handler(val) {
          console.log('tagIdList改变了',val);
          this.selectValue = this.tagIdList;
        },
        immediate: true
      }
    }
  }
</script>

<style scoped>

</style>
