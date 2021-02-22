/**
 * 路由配置
 */
import Loadable from 'react-loadable';
import Loading from '@/components/Loading'
const Dashboard = Loadable({loader: () => import('@/pages/dashboard'),loading: Loading});
const UserInfo = Loadable({loader: () => import('@/pages/userInfo'),loading: Loading});
const Contact = Loadable({loader: () => import('@/pages/contact'),loading: Loading});
const Note = Loadable({loader: () => import('@/pages/note'),loading: Loading});
const NewsManage = Loadable({loader: () => import('@/pages/newsManage'),loading: Loading});
const StudentList = Loadable({loader: () => import('@/pages/studentList'),loading: Loading});
const AddStudent = Loadable({loader: () => import('@/pages/addStudent'),loading: Loading});
const ExamManage = Loadable({loader: () => import('@/pages/examManage'),loading: Loading});
const MoneyManage = Loadable({loader: () => import('@/pages/moneyManage'),loading: Loading});
const BaseNews = Loadable({loader: () => import('@/pages/baseNews'),loading: Loading});

export default [
  { path: "/dashboard", component: Dashboard, },
  { path: "/userInfo", component: UserInfo, },
  { path: "/contact", component: Contact, },
  { path: "/note", component: Note, },
  { path: "/newsManage", component: NewsManage, },
  { path: "/studentList", component: StudentList, },
  { path: "/addStudent", component: AddStudent, },
  { path: "/examManage", component: ExamManage, },
  { path: "/moneyManage", component: MoneyManage, },
  { path: "/baseNews", component: BaseNews, },
];
