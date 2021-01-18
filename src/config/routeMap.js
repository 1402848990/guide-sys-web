/**
 * 路由配置
 */
import Loadable from 'react-loadable';
import Loading from '@/components/Loading'
const Dashboard = Loadable({loader: () => import('@/views/dashboard'),loading: Loading});
const UserInfo = Loadable({loader: () => import('@/views/userInfo'),loading: Loading});
const Contact = Loadable({loader: () => import('@/views/contact'),loading: Loading});
const Note = Loadable({loader: () => import('@/views/note'),loading: Loading});
const WorkPlan = Loadable({loader: () => import('@/views/workPlan'),loading: Loading});
const StudentList = Loadable({loader: () => import('@/views/studentList'),loading: Loading});
const AddStudent = Loadable({loader: () => import('@/views/addStudent'),loading: Loading});
const ExamManage = Loadable({loader: () => import('@/views/examManage'),loading: Loading});
const MoneyManage = Loadable({loader: () => import('@/views/moneyManage'),loading: Loading});
const BaseWorkPlan = Loadable({loader: () => import('@/views/baseWorkPlan'),loading: Loading});

export default [
  { path: "/dashboard", component: Dashboard, },
  { path: "/userInfo", component: UserInfo, },
  { path: "/contact", component: Contact, },
  { path: "/note", component: Note, },
  { path: "/workPlan", component: WorkPlan, },
  { path: "/studentList", component: StudentList, },
  { path: "/addStudent", component: AddStudent, },
  { path: "/examManage", component: ExamManage, },
  { path: "/moneyManage", component: MoneyManage, },
  { path: "/baseWorkPlan", component: BaseWorkPlan, },
];
