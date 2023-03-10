import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login";
import Home from "../views/Home";
import Welcome from "../views/Welcome";
import Users from "../views/users/Users";
import Comments from "../views/users/Comments";
import Courses from "../views/courses/Courses";
import Chapters from "../views/courses/Chapters";
import Posts from "../views/posts/Posts";
import Clubs from "../views/clubs/Clubs";
import Events from "../views/clubs/Events";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: Welcome},
      {path: '/users', component: Users},
      {path: '/comments', component: Comments},
      {path: '/courses', component: Courses},
      {path: '/chapters', component: Chapters},
      {path: '/clubs', component: Clubs},
      {path: '/events', component: Events},
      {path: '/posts', component: Posts},
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  routes,
  linkActiveClass: 'active'
});

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳转过来
  //next() 放行   next('/login')  强制跳转

  if(to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) {
    return next('/login');
  }
  next()
});


export default router
