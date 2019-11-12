// 引入两个路由组件

import Admin from '../components/Admin/Admin.jsx'
import Category from '../containers/Category/Category'
// 引入商品组件
import Product from '../containers/product/Product.jsx'
// 引入添加或者修改商品的组件
import AddUpdate from '../containers/product/add-update/AddUpdate.jsx'
// 引入Role组件
import Role from '../containers/role/Role.jsx'
// 引入User组件
import User from '../containers/user/User.jsx'
export default[
  {
    exact:true,
    path:'/',
    component:Admin
  },
  {
    exact:true,
    path:'/category',
    component:Category
  },
  {
    exact:true,
    path:'/product',
    component:Product
  },
  {
    exact:true,
    path:'/product/addupdate',
    component:AddUpdate
  },
  {
    exact:true,
    path:'/role',
    component:Role
  },{
    exact:true,
    path:'/user',
    component:User
  }
]