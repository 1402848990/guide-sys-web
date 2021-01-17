/**
 * icon:菜单项图标
 * 菜单栏配置
 */
const menuList = [
  {
    title: '首页',
    path: '/dashboard',
    icon: 'home',
    roles: ['admin', 'editor', 'guest'],
  },
  {
    title: '个人中心',
    path: '/userInfo',
    icon: 'user',
    roles: ['admin', 'editor', 'guest'],
  },
  {
    title: '通讯录',
    path: '/contact',
    icon: 'solution',
    roles: ['admin', 'editor'],
  },
  {
    title: '备忘录',
    path: '/note',
    icon: 'book',
    roles: ['admin', 'editor'],
  },
  {
    title: '工作计划',
    path: '/workPlan',
    icon: 'schedule',
    roles: ['admin', 'editor'],
  },
  {
    title: '学生管理',
    path: '/studentList',
    icon: 'team',
    roles: ['admin', 'editor'],
  },
  {
    title: '成绩管理',
    path: '/examManage',
    icon: 'file-done',
    roles: ['admin', 'editor'],
  },
  {
    title: '奖学金管理',
    path: '/moneyManage',
    icon: 'pay-circle',
    roles: ['admin', 'editor'],
  },
  {
    title: 'charDemo',
    path: '/charDemo',
    icon: 'key',
    roles: ['admin', 'editor'],
  },
]
export default menuList
