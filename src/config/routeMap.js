/**
 * 路由配置
 */
import Loadable from 'react-loadable';
import Loading from '@/components/Loading'
const Drugs = Loadable({loader: () => import('@/pages/drugs'),loading: Loading});
const DateManage = Loadable({loader: () => import('@/pages/dateManage'),loading: Loading});
const OrderList = Loadable({loader: () => import('@/pages/orderList'),loading: Loading});
const PatientManage = Loadable({loader: () => import('@/pages/patientManage'),loading: Loading});
const UserManage = Loadable({loader: () => import('@/pages/userManage'),loading: Loading});
const DoctorManage = Loadable({loader: () => import('@/pages/doctorManage'),loading: Loading});
const AddPatient = Loadable({loader: () => import('@/pages/addPatient'),loading: Loading});
const BaseNews = Loadable({loader: () => import('@/pages/baseNews'),loading: Loading});

export default [
  { path: "/drugs", component: Drugs, },
  { path: "/dateManage", component: DateManage, },
  { path: "/orderList", component: OrderList, },
  { path: "/patientManage", component: PatientManage, },
  { path: "/userManage", component: UserManage, },
  { path: "/doctorManage", component: DoctorManage, },
  { path: "/addPatient", component: AddPatient, },
  { path: "/baseNews", component: BaseNews, },
];
