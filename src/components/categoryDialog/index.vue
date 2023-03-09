<template>
    <el-dialog
        :title="updateForm.name?'修改':'添加'"
        :visible.sync="isShow"
        width="30%"
        :before-close="handleClose">
        <el-form :model="updateForm.name?updateForm:addForm" :rules="SearchFormRules" label-width="80px" :inline="false" size="normal">
            <el-form-item label="分类名称" prop="name">
                <el-input v-show="!updateForm.name" v-model="addForm.name" placeholder="请输入分类名称"></el-input>
                <el-input v-show="updateForm.name" v-model="updateForm.name" placeholder="请输入分类名称"></el-input>
            </el-form-item>
        </el-form>
        
        <span slot="footer">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="addOrUpdate">{{updateForm.name?'修改':'添加'}}</el-button>
        </span>
    </el-dialog>
    
</template>

<script>

export default {
  name: 'categoryDialog',
  // 从属分类名,分类表格数据
  props:['categoryName','categoryData'],
  data () {
    return {
        isShow:false,
        // 添加表单
        addForm:{
            name:''
        },
        // 修改表单
        updateForm:{
            name:''
        },
        SearchFormRules:{

        }
    }
  },
  mounted() {
    
  },
  methods: {
    // 取消添加或修改
    cancel(){
        this.isShow = false
        this.addForm.name = ''
        this.updateForm.name = ''
    },
    // 添加或修改分类
    async addOrUpdate(){
        const {addForm,updateForm,categoryName} = this
        if(addForm.name){
            try {
                console.log(categoryName);
                await this.$API[categoryName].addCategory({name:addForm.name,parent_id:0})
                this.$message.success('添加成功')
                this.cancel()
                // 触发父组件事件，让表格重新刷新
                this.$emit('onLoadTable','add')
            } catch (error) {}
        }else{
            const {id,name,parent_id} = updateForm
            try {
                await this.$API[categoryName].updateCategory({id,name,parent_id})
                this.$message.success('修改成功')
                this.cancel()
                // 触发父组件事件，让表格重新刷新
                this.$emit('onLoadTable','update')
            } catch (error) {}
        }
    },
    handleClose(done){
        this.cancel()
        done()
    },
    checkFormName(){
        return this.categoryName.some(el=>{
            el.name !== addForm.name && updateForm.name
        })
    }
  },
}
</script>

<style lang='scss' scoped>

</style>
