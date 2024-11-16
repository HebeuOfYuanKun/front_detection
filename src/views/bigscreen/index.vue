<template>
  <div id="index" ref="appRef">
    <div class="bg">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <div v-else class="host-body">
        <div class="d-flex jc-center">
          <dv-decoration-10 class="dv-dec-10" />
          <div class="d-flex jc-center">
            <dv-decoration-8 class="dv-dec-8" :color="decorationColor" />
            <div class="title">
              <span class="title-text">无人机智慧巡检大数据可视化平台</span>
              <dv-decoration-6
                class="dv-dec-6"
                :reverse="true"
                :color="['#50e3c2', '#67a1e5']"
              />
            </div>
            <dv-decoration-8
              class="dv-dec-8"
              :reverse="true"
              :color="decorationColor"
            />
          </div>
          <dv-decoration-10 class="dv-dec-10-s" />
        </div>

        <!-- 第二行 -->
        <div class="d-flex jc-between px-2">
          <div class="d-flex aside-width">
            <div class="react-left ml-4 react-l-s">
              <span class="react-left"></span>
              <span class="text">飞机状态：尚未起飞</span>
            </div>
            <div class="react-left ml-3">
              <span class="text">今日天气：{{ weatherdata.weather }} {{ weatherdata.temperature }} °</span>
            </div>
          </div>
          <div class="d-flex aside-width">
            <div class="react-right bg-color-blue mr-3">
              <span class="text fw-b">{{ deptInfo.deptName }}</span>
            </div>
            <div class="react-right mr-4 react-l-s">
              <span class="react-after"></span>
              <span class="text"
                >{{ dateYear }} {{ dateWeek }} {{ dateDay }}</span
              >
            </div>
          </div>
        </div>

        <div class="body-box">
          <!-- 第三行数据 -->
          <div class="content-box">
            <div>
              <dv-border-box-12>
                <centerLeft1 />
              </dv-border-box-12>
            </div>
            <div>
              <dv-border-box-12>
                <centerLeft2 />
              </dv-border-box-12>
            </div>
            <!-- 中间 -->
            <div>
              <center />
            </div>
            <!-- 中间 -->
            <div>
              <centerRight2 />
            </div>
            <div>
              <dv-border-box-13>
                <centerRight1 />
              </dv-border-box-13>
            </div>
          </div>

          <!-- 第四行数据 -->
          <div class="bottom-box">
            <dv-border-box-13>
              <bottomLeft />
            </dv-border-box-13>
            <dv-border-box-12>
              <bottomRight />
            </dv-border-box-12>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import drawMixin from "@/utils/bigscreen/drawMixin";
import { formatTime } from "@/utils/bigscreen/index.js";
import centerLeft1 from "./centerLeft1";
import centerLeft2 from "./centerLeft2";
import centerRight1 from "./centerRight1";
import centerRight2 from "./centerRight2";
import center from "./center";
import bottomLeft from "./bottomLeft";
import bottomRight from "./bottomRight";
import AMapLoader from "@amap/amap-jsapi-loader";
import { listDept } from "@/api/system/dept"
export default {
  mixins: [drawMixin],
  data() {
    return {
      timing: null,
      loading: true,
      dateDay: null,
      dateYear: null,
      dateWeek: null,
      weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      decorationColor: ["#568aea", "#000000"],
      weatherdata: {},
      deptInfo:{
        "deptName"  : ""
      },
    };
  },
  components: {
    centerLeft1,
    centerLeft2,
    centerRight1,
    centerRight2,
    center,
    bottomLeft,
    bottomRight,
  },
  mounted() {
    this.initWeather();
    this.timeFn();
    this.cancelLoading();
  },
  beforeDestroy() {
    clearInterval(this.timing);
  },
  created(){
    this.getDept()
  },
  methods: {
    getDept(){
      listDept({"parentId":0}).then(response => {
      this.deptInfo = response.data[0];
    });
    },
    initWeather() {
      AMapLoader.load({
        key: "35edef5e1b134ce75c721a266e6e5a2a", //申请好的Web端开发者 Key，调用 load 时必填
        version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Weather", "AMap.CitySearch"],
      }).then((AMap) => {
        let that = this;
        var citySearch = new window.AMap.CitySearch();
        console.log(citySearch);
        citySearch.getLocalCity(function (status, result) {
          console.log(result);
          if (status === "complete" && result.info === "OK") {
            // 查询成功，result即为当前所在城市信息
            //that.getWeather(result.city)
            //创建天气查询实例
            let weather = new AMap.Weather();
            weather.getLive(result.city, function (err, data) {
              if (data.info == "OK") {
                
                that.weatherdata = data;
              }
            });
          }
        });
      });
      //this.getCity()
    },
    getCity() {
      let that = this;
      if (window) {
        window.AMap.plugin("AMap.CitySearch", function () {
          var citySearch = new window.AMap.CitySearch();
          citySearch.getLocalCity(function (status, result) {
            if (status === "complete" && result.info === "OK") {
              // 查询成功，result即为当前所在城市信息
              that.getWeather(result.city);
            }
          });
        });
      }
    },
    // 获取天气
    getWeather(city) {
      let that = this;
      // 加载天气查询插件
      window.AMap.plugin("AMap.Weather", function () {
        // 创建天气查询实例
        let weather = new window.AMap.Weather();
        // 执行实时天气信息查询
        weather.getLive(city, function (err, data) {
          if (data.info == "OK") {
            that.weatherdata = data;
          }
        });
      });
    },
    timeFn() {
      this.timing = setInterval(() => {
        this.dateDay = formatTime(new Date(), "HH: mm: ss");
        this.dateYear = formatTime(new Date(), "yyyy-MM-dd");
        this.dateWeek = this.weekday[new Date().getDay()];
      }, 1000);
    },
    cancelLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/bigscreen/scss/index.scss";
@import "@/assets/bigscreen/scss/style.scss";
</style>
