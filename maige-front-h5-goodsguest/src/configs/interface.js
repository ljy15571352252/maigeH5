/**
 * 后台接口集合
 */

// ===========首页========== //
// 首页-banner轮播
export const findByPosition = '/api/open/c/b2b2c/contentservice/ad/find_by_position.json'
// 首页-活动列表（旧接口）
export const activityList = '/api/open/h5/b2b2c/acvitityservice/goods/list.json'
// 首页-活动列表（暂时接口）
export const activityGroupList = "/api/open/c/b2b2c/acvitityservice/activity/list.json"

// ===========商品接口========== //
// 搜索-获取导航栏树形结构
export const tree = '/api/open/c/b2b2c/goodsservice/navigation_bar/tree.json'
// 搜索-查询商品基础列表
export const findList = '/api/open/c/b2b2c/goodsservice/goods/find_list.json'
// 搜索-查询热销商品
export const findTopFive = '/api/open/c/b2b2c/goodsservice/goods/find_top_five.json'
// 搜索-查询送礼场景树形列表
export const findSceneTree = '/api/open/c/b2b2c/goodsservice/scene/find_tree.json'
// 商品-普通商品详情
export const goodsDetail = "/api/open/c/b2b2c/goodsservice/goods/find_detail.json";
// 商品-查看评论
export const goodsComments = "/api/open/c/b2b2c/goodsservice/comment/find_list_by_goodsid.json";
// 商品-看了又看/猜你喜欢/同类商品
export const threeModule = "/api/open/c/b2b2c/goodsservice/goods/find_basic_to_type.json";
// 商品-热销排行
export const hotRank = "/api/open/c/b2b2c/goodsservice/goods/find_top_five.json";
// 获取商品详情中的图片资源
export const imgData = "api/open/c/b2b2c/goodsdetailservice/front/goodsdetail/find_by_goods_id.json";

// ===========账号========== //
// 注册/找回密码-再次发送验证码倒记时
export const findSmsSendTime = '/api/open/c/b2b2c/userservice/user/find_sms_send_time.json'
// 登录-登录请求
export const login = '/api/open/c/b2b2c/userservice/user/login.json'
//用户注销登录
export const logout = '/api/open/c/b2b2c/userservice/user/logout.json'
//用户上传文件
export const uploadFile = '/api/open/c/b2b2c/fileservice/uploadFile'
//修改用户信息
export const useredit = '/api/open/c/b2b2c/userservice/user/edit.json'
//获取当前用户数据
export const usercurrent = '/api/open/c/b2b2c/userservice/user/current.json'
// 注册-请求发送短信获取注册验证码
export const sendRegisterCaptchaMessage = '/api/open/c/b2b2c/userservice/user/send_register_captcha_message.json'
// 注册-通过短信注册账号
export const registerByShortMessage = '/api/open/c/b2b2c/userservice/user/register_by_short_message.json'
// 找回密码-请求发送短信获取找回密码验证码
export const sendRetrievePasswordCaptchaMessage = '/api/open/c/b2b2c/userservice/user/send_retrieve_password_captcha_message.json'
// 找回密码-短信验证
export const verifyShortMessage = '/api/open/c/b2b2c/userservice/user/verify_short_message.json'
// 找回密码-设置密码
export const retrievePwdByShortMessage = '/api/open/c/b2b2c/userservice/user/retrieve_pwd_by_short_message.json'
// 查找账户上的专属费用/积分兑换等等信息 返回0是积分 1是专属费用
export const accountPayInfo = "/api/open/c/b2b2c/userservice/accountinfo/findUserAllAccountInfo.json"
// 绑定手机号-发送修改手机号短信验证码
export const sendEditTelephoneCaptchaMessage = "/api/open/c/b2b2c/userservice/user/send_edit_telephone_captcha_message.json"
// 绑定手机号-修改绑定手机号码 (短信验证码)
export const editTelephone = "/api/open/c/b2b2c/userservice/user/edit_telephone.json"


// ===========地址接口========== //
// 用户地址列表
export const addressList = "/api/open/c/b2b2c/userservice/ship_address/find_all.json";
// 设置默认收货地址
export const setDefaultAddress = "/api/open/c/b2b2c/userservice/ship_address/set_def.json";
// 删除收货地址
export const deleteAddress = "/api/open/c/b2b2c/userservice/ship_address/delete_by_id.json"
// 根据id查询收货地址信息
export const addressInfo = "/api/open/c/b2b2c/userservice/ship_address/find_info_by_id.json"
// 级联查询(根据上一个地区的id查其子id)
export const casecadeInfo = "/api/open/c/b2b2c/userservice/region/find_by_parent.json"
// 修改用户地址
export const updateAddress = "/api/open/c/b2b2c/userservice/ship_address/update.json"
// 保存用户收货地址
export const saveAddress = "/api/open/c/b2b2c/userservice/ship_address/save.json"

// ===========购物和订单接口========== //
// 加入购物车
export const addCart = "/api/open/c/b2b2c/orderservice/cart/save.json";
// 查询用户购物车商品数量
export const shopCartNum = "/api/open/c/b2b2c/orderservice/cart/sumCount.json";
// 查询购物车商品信息列表
export const cartGoodsList = "/api/open/p/b2b2c/orderservice/cart/findDetail.json"
// 修改购物车商品的数量
export const updateCartNum = "/api/open/p/b2b2c/orderservice/cart/update.json"
// 修改购物车商品的选中状态
export const updateCartChecked = "/api/open/p/b2b2c/orderservice/cart/checked.json"
// 删除购物车的商品
export const deleteCart = "/api/open/p/b2b2c/orderservice/cart/delete.json"
// 待提交订单的商品列表
export const orderList = "/api/open/c/b2b2c/orderservice/order/findPrice.json"
// 提交订单（购物车结算）
export const submitOrderList = "/api/open/c/b2b2c/orderservice/order/saveMultipleOrder.json"
// 提交订单(立即购买)
export const buyNowOrder = "/api/open/c/b2b2c/orderservice/order/saveSingleOrder.json";
// 已提交订单的信息 请求参数orderNo表示总单号
export const orderInfo = "/api/open/c/b2b2c/orderservice/order/findDetail.json"
// 订单详情(在订单管理列表中点击)，是拆单后的详情，参数orderId是拆单后的订单id
export const orderDetail = "/api/open/c/b2b2c/orderservice/order/orderDetail.json"
// h5支付接口(微信支付和支付宝支付)
export const payMoney = "/api/open/c/b2b2c/orderservice/pay/mobile_pay.json";
// h5支付状态（微信和支付宝）
export const payStatus = "/api/open/c/b2b2c/orderservice/order/checkPayStatus.json"
// 订单管理-订单列表（包括所有订单的数据）
export const orderManageList = "/api/open/c/b2b2c/orderservice/order/orderPageToC.json";
// 取消订单/删除订单/确认收货
export const orderOperation = "/api/open/c/b2b2c/orderservice/order/update.json";
// 提醒发货接口
export const alertDeliver = "/api/open/c/b2b2c/orderservice/order/urgeDelivery.json";
// 付款之后发货之前退款
export const returnMoney = "/api/open/c/b2b2c/orderservice/h5/afterSale/save_refund_c.json"
// 0元支付（积分/专属费用）
export const zeroPay = "/api/open/c/b2b2c/orderservice/order/updatePayStatus.json"
// 评价页面商品基础信息
export const commentsgoodsInfo = "/api/open/c/b2b2c/orderservice/order/CommentOrderDetail.json"
// 查看评价详情
export const goodsCommentsInfo = "/api/open/c/b2b2c/orderservice/order/findComment.json"
// 订单管理-查看单个订单所有的物流信息
export const orderDelivery = "/api/open/c/b2b2c/orderservice/logistics/allInfo.json"
// 订单管理-查看单个物流信息
export const singleDelivery = "/api/open/c/b2b2c/orderservice/logistics/info.json"
//获取活动可选的支付方式
export const findaccountbyactivity = "/api/open/c/b2b2c/acvitityservice/activity/find_account_by_activity.json"

// ===========售后列表========== //
// 售后列表
export const aftersalepage = "/api/open/c/b2b2c/orderservice/h5/afterSale/after_sale_page.json";
//取消售后
export const cancelafterSale = "/api/open/c/b2b2c/orderservice/h5/afterSale/cancel_afterSale.json";
//根据订单号获取订单详情
export const findorderdetail = "/api/open/c/b2b2c/orderservice/h5/afterSale/find_order_detail.json";
//查看售后单
export const aftersaleetail = "/api/open/c/b2b2c/orderservice/h5/afterSale/after_sale_etail.json";
//升级客诉
export const againaftersale = "/api/open/c/b2b2c/orderservice/h5/afterSale/again_after_sale.json";
//新增售后单
export const saveaftersale = "/api/open/c/b2b2c/orderservice/h5/afterSale/save_after_sale.json";
//售后-查看进度表
export const findafterlog = "/api/open/c/b2b2c/orderservice/h5/afterSale/find_after_log.json";
//H5-售后单商品列表
export const aftergoodslist = "/api/open/c/b2b2c/orderservice/h5/afterSale/after_goods_list.json";
//查找所有快递公司
export const shippingCompany = "/api/open/c/b2b2c/orderservice/order/shippingCompany.json";
//用户寄回商品
export const userreturngoods = "/api/open/c/b2b2c/orderservice/h5/afterSale/user_return_goods.json";
//买家签收快递
export const userreceive = "/api/open/c/b2b2c/orderservice/h5/afterSale/user_receive.json";

// ===========个人中心========== //
// 个人中人/设置/重置密码
export const editPassword = "/api/open/c/b2b2c/orderservice/order/update.json";
// 个人中心-个人资金管理-我的积分账户信息
export const findUserAllAccountInfo = "/api/open/c/b2b2c/userservice/accountinfo/findUserAllAccountInfo.json";


// ===========活动========== //
// 活动/获取活动商品
export const activityGoodsPage = "/api/open/c/b2b2c/acvitityservice/activityGoods/page.json";
// 查询商品详细页面
export const goodsdetailFinddetail = "/api/open/h5/b2b2c/acvitityservice/goodsdetail/find_detail.json";
// 查询拼团
export const findassemblepage = "/api/open/h5/b2b2c/acvitityservice/assemble/find_assemble_page.json";
// 加入拼团
export const joinassemble = "/api/open/h5/b2b2c/acvitityservice/assemble/join_assemble.json";
// 活动/获取活动配图
export const activityGallery = "/api/open/h5/b2b2c/acvitityservice/activity/activity_gallery.json";
// 活动/特惠、团购、好货、节日专区详情页
export const discountActivity = "/api/open/c/b2b2c/acvitityservice/activity/discount_activity.json";
// 分页获取折扣专区活动页商品
export const rebateActivityType = "/api/open/h5/b2b2c/acvitityservice/goods/rebate_activity_type.json";
// 通过排序方式获取活动商品
export const activityGoodsSaleSort = "/api/open/h5/b2b2c/acvitityservice/goods/activity_goods_sale_sort.json";
// 获取拼团主键ID
export const assembleKey = "/api/open/h5/b2b2c/acvitityservice/assemble/assemble_key.json";
// 增加团购
export const addAssemble = "/api/open/c/b2b2c/acvitityservice/groupBuy/add_assemble.json";
// 查询团购
export const findAssemble = "/api/open/c/b2b2c/acvitityservice/groupBuy/find_group_buy_page.json";
// 获取天梯价
export const findLadderPrice = "/api/open/c/b2b2c/acvitityservice/groupBuy/find_ladder_price.json";
// 周周精选活动详情页
export const selectedActivity = "/api/open/c/b2b2c/acvitityservice/activity/selected_activity.json";
// 通过活动Id查询活动详情
export const activitySearchById = "/api/open/c/b2b2c/acvitityservice/activity/activity_search_by_id.json";
// 通过活动Id查询活动详情
export const findAddressByGroupId = "/api/open/c/b2b2c/acvitityservice/activity/find_address_by_groupId.json";
// 加入分销
export const addDistribution = "/api/open/c/b2b2c/acvitityservice/distribution/add_distribution.json";
// 查询分销
export const reqDistribution = "/api/open/c/b2b2c/acvitityservice/distribution/find_group_buy_page.json";
// 查询分销获取的奖励
export const findReward = "/api/open/c/b2b2c/acvitityservice/distribution/find_reward.json"


//获取平台信息
export const platformOpenInfo = "/api/open/c/b2b2c/settingservice/systemSetting/platformOpenInfo.json";
export const goodsClickNum = "/api/open/c/b2b2c/goodsservice/goodsStats/update.json";

