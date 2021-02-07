/**
 * 路由组件
 * 规则:1.路由组件采用按需加载和分块打包的方式导入
 *      2.webpackChunkName: '名字' 这个为特殊打包注释，同名字的路由组件会被打包在一起
 *      3.导出组件的首字母大写
 */

// 首页
export const Home = () => import(/* webpackChunkName: 'home' */ "@/views/home/index.vue");

// ==========商品购买流程相关========== //
// 商品详细
export const Productnormal = () => import(/* webpackChunkName: 'product' */ "@/views/product/productnormal.vue");
// 商品评价详情
export const Productcomments = () => import(/* webpackChunkName: 'product' */ "@/views/product/comments.vue");
// 地址编辑/新增
export const Address = () => import(/* webpackChunkName: 'address' */ "@/views/address/addoredit.vue");
// 地址选择列表
export const AddressList = () => import(/* webpackChunkName: 'address' */ "@/views/address/addresslist.vue");
// 提交订单
export const OrderSubmit = () => import(/* webpackChunkName: 'order' */ "@/views/order/submit.vue");
// 提交订单-支付订单
export const PayOrder = () => import(/* webpackChunkName: 'order' */ "@/views/order/payorder.vue");
// 提交订单-支付结果
export const PayResult = () => import(/* webpackChunkName: 'order' */ "@/views/order/payresult.vue");


// ==========搜索========== //
// 分类搜索-分类搜索页面
export const Category = () => import(/* webpackChunkName: 'category' */ "@/views/category/index.vue");
// 分类搜索头部搜索跳转
export const Headsearch = () => import(/* webpackChunkName: 'heardsearch' */ "@/views/headsearch/index.vue");
// 分类搜索-搜索结果详情
export const SearchDetail = () => import(/* webpackChunkName: 'personal' */ "@/views/headsearch/searchDetail.vue");



// ==========发现========== //
// 发现首页
export const Discovery = () => import(/* webpackChunkName: 'discovery' */ "@/views/discovery/index.vue");

// 个人中心-设置-账户安全
export const AccountSecurity = () => import(/* webpackChunkName: 'order' */ "@/views/personal/Settings/security/index.vue");

// 个人中心-设置-账户安全-设置密码
export const ChangePassword = () => import(/* webpackChunkName: 'order' */ "@/views/personal/Settings/security/changePassword.vue");

// 个人中心-设置-账户安全-设置密码2
export const ChangePassword2 = () => import(/* webpackChunkName: 'order' */ "@/views/personal/Settings/security/changePassword2.vue");

// 个人中心-设置-账户安全-设置密码3
export const ChangePassword3 = () => import(/* webpackChunkName: 'order' */ "@/views/personal/Settings/security/changePassword3.vue");

// 个人中心-设置-账户安全-更改绑定手机
export const ChangeBindPhone = () => import(/* webpackChunkName: 'order' */ "@/views/personal/Settings/security/changeBindPhone.vue");

// 个人中心-设置-账户安全-更改绑定手机
export const ChangeBindPhone2 = () => import(/* webpackChunkName: 'order' */ "@/views/personal/Settings/security/changeBindPhone2.vue");

// 个人中心-设置-账户安全-更改绑定手机
export const ChangeBindPhone3 = () => import(/* webpackChunkName: 'order' */ "@/views/personal/Settings/security/changeBindPhone3.vue");

// ==========购物车========== //
// 购物车首页
export const Cart = () => import(/* webpackChunkName: 'cart' */ "@/views/cart/index.vue");


// ==========我的（个人中心）========== //
// 个人中心首页
export const Personal = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/index.vue");
// 个人中心-个人信息资料
export const Setinformation = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/Settings/information/index.vue");
// 个人中心-修改昵称
export const EdiotName = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/Settings/information/ediotname.vue");
// 个人中心-订单管理
export const OrderManage = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/order/manage.vue");
// 个人中心-订单管理-订单搜索页面
export const OrderSearch = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/order/search.vue");
// 个人中心-订单管理-订单详情
export const OrderDetail = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/order/orderdetail.vue");
// 个人中心-订单管理-订单详情-评价列表
export const CommentsList = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/order/comments.vue");
// 个人中心-订单管理-订单详情-评价列表
export const CommentEdit = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/order/commentedit.vue");
// 个人中心-订单管理-物流详情
export const DeliveryDetail = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/order/deliverydetail.vue");
// 个人中心-订单管理-物流列表
export const DeliveryList = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/order/deliverylist.vue");

// 个人中心-账户设置首页
export const PersonalSettings = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/Settings/index.vue");
// 个人中心-账户设置/地址管理
export const SettingsAdress = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/Settings/address.vue");
// 个人中心-售后管理
export const AfterSale = () => import(/* webpackChunkName: 'order' */ "@/views/personal/aftersale/index.vue");
// 个人中心-售后管理-售后申请
export const AfterSaleApply = () => import(/* webpackChunkName: 'order' */ "@/views/personal/aftersale/routercomponents/apply.vue");
// 个人中心-售后管理-处理中
export const AfterSaleProcessing = () => import(/* webpackChunkName: 'order' */ "@/views/personal/aftersale/routercomponents/processing.vue");
// 个人中心-售后管理-升级客诉
export const AfterSaleUpgrade = () => import(/* webpackChunkName: 'order' */ "@/views/personal/aftersale/routercomponents/upgrade.vue");
// 个人中心-售后管理-升级客诉按钮
export const AfterSaleComplaints = () => import(/* webpackChunkName: 'order' */ "@/views/personal/aftersale/routercomponents/complaints.vue");
// 个人中心-售后管理-售后评价
export const AfterSaleRate = () => import(/* webpackChunkName: 'order' */ "@/views/personal/aftersale/routercomponents/rate.vue");
// 个人中心-售后管理-申请记录
export const AfterSaleRecord = () => import(/* webpackChunkName: 'order' */ "@/views/personal/aftersale/routercomponents/record.vue");
// 个人中心-售后管理-申请售后-选择类型
export const AfterSaleType = () => import(/* webpackChunkName: 'order' */ "@/views/personal/aftersale/routercomponents/type.vue");
// 个人中心-售后管理-申请售后-退货
export const AfterSaleRefund = () => import(/* webpackChunkName: 'order' */ "@/views/personal/aftersale/routercomponents/refund.vue");
// 个人中心-售后管理-申请售后-换货
export const AfterSaleExchange = () => import(/* webpackChunkName: 'order' */ "@/views/personal/aftersale/routercomponents/exchange.vue");
// 个人中心-售后管理-申请售后-维修
export const AfterSaleFix = () => import(/* webpackChunkName: 'order' */ "@/views/personal/aftersale/routercomponents/fix.vue");
// 个人中心-售后管理-申请售后-同订单选择退货商品
export const AfterSaleSelectPro = () => import(/* webpackChunkName: 'order' */ "@/views/personal/aftersale/routercomponents/selectpro.vue");
// 个人中心-售后管理-申请售后-服务单详情
export const AfterSaleTicket = () => import(/* webpackChunkName: 'order' */ "@/views/personal/aftersale/routercomponents/ticket.vue");
// 个人中心-售后管理-申请售后-服务单详情-进度详情
export const AfterSaleTicketDetail = () => import(/* webpackChunkName: 'order' */ "@/views/personal/aftersale/routercomponents/ticketdetail.vue");
// 个人中心-售后管理-申请售后-寄回快递
export const AfterSaleSendback = () => import(/* webpackChunkName: 'order' */ "@/views/personal/aftersale/routercomponents/sendback.vue");

// 个人中心-资金管理
export const FundManagement = () => import(/* webpackChunkName: 'order' */ "@/views/personal/fundmanagement/index.vue");
// 个人中心-资金管理-我的积分
export const Integral = () => import(/* webpackChunkName: 'order' */ "@/views/personal/fundmanagement/integral.vue");



// ==========账户相关========== //
// 账户页面（包括登录注册等等）
export const Account = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/account/index.vue");
// 账户-登录
export const Login = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/account/login.vue");
// 账户-注册
export const Register = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/account/register.vue");
// 账户-绑定手机号码
export const BindingIpone = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/binding/index.vue");
// 账户-找回密码-验证手机号
export const FoundCode1 = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/account/foundCode1.vue");
// 账户-找回密码-设置密码
export const FoundCode2 = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/account/foundCode2.vue");
// 账户-注册协议
export const RegisterAgreement = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/account/registerAgreement.vue");
// 账户-注册协议-注册协议细则
export const RegisterAgreementDetail = () => import(/* webpackChunkName: 'personal' */ "@/views/personal/account/agreementDetail.vue");

// ==========活动相关========== //
// 活动-折扣专区
export const Discount = () => import(/* webpackChunkName: 'personal' */ "@/views/activity/discount.vue");
// 活动-特惠专区
export const Preferential = () => import(/* webpackChunkName: 'personal' */ "@/views/activity/preferential.vue");
// 活动-节日专区
export const Festival = () => import(/* webpackChunkName: 'personal' */ "@/views/activity/festival.vue");
// 活动-生日专区
export const Birthday = () => import(/* webpackChunkName: 'personal' */ "@/views/activity/birthday.vue");
// 活动-限时秒杀
export const Seckill = () => import(/* webpackChunkName: 'personal' */ "@/views/activity/seckill.vue");
// 活动-周周精选
export const Weekly = () => import(/* webpackChunkName: 'personal' */ "@/views/activity/weekly.vue");
// 活动-周周精选
export const Goodfirst = () => import(/* webpackChunkName: 'personal' */ "@/views/activity/goodfirst.vue");
// 活动-拼团
export const Assemble = () => import(/* webpackChunkName: 'personal' */ "@/views/activity/assemble.vue");
// 活动-拼团
export const Groupbuying = () => import(/* webpackChunkName: 'personal' */ "@/views/activity/groupbuying.vue");
// 活动-分销
export const Distribution = () => import(/* webpackChunkName: 'personal' */ "@/views/activity/distribution.vue");
