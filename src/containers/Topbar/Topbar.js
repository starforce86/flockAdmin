import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import appActions from "../../redux/app/actions";
import TopbarUser from "./topbarUser";
import TopbarWrapper from "./topbar.style";
import themes from "../../settings/themes";
import { themeConfig } from "../../settings";
import moment from 'moment';

import logo from "../../image/logo.png"

const { Header } = Layout;
const { toggleCollapsed } = appActions;
const customizedTheme = themes[themeConfig.theme];


class Topbar extends Component {
  render() {
    const collapsed = this.props.collapsed && !this.props.openDrawer;
    const styling = {
      background: customizedTheme.backgroundColor,
      position: "fixed",
      width: "100%",
      height: 90,
      paddingLeft: 22,
      paddingTop: 10
    };
    let { last_accessed } = this.props;
    last_accessed = moment(last_accessed).format('MM/DD/YYYY');
    return (
      <TopbarWrapper>
        <Header
          style={styling}
          className={
            collapsed ? "isomorphicTopbar collapsed" : "isomorphicTopbar"
          }
        >
          <img alt="logo" src={logo} style={{width:"206px", height:"60px"}}/>

          <ul className="isoRight" style={{marginTop: "10px"}}>
            <label style={{paddingRight: "10px"}}>Last Accessed: {last_accessed} </label>
            <li
              onClick={() => this.setState({ selectedItem: "user" })}
              className="isoUser"
            >
              <TopbarUser />
            </li>
          </ul>
        </Header>
      </TopbarWrapper>
    );
  }
}

export default connect(
  state => ({
    ...state.App,
    ...state.Auth
  }),
  { toggleCollapsed }
)(Topbar);
