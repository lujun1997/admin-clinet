import React, { Component } from 'react';
import {connect} from 'react-redux'

import { Form, Input } from 'antd';
import PropTypes from 'prop-types'
const Item = Form.Item;
@connect((state)=>({roles:state.roles}),null)
@Form.create()
class AddRoleForm extends Component {
  constructor(props){
    super(props)
    this.props.setAddRoleForm(this.props.form)
  }
  static propTypes={
    setAddRoleForm:PropTypes.func.isRequired
  }
  validator=(rule, value, callback)=>{
    if (!value) {
        return callback('请输入角色名称')
    }
    //当前输入的角色名字是佛存在
    const result = this.props.roles.find(role=>role.name===value)
    if(result){
      return callback('角色名重复')
    }

    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback()
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    this.props.setAddRoleForm(this.props.form)
    
    return (
      <Form>
        <Item label='角色名称' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'name',
              {
                rules: [{validator:this.validator }],
              }
            )(
              <Input placeholder='请输入角色名称'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default AddRoleForm;