/**
 * 路由配置
 */
import Loadable from 'react-loadable';
import Loading from '@/components/Loading'
// const Dashboard = Loadable({loader: () => import('@/views/dashboard'),loading: Loading});
const UserInfo = Loadable({loader: () => import('@/views/userInfo'),loading: Loading});
const SiteMessageManage = Loadable({loader: () => import('@/views/siteMessageManage'),loading: Loading});
const Note = Loadable({loader: () => import('@/views/note'),loading: Loading});
const CityNoticeManage = Loadable({loader: () => import('@/views/cityNoticeManage'),loading: Loading});
const GlobalNoticeManage = Loadable({loader: () => import('@/views/globalNoticeManage'),loading: Loading});
// const StudentList = Loadable({loader: () => import('@/views/studentList'),loading: Loading});
const AddStudent = Loadable({loader: () => import('@/views/addStudent'),loading: Loading});
// const ExamManage = Loadable({loader: () => import('@/views/examManage'),loading: Loading});
const BaseGlobalNotice = Loadable({loader: () => import('@/views/baseGlobalNotice'),loading: Loading});
const BaseWorkPlan = Loadable({loader: () => import('@/views/baseWorkPlan'),loading: Loading});

export default [
  // { path: "/dashboard", component: Dashboard, },
  { path: "/userInfo", component: UserInfo, },
  { path: "/siteMessageManage", component: SiteMessageManage, },
  { path: "/note", component: Note, },
  { path: "/cityNoticeManage", component: CityNoticeManage, },
  { path: "/globalNoticeManage", component: GlobalNoticeManage, },
  { path: "/addStudent", component: AddStudent, },
  { path: "/baseWorkPlan", component: BaseWorkPlan, },
  { path: "/baseGlobalNotice", component: BaseGlobalNotice, },
];
