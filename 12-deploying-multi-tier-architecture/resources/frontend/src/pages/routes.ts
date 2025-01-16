import MainLayout from "@/layouts/MainLayout";
import { lazy } from "react";

const Home = lazy(() => import("./Home"));
const Login = lazy(() => import("./Login"));
const Register = lazy(() => import("./Register"));
const Tasks = lazy(() => import("./Tasks"));
const TaskDetail = lazy(() => import("./Tasks/TaskDetail"));

export default [
  {
    path: "/",
    component: Home,
    layout: MainLayout,
  },
  {
    path: "/login",
    component: Login,
    layout: MainLayout,
    isPublic: true,
  },
  {
    path: "/register",
    component: Register,
    layout: MainLayout,
    isPublic: true,
  },
  {
    path: "/tasks",
    component: Tasks,
    layout: MainLayout,
    isPrivate: true,
  },
  {
    path: "/tasks/:id",
    component: TaskDetail,
    layout: MainLayout,
    isPrivate: true,
  },
];
