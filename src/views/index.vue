<template>
  <div class="app-container home">
    <!-- <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <el-statistic
            group-separator=","
            :precision="2"
            :value="value2"
            :title="title"
          ></el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-statistic title="男女比">
            <template slot="formatter"> 456/2 </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-statistic
            group-separator=","
            :precision="2"
            decimal-separator="."
            :value="value1"
            :title="title"
          >
            <template slot="prefix">
              <i class="el-icon-s-flag" style="color: red"></i>
            </template>
            <template slot="suffix">
              <i class="el-icon-s-flag" style="color: blue"></i>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-statistic :value="like ? 521 : 520" title="Feedback">
            <template slot="suffix">
              <span @click="like = !like" class="like">
                <i
                  class="el-icon-star-on"
                  style="color: red"
                  v-show="!!like"
                ></i>
                <i class="el-icon-star-off" v-show="!like"></i>
              </span>
            </template>
          </el-statistic>
        </div>
      </el-col>
    </el-row> -->

    <el-row :gutter="2">
      <el-col :span="12">
        <!-- <video
          id="videoElement1"
          style="width: 1450px; height: 700px"
          controls
          autoplay
          muted
        ></video> -->
        <video
        id="webrtc" ref="webrtc" controls 
         
          style="width: 1450px; height: 700px"
          controls
          autoplay
          muted
        ></video>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="tableData" border style="width: 100%" max-height="250" >
          <el-table-column fixed prop="createTime" align="center" label="发生时间" width="200">
          </el-table-column>
          <el-table-column prop="eveType" align="center" label="事件类型" width="300"> </el-table-column>
          <el-table-column prop="location" align="center" label="位置" > </el-table-column>

          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="queryRow(scope.row.unsafeid, tableData)"
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
    <!-- <el-row>
      <el-col :span="24">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="消息提示">
            <!-- <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
            <!-- <el-input type="textarea" v-model="form.warning"></el-input> -->
    <!-- <div v-for="item in form.warning" style="font-size: 15px">
              <span>{{item.message}}</span>
              <span>{{item.time}}</span>
            </div>
            </ul>
            <el-input
              type="textarea"
              :rows="9"
              :disabled="true"
              placeholder="请输入内容"
              v-model="form.warning"
            >
            </el-input>
  
          </el-form-item>
        </el-form>
      </el-col>
    </el-row> -->
    <!-- <el-progress :percentage="50" class="progress"></el-progress>
    <el-select v-model="value" class="select" placeholder="请选择要检测的物体">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select> -->
    <!-- 查看对话框 -->
    <el-dialog
      title="查看信息"
      :visible.sync="open"
      width="500px"
      append-to-body
    >
      <el-form ref="UnsafeInfo" :model="UnsafeInfo" label-width="90px">
        <!-- <el-form-item label="当前状态:" prop="curState" >
        <el-select
              v-model="UnsafeInfo.curState"
              placeholder="当前状态"
              clearable
              style="width: 240px"
            >
            <el-option
                v-for="dict in dict.type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
      </el-form-item> -->
        <!-- <el-form-item label="${comment}" prop="imgPath">
          <el-input v-model="form.imgPath" placeholder="请输入${comment}" />
        </el-form-item> -->
        <el-form-item label="发生时间:" prop="eveType">
          <!-- <el-input v-model="UnsafeInfo.location" placeholder="请输入位置" /> -->
          {{ UnsafeInfo.createTime }}
        </el-form-item>
        <el-form-item label="位置:" prop="location">
          <!-- <el-input v-model="UnsafeInfo.location" placeholder="请输入位置" /> -->
          {{ UnsafeInfo.location }}
        </el-form-item>
        <el-form-item label="图片" prop="imgPath">
          <el-image
            style="width: 100px; height: 100px"
            :src="'data:image/jpeg;base64,' + UnsafeInfo.imgPath"
            fit="fill"
          ></el-image>
          <div>
            <el-button
              type="primary"
              @click="downloadImage(UnsafeInfo.unsafeid)"
              >下载图片</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="事件类型:" prop="eveType">
          <!-- <el-input v-model="UnsafeInfo.location" placeholder="请输入位置" /> -->
          {{ UnsafeInfo.eveType }}
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>  -->
    </el-dialog>
  </div>
</template>

<script>
//import JSWebrtc from "@/utils/jswebrtc.min.js"
import mqtt from "mqtt";
import flvjs from "flv.js";
import FlvExtend from "flv-extend";
import { onMounted,ref } from 'vue';
// 定义全局属性
let videoStream = null;
let videoElement = null;
// 全局的RTCPeerConnection
let pc = null;
// 全局音频轨道，用于RTCRtpSender发送和停止对应轨道
let audioTrack = null;
// 全局的RTCRtpSender
const play = async()=>{
    var httpURL = "http://127.0.0.1:1985/rtc/v1/whep/?app=live&stream=livestream";
    var webRTCURL = "webrtc://127.0.0.1:1985/rtc/v1/whep/?app=live&stream=livestream";
    // 创建RTCPeerConnection连接对象
    var pc = new RTCPeerConnection();
    // 创建媒体流对象
    var stream = new MediaStream();
    // 获取播放流的容器video
    var videoElement2 = document.getElementById('webrtc')	;
    // 监听流
    pc.ontrack = (event)=>{
        // 监听到的流加入MediaStream对象中让video播放
        stream.addTrack(event.track);
        videoElement2.srcObject = stream;
    }
    // RTCPeerConnection方法addTransceiver()创建一个新的RTCRtpTransceiver，并将其添加到与RTCPeerConnection关联的收发器集中。
    // 每个收发器代表一个双向流，RTCRtpSender和RTCRtpReceiver都与之相关联。
    // 注意添加顺序为audio、video,后续RTCPeerConnection创建offer时SDP的m线顺序遵循此顺序创建，SRS自带的信令服务器响应的SDP中m线总是先audio后video。
    // 若本端SDP和远端SDP中的m线顺序不一直，则设置远端描述时会异常，显示offer中的m线与answer中的m线顺序不匹配
    pc.addTransceiver("audio", {direction: "recvonly"});
    pc.addTransceiver("video", {direction: "recvonly"});

    var offer =await pc.createOffer();
    await pc.setLocalDescription(offer)
    var data = {
            "api": httpURL,
            "streamurl":webRTCURL,
            "sdp":offer.sdp
    }
    // SDP交换，请求SRS自带的信令服务器
    httpApi(httpURL,data).then(async(data)=>{
            console.log("answer",data);
            // 设置远端描述，开始连接
            await pc.setRemoteDescription(new RTCSessionDescription({type: 'answer', sdp: data.sdp}));
            button_five.value.disabled=true;

    }).catch((data)=>{
            if(data.code===400){
                console.log("SDP交换失败");
            }
    });
}
const httpApi = (httpURL,data)=>{
    var promise = new Promise((resolve,reject)=>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', httpURL, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(data));
        xhr.onload = ()=>{
                if (xhr.readyState !== xhr.DONE) reject(xhr);
                if (xhr.status !== 200 && xhr.status !== 201) reject(xhr) ;
                var data = JSON.parse(xhr.responseText);
                if(data.code===0){
                    resolve(data);
                }else{
                    reject(data)
                }
            }
    });
    return promise;
}
import { queryInfoById, downloadFile, getInfo } from "@/api/business/alarm";
export default {
  name: "index",
  data() {
    return {
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
      options: [
        {
          value: "选项1",
          label: "人",
        },
        {
          value: "选项2",
          label: "机器",
        },
        {
          value: "选项3",
          label: "车辆",
        },
      ],
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
    this.initMqtt();
    
      this.initVideo('webrtc://127.0.0.1:1985/rtc/v1/whep/?app=live&stream=livestream')
    
    //play();
    // this.$nextTick(()=>{
    //   this.initVideo('webrtc://127.0.0.1:1985/rtc/v1/whep/?app=live&stream=livestream');
    // })
    //this.initVideo('http://127.0.0.1:1985/rtc/v1/whep/?app=live&stream=livestream');
    // 配置需要的功能
    // const flv = new FlvExtend({
    //   element: document.getElementById("videoElement1"), // *必传
    //   frameTracking: true, // 开启追帧设置
    //   updateOnStart: true, // 点击播放后更新视频
    //   updateOnFocus: true, // 获得焦点后更新视频
    //   reconnect: true, // 开启断流重连
    //   reconnectInterval: 2000, // 断流重连间隔
    // });

    // 调用 init 方法初始化视频
    // init 方法的参数与 flvjs.createPlayer 相同，并返回 flvjs.player 实例
    // const player = flv.init(
    //   {
    //     type: "flv",
    //     url: "http://127.0.0.1:8080/live/livestream.flv",
    //     isLive: true,
    //   },
    //   {
    //     enableStashBuffer: false, // 如果您需要实时（最小延迟）来进行实时流播放，则设置为false
    //     stashInitialSize: 128, // 减少首帧显示等待时长
    //   }
    // );
    
    // 直接调用play即可播放
    //player.play();
    //   document.addEventListener('visibilitychange', function() {
    //    // 获取当前页面video节点
    //   let videoEleObj = document.getElementById('videoElement1');
    //   // 离开了当前页面时触发
    //   if (document.visibilityState === 'hidden') {
    //        console.log(document.visibilityState);
    //   }
    //   // 打开或回到页面时触发
    //   if (document.visibilityState === 'visible') {
    //     console.log(document.visibilityState);
    //     // 防止视频延时
    //     console.log(videoEleObj);
    //     for (let video in videoEleObj) {
    //     // 监听通过判断buffered属性（该属性记录了视频的缓存范围）；
    //       let buffered = videoEleObj[video].buffered;
    //       console.log(video);
    //     // 若存在buffered，则应该将currentTime赋值到缓存范围尾端。
    //       if (buffered && buffered.length > 0) {
    //         console.log(buffered.end(0));
    //         videoEleObj[video].currentTime = buffered.end(0) - 0.5;
    //       }
    //     }
    //   }
    // });
    // if (flvjs.isSupported()) {
    //   let videoElement1 = document.getElementById("videoElement1"); //获取video的dom元素

    //   if (videoElement1) {
    //     //添加一些必要的属性

    //     videoElement1.muted = true;

    //     videoElement1.controls = true;
    //   }

    //   let flvPlayer = flvjs.createPlayer({
    //     type: "flv",

    //     isLive: true,

    //     hasAudio: false,

    //     url: "http://127.0.0.1:8080/live/livestream.flv", // 自己的flv视频流
    //   });

    //   if (flvPlayer) {
    //     flvPlayer.attachMediaElement(videoElement1);

    //     flvPlayer.load();
    //     // let timer = setInterval(() => {
    //     //   let end = flvPlayer.buffered.end(0);
    //     //   let diff = end - flvPlayer.currentTime;
    //     //   //重新构建
    //     //   if (diff >= 10) {
    //     //     this.flv_destroy(flvPlayer);
    //     //     realtimeOnFlv(flvPlayer);
    //     //   }
    //     // });
    //     let playPromise = flvPlayer.play();

    //     if (playPromise) {
    //       playPromise
    //         .then(() => {
    //           setTimeout(() => {
    //             flvPlayer.play();
    //           }, flvPlayer.lazyLoadMaxDuration * 1000);
    //         })
    //         .catch((e) => {
    //           flvPlayer.play();
    //         });
    //     }
    //   }
    // }

    //this.initVideo(),

    //this.publish("cumt/message","开启直播")
  },
  beforeDestroy() {
    //断开连接
    this.client.end();
    this.client = null;
    //console.log("已经与mqtt客户端断开连接");
  },
  created() { 
     //this.initVideo('webrtc://127.0.0.1:1985/rtc/v1/whep/?app=live&stream=livestream');
  },
  methods: {
    
		initVideo(url){
 
				// 播放器存在 清空重置
				// if (player) {
				// 	player.destroy()
				// 	player = null
				// }
				let videoDom = document.getElementById('webrtc')			// 初始化播放器 
        async()=>{
player = new JSWebrtc.Player(url, {
					video: videoDom,
					autoplay: true,
					onPlay: (obj) => {
						// 监听video元素状态，可播放时进行播放 。 某些情况下  autoplay 会失效
						// mdn https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/canplay_event
						// 菜鸟 https://www.runoob.com/tags/av-event-canplay.html
						videoDom.addEventListener('canplay', function () {
							videoDom.play()
						})
						// console.log(obj, '播放器开始播放！')
					}
				})
        return promise
        }
				
 
		},
    
    // flv_destroy(player) {
    //   player.pause();
    //   player.unload();
    //   player.detachMediaElement();
    //   player.destroy();
    // },
    publish(topic, message) {
      if (!this.client.connected) {
        //console.log("客户端未连接");
        return;
      }
      this.client.publish(topic, message, { qos: 0 }, (err) => {
        
      });
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
      this.client.subscribe(topic, { qos: 0 }, (err) => {
      });
      this.client.subscribe("cumt/tips", { qos: 0 }, (err) => {
      });
      this.client.on("message", (topic, message) => {
        console.log(`收到来自：${topic} 的消息：${message}`);
        if (topic == "cumt/message") {
          const data = JSON.parse(`${message}`); //接受到控制信号的数据
          //console.log(data);
          //this.form.warning.push(data);
          //this.form.warning = this.form.warning + message + "\r";
          this.tableData.unshift(data);
        }
        if(topic == "cumt/tips"){
          const data = JSON.parse(`${message}`); //接受到控制信号的数据
          if(data.code==500){
            this.$modal.msgError(data.msg);
          }
          if(data.code==200){
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
    // receive() {
    //   this.client.on("message", (topic, message) => {
    //     console.log(`收到来自：${topic} 的消息：${message}`);
    //     const data = JSON.parse(`${msg}`); //接受到控制信号的数据
    //     this.form.warning = this.form.warning + data.warning;
    //     console.log(data);
    //   });
    // },
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

    format(percentage) {
      return percentage === 100 ? "满" : `${percentage}%`;
    },
    queryRow(id, tableData) {
      this.open = true;
      getInfo(id).then((response) => {
        this.UnsafeInfo = response.data;
      });
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
