/**
 * 路由配置
 */
import Loadable from 'react-loadable';
import Loading from '@/components/Loading'
// const Dashboard = Loadable({loader: () => import('@/pages/dashboard'),loading: Loading});
const UserInfo = Loadable({loader: () => import('@/pages/userInfo'),loading: Loading});
const Drugs = Loadable({loader: () => import('@/pages/drugs'),loading: Loading});
const DateManage = Loadable({loader: () => import('@/pages/dateManage'),loading: Loading});
const Note = Loadable({loader: () => import('@/pages/note'),loading: Loading});
const NewsManage = Loadable({loader: () => import('@/pages/newsManage'),loading: Loading});
const PatientManage = Loadable({loader: () => import('@/pages/patientManage'),loading: Loading});
const AddPatient = Loadable({loader: () => import('@/pages/addPatient'),loading: Loading});
// const ExamManage = Loadable({loader: () => import('@/pages/examManage'),loading: Loading});
const BaseNews = Loadable({loader: () => import('@/pages/baseNews'),loading: Loading});

export default [
  // { path: "/dashboard", component: Dashboard, },
  { path: "/userInfo", component: UserInfo, },
  { path: "/drugs", component: Drugs, },
  { path: "/dateManage", component: DateManage, },
  { path: "/note", component: Note, },
  { path: "/newsManage", component: NewsManage, },
  { path: "/patientManage", component: PatientManage, },
  { path: "/addPatient", component: AddPatient, },
  // { path: "/examManage", component: ExamManage, },
  { path: "/baseNews", component: BaseNews, },
];
