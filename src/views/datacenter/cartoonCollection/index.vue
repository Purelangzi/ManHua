<template>
  <el-tabs v-model="activeName" class="cartoonCollect">
    <el-tab-pane label="采集漫画信息" name="first">
      <div class="collectionLink">
        <div class="linkLeft">
          <div class="link title">
            <p>商品链接<span style="color: #409eff;">(一行一个,获取漫画详情或章节信息和内容)</span></p>
          </div>
          <div class="link container">
            <el-input type="textarea" v-model="ctLinkTextarea" :rows="6" resize="none"></el-input>
          </div>
          <div class="link footer">
            <p>范例：<span style="color: red;">漫客栈：https://www.mkzhan.com/216151/</span></p>
          </div>
        </div>
        <div class="linkMain">
          <div class="link btn">
            <el-button v-if="isStartCollect" type="primary" @click="startCollectCt" size="small">开始采集</el-button>
            <el-button v-else type="primary" plain @click="isStartCollect=true" size="small">取消采集</el-button>
            <el-button v-if="radioCatroonValue==1" type="primary" @click="exportInfo(1)" size="small">导出漫画信息</el-button>
            <el-button v-else type="primary" @click="exportInfo(2)" size="small">导出章节信息</el-button>
            <el-button type="danger " @click="clearList(1)" size="small">清理列表</el-button>
          </div>
          <div class="link">
            <el-button v-if="radioCatroonValue==1" type="danger" @click="addMoreNovelOrCartoon(2)" size="small">一键添加漫画</el-button>
          </div>
          <div class="link radio">
            <el-radio-group v-model="radioCatroonValue" style="margin-top: 15px;">
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
            <el-input type="textarea" v-model="logDataCt" :rows="6" disabled resize="none"></el-input>
          </div>
        </div>
      </div>
      <div class="collectionTable">
        <el-table v-if="radioCatroonValue==1" :data="cartoonCtDetail" v-loading="loadingDetail" @selection-change="selectChange"
          border height="calc(100vh - 420px )" style="width:calc(100vw - 100px )" size="small">
          <el-table-column type="selection"></el-table-column>
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
        <el-table v-else :data="cartoonCtChapter" v-loading="loadingChapter" @selection-change="selectChange"
          border height="calc(100vh - 420px )" style="width:calc(100vw - 100px )" size="small">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="序号" align="center" :key="Math.random()">
            <template v-slot="{$index}">
              <span>{{ (pageCt-1)*pageSizeCt+($index+1) }}</span>
            </template>
          </el-table-column>
            <template  v-for="col in ctChapterColumns">
              <el-table-column v-if="col.isSlot"  :label="col.label" align="center" show-overflow-tooltip>
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
      <el-pagination
        v-if="radioCatroonValue=='2'"
        style="text-align: right;padding: 20px;"
        @size-change="sizeChangeCt"
        @current-change="currentChangeCt"
        :current-page.sync="pageCt"
        :page-sizes="[10,20, 40, 80, 100]"
        :page-size="pageSizeCt"
        layout="sizes, prev, pager, next, jumper, total"
        :total="totalNumCt" background>
      </el-pagination>
    </el-tab-pane>

    <el-tab-pane label="采集漫画/小说链接" name="second">
      <div class="collectionLink">
        <div class="linkMain">
          <div class="link btn">
            <el-button v-if="isStartCollect" type="primary" @click="startCollectCt" size="small">开始采集</el-button>
            <el-button v-else type="primary" plain @click="isStartCollect=true" size="small">取消采集</el-button>
            <el-button  type="primary" @click="exportLink()" size="small">导出链接</el-button>
            <el-button type="danger" @click="clearList(1)" size="small">清理列表</el-button>
          </div>
          <div class="link">
            <el-button v-if="radioCtAndCpValue==2||radioCtAndCpValue==3" type="danger" @click="addMoreNovelOrCartoon(2)" size="small">一键添加</el-button>
          </div>
          <div class="link radio">
            <el-radio-group v-model="radioCtAndCpValue" style="margin-top: 15px;">
              <el-radio label="1">漫画链接</el-radio>
              <el-radio label="2">小说链接</el-radio>
              <el-radio label="3">视频链接</el-radio>
            </el-radio-group>
          </div>
          <div class="link">
            <span>开始页码：</span>
            <el-input v-model="startpage" style="width: 60px;" clearable></el-input>
            <span>总页码：</span>
            <el-input v-model="endPage" style="width: 60px;" clearable></el-input>
          </div>
        </div>
        <div class="linRight">
          <div class="link title">
            <p>执行日志</p>
          </div>
          <div class="link container">
            <el-input type="textarea" v-model="logDataCtAndCp" :rows="6" disabled resize="none"></el-input>
          </div>
        </div>
      </div>
      <div class="collectionTable">
        <el-table v-if="radioCatroonValue==1" :data="cartoonCtDetail" v-loading="loadingDetail" @selection-change="selectChange"
          border height="calc(100vh - 420px )" style="width:calc(100vw - 100px )" size="small">
          <el-table-column type="selection"></el-table-column>
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
        <el-table v-else :data="cartoonCtChapter" v-loading="loadingChapter" @selection-change="selectChange"
          border height="calc(100vh - 420px )" style="width:calc(100vw - 100px )" size="small">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="序号" align="center" :key="Math.random()">
            <template v-slot="{$index}">
              <span>{{ (pageCt-1)*pageSizeCt+($index+1) }}</span>
            </template>
          </el-table-column>
            <template  v-for="col in ctChapterColumns">
              <el-table-column v-if="col.isSlot"  :label="col.label" align="center" show-overflow-tooltip>
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
    <el-tab-pane label="采集小说信息" name="third">
      <div class="collectionLink">
        <div class="linkLeft">
          <div class="link title">
            <p>商品链接<span style="color: #409eff;">(一行一个,获取小说详情或小说信息)</span></p>
          </div>
          <div class="link container">
            <el-input type="textarea" v-model="cpLinkTextarea" :rows="6" resize="none"></el-input>
          </div>
          <div class="link footer">
            <p>范例：<span style="color: red;">七猫小说网:https://www.9biquge.com/42/42857/</span></p>
          </div>
        </div>
        <div class="linkMain">
          <div class="link btn">
            <el-button v-if="isStartCollect" type="primary" @click="startCollectChapter" size="small">开始采集</el-button>
            <el-button v-else type="primary" plain @click="isStartCollect=true" size="small">取消采集</el-button>
            <el-button v-if="radioChpaterValue==1" type="primary" @click="exportInfo(3)" size="small">导出小说信息</el-button>
            <el-button v-else type="primary" @click="exportInfo(4)" size="small">导出章节信息</el-button>
            <el-button type="danger" @click="clearList(2)" size="small">清理列表</el-button>
          </div>
          <div class="link">
            <el-button v-if="radioChpaterValue==1" type="danger" @click="addMoreNovelOrCartoon(1)" size="small">一键添加小说</el-button>
          </div>
          <div class="link radio">
            <el-radio-group v-model="radioChpaterValue" style="margin-top: 15px;">
              <el-radio label="1">小说详情</el-radio>
              <el-radio label="2">小说章节</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="linRight">
          <div class="link title">
            <p>执行日志</p>
          </div>
          <div class="link container">
            <el-input type="textarea" v-model="logDataCp" :rows="6" disabled resize="none"></el-input>
          </div>
        </div>
      </div>
      <div class="collectionTable">
        <el-table v-if="radioChpaterValue==1" :data="novelCtDetail" v-loading="loadingDetail" @selection-change="selectChange"
          border height="calc(100vh - 420px )" style="width:calc(100vw - 100px )" size="small">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <template  v-for="col in cpDetailColumns">
            <el-table-column v-if="col.isSlot" :label="col.label" align="center" show-overflow-tooltip>
              <template v-slot="{row}">
                <div v-if="col.prop == 'cover_lateral'">
                  <el-image :src="row.cover_lateral" fit="fill" style="width: 56px;height: 56px;"></el-image>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-else :prop="col.prop" :label="col.label" align="center" show-overflow-tooltip></el-table-column>
          </template>
        </el-table>
        <el-table v-else :data="novelCtChapter" v-loading="loadingChapter" @selection-change="selectChange"
          border height="calc(100vh - 420px )" style="width:calc(100vw - 100px )" size="small">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="序号" align="center" :key="Math.random()">
            <template v-slot="{$index}">
              <span>{{ (pageCp-1)*pageSizeCp+($index+1) }}</span>
            </template>
          </el-table-column>
            <template  v-for="col in cpChapterColumns">
              <el-table-column  :prop="col.prop"  :label="col.label" align="center" show-overflow-tooltip>
              </el-table-column>
             
            </template>
        </el-table>
        <el-pagination
          v-if="radioChpaterValue=='2'"
          style="text-align: right;padding: 20px;"
          @size-change="sizeChangeCp"
          @current-change="currentChangeCp"
          :current-page.sync="pageCp"
          :page-sizes="[10,20, 40, 80, 100]"
          :page-size="pageSizeCp"
          layout="sizes, prev, pager, next, jumper, total"
          :total="totalNumCp" background>
        </el-pagination>
      </div>
    </el-tab-pane>

  </el-tabs>

  
</template>

<script>
import {handleKey} from'@/utils'
import {exportXls} from '@/utils/file'
export default {
  name: 'cartoonCollection',
  data () {
    return {
      loadingDetail:false,
      loadingChapter:false,
      activeName:'first',
      ctLinkTextarea:'', // 采集链接-漫画
      cpLinkTextarea:'', // 采集链接-小说
      isStartCollect:true, // 是否开始采集
      radioCatroonValue:'1', // 1漫画详情 2漫画章节
      radioChpaterValue:'1', // 1小说详情 2小说章节
      radioCtAndCpValue:'1', // 1漫画 2小说 3视频
      logDataCt:'', // 日志信息-漫画
      logDataCp:'', // 日志信息-小说
      logDataCtAndCp:'', // 日志信息-漫画/小说
      cartoonCtDetail:[], // 采集的漫画详情列表
      cartoonCtChapter:[],// 展示采集的漫画章节列表
      cartoonCtChapterAll:[],// 采集的全部漫画章节列表
      novelCtDetail:[], // 采集的小说详情列表
      novelCtChapter:[],// 展示采集的小说章节列表
      novelCtChapterAll:[],// 采集的全部小说章节列表
      // 漫画表头
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
      // 小说表头
      cpDetailColumns:[
        {isSlot:false,prop:'name',label:'小说名称'},
        {isSlot:true,prop:'cover_lateral',label:'封面'},
        {isSlot:false,prop:'intro',label:'简介'},
        {isSlot:false,prop:'author',label:'作者'},
      ],
      cpChapterColumns:[
        {isSlot:false,prop:'title',label:'章节名称'},
        {isSlot:false,prop:'title_alias',label:'章节别名'},
      ],
      startPage:'',
      endPage:'',








      selectChapterOption:[],// 已选择的章节列表多选框数据


      // 漫画章节分页器
      pageCt:1, // 当前页
      pageSizeCt:10, // 每页显示的条数
      totalNumCt:0, // 总条数
      // 小说章节分页器
      pageCp:1, 
      pageSizeCp:10, 
      totalNumCp:0, 
        
    }
  },
  mounted() {
    
  },
  methods: {
    // 开始采集漫画链接
    async startCollectCt(){
      this.logDataCt = ''
      if (!this.ctLinkTextarea) {
        return this.$message.warning('漫画链接不能为空！')
      }
      this.logDataCt = '采集中...\n' + this.logDataCt
      
      
      this.isStartCollect = false
      // 数据处理,Set数组去重然后浅拷贝成数组,只有一层不会改变原数组
      const linkArr = Array.from(new Set(handleKey(this.ctLinkTextarea)))
      const linkArrLength = linkArr.length
      for (let i = 0; i < linkArrLength; i++) {
        const item = linkArr[i];
        //准备采集漫画链接的请求参数
        let comicId = ''
        let chapterId = ''
        let platformId = 1
        // 检查链接格式
        let execPlatform = /(mkzhan.com)/g // 平台正则规则
        let platform = item.match(execPlatform) // ["mkzhan.com"]
        if (!platform) {
          this.logDataCt = `${i + 1}/${linkArrLength}暂不支持此平台连接，请检查链接是否正确！\n` + this.logDataCt
        }
        if(this.isStartCollect){
          this.logDataCt = `正在取消采集中，请稍等....\n` + this.logDataCt 
          break
        }
        if(platform && platform[0]){
          if(platform[0]=='mkzhan.com'){
            // item https://www.mkzhan.com/212350/ 
            // ["com/212350/", "212350"]
            comicId = item.match(/com\/(.+)\//)[1]
            platformId = 1
          }else{
            this.logDataCt = `${i + 1}/${linkArrLength}未从链接中获取到漫画id，请检查链接是否正确！\n` + this.logDataCt
            continue
          }
        }
        if (comicId.length < 2) {
          this.logDataCt = `${i + 1}/${linkArrLength}未从链接中获取到漫画id，请检查链接是否正确！\n` +  this.logDataCt
          continue
        }
        const params = {
          comicId,//漫画Id
          chapterId, 
          method: 'GET',
          platform: platformId,
          // detail: 1 // 1漫画详情 2漫画章节
        }
        // 采集的是漫画详情
        if(this.radioCatroonValue == '1') {
          this.loadingDetail = true
          try {
            params.detail = 1
            const res = await this.$API.common.queryDetailById(params)
            if(res.code != 200) {
              this.logDataCt =`${i + 1}/${linkArrLength},漫画${comicId}采集失败,【${res.code}】${res.msg || ''}\n` + this.logDataCt
            } else{
              // 添加所属漫画链接，方便一键添加漫画中添加请求采集的参数:平台id和漫画id
              res.data.url = item
              this.cartoonCtDetail.push(res.data)
              this.logDataCt = `${i + 1}/${linkArrLength}漫画${comicId}采集成功\n` + this.logDataCt
            }
          } catch (error) {
            this.logDataCt = `${i + 1}/${linkArrLength}采集失败\n` + this.logDataCt
          }
          this.loadingDetail = false
        
        }else{
          // 采集的是漫画章节
          this.loadingChapter = true
          try {
            params.detail = 2
            const res = await this.$API.common.queryDetailById(params)
            if(res.code != 200) {
              this.logDataCt =`${i + 1}/${linkArrLength},漫画${comicId}采集失败,【${res.code}】${res.msg || ''}\n` + this.logDataCt
            } else{
              for (let i = 0; i < res.data.length; i++) {
                const index = res.data[i];
                this.cartoonCtChapterAll.push(index)
              }
              this.logDataCt = `${i + 1}/${linkArrLength}漫画${comicId}采集成功\n` + this.logDataCt
            }
            this.totalNumCt = this.cartoonCtChapterAll.length
          } catch (error) {
            this.logDataCt = `${i + 1}/${linkArrLength}采集失败\n` + this.logDataCt
          }
          this.loadingChapter = false
        }

      }
      // 切割成要展示的章节数据
      this.cartoonCtChapter = this.cartoonCtChapterAll.slice((this.pageCt-1) * this.pageSizeCt, this.pageCt * this.pageSizeCt)
      this.logDataCt = `采集完成\n` + this.logDataCt
      this.isStartCollect = true

    },

    // 开始采集小说链接
    async startCollectChapter(){
      this.logDataCp = ''
      if (!this.cpLinkTextarea) {
        return this.$message.warning('小说链接不能为空！')
      }
      this.logDataCp = '采集中...\n' + this.logDataCp
      this.isStartCollect = false
      // 数据处理，Set数组去重然后浅拷贝成数组,只有一层不会改变原数组
      const linkArr = Array.from(new Set(handleKey(this.cpLinkTextarea)))
      const linkArrLength = linkArr.length
      for (let i = 0; i < linkArrLength; i++) {
        const item = linkArr[i];
        // 准备采集小说链接的请求参数
        let comicId = ''
        let pageId = 1
        // 检查链接格式
        let execPlatform = /(9biquge.com)/g // 平台正则规则
        let platform = item.match(execPlatform) // ["9biquge.com"]
        if (!platform) {
          this.logDataCp = `${i + 1}/${linkArrLength}暂不支持此平台连接，请检查链接是否正确！\n` + this.logDataCp
        }
        if(this.isStartCollect){
          this.logDataCp = `正在取消采集中，请稍等....\n` + this.logDataCp 
          break
        }
        if(platform && platform[0]){
          if(platform[0]=='9biquge.com'){
            // item https://www.9biquge.com/44/44347/
            // ids ["com/44/44347", "44/44347"]
            let ids = item.match(/com\/(.+)\//)[1].split('/')
            pageId = ids[0]
            comicId = ids[1]
          }else{
            this.logDataCp = `${i + 1}/${linkArrLength}未从链接中获取到漫画id，请检查链接是否正确！\n` + this.logDataCp
            continue
          }
        }
        if (comicId.length == 0) {
          this.logDataCp = `${i + 1}/${linkArrLength}未从链接中获取到小说id，请检查链接是否正确！\n` + this.logDataCp
          continue
        }

        const params = {
          comicId,
          pageId,
          type: 0
        }
        // 采集的是小说详情
        if(this.radioChpaterValue == '1') {
          this.loadingDetail = true
          try {
            const res = await this.$API.common.queryNovelDetail(params)
            if(res.code != 200) {
              this.logDataCp =`${i + 1}/${linkArrLength},小说${comicId}采集失败,【${res.code}】${res.msg || ''}\n` + this.logDataCp
            } else{
              // 添加所属小说链接，方便一键添加小说中添加请求采集的参数:平台id和小说id
              res.data.url = item
              this.novelCtDetail.push(res.data)
              this.logDataCp = `${i + 1}/${linkArrLength}小说${comicId}采集成功\n` + this.logDataCp
            }
          } catch (error) {
            this.logDataCp = `${i + 1}/${linkArrLength}采集失败\n` + this.logDataCp
          }
          this.loadingDetail = false
        }else{
          // 采集的是小说章节
          this.loadingChapter = true
          try {
            params.type = 1
            const res = await this.$API.common.queryNovelDetail(params)
            if(res.code != 200) {
              this.logDataCp =`${i + 1}/${linkArrLength},小说${comicId}采集失败,【${res.code}】IP限制，请稍后重新采集\n` + this.logDataCp
            } else{
              this.novelCtChapterAll = this.novelCtChapterAll.concat(res.data)
              this.logDataCp = `${i + 1}/${linkArrLength}小说${comicId}采集成功\n` + this.logDataCp
            }
            this.totalNumCp = this.novelCtChapterAll.length
          } catch (error) {
            this.logDataCp = `${i + 1}/${linkArrLength}采集失败\n` + this.logDataCp
          }
          this.loadingChapter = false
        }

      }
      // 切割成要展示的章节数据
      this.novelCtChapter = this.novelCtChapterAll.slice((this.pageCp-1) * this.pageSizeCp, this.pageCp * this.pageSizeCp)
      this.logDataCp = `采集完成\n` + this.logDataCp
      this.isStartCollect = true
    },

    
    // 导出excel漫画1,漫画章节2,小说3,小说章节4
    exportInfo(type){
      let result = []
      let filename = ''
      let head = {}
      switch (type) {
        case 1:
        filename = '漫画列表'
        head = {
          title: '漫画名称',
          cover: '封面',
          content: '漫画简介',
          author_id: '作者',
          price: '价格',
          is_vip: '是否vip',
          url: '采集链接',
          comic_id: '上家漫画ID',
          cover_lateral: '漫画详情封面'
        }
        // 选择的章节列表
        result = this.selectChapterOption.length > 0 ? this.selectChapterOption : this.cartoonCtDetail
        break;
        case 2:
        filename = '章节列表'
        head = {
          title: '章节名称',
          cover: '封面',
          title_alias: '章节别名',
          price: '价格',
          is_vip: '是否vip',
          url: '采集链接',
          platform_chapter: '上家ID',
          comicId: '上家漫画ID'
        }
        result = this.selectChapterOption.length > 0 ? this.selectChapterOption : this.cartoonCtChapter
        break
        case 3:
          filename = '小说列表'
          head = {
            name: '小说名称',
            cover_lateral: '封面',
            intro: '简介',
            author: '作者',
            url: '采集链接',
            platform_comic: '上家漫画ID',
            pageId: '上家页面id'
          }
          result = this.selectChapterOption.length > 0 ? this.selectChapterOption : this.novelCtDetail
          break
        case 4:
        filename = '小说章节列表'
        head = {
          title: '小说名称',
          title_alias: '章节别名',
          platform_chapter: '上家章节ID',
          platform_comic: '上家漫画ID'
        }
        result = this.selectChapterOption.length > 0 ? this.selectChapterOption : this.novelCtChapter
        break
      }
      //定义一个数组，用来保存最后需要发请求的数据,最后结果是个数组对象[{},{}]
      const list = result.map(item=>{
        const obj = {} 
        for(const k in item){
          // head的键值和res的对象属性相同，head['漫画名称']存在？
          if(head[k]){
            // 相当于obj.name = item.name，而item.name='xxx',添加属性并赋值
            obj[head[k]] = item[k]
          }
        }
        return obj
      })

      exportXls(filename, list)
    },
    // 导出采集好的链接（漫画，小说，视频）
    exportLink(){

    },
    // 一键添加小说或漫画 type 1小说 2漫画 
    async addMoreNovelOrCartoon(type){
      let result = []
      
      // 一键添加小说(不用检查链接格式)
      if(type == 1){
        if(!this.novelCtDetail.length){
          return this.$message.warning('请采集小说链接')
        }
        result = this.selectChapterOption.length > 0 ? this.selectChapterOption : this.novelCtDetail
        this.logDataCp = '开始一键添加小说...\n' + this.logDataCp
        const linkArrLength = result.length
        for (let i = 0; i < result.length; i++) {
          const item = result[i];
          // item https://www.9biquge.com/44/44347/
          // ids ["com/44/44347", "44/44347"]
          let ids = item['url'].match(/com\/(.+)\//)[1].split('/')
          // 准备采集小说详情的请求参数
          const params = {
            comicId:ids[0],
            pageId:ids[1]
          }
          try {
            const res = await this.$API.common.queryNovelDetail(params)
            if(res.code != 200) {
              this.logDataCp =`${i + 1}/${linkArrLength},小说${params.comicId}采集失败,【${res.code}】${res.msg || ''}\n` + this.logDataCp
            } else{
              const novel = res.data
              this.logDataCp = `${i + 1}/${linkArrLength}小说${params.comicId}添加成功\n` + this.logDataCp
              this.logDataCp = `开始添加${novel.name}\n` + this.logDataCp
              novel['category_id'] = 1
              const res1 = await this.$API.novel.addList(novel)
              if(res1.code == 200){
                this.logDataCp = `${novel.name}添加成功\n` + this.logDataCp
              }else{
                this.logDataCp = `${novel.name}添加失败,${res1.msg}\n` + this.logDataCp
              }
            }
          } catch (error) {
            this.logDataCp = `${i + 1}/${linkArrLength}，小说${params.comicId}采集失败\n` + this.logDataCp
          }
        }
        this.logDataCp  = `一键添加小说完成\n` +this.logDataCp 
      
      }else if(type == 2){
        // 一键添加漫画(不用检查链接格式)
        if(!this.cartoonCtDetail.length){
          return this.$message.warning('请采集漫画链接')
        }
        result = this.selectChapterOption.length > 0 ? this.selectChapterOption : this.cartoonCtDetail
        this.logDataCt = '开始一键添加漫画...\n' + this.logDataCt
        const linkArrLength = result.length
        for (let i = 0; i < result.length; i++) {
          const item = result[i];
          // // 准备采集漫画详情的请求参数
          const params = {
            // item https://www.mkzhan.com/212350/ 
            // ["com/212350/", "212350"]
            comicId:item['url'].match(/com\/(.+)\//)[1],//漫画Id
            chapterId:'', 
            method: 'GET',
            platform: 1,
            detail: 1 // 1漫画详情 2漫画章节
          }
          try {
            const res = await this.$API.common.queryDetailById(params)
            if(res.code != 200) {
              this.logDataCt =`${i + 1}/${linkArrLength},漫画${params.comicId}采集失败,【${res.code}】${res.msg || ''}\n` + this.logDataCt
            } else{
              const {title,content,cover,price,is_vip,status,cover_lateral,comic_id,author_id} = res.data
              // 准备添加漫画的请求参数
              const cartoon ={
                name:title,
                cartoon_introduction:content,
                img_url:cover,
                cover_lateral,
                price,
                charge:is_vip,
                status,
                platform_comic:comic_id,
                category_id:1,
                author:author_id,
              }
              this.logDataCt = `${i + 1}/${linkArrLength}漫画${params.comicId}添加成功\n` + this.logDataCt
              this.logDataCt = `开始添加${cartoon.name}\n` + this.logDataCt
              const res1 = await this.$API.cartoon.addList(cartoon)
              if(res1.code == 200){
                this.logDataCt = `${cartoon.name}添加成功\n` + this.logDataCt
              }else{
                this.logDataCt = `${cartoon.name}添加失败,${res1.msg}\n` + this.logDataCt
              }
            }
          } catch (error) {
            this.logDataCt = `${i + 1}/${linkArrLength}，漫画${params.comicId}采集失败\n` + this.logDataCt
          }
        }
        this.logDataCt  = `一键添加漫画完成\n` +this.logDataCt 
      }
      
    },
    // 清理列表 1漫画 2小说 3漫画/小说
    clearList(type){

      if(type == 1){
        if(this.radioCatroonValue == '1'){
          this.cartoonCtDetail = []
        }else{
          this.cartoonCtChapterAll = []
          this.cartoonCtChapter = []
          this.pageCt=1
          this.pageSizeCt=10
          this.totalNumCt=0
        }
      }else if(type == 2){
        if(this.radioChpaterValue == '1'){
          this.novelCtDetail = []
        }else{
          this.novelCtChapterAll = []
          this.novelCtChapter = []
          this.pageCp=1
          this.pageSizeCp=10
          this.totalNumCp=0
        }
      }else{

      }
     
      
    },
    // 多选框改变时，选择的章节列表
    selectChange(selection){
      this.selectChapterOption = selection
    },


    

    // 每页显示的条数改变时-漫画章节
    sizeChangeCt(pageSize){
      this.pageSizeCt = pageSize
      if(this.cartoonCtChapterAll.length){
        this.cartoonCtChapter = this.cartoonCtChapterAll.slice((this.pageCt-1) * this.pageSizeCt, this.pageCt * this.pageSizeCt)
      }
    },
    // 每页显示的条数改变时-小说章节
    sizeChangeCp(pageSize){
      this.pageSizeCp = pageSize
      if(this.novelCtChapterAll.length){
        this.novelCtChapter = this.novelCtChapterAll.slice((this.pageCp-1) * this.pageSizeCp, this.pageCp * this.pageSizeCp)
      }
    },
    // 当前页改变时-漫画章节
    currentChangeCt(page){
      this.page = page
      if(this.cartoonCtChapterAll.length){
        this.cartoonCtChapter = this.cartoonCtChapterAll.slice((this.pageCt-1) * this.pageSizeCt, this.pageCt * this.pageSizeCt)
      }
    },
    // 当前页改变时-小说章节
    currentChangeCp(page){
      this.pageCp = page
      if(this.novelCtChapterAll.length){
        this.novelCtChapter = this.novelCtChapterAll.slice((this.pageCp-1) * this.pageSizeCp, this.pageCp * this.pageSizeCp)
      }
    }
  },
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
