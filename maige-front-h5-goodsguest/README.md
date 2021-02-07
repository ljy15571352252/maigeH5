# 福利商城

## 项目安装和依赖说明
```
npm install 或 cnpm
基于vue-cli3开发
```
### 项目在开发环境中运行
```
npm run dev
```

### 项目在开发环境切换接口环境（两种情况）
```
第一种：当使用代理的方式启动时，在src/configs/env.js更改开发环境下的接口地址需要重启代理,暂时采用的代理
第二种：无需任何代理，在开发阶段直接关闭浏览器的安全模式，并且在在src/configs/env.js更改开发环境下的接口地址，无需重启
```

### 测试环境打包(需要在根目录.env.test文件里设置VUE_APP_BASEURL为测试环境接口地址)
```
npm run build:test
```

### 生产环境打包(需要在根目录.env.prod文件里设置VUE_APP_BASEURL为生产环境接口地址)
```
npm run build
```

### vue-cli自带的lint检查
```
npm run lint
```

### css约定规则（在没有普及CSS module之前,不要使用scoped）
```
命名规则：每个组件最外层类名以组件所在的文件夹来命名并且最外层类名包裹所有组件内样式，比如views/person/index.vue那么组件的最外面类名命名为v-person-index，来尽量避免变量名污染
书写规则：css嵌套最好不要超过四层
静态资源引入：1.在组件中使用~+别名引入，比如<img src="~assets/home/banner.png"/>
             2.js操作：require引入+ 别名引入，比如 require("assets/home/banner.png")
```
### 组件开发规则
```
1. 如果是组件之间的数据通讯尽量采用组件传值，这样有利于阅读
2. 开发过程中封装的组件比如自定义弹窗，自定义toast等这种使用较为广泛的在main.js注册，普通的组件最好手动引入，利于代码阅读
```

### 项目的目录介绍（重要）

-src
    -assets                    存放全局使用图片和一些全局的基础css以及mixincss
    -components                存放可复用的vue组件
    -configs                   存放需要动态添加的一些配置，比如接口环境，按需加载组件，接口统一管理，公共的一些遍历数据，正则等等     -http                      专门存放请求的文件
    -router                    专门存放路由
    -store                     vuex仓库
    -utils                     存放一些常用的js逻辑或者插件
    -views                     业务代码写在这里                   
.en.prod                       生产环境的打包配置
.env.test                      测试环境的打包配置
babel.config.js                babel配置
package.json                   依赖json文件
vue.config.js                  vue-cli提供的api来定制一些配置
