/**
 * 各个环境配置
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 */

let baseURL = '';
if (process.env.NODE_ENV === 'development') {
	// 开发环境(两种方式实现跨域)
	// 方式一：在这里省略域名仅仅添加代理字段，同时在vue.config.js的devServer里设置代理的目标地址，缺点，切换目标域名需要重启服务
	// 方式二：不用devserver代理，直接关闭谷歌浏览器的安全策略，在这里设置完整请求地址。当我们切换请求目标，无需重启服务。较为推荐
	// 本项目暂时采取方式一
	// baseURL = 'http://c.test.fyuanai.com'
	baseURL = 'http://www.maige.com'
} else if (process.env.VUE_APP_CURRENTMODE === 'test') {
	// 在根目录的.env.test配置接口路径
	baseURL = process.env.VUE_APP_BASEURL;
} else if (process.env.VUE_APP_CURRENTMODE === 'production') {
	// 在根目录的.env.prod配置接口路径
	baseURL = process.env.VUE_APP_BASEURL;
}

export default {
	baseURL
};