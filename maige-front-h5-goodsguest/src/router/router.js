import Vue from 'vue'
import Router from 'vue-router'
import {
  myStorage
} from "@/utils/cache.js";
import {
  Home,
  Category,
  Discovery,
  Cart,
  Personal,
  Productnormal,
  Productcomments,
  Address,
  AddressList,
  Account,
  Login,
  Register,
  FoundCode1,
  FoundCode2,
  RegisterAgreement,
  Headsearch,
  PersonalSettings,
  Setinformation,
  OrderSubmit,
  RegisterAgreementDetail,
  PayOrder,
  PayResult,
  OrderManage,
  OrderSearch,
  OrderDetail,
  SearchDetail,
  AfterSale,
  AfterSaleApply,
  AfterSaleProcessing,
  AfterSaleUpgrade,
  AfterSaleComplaints,
  AfterSaleRate,
  AfterSaleRecord,
  AfterSaleType,
  AfterSaleRefund,
  AfterSaleExchange,
  AfterSaleFix,
  AfterSaleSelectPro,
  AfterSaleTicket,
  AfterSaleTicketDetail,
  SettingsAdress,
  EdiotName,
  AccountSecurity,
  ChangePassword,
  ChangePassword2,
  ChangePassword3,
  ChangeBindPhone,
  ChangeBindPhone2,
  ChangeBindPhone3,
  Discount,
  Preferential,
  Festival,
  Birthday,
  Seckill,
  Weekly,
  Goodfirst,
  Assemble,
  AfterSaleSendback,
  CommentsList,
  CommentEdit,
  DeliveryDetail,
  DeliveryList,
  Groupbuying,
  FundManagement,
  Integral,
  Distribution,
  BindingIpone
} from './components.js';

// 全局注册路由
Vue.use(Router)
// 路由规则
const routes = [{
    path: "*",
    redirect: "/home"
  }, {
    path: "/",
    redirect: "/home"
  }, {
    // 首页
    path: '/home',
    name: 'home',
    component: Home,
    // 是否需要显示底部导航
    meta: {
      needNav: true
    }

  }, {
    // 分类页面
    path: '/category',
    name: 'category',
    component: Category,
    meta: {
      needNav: true
    }

  }, {
    // 发现
    path: '/discovery',
    name: 'discovery',
    component: Discovery,
    meta: {
      needNav: true
    }

  }, {
    // 购物车
    path: '/cart',
    name: 'cart',
    component: Cart,
    meta: {
      needNav: true
    }
  }, {
    // 个人中心
    path: '/personal',
    name: 'personal',
    component: Personal,
    meta: {
      needNav: true
    }

  }, { // 账户
    path: '/personal/account',
    name: 'account',
    component: Account,
    children: [{ // 登录
      path: '/personal/account/login',
      name: 'login',
      component: Login,
    }, { // 注册
      path: '/personal/account/register',
      name: 'register',
      component: Register,
    }, { // 找回密码1
      path: '/personal/account/foundCode1',
      name: 'foundCode1',
      component: FoundCode1,
    }, { // 找回密码2
      path: '/personal/account/foundCode2',
      name: 'foundCode2',
      component: FoundCode2,
    }, ],
    redirect: '/personal/account/login'
  }, { //绑定手机号码
    path: '/personal/binding',
    name: 'BindingIpone',
    component: BindingIpone,
  },
  { // 注册协议
    path: '/personal/registerAgreement',
    name: 'registerAgreement',
    component: RegisterAgreement,
  }, { // 注册协议细则
    path: '/personal/agreementDetail',
    name: 'registerAgreementDetail',
    component: RegisterAgreementDetail,
  }, {
    // 产品详情
    path: '/productnormal',
    name: 'productnormal',
    component: Productnormal
  }, {
    // 商品详情-商品评价
    path: '/productcomments',
    name: 'productcomments',
    component: Productcomments
  }, {
    // 新建地址
    path: '/address/add',
    name: 'addAddress',
    component: Address
  }, {
    // 编辑地址
    path: '/address/edit/:addressId',
    name: 'editAddress',
    component: Address
  }, {
    // 地址选择列表 address为single表示单地址选择，address为more表示多地址选择
    path: '/address/list',
    name: 'addressList',
    component: AddressList
  }, { // 分类搜索页面
    path: '/headsearch',
    name: 'headsearch',
    component: Headsearch
  }, { // 搜索商品展示详情
    path: '/searchDetail',
    name: 'searchDetail',
    component: SearchDetail
  }, {
    // 个人中心-账户设置首页
    path: '/personal/Settings',
    name: 'personalSettings',
    component: PersonalSettings
  }, { // 地址管理
    path: '/personal/Settings/adress',
    name: 'Settingsadress',
    component: SettingsAdress,
  }, {
    // 个人中心-个人信息
    path: '/personal/Settings/information',
    name: 'setinformation',
    component: Setinformation
  }, {
    // 个人中心-个人资料-修改昵称
    path: '/personal/Settings/information/username',
    name: 'username',
    component: EdiotName
  }, {
    // 申请售后-服务单详情-进度详情
    path: '/personal/Settings/security',
    name: 'accountsecurity',
    component: AccountSecurity,
  }, {
    // 个人中心-个人中心-修改密码
    path: '/personal/Settings/changepassword',
    name: 'changepassword',
    component: ChangePassword,
  }, {
    // 个人中心-个人中心-修改密码2
    path: '/personal/Settings/changepassword2',
    name: 'changepassword2',
    component: ChangePassword2,
  }, {
    // 个人中心-个人中心-修改密码3
    path: '/personal/Settings/changepassword3',
    name: 'changepassword3',
    component: ChangePassword3,
  }, {
    // 个人中心-个人中心-修改账户
    path: '/personal/Settings/changeBindPhone',
    name: 'changeBindPhone',
    component: ChangeBindPhone,
  }, {
    // 个人中心-个人中心-修改账户2
    path: '/personal/Settings/changeBindPhone2',
    name: 'changeBindPhone2',
    component: ChangeBindPhone2,
  }, {
    // 个人中心-个人中心-修改账户3
    path: '/personal/Settings/changeBindPhone3',
    name: 'changeBindPhone3',
    component: ChangeBindPhone3,
  }, {
    // 提交订单页面(query传参) address=0表示单地址 address=1表示多地址, buyNow为1时表示立即购买，为0时表示购物车结算
    path: '/order/submit',
    name: 'orderSubmit',
    component: OrderSubmit
  }, {
    // 支付订单页面
    path: '/pay/order',
    name: 'payOrder',
    component: PayOrder
  }, {
    // 支付结果 query参数： orderNo表示订单编号，payId为3微信支付，为4支付宝支付, 为other表示平台内部的支付
    path: '/pay/result',
    name: 'payResult',
    component: PayResult
  }, {
    // 订单管理订单状态(1-待付款；2-待发货；3-待收货；4-待评价；5-已完成；6-售后服务；8-已取消；9-已评价；10-我的兑换)
    path: '/personal/ordermanage',
    name: 'orderManage',
    component: OrderManage
  }, {
    // 订单搜索
    path: '/personal/ordersearch',
    name: 'orderSearch',
    component: OrderSearch
  }, {
    // 订单详情
    path: '/personal/orderDetail',
    name: 'orderDetail',
    component: OrderDetail
  }, {
    // 订单管理-评价列表
    path: '/personal/comments',
    name: 'commentsList',
    component: CommentsList
  }, {
    // 订单管理-评价追评或新增 query传参
    path: '/personal/commentedit',
    name: 'commentEdit',
    component: CommentEdit
  }, {
    // 订单管理-物流详情信息
    path: '/personal/deliverydetail',
    name: 'deliveryDetail',
    component: DeliveryDetail
  }, {
    // 订单管理-物流详情信息
    path: '/personal/deliverylist',
    name: 'deliveryList',
    component: DeliveryList
  }, {
    // 售后
    path: '/personal/aftersale',
    name: 'aftersale',
    component: AfterSale,
    children: [{ // 售后申请
        path: '/personal/aftersale/apply',
        name: 'aftersaleapply',
        component: AfterSaleApply,
      }, { // 处理中
        path: '/personal/aftersale/processing',
        name: 'aftersaleprocessing',
        component: AfterSaleProcessing,
      }, { // 升级客诉
        path: '/personal/aftersale/upgrade',
        name: 'aftersaleupgrade',
        component: AfterSaleUpgrade,
      },
      { // 售后评价
        path: '/personal/aftersale/rate',
        name: 'aftersalerate',
        component: AfterSaleRate,
      }, { // 申请记录
        path: '/personal/aftersale/record',
        name: 'aftersalerecord',
        component: AfterSaleRecord,
      },
    ],
    redirect: '/personal/aftersale/apply',
  }, { // 升级客诉按钮
    path: '/personal/aftersale/complaints',
    name: 'aftersalecomplaints',
    component: AfterSaleComplaints,
  },
  { // 寄回快递
    path: '/personal/aftersale/sendback',
    name: 'AfterSalesendback',
    component: AfterSaleSendback,
  },
  {
    // 申请售后-选择类型
    path: '/personal/aftersale/type',
    name: 'aftersaletype',
    component: AfterSaleType,
  }, {
    // 申请售后-退货
    path: '/personal/aftersale/refund',
    name: 'aftersalerefund',
    component: AfterSaleRefund,
  }, {
    // 申请售后-换货
    path: '/personal/aftersale/exchange',
    name: 'aftersaleexchange',
    component: AfterSaleExchange,
  }, {
    // 申请售后-维修
    path: '/personal/aftersale/fix',
    name: 'aftersalefix',
    component: AfterSaleFix,
  }, {
    // 申请售后-同订单选择退货商品
    path: '/personal/aftersale/selectoro',
    name: 'aftersaleselectoro',
    component: AfterSaleSelectPro,
  }, {
    // 申请售后-服务单详情
    path: '/personal/aftersale/ticket',
    name: 'aftersaleticket',
    component: AfterSaleTicket,
  }, {
    // 申请售后-服务单详情-进度详情
    path: '/personal/aftersale/ticketdetail',
    name: 'aftersaleticketdetail',
    component: AfterSaleTicketDetail,
  }, {
    // 活动-折扣专区
    path: '/activity/discount',
    name: 'discount',
    component: Discount,
  }, {
    // 活动-特惠专区
    path: '/activity/preferential',
    name: 'preferential',
    component: Preferential,
  }, {
    // 活动-节日专区
    path: '/activity/festival',
    name: 'festival',
    component: Festival,
  }, {
    // 活动-生日专区
    path: '/activity/birthday',
    name: 'birthday',
    component: Birthday,
  }, {
    // 活动-限时秒杀
    path: '/activity/seckill',
    name: 'seckill',
    component: Seckill,
  }, {
    // 活动-周周精选
    path: '/activity/weekly',
    name: 'weekly',
    component: Weekly,
  }, {
    // 活动-好货抢先购
    path: '/activity/goodfirst',
    name: 'goodfirst',
    component: Goodfirst,
  }, {
    // 活动-拼团
    path: '/activity/assemble',
    name: 'assemble',
    component: Assemble,
  }, {
    // 活动-团购
    path: '/activity/groupbuying',
    name: 'groupbuying',
    component: Groupbuying,
  }, {
    // 活动-分销
    path: '/activity/distribution',
    name: 'distribution',
    component: Distribution,
  }, {
    // 资金管理
    path: '/fundmanagement',
    name: 'fundmanagement',
    component: FundManagement,
  }, {
    // 资金管理-我的积分
    path: '/fundmanagement/integral',
    name: 'integral',
    component: Integral,
  },
]
// 实例化一个路由对象
const router = new Router({
  // 自动获取网站部署根目录
  base: process.env.BASE_URL,
  'mode': 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) { //如果savedPosition存在，滚动条会自动跳到记录的值的地方
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      } //savedPosition也是一个记录x轴和y轴位置的对象
    }
  },
  routes
})

// 路由拦截
router.beforeEach((to, from, next) => {
  // const title = to.meta && to.meta.title;
  // if (title) {
  //   document.title = title;
  // }
  if (from.name && !from.fullPath.includes("personal") && to.name === "login") {
    // 在登录成功后跳转至fromPath
    myStorage.set("fromPath", from.fullPath)
  }
  next();
})

// 导出路由
export default router;