import styled from 'styled-components';
import Modal from './modal';

export default styled(Modal)`
  .ant-modal-content, .ant-modal-header {
    background: #4c4d4d;
    color: #d3d3d3;
    border: 0px;
    .ant-form-item-label label {
      color: #d3d3d3;
    }
  }
  .ant-modal-content {
    opacity: 0.9;
    // width: 700px;
  }
  .ant-modal-header {
    text-align: center;
  }
  .ant-modal-title {
    color: #d3d3d3;
    font-size: 20px;
  }
  .ant-modal-body {
    // text-align: center;
  }
  .ant-modal-footer {
    border: 0px;
    text-align: center;
    button {
      width: 120px;
      color: black;
    }
  }
  .ant-modal-content {
    button {
      background: #b8b8b8;
      &.ant-modal-close {
        margin-top: 10px;
        margin-right: 10px;
        border-radius: 15px;
        span.ant-modal-close-x {
          width: 24px;
          height: 24px;
          .ant-modal-close-icon {
            vertical-align: 12px;
          }
        }
      }
    }
  }
`;
