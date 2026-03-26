export default defineAppConfig({
  pages: [
    "pages/tabbar/index",
    'pages/index/index',
    "pages/home/index"

  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar:{
    // 默认选中的 tab 索引（从 0 开始）
    selectedColor: '#1677ff',
    // 未选中文字颜色
    color: '#666',
    // 背景色
    backgroundColor: '#fff',
    // 边框颜色（顶部一条线）
    borderStyle: 'black',
    list:[
      {
        pagePath:"pages/index/index",
        text:"首页",

      }
    ]
  }
})
