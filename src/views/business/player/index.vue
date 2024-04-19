<template>
  <div class="app-container home">
    <el-row>
      <div>
        <label>
          <input
            id="input_address"
            v-model="liveUrl"
            type="text"
            placeholder="请输入播放地址"
          />
        </label>
        <el-button @click="play()" style="margin-left: 10px" type="primary"
          >播放
        </el-button>
        <el-button @click="stop()" type="info">停止</el-button>
      </div>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="24">
        <video
          id="player"
          ref="player"
          controls
          autoplay
          muted
          poster="@/assets/images/cover.svg"
        ></video>
        
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="tableData" border style="width: 100%" max-height="250">
          <el-table-column
            fixed
            prop="createTime"
            align="center"
            label="发生时间"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="remark"
            align="center"
            label="事件类型"
            width="300"
          >
          </el-table-column>
          <el-table-column prop="grade" align="center" label="警报等级">
            <template slot-scope="scope">
          <dict-tag
            :options="dict.type.bus_ai_alarm"
            :value="scope.row.grade"
          />
        </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="queryRow(scope.row.unsafeid, scope.row)"
                type="text"
                size="small"
              >
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      title="查看信息"
      :visible.sync="open"
      width="500px"
      append-to-body
    >
      <el-form ref="alarm" :model="alarm" label-width="90px">
        <el-form-item label="发生时间:" prop="createTime">
          {{ alarm.createTime }}
        </el-form-item>
        <el-form-item label="预警图片：" prop="imagePath">
          <el-image
            style="width: 200px; height: 200px"
            :src="alarm.imagePath"
            fit="fill"
          ></el-image>
          
        </el-form-item>
        <el-form-item label="事件类型:" prop="remark">
          {{ alarm.remark }}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getFlvUrl,getCurrentAlarm  } from "@/api/business/player";
