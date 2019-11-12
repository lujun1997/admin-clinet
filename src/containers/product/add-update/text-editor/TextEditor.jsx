import React, { Component } from 'react';
import { EditorState,ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
// 引入默认的样式
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// 引入自己的样式
import './TextEditor.less'
// 引入PropTypes
import PropTypes from 'prop-types'
class TextEditor extends Component {
  static propTypes = {
    setEditor: PropTypes.func.isRequired,
    detail:PropTypes.string
  }
  // 初始化的时候调用这个方法
  constructor(props) {
    super(props)
    this.props.setEditor(this)
    const detail = this.props.detail
    let editorState
    if(detail){
      const blocksFromHtml = htmlToDraft(detail);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      editorState = EditorState.createWithContent(contentState);
    }else{
      editorState=EditorState.createEmpty()
    }
    this.state={
      editorState
    }
  }


  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="text-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}
export default TextEditor