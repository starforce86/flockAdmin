import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popover from '../../components/uielements/popover';
import IntlMessages from '../../components/utility/intlMessages';
import userpic from '../../image/avatar.jpg';
import authAction from '../../redux/auth/actions';
import TopbarDropdownWrapper from './topbarDropdown.style';

const { logout, toggleChangePasswordModal } = authAction;

class TopbarUser extends Component {
  constructor(props) {
    super(props);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.hide = this.hide.bind(this);
    this.state = {
      visible: false,
    };
  }
  hide() {
    this.setState({ visible: false });
  }
  handleVisibleChange() {
    this.setState({ visible: !this.state.visible });
  }
  handleLogout = () => {
    const { dispatch, logout } = this.props;
    dispatch(logout());
  }
  handleChangePasswordModal = () => {
    const { dispatch, toggleChangePasswordModal } = this.props;
    dispatch(toggleChangePasswordModal());
  }

  render() {
    const content = (
      <TopbarDropdownWrapper className="isoUserDropdown">
        <a className="isoDropdownLink" onClick={this.handleChangePasswordModal.bind(this)} href="# ">
          <IntlMessages id="topbar.changePassword" />
        </a>
        <a className="isoDropdownLink" onClick={this.handleLogout.bind(this)} href="# ">
          <IntlMessages id="topbar.logout" />
        </a>
      </TopbarDropdownWrapper>
    );

    return (
      <Popover
        content={content}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        arrowPointAtCenter={true}
        placement="bottomLeft"
      >
        <div className="isoImgWrapper">
          <img alt="user" src={userpic} />
          <span className="userActivity online" />
        </div>
      </Popover>
    );
  }
}
export default connect(
  null,
  (dispatch) => {
    return {
      dispatch,
      logout,
      toggleChangePasswordModal
    }
  }
)(TopbarUser);
