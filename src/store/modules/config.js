const explorer = navigator.userAgent

const state = {
  enabledOptions: [
    { key: true, value: '启用' },
    { key: false, value: '禁用' }
  ],
  sexOptions: [
    { key: 'M', value: '男' },
    { key: 'F', value: '女' },
    { key: 'N', value: '未知' }
  ],
  style: explorer.indexOf('Chrome') >= 0 ? 'width: 184px' : 'width: 172px'
}

export default {
  namespaced: true,
  state
}
