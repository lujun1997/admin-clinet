import React, { Component } from 'react';
import menes from '../../config/menus'
import {withTranslation} from 'react-i18next'
import PubSub from 'pubsub-js'
import { Form, Input, Tree } from 'antd';
import PropTypes from 'prop-types'
const Item = Form.Item;
const { TreeNode } = Tree;
@withTranslation()
@Form.create()
class UpdateRoleForm extends Component {
  constructor(props){
    super(props)
    //把当前组件的form传给父级
    this.props.setUpdateForm(this.props.form)
  }
  static propTypes={
    setUpdateForm:PropTypes.func.isRequired,
    role:PropTypes.object.isRequired
  }
  state = {
    checkedKeys: []
  };
  //设置节点树中显示的数据
  getTreeNodes=()=>{
    const treeDate = menes.map((menu)=>{
      if(menu.children){
        return {
          title: menu.title,
          key: menu.key,
          children:menu.children.map((cMenu)=>{
            return {
              title: cMenu.title,
              key: cMenu.key
            }
          })
        }
      }else{
        return {
          title: menu.title,
          key: menu.key
        }
      }
    })
    return [
      {
        title:'平台权限',
        key:'/power',
        children:treeDate
      }
    ]
  }
  


  
  onCheck = (checkedKeys) => {
    // 更新状态数据
    this.setState({ checkedKeys },()=>{
      // 缓存
      PubSub.publish('getCheckedKeys',checkedKeys );
      // 可以清空state中的checkedKeys的数据
      this.state.checkedKeys=[]
    });
  };
  
  
  renderTreeNodes = data => data.map((item) => {
    const { t } = this.props
    if (item.children) {
      return (
        <TreeNode title={t(item.title)} key={item.key} dataRef={item}>
          {
            this.renderTreeNodes(item.children)
          }
        </TreeNode>
      );
    }
    return <TreeNode  title={t(item.title)} key={item.key}/>;
  });
  
  render () {
    const { getFieldDecorator } = this.props.form;
    const {name,menus} = this.props.role
    const { checkedKeys } = this.state
    return (
      <Form>
        <Item label='角色名称'>
          {
            getFieldDecorator(
              'name',
              {
                initialValue: name||''
              }
            )(
              <Input placeholder='请输入角色名称' disabled/>
            )
          }
        </Item>
        <Item>
          <Tree
            checkable
            defaultExpandAll
            onCheck={this.onCheck}
            checkedKeys={checkedKeys.length?checkedKeys:menus}
          >
            {this.renderTreeNodes(this.getTreeNodes())}
          </Tree>
        </Item>
      </Form>
    )
  }
}

export default UpdateRoleForm;