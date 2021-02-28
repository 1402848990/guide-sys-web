/**
 * 路由配置
 */
import Loadable from 'react-loadable';
import Loading from '@/components/Loading'
const UserInfo = Loadable({loader: () => import('@/pages/userInfo'),loading: Loading});
const Drugs = Loadable({loader: () => import('@/pages/drugs'),loading: Loading});
const DateManage = Loadable({loader: () => import('@/pages/dateManage'),loading: Loading});
const OrderList = Loadable({loader: () => import('@/pages/orderList'),loading: Loading});
const Note = Loadable({loader: () => import('@/pages/note'),loading: Loading});
const NewsManage = Loadable({loader: () => import('@/pages/newsManage'),loading: Loading});
const PatientManage = Loadable({loader: () => import('@/pages/patientManage'),loading: Loading});
const AddPatient = Loadable({loader: () => import('@/pages/addPatient'),loading: Loading});
const BaseNews = Loadable({loader: () => import('@/pages/baseNews'),loading: Loading});

export default [
  { path: "/userInfo", component: UserInfo, },
  { path: "/drugs", component: Drugs, },
  { path: "/dateManage", component: DateManage, },
  { path: "/orderList", component: OrderList, },
  { path: "/note", component: Note, },
  { path: "/newsManage", component: NewsManage, },
  { path: "/patientManage", component: PatientManage, },
  { path: "/addPatient", component: AddPatient, },
  { path: "/baseNews", component: BaseNews, },
];
