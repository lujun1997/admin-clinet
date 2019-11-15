import React, { Component } from 'react';
import { Card, Button, Table, Modal } from 'antd';
import dayjs from "dayjs";

import AddUserForm from './add-user-form';
import UpdateUserForm from './update-user-form';
import {connect} from 'react-redux'
import {getUsers,getRoles,addUser,deleteUser,updateUser} from '../../redux/action-creators'
@connect(state=>({users:state.users,roles:state.roles}),{getUsers,getRoles,addUser,deleteUser,updateUser})
class User extends Component {
  state = {
    isShowAddUserModal: false, //是否展示创建用户的标识
    isShowUpdateUserModal: false, //是否展示更新用户的标识
  };


  componentDidMount() {
    //可能需要发送请求,在没有数据的时候
    if(!this.props.users.length){
      //获取用户信息
      this.props.getUsers()
    }
    //获取权限时可能需要发送请求
    if(!this.props.roles.length){
      this.props.getRoles()
    }
  }
  
  columns = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      render: time => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '所属角色',
      dataIndex: 'roleId',
      render:roleId=>{
        if(this.props.roles.length){
          const result = this.props.roles.find(role=>role._id===roleId)
          return result.name
        }
      }
    },
    {
      title: '操作',
      render: user => {
        return <div>
          <Button type="link" onClick={() => { this.showUpdate(user.username) }}>修改</Button>
          <Button type="link" onClick={() => {this.deleteUser(user.username)}}>删除</Button>
        </div>
      }
    }
  ];

 
  //删除用户的回调函数
  deleteUser=(username)=>{
    Modal.confirm({
      title:'确认删除用户吗?',
      okText:'确认',
      cancelText:'取消',
      onOk:()=>{
        this.props.deleteUser(username)
      }
    })
  }
  // 创建用户的回调函数
  addUser = () => {
    const form = this.addForm
    form.validateFields((err, values) => {
      if (!err) {
        //添加数据 redux中添加用户的方法
        const {username,password,phone,email,roleId} = values
        this.props.addUser({username,password,phone,email,roleId})
        this.addForm.resetFields()
        this.setState({
          isShowAddUserModal:false
        })
      }
    });
  };
  //弹出添加用户的提示框
  showAdd=()=>{
    this.setState({
      isShowAddUserModal:true
    })
  }
  //点击取消隐藏添加用户弹框
  hideAdd=()=>{
    this.addForm.resetFields()
    this.setState({
      isShowAddUserModal:false
    })
  }
   //更新用户密码
   showUpdate=(username)=>{
    this.username = username
    this.setState({
      isShowUpdateUserModal:true
    })
  }
  // 点击确定更新用户的回调函数
  updateUser = () => {
    const form = this.updateForm
    form.validateFields((err, values) => {
      if (!err) {
        //变淡验证通过,判断两次密码是否一致
        const{password}=values
        const username = this.username
        this.props.updateUser(username,password)
        this.hideUpdate()
      }
    });
  };
  //点击取消隐藏更新用户弹窗
  hideUpdate=()=>{
    //清空输入框
    this.updateForm.resetFields()
    //删除打开弹框时存的username
    delete this.username
    this.setState({
      isShowUpdateUserModal:false
    })
  }


  render () {
    const { isShowAddUserModal, isShowUpdateUserModal } = this.state;
    const { users } = this.props

    return (
      <Card
        title={
          <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        }
      >
        <Table
          columns={this.columns}
          dataSource={users}
          bordered
          rowKey='_id'
          pagination={{
            defaultPageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            showQuickJumper: true,
          }}
        />
  
        <Modal
          title="创建用户"
          visible={isShowAddUserModal}
          onOk={this.addUser}
          onCancel={this.hideAdd}
          okText='确认'
          cancelText='取消'
        >
          <AddUserForm setAdd={form=>this.addForm=form}/>
        </Modal>
  
        <Modal
          title="更新用户"
          visible={isShowUpdateUserModal}
          onOk={this.updateUser}
          onCancel={this.hideUpdate}
          okText='确认'
          cancelText='取消'
        >
          <UpdateUserForm setUpdate={form=>this.updateForm=form} rePassword = {this.state.rePassword}/>
        </Modal>
        
      </Card>
    )
  }
}
export default User;
