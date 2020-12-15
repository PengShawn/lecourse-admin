//审核种类
const inspectTypeOptions = [
  {value: 'VIOLATE', label: '含暴力信息'},
  {value: 'ELSE', label: '其他原因(不通过)'}
];

//是否已经审核
const checkedOptions = [
  {value: true, label: '已审核'},
  {value: false, label: '未审核'}
];

exports.inspectTypeOptions = inspectTypeOptions;
exports.checkedOptions = checkedOptions;
