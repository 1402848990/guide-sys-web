export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}
// 根据某个属性值从MenuList查找拥有该属性值的menuItem
export function getMenuItemInMenuListByProperty(menuList, key, value) {
  let stack = [];
  stack = stack.concat(menuList);
  let res;
  while (stack.length) {
    let cur = stack.shift();
    if (cur.children && cur.children.length > 0) {
      stack = cur.children.concat(stack);
    }
    if (value === cur[key]) {
      res = cur;
    }
  }
  return res;
}

/**
 * @description 将时间戳转换为年-月-日-时-分-秒格式
 * @param {String} timestamp
 * @returns {String} 年-月-日-时-分-秒
 */

export function timestampToTime(timestamp) {
  var date = new Date(timestamp);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
  
  let strDate = Y+M+D+h+m+s;
  return strDate;
}

export const DATE = [
  {
    label:'大一上学期',
    value:'大一上学期'
  },
  {
    label:'大一下学期',
    value:'大一下学期'
  },
  {
    label:'大二上学期',
    value:'大二上学期'
  },
  {
    label:'大二下学期',
    value:'大二下学期'
  },
  {
    label:'大三上学期',
    value:'大三上学期'
  },
  {
    label:'大三下学期',
    value:'大三下学期'
  },
  {
    label:'大四上学期',
    value:'大四上学期'
  },
  {
    label:'大四下学期',
    value:'大四下学期'
  }
]

// 各个省份的代码和名称枚举值
export const PROVINCE = {
  110000: '北京',
  120000: '天津',
  130000: '河北省',
  140000: '山西省',
  150000: '内蒙古',
  210000: '辽宁省',
  220000: '吉林省',
  230000: '黑龙江省',
  310000: '上海',
  320000: '江苏省',
  330000: '浙江省',
  340000: '安徽省',
  350000: '福建省',
  360000: '江西省',
  370000: '山东省',
  410000: '河南省',
  420000: '湖北省',
  430000: '湖南省',
  440000: '广东省',
  450000: '广西',
  460000: '海南省',
  500000: '重庆',
  510000: '四川省',
  520000: '贵州省',
  530000: '云南省',
  540000: '西藏',
  610000: '陕西省',
  620000: '甘肃省',
  630000: '青海省',
  640000: '宁夏',
  650000: '新疆',
  710000: '台湾省',
  810000: '香港',
  820000: '澳门',
};

// export getAreaList = 

// 生成省份的选项
export const AREA_LIST = () => {
  const res = [];
  for (const [value, label] of Object.entries(PROVINCE)) {
    // res.push({ label, value });
    res.push(label.replace('省',''))
  }
  return res;
};