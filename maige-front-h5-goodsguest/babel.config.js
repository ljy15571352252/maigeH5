module.exports = {
  presets: [
    '@vue/app'
  ],
  // 配置之后不允许将vant全部导入，只支持按需导入
  plugins: [
    [
      'import',
      { libraryName: 'vant', libraryDirectory: 'es', style: true },
      'vant'
    ]
  ]
}
