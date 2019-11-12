import React, { Component } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types'
const Item = Form.Item;

@Form.create()
class AddRoleForm extends Component {
  constructor(props){
    super(props)
    this.props.setAddRoleForm(this.props.form)
  }
  static propTypes={
    setAddRoleForm:PropTypes.func.isRequired
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    this.props.setAddRoleForm(this.props.form)
    
    return (
      <Form>
        <Item label='角色名称' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'name'
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