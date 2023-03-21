<template>
  <el-tabs v-model="activeName" class="cartoonCollect">
    <el-tab-pane label="采集漫画信息" name="first">
      <div class="collectionLink">
        <div class="linkLeft">
          <div class="link title">
            <p>商品链接<span style="color: #409eff;">(一行一个,获取漫画详情或章节信息和内容)</span></p>
          </div>
          <div class="link container">
            <el-input type="textarea" v-model="linkTextarea" :rows="6" resize="none"></el-input>
          </div>
          <div class="link footer">
            <p>范例：<span style="color: red;">漫客栈：https://www.mkzhan.com/216151/</span></p>
          </div>
        </div>
        <div class="linkMain">
          <div class="link btn">
            <el-button v-if="isStartCollect" type="primary" @click="startCollection" size="small">开始采集</el-button>
            <el-button v-else type="primary" plain @click="isStartCollect=true" size="small">取消采集</el-button>
            <el-button v-if="radioValue==1" type="primary" @click="exportInfo(1)" size="small">导出漫画信息</el-button>
            <el-button v-else type="primary" @click="exportInfo(2)" size="small">导出章节信息</el-button>
            <el-button type="danger " @click="clearList" size="small">清理列表</el-button>
          </div>
          <div class="link radio">
            <el-radio-group v-model="radioValue" style="margin-top: 15px;">
              <el-radio label="1">漫画详情</el-radio>
              <el-radio label="2">漫画章节</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="linRight">
          <div class="link title">
            <p>执行日志</p>
          </div>
          <div class="link container">
            <el-input type="textarea" v-model="logData" :rows="6" disabled resize="none"></el-input>
          </div>
        </div>
      </div>
      <div class="collectionTable">
        <el-table v-if="radioValue==1" :data="cartoonCtDetail" ref="listTable" @selection-change="selectChange"
          border height="calc(100vh - 420px )" style="width:calc(100vw - 100px )" size="small">
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <template  v-for="col in ctDetailColumns">
            <el-table-column v-if="col.isSlot" :label="col.label" align="center" show-overflow-tooltip>
              <template v-slot="{row}">
                <div v-if="col.prop == 'cover_lateral'">
                  <el-image :src="row.cover_lateral" fit="fill" style="width: 56px;height: 56px;"></el-image>
                </div>
                <div v-if="col.prop == 'is_vip'">
                  <el-tag  :type="row.is_vip==1?'danger':'success'" effect="dark">{{ row.is_vip==1?'会员':'免费' }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-else :prop="col.prop" :label="col.label" align="center" show-overflow-tooltip></el-table-column>
          </template>
        </el-table>
        <el-table v-else :data="cartoonCtChapter" ref="listTable" @selection-change="selectChange"
          border height="calc(100vh - 420px )" style="width:calc(100vw - 100px )" size="small">
          <el-table-column label="序号" align="center" :key="Math.random()">
            <template v-slot="{$index}">
              <span>{{ (page-1)*pageSize+($index+1),page,pageSize }}</span>
            </template>
          </el-table-column>
            <template  v-for="col in ctChapterColumns">
              <el-table-column v-if="col.isSlot" :label="col.label" align="center" show-overflow-tooltip>
                <template v-slot="{row}">
                  <div v-if="col.prop == 'cover'">
                    <el-image :src="row.cover" fit="fill" style="width: 56px;height: 56px;"></el-image>
                  </div>
                  <div v-if="col.prop == 'is_vip'">
                    <el-tag  :type="row.is_vip==1?'danger':'success'" effect="dark">{{ row.is_vip==1?'收费':'免费' }}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-else :prop="col.prop" :label="col.label" align="center" show-overflow-tooltip></el-table-column>
            </template>
        </el-table>
      </div>
    </el-tab-pane>

    <el-tab-pane label="采集漫画/小说链接" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="采集小说信息" name="third">角色管理</el-tab-pane>
    <el-pagination
      v-if="radioValue=='2'"
      style="text-align: right;padding: 20px;"
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="page"
      :page-sizes="[10,20, 40, 80, 100]"
      :page-size="pageSize"
      layout="sizes, prev, pager, next, jumper, total"
      :total="totalNum" background>
    </el-pagination>
  </el-tabs>

  
</template>

<script>
import {handleKey} from'@/utils'
import { Tree } from 'element-ui'
export default {
  name: 'cartoonCollection',
  data () {
    return {
      activeName:'first',
      linkTextarea:'', // 采集链接
      isStartCollect:true, // 是否开始采集
      radioValue:'1', // 1漫画详情 2漫画章节
      logData:'', // 日志信息
      cartoonCtDetail:[], // 采集的漫画详情列表
      cartoonCtChapter:[],// 展示采集的漫画章节列表
      cartoonCtChapterAll:[],// 采集的全部漫画章节列表
      ctDetailColumns:[
        {isSlot:false,prop:'title',label:'漫画名称'},
        {isSlot:false,prop:'content',label:'漫画简介'},
        {isSlot:true,prop:'cover_lateral',label:'封面'},
        {isSlot:false,prop:'author_id',label:'作者id'},
        {isSlot:false,prop:'chapter_title',label:'最新章节'},
        {isSlot:false,prop:'price',label:'价格'},
        {isSlot:true,prop:'is_vip',label:'是否vip'},
      ],
      ctChapterColumns:[
        {isSlot:false,prop:'title',label:'章节名称'},
        {isSlot:true,prop:'cover',label:'封面'},
        {isSlot:false,prop:'title_alias',label:'章节别名'},
        {isSlot:false,prop:'price',label:'价格'},
        {isSlot:true,prop:'is_vip',label:'是否vip'},
      ],



      
      selectListOption:[],// 已选择的多选框数据
      page:1, // 当前页
      pageSize:10, // 每页显示的条数
      totalNum:0, // 总条数
        
    }
  },
  mounted() {
    
  },
  methods: {
    // 开始采集
    async startCollection(){
      this.logData = ''
      if (!this.linkTextarea) {
        return this.$message.warning('漫画链接不能为空！')
      }
      this.logData = '采集中...\n' + this.logData
      this.isStartCollect = false
      // 数据处理，Set数组去重然后浅拷贝成数组,只有一层不会改变原数组
      const linkArr = Array.from(new Set(handleKey(this.linkTextarea)))
      const linkArrLength = linkArr.length
      for (let i = 0; i < linkArrLength; i++) {
        const item = linkArr[i];
        // 准备请求参数
        let comicId = ''
        let chapterId = ''
        let platformId = 1
        let execPlatform = /(mkzhan.com)/g // 平台正则规则
        let platform = item.match(execPlatform) // ["mkzhan.com"]
        if (!platform) {
          this.logData = `${i + 1}/${linkArrLength}暂不支持此平台连接，请检查链接是否正确！\n` + this.logData
        }
        if(this.isStartCollect){
          this.logData = `正在取消采集中，请稍等....\n` + this.logData 
          break
        }
        if(platform && platform[0]){
          if(platform[0]=='mkzhan.com'){
            // ["com/212350/", "212350"]
            comicId = item.match(/com\/(.+)\//)[1]
            platformId
          }else{
            this.logData = `${i + 1}/${linkArrLength}未从链接中获取到漫画id，请检查链接是否正确！\n` + this.logData
          }
        }
        // 采集的是漫画详情
        if(this.radioValue == '1') {
          try {
            const param = {
              comicId,//漫画Id
              chapterId, 
              method: 'GET',
              platform: platformId,
              detail: 1 // 1漫画详情 2漫画章节
            }
            const res = await this.$API.common.queryDetailById(param)
            if(res.code != 200) {
              this.logData =`${i + 1}/${linkArrLength},漫画${comicId}采集失败,【${res.code}】${res.msg || ''}\n` + this.logData
            } else{
              console.log(res);
              this.cartoonCtDetail.push(res.data)
              this.logData = `${i + 1}/${linkArrLength}漫画${comicId}采集成功\n` + this.logData
            }
          } catch (error) {
            this.logData = `${i + 1}/${linkArrLength}采集失败\n` + this.logData
          }
        }else{
          try {
            const param = {
              comicId,//漫画Id
              chapterId, 
              method: 'GET',
              platform: platformId,
              detail: 2 // 1漫画详情 2漫画章节
            }
            const res = await this.$API.common.queryDetailById(param)
            if(res.code != 200) {
              this.logData =`${i + 1}/${linkArrLength},漫画${comicId}采集失败,【${res.code}】${res.msg || ''}\n` + this.logData
            } else{
              for (let i = 0; i < res.data.length; i++) {
                const index = res.data[i];
                this.cartoonCtChapterAll.push(index)
              }
              this.logData = `${i + 1}/${linkArrLength}漫画${comicId}采集成功\n` + this.logData
            }
            this.totalNum = this.cartoonCtChapterAll.length
            
          } catch (error) {
            this.logData = `${i + 1}/${linkArrLength}采集失败\n` + this.logData
          }
        }

      }
      // 切割成要展示的章节数据
      this.cartoonCtChapter = this.cartoonCtChapterAll.slice((this.page-1) * this.pageSize, this.page * this.pageSize)
      this.logData = `采集完成\n` + this.logData
      this.isStartCollect = true

    },
    // 导出漫画或漫画章节或小说或小说章节信息
    exportInfo(){

    },

    clearList(){
      if(this.radioValue == '1'){
        this.cartoonCtDetail = []
      }else{
        this.cartoonCtChapter = []
      }
      
    },




    // 多选框改变时
    selectChange(selection){
      this.selectListOption = selection
    },

    // 每页显示的条数改变时
    sizeChange(pageSize){
      this.pageSize = pageSize
      this.cartoonCtChapter = this.cartoonCtChapterAll.slice((this.page-1) * this.pageSize, this.page * this.pageSize)

    },
    // 当前页改变时
    currentChange(page){
      this.page = page
      this.cartoonCtChapter = this.cartoonCtChapterAll.slice((this.page-1) * this.pageSize, this.page * this.pageSize)
    }
  },
/*   watch: {
    'cartoonCtChapter':{
      deep:tree,
      handler(){
        console.log(1);
      }
    }
  }, */
}
</script>

<style lang='scss' scoped>
.cartoonCollect{
  padding: 20px;
  font-size: 14px;
  .collectionLink{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    padding: 0 15px;
    background-color:#fff;
    border: 1px solid #ebeef5;
    .linkLeft{
      flex: 1 1 auto;
      width: 700px;
    }
    .linkMain{
      width: 360px;
      padding: 60px 10px 0 25px;
    }
    .linRight{
      width: 400px;
      flex: 1 1 auto;
    }
    .link{
      display: flex;
      align-items: center;
      margin: 0 10px 10px 0;
    }
  }
  .collectionTable{
    margin-top: 20px;
  }
}
</style>
