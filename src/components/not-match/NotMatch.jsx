import React, { Component } from 'react';
import notFond from '../../assets/images/404.png'
class NotMatch extends Component {
  render() {
    return (
      <div>
        <img src={notFond} alt="404" style={{width:"100%",height:'100%'}}/>
      </div>
    );
  }
}

export default NotMatch;