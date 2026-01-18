import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import Loadable from "../component/third-patry/Loadable";

const Login = Loadable(lazy(() => import("../page/login")));

// User Role
const User = Loadable(lazy(() => import("../page/user/")));

// Admin Role 
const Admin = Loadable(lazy(() => import("../page/admin/")));
const MainLayout = Loadable(lazy(() => import("../component/admin/MainLayout")));
const Profile = Loadable(lazy(() => import("../component/admin/profile/SocialProfile")));
const Calendar = Loadable(lazy(() => import("../page/admin/calendar")));
const Product = Loadable(lazy(() => import("../page/admin/product/index")));
const Stock = Loadable(lazy(() => import("../page/admin/stock/")));
const Customer_Manage = Loadable(lazy(() => import("../page/admin/user/")));

// Example Page Profile
const Example = Loadable(lazy(() => import("../page/admin/profile")));
const UserRoutes = (): RouteObject[] => [
  {
    path: "/", element: <User />,
  },
  {
    path: "/user",
    children: [
      { index: true, element: <User /> },
    ],
  },
];

const AdminRoutes = (): RouteObject[] => [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Admin /> },
    ],
  },
  {
    path: "/admin",
    element: <MainLayout />,
    children: [
      { index: true, element: <Admin /> },
      { path: "Dashboard", element: <Admin /> },
      { path: "profile", element: <Profile /> },
      { path: "Calendar", element: <Calendar /> },
      { path: "Products", element: <Product /> },
      { path: "Stock", element: <Stock /> },
      { path: "Customers", element: <Customer_Manage /> },
      { path: "Example", element: <Example /> },
    ],
  },
];


const MainRoutes = (): RouteObject[] => [
  {
    path: "/",
    children: [
      { index: true, element: <Login /> },
      { path: "*", element: <Login /> },
    ],
  },
];


function ConfigRoutes() {
  const isLoggedIn = localStorage.getItem('isLogin') === 'true';
  const roleName = localStorage.getItem('roleName');
  const userID = Number(localStorage.getItem('userid'));

  console.log("isLoggedIn:", isLoggedIn);
  console.log("roleName:", roleName);
  console.log("userid:", userID);

  let routes: RouteObject[] = [];

  if (isLoggedIn) {
    switch (roleName) {
      case 'Admin':
        routes = AdminRoutes();
        break;
      case 'User':
        routes = UserRoutes();
        break;
      default:
        routes = MainRoutes();
        break;
    }
  }
  else {
    routes = MainRoutes();
  }

  return useRoutes(routes);
}
export default ConfigRoutes;