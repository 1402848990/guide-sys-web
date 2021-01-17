import Loadable from 'react-loadable';
import Loading from '@/components/Loading'
const Dashboard = Loadable({loader: () => import(/*webpackChunkName:'Dashboard'*/'@/views/dashboard'),loading: Loading});
const UserInfo = Loadable({loader: () => import(/*webpackChunkName:'UserInfo'*/'@/views/userInfo'),loading: Loading});
const Contact = Loadable({loader: () => import(/*webpackChunkName:'Contact'*/'@/views/contact'),loading: Loading});
const Note = Loadable({loader: () => import(/*webpackChunkName:'Contact'*/'@/views/note'),loading: Loading});
const WorkPlan = Loadable({loader: () => import(/*webpackChunkName:'Contact'*/'@/views/workPlan'),loading: Loading});
const StudentList = Loadable({loader: () => import(/*webpackChunkName:'Contact'*/'@/views/studentList'),loading: Loading});
const AddStudent = Loadable({loader: () => import(/*webpackChunkName:'Contact'*/'@/views/addStudent'),loading: Loading});
const ExamManage = Loadable({loader: () => import(/*webpackChunkName:'Contact'*/'@/views/examManage'),loading: Loading});
const MoneyManage = Loadable({loader: () => import(/*webpackChunkName:'Contact'*/'@/views/moneyManage'),loading: Loading});
const CharDemo = Loadable({loader: () => import(/*webpackChunkName:'Contact'*/'@/views/charDemo'),loading: Loading});
const BaseWorkPlan = Loadable({loader: () => import(/*webpackChunkName:'RichTextEditor'*/'@/views/baseWorkPlan'),loading: Loading});

export default [
  { path: "/dashboard", component: Dashboard, roles: ["admin","editor","guest"] },
  { path: "/userInfo", component: UserInfo, roles: ["admin","editor","guest"] },
  { path: "/contact", component: Contact, roles: ["admin","editor","guest"] },
  { path: "/note", component: Note, roles: ["admin","editor","guest"] },
  { path: "/workPlan", component: WorkPlan, roles: ["admin","editor","guest"] },
  { path: "/studentList", component: StudentList, roles: ["admin","editor","guest"] },
  { path: "/addStudent", component: AddStudent, roles: ["admin","editor","guest"] },
  { path: "/examManage", component: ExamManage, roles: ["admin","editor","guest"] },
  { path: "/moneyManage", component: MoneyManage, roles: ["admin","editor","guest"] },
  { path: "/charDemo", component: CharDemo, roles: ["admin","editor","guest"] },
  { path: "/baseWorkPlan", component: BaseWorkPlan, roles: ["admin","editor"] },
];
