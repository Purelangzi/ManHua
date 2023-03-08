<template>
    <el-dialog
        title="修改"
        :visible.sync="isShowDialog"
        width="30%"
        :before-close="handleClose">
        <el-form :model="AddOrUpdateform" label-width="80px" :inline="false" size="normal">
            <el-form-item label="分类名称">
                <el-input v-model="rowData.name || AddOrUpdateform.name" placeholder="请输入分类名称"></el-input>
            </el-form-item>
        </el-form>
        
        <span slot="footer">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="addOrUpdate">修改</el-button>
        </span>
    </el-dialog>
    
</template>

<script>
export default {
  name: 'categoryDialog',
  props:['rowData'],
  data () {
    return {
        isShowDialog:false,
        AddOrUpdateform:{
            name:''
        }
    }
  },
  mounted() {
    
  },
  methods: {
    cancel(){

    },
    addOrUpdate(){

    },
    handleClose(){

    }
  },
}
</script>

<style lang='scss' scoped>

</style>
