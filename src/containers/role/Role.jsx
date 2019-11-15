import React, { Component } from 'react';
import { Card, Button, Table, Radio, Modal } from 'antd';
//引入时间插件
import dayjs from 'dayjs'
import PubSub from 'pubsub-js'
import AddRoleForm from './add-role-form';
import UpdateRoleForm from './update-role-form';

// 引入高阶组件
import { connect } from 'react-redux'
// 引入action-creators.js
import { getRoles,addRole,updateRoles,deleteRoles } from '../../redux/action-creators.js'
// 单选
const RadioGroup = Radio.Group;


//装饰器
@connect((state) => ({ roles: state.roles,username:state.user.user.username }), { getRoles,addRole,updateRoles,deleteRoles })
class Role extends Component {
  // 界面渲染完毕
  componentDidMount() {
    this.props.getRoles()
    this.pubToken = PubSub.subscribe('getCheckedKeys', (msg,data)=>{
      this.checkedKeys=data
    });
  }
  state = {
    value: '',  //单选的默认值，也就是选中的某个角色的id值
    isShowAddRoleModal: false, //是否展示创建角色的标识
    isShowUpdateRoleModal: false, //是否展示设置角色的标识
    isDisabled: true
  };


  columns = [{
    dataIndex: '_id',
    render: id => <Radio value={id} />
  }, {
    title: '角色名称',
    dataIndex: 'name',
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    render:(time)=>{
      return time&&dayjs(time).format('YYYY-MM-DD hh:mm:ss')
    }
  }, {
    title: '授权时间',
    dataIndex: 'authTime',
    render:(time)=>{
      return time&&dayjs(time).format('YYYY-MM-DD hh:mm:ss')
    }
  }, {
    title: '授权人',
    dataIndex: 'authName',
  }, {
    title: '操作',
    // dataIndex: 'todo',
    render: (role) => {
      return (
          <Button type="link" onClick={()=>{this.delRole(role._id)}}>删除</Button>
      )
    }
  }
  ];
  //删除操作
  delRole=(roleId)=>{
    Modal.confirm({
      title: '确认删除吗',
      okText: '确认',
      cancelText: '取消',
      // 箭头函数
      onOk: () => {
        this.props.deleteRoles(roleId)
      }
    })
  }
  onRadioChange = (e) => {
    // e.target.value=====>当前这条数据的id值
    this.setState({
      value: e.target.value,
      isDisabled: false
    });
  };

  switchModal = (key, value) => {
    return () => {
      this.setState({ [key]: value })
    }
  };

  //创建角色的回调函数
  addRole = () => {
    this.addRoleFormRef.validateFields((err, values) => {
      if (!err) {
        const {name} = values
        this.props.addRole(name)
        //关闭对话框
        this.addRoleFormRef.resetFields()
        this.setState({
          isShowAddRoleModal:false
        })
      }
    });
   };
  //设置角色权限的回调函数
  updateRole = () => { 
    const roleId = this.state.value
    const authName = this.props.username
    const menus = this.checkedKeys
    this.props.updateRoles(roleId,authName,menus)
    this.setState({
      isShowUpdateRoleModal:false
    })
  };

  render() {
    const { value, isDisabled, isShowAddRoleModal, isShowUpdateRoleModal } = this.state;
    const { roles } = this.props
    const role = roles.find(role=>role._id===value)
    return (
      <Card
        title={
          <div>
            <Button type='primary' onClick={this.switchModal('isShowAddRoleModal', true)}>创建角色</Button> &nbsp;&nbsp;
            <Button type='primary' disabled={isDisabled} onClick={this.switchModal('isShowUpdateRoleModal', true)}>设置角色权限</Button>
          </div>
        }
      >
        <RadioGroup onChange={this.onRadioChange} value={value} style={{ width: '100%' }}>
          <Table
            columns={this.columns}
            dataSource={roles}
            bordered
            rowKey='_id'
            pagination={{
              defaultPageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              showQuickJumper: true,
            }}
          />
        </RadioGroup>

        <Modal
          title="创建角色"
          visible={isShowAddRoleModal}
          onOk={this.addRole}
          onCancel={this.switchModal('isShowAddRoleModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <AddRoleForm setAddRoleForm={form => this.addRoleFormRef = form} />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowUpdateRoleModal}
          onOk={this.updateRole}
          onCancel={this.switchModal('isShowUpdateRoleModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <UpdateRoleForm setUpdateForm={form => this.updateRoleFormRef = form} role={role}/>
        </Modal>

      </Card>
    )
  }
}

export default Role;