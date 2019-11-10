import React, { Component } from 'react';
import { Layout } from 'antd'
import { Button, Icon, Modal } from 'antd'; // 有个对话框
// 引入样式
import './HeaderMain.less'
// 引入screenfull的插件包
import screenfull from 'screenfull'
// 引入实现国际化的翻译的相关的包,高阶组件
import { withTranslation, getI18n } from 'react-i18next';
// 引入connect高阶组件
import { connect } from 'react-redux'
// 引入action-creators.js中的方法
import { removeUser } from '../../redux/action-creators.js'
// 引入dayjs格式化日期的包
import dayjs from 'dayjs'
const { Header } = Layout;




// 当前的组件实例对象中的props中就有username属性:({username:state.user.user.username})
// @connect((state)=>{
//   console.log(state.user)
//   return {username:state.user.user.username}
// },null)
@connect((state) => ({
  username: state.user.user.username,
  title: state.title
}), { removeUser })
@withTranslation()
class HeaderMain extends Component {

  state = {
    isScreen: true,
    isEnglish: getI18n().language === 'en',
    time:dayjs().format('YYYY-MM-DD hh:mm:ss')
  }
  // 切换全屏效果
  changeScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }
  // 全屏的change事件的回调
  screenChange = () => {
    const isScreen = !this.state.isScreen
    // 切换数据状态
    this.setState({
      isScreen
    })
  }
  // 界面渲染完毕的生命周期函数
  componentDidMount() {
    screenfull.on('change', this.screenChange);
    setInterval(()=>{
      this.setState({
        time:dayjs().format('YYYY-MM-DD hh:mm:ss')
      })
    },1000)
  }
  // 组件卸载的生命周期函数
  componentWillUnmount() {
    screenfull.off('change', this.screenChange);
  }
  // 国际化
  changeLanguage = () => {
    const isEnglish = !this.state.isEnglish
    // 改变翻译的方式:en还是zh-CN
    this.props.i18n.changeLanguage(isEnglish ? 'en' : 'zh-CN')
    this.setState({
      isEnglish
    })
  }
  // 退出操作
  loginOut = () => {
    Modal.confirm({
      title: '您真的要走吗?',
      okText: getI18n().language === 'en' ? 'ok' : '确定',
      cancelText: getI18n().language === 'en' ? 'cancel' : '取消',
      onOk: () => {
        this.props.removeUser()
      },
    })
  }
  render() {
    const { isScreen, isEnglish,time } = this.state
    // 从props中取出
    const { username, title ,t} = this.props
    //console.log(this.props)
    return (
      <Header style={{ background: '#fff', padding: 0 }} className="header-main">
        <div className="header-top">
          <Button size="small" onClick={this.changeScreen}><Icon type={isScreen ? 'fullscreen' : 'fullscreen-exit'} /></Button>
          <Button size="small" className="header-english" onClick={this.changeLanguage}>
            {isEnglish ? '中文' : 'English'}
          </Button>
          <span>欢迎,{username}</span>
          <Button type="link" onClick={this.loginOut}>退出</Button>
        </div>
        <div className="header-content">
          <div className="header-left">{t(title)}</div>
          <div className="header-right">{time}</div>
        </div>

      </Header>
    );
  }
}

export default HeaderMain;