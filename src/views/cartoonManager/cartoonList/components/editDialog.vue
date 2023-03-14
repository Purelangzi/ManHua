<template>
  <el-tabs v-model="activeName" class="editDialog">
    <el-tab-pane label="漫画详情" name="first">
      <div class="editContent" v-show="editForm">
        <div class="detail">
          <el-image :src="editForm.img_url" fit="fill" class="detailImg" ></el-image>
          <div class="dataRight">
            <h1>{{ editForm.name }}</h1>
            <div class="author">
              <span>作者：{{ editForm.author }}</span> 
            </div>
            <div class="author">
              <span>分类：</span>
              <el-select v-model="editForm.category_id" size="small">
                <el-option v-for="item in categoryData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="status">
              <div class="text">
                 <span>阅读量:</span>
                 <el-input v-model="editForm.read" class="inputText" size="mini"></el-input>
              </div>
              <div class="text">
                 <span>点赞量:</span>
                 <el-input v-model="editForm.fabulous" class="inputText" size="mini"></el-input>
              </div>
              <div class="text">
                <span>是否收费:</span>
                <el-select v-model="editForm.status" class="inputText" size="mini">
                  <el-option v-for="item in statusArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              
            </div>
            <div class="introduce">
              <span>简介：</span>
              <el-input type="textarea" v-model="editForm.cartoon_introduction" :rows="4"  placeholder="请输入简介内容" ></el-input>
              
            </div>
            <div class="handler">
              <el-button type="success" round @click="saveDetail" style="margin-right: 30px;">保存漫画</el-button>
              <el-upload action="#" :before-upload="beforeAvatarUpload" :on-error="imgSaveToUrl">
                <el-button type="primary " round>选择封面</el-button>
              </el-upload>
            </div>
          </div>
        </div>

        
      </div>
      
    </el-tab-pane>
    <el-tab-pane label="添加章节" name="second">
      
    </el-tab-pane>

    <div class="chapterList">
      <div class="chapterTitle">
        <div class="series">
          <span class="seriesTitle">连载</span>
          <span class="seriesDate">xxxxx</span>
        </div>
        <div class="flashBack">
          <span>倒叙</span>
        </div>
      </div>
      <div class="chapterContent">
        <span v-for="item in chapterList" :key="item.chapter_id">{{ item.title }}</span>
      </div>
    </div>
  </el-tabs>
</template>

<script>
export default {
  name: 'editDialog',
  props:['detailId','categoryData'],
  data () {
    return {
      activeName:'first',
      statusArr:[{label:'收费',value:1},{label:'免费',value:0}],
      // 漫画id
      id:'',
      // 漫画详情表单
      editForm:{},
      // 漫画章节列表
      chapterList:[]
    }
  },
  mounted() {
    this.getDetail()
    this.getChapterList()
  },


  methods: {
    // 根据传过来的id获取漫画详情
    async getDetail(){
      const {id} = this
      const res = await this.$API.cartoon.getDetail({id})
      if(res.code == 200){
        this.editForm = res.data
      }
    },
    // 根据id获取漫画章节列表
    async getChapterList(){
      const res = await this.$API.cartoon.getChapterList({comic_id:this.id,isAll:true})
      if(res.code==200){
        this.chapterList = res.data.data
      }
    },
    // 保存漫画
    async saveDetail(){
      const {editForm} = this
      const res = await this.$API.cartoon.updateList(editForm)
      if(res.code == 200) this.$message.success(`${res.msg}`)
    },

    // 上传漫画封面前的回调
    beforeAvatarUpload(file){
      try {
        let reader = new FileReader()
        // 读取图像文件，完成会包含一个URL格式的字符串表示所读取文件的内容
        reader.readAsDataURL(file)
        reader.onload = (e) =>{
          // 拿到上传文件后的url字符串base64编码
          let txt = e.target.result
          // 预览图片
          document.querySelector('.detailImg>img').src = txt 
        }
        // 判断图片类型
        let typeArr = ['image/png','image/jpg','image/jpeg']
        const flag = typeArr.includes(file.type)
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!flag) {
          this.$message.error('上传图片只能是 PNG、JPG、JPEG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return flag && isLt2M
      } catch (error) {
        
      }
    },
    // 
    async imgSaveToUrl(error,file){
      try {
        console.log(file);
        // 创建一个表单对象
        const formData = new FormData()
        // 追加图片数据,files为请求参数名A
        formData.append('files',file.raw)
        const res = await this.$API.common.uploadFile(formData)
        console.log(res);
      } catch (error) {
        
      }
    }
  },
  watch: {
    'detailId':{
      immediate:true,
      handler(newVal){
        this.id = newVal
        this.getDetail()
      }
    }
  },
}
</script>

<style lang='scss' scoped>
.editDialog{
  height: 600px;
  overflow-y: auto;
  .editContent{
    .detail{
      display: flex;
      .detailImg{
        min-width: 295px;
        height: 395px;
        border: 10px solid #fff;
        box-shadow: 0 1px 10px #0000001a;
      }
      .dataRight{
        margin-left: 35px;
        .author{
          margin-top: 15px;
          color: #863b13;
          font-size: 12px;
        }
        .status{
          display: flex;
          flex-wrap: nowrap;
          margin-top: 30px;
          .text{
            display: flex;
            align-items: center;
            margin-right: 35px;
            color:#999;
            .inputText{
              margin-left: 10px;
              width: 100px;
            }
          }
        }
        .introduce{
          display: flex;
          margin-top: 20px;
          span{
            width: 45px;
            height: 45px;
            font-size: 12px;
            height: 15px;
            color:#999;
          }
        }
        .handler{
          margin: 40px 0px 0px 20px;
          display: flex;
        }
      }
    }
}
  .chapterList{
    margin: 50px 20px 0 10px;
    
    .chapterTitle{
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .seriesTitle{
        font-size: 24px;
        color: #606266;
      }
      .seriesDate{
        color: #666;
        font-size: 13px;
      }
      .flashBack{
        color: #606266;
      }
    }
    .chapterContent{
      display: flex;
      flex-wrap: wrap;
      span{
        margin:0 20px 10px 0;
        padding: 0 15px;
        font-size: 12px;
        width: 184px;
        height: 22px;
        line-height: 22px;
        background-color: #fbfbfb;
        white-space:nowrap;
        overflow: hidden;
      }
    }
  }
}


</style>