import mqtt from "mqtt";
import {getDay} from "@/utils/time/getTime";
import FlvExtend from "flv-extend";
export default {
  name: "index",
  dicts: ["bus_ai_alarm", "sys_normal_disable"],
  data() {
    return {
      liveUrl: "",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        state: 1,
        c: null,
        location: null,
        category: [],
      },
      alarm:"",
      dateRange: [],
      client: null,
      like: true,
      tableData: [],
      // 版本号
      version: "3.4.0",
      // 是否显示弹出层
      open: false,
      UnsafeInfo: {
        location: "",
      },
      form: {
        warning: "",
      },
    
      videoOptions: {
        autoplay: true,
        controls: true,
        sources: [
          {
            src: "../assets/example.mp4",
            type: "video/mp4",
          },
        ],
      },
    };
  },
  mounted() {
    this.initVideo();
  },
  beforeDestroy() {
    //断开连接
    this.client.end();
    this.client = null;
    //console.log("已经与mqtt客户端断开连接");
  },
  created() {
    this.getAlarmList()
  },
  methods: {
    //得到最近一天且未处理的报警
    getAlarmList() {
      this.dateRange=[getDay(-300),getDay(0)]
      getCurrentAlarm(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
            this.tableData=response.rows;

        }
      );
    },
    // initVideo(url) {
    //   //播放器存在 清空重置
    //   if (player) {
    //     player.destroy();
    //     player = null;
    //   }
      
    //   let app = this.$route.query.app; // 获取名字
    //   let name = this.$route.query.name; // 获取名字
    //   if(app!=null&&name!=null){
    //     getFlvUrl(app, name).then((response) => {
    //     if (response.code == 200) {
    //       let data = response.data;
    //       if (data.hasAdress) {
    //         url = data.flvUrl;
    //         this.liveUrl = url;
    //       }
    //     }
    //   })
    //   }
      
    //   // 配置需要的功能
    //   const flv = new FlvExtend({
    //     element: document.getElementById("player"), // *必传
    //     frameTracking: true, // 开启追帧设置
    //     updateOnStart: true, // 点击播放后更新视频
    //     updateOnFocus: true, // 获得焦点后更新视频
    //     reconnect: true, // 开启断流重连
    //     reconnectInterval: 2000, // 断流重连间隔
    //   });

    //   // 调用 init 方法初始化视频
    //   // init 方法的参数与 flvjs.createPlayer 相同，并返回 flvjs.player 实例
    //   let player;
    //   const self = this;
    //   setTimeout(function () {
    //     player = flv.init(
    //       {
    //         type: "flv",
    //         url: self.liveUrl,
    //         isLive: true,
    //       },
    //       {
    //         enableStashBuffer: false, // 如果您需要实时（最小延迟）来进行实时流播放，则设置为false
    //         stashInitialSize: 128, // 减少首帧显示等待时长
    //       }
    //     );
    //     player.play();
    //   }, 1000); // 延迟时间为1000毫秒（1秒）
    // },
    async initVideo() {
    // 如果播放器存在，清空重置
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }

    // 从路由中获取'app'和'name'
    const { app, name } = this.$route.query;
    if(app!=null&&name!=null){
        try {
        const response = await getFlvUrl(app, name);
        //console.log(response.data.hasAddress) 
        if (response.code === 200 && response.data.hasAddress) {
          this.liveUrl = response.data.flvUrl;
        } else {
          console.error('Failed to get video URL:', response);
          return; // 获取URL失败，终止执行
        }
      } catch (error) {
        console.error('Error fetching video URL:', error);
        return; // 出错时，终止执行
      }
    }
    

    // 配置播放器
    const flv = new FlvExtend({
      element: document.getElementById("player"), // 必传
      frameTracking: true,        // 开启追帧设置
      updateOnStart: true,        // 点击播放后更新视频
      updateOnFocus: true,        // 获得焦点后更新视频
      reconnect: true,            // 开启断流重连
      reconnectInterval: 2000,    // 断流重连间隔
    });

    // 延迟初始化和播放，以确保DOM已更新
    setTimeout(() => {
      
      if(this.liveUrl!=null&&this.liveUrl!=""){
        this.player = flv.init({
        type: "flv",
        url: this.liveUrl,
        isLive: true
      }, {
        enableStashBuffer: false,  // 实时流播放
        stashInitialSize: 128      // 减少首帧显示等待时长
      });
        this.player.play().catch(err => {
        console.error('Error playing video:', err);
      });
      }
      
    }, 1000); // 延迟1秒以确保视频URL已更新
  },
    publish(topic, message) {
      if (!this.client.connected) {
        //console.log("客户端未连接");
        return;
      }
      this.client.publish(topic, message, { qos: 0 }, (err) => {});
    },
    initMqtt() {
      // 连接配置选项
      let options = {
        connectTimeout: 4000, // 超时时间
        // 认证信息
        clientId: "cumt/message/" + Math.random(), //不填默认随机生成一个ID
        username: "yuankun", //用户名
        password: "123456yk", //密码
      };
      this.client = mqtt.connect("ws://localhost:8083/mqtt", options); //调用连接的api
      const topic = "cumt/message";

      //连接成功
      this.client.on("connect", (e) => {
        this.form.warning = this.form.warning + "连接成功" + "\r";
        let tem = {
          index: 2,
          message: "连接成功",
          time: "2021-01-02 22:39:48",
        };
        //this.form.warning.push(tem);
        //console.log("连接成功", e);
      });
      this.client.subscribe(topic, { qos: 0 }, (err) => {});
      this.client.subscribe("cumt/tips", { qos: 0 }, (err) => {});
      this.client.on("message", (topic, message) => {
        console.log(`收到来自：${topic} 的消息：${message}`);
        if (topic == "cumt/message") {
          const data = JSON.parse(`${message}`); //接受到控制信号的数据
          this.tableData.unshift(data);
        }
        if (topic == "cumt/tips") {
          const data = JSON.parse(`${message}`); //接受到控制信号的数据
          if (data.code == 500) {
            this.$modal.msgError(data.msg);
          }
          if (data.code == 200) {
            this.$modal.msgSuccess(data.msg);
          }
        }
      });
      //重连提醒
      this.client.on("reconnect", (error) => {
        //this.form.warning = this.form.warning  + "正在重连"+"\r";
        console.log("正在重连", error);
      });
      //连接失败提醒
      this.client.on("error", (error) => {
        this.form.warning = this.form.warning + "连接失败" + "\r";
        console.log("连接失败", error);
      });
    },
    // initVideo() {
    //   //初始化视频方法
    //   let myPlayer = this.$video(myVideo, {
    //     //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
    //     controls: true,
    //     //自动播放属性,muted:静音播放
    //     autoplay: "muted",
    //     //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
    //     preload: "auto",
    //     //设置视频播放器的显示宽度（以像素为单位）
    //     width: "400px",
    //     //设置视频播放器的显示高度（以像素为单位）
    //     height: "350px",
    //   });
    // },

    goTarget(href) {
      window.open(href, "_blank");
    },
    play(){
      this.initVideo()
    },
    stop(){
      this.player.pause()
    },
    format(percentage) {
      return percentage === 100 ? "满" : `${percentage}%`;
    },
    queryRow(id, alarm) {
      this.open = true;
      this.alarm=alarm
    },
    downloadImage(id) {
      //this.download('message/warning/downloadImage/'+id, `info_${new Date().getTime()}.jpg`)
      //queryInfoById(id).then((res) => {});
      downloadFile(id).then((res) => {});
    },
  },
};
</script>

<style scoped lang="scss">
video {
  width: 100%;
  height: 100%;
  max-height: 550px;
  background-color: rgba(0, 0, 00, 1);
  /*object-fit: fill;*/ /*伸缩*/
  border-radius: 5px;
  /*border: 1px solid #f0f0f0;*/
}
#input_address {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  font-size: 13px;
  font-weight: normal;
  height: 35px;
  line-height: 35px;
  width: 400px;

  margin-left: 15px;
  padding: 1px 10px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.home {
  position: relative;
  .card01 {
    position: absolute;
    width: 450px;
    height: 450px;
    left: 50px;
    top: 30px;
  }
  .card02 {
    position: absolute;
    width: 450px;
    height: 450px;
    top: 30px;
    left: 550px;
  }
  .select {
    position: absolute;
    top: 100px;
    left: 1080px;
  }
  .progress {
    position: absolute;
    width: 300px;
    left: 1050px;
    top: 30px;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .like {
    cursor: pointer;
    font-size: 25px;
    display: inline-block;
  }
}
</style>
