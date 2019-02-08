import React, { Component } from 'react';
import { connect } from "react-redux";
import { Row, Col, InputNumber } from "antd";
import clone from "clone";
import settings from "../../settings/index";
import Box from "../../components/utility/box";
import LayoutWrapper from "../../components/utility/layoutWrapper";
import basicStyle from "../../settings/basicStyle";
import unitActions from "../../redux/unit/actions";
import authActions from "../../redux/auth/actions";
import { rtl } from '../../settings/withDirection';
import Input, { Textarea } from '../../components/uielements/input';
import Button from "../../components/uielements/button";
import PropTypes from 'prop-types'
import notification from '../../components/notification';
import axios from 'axios';
import Modal from '../../components/feedback/modal.style';
import Progress from '../../components/uielements/progress';
import Select, {
  SelectOption as Option,
} from '../../components/uielements/select';
import {
  TableWrapper,
  ActionWrapper,
  FlockButton,
  PseudoFlockButton,
  FlockSelect,
  FlockSelectOption,
  FlockInputSearch,
} from '../../components/unit/units.style';
import {
  EditableCell
} from '../../components/tables/helperCells';
import DatePicker from '../../components/uielements/datePicker';
import moment from 'moment';
import Form from '../../components/uielements/form';
import Spin from './spin.style';
import AutoComplete, {
  AutoCompleteOption
} from '../../components/uielements/autocomplete';

const FormItem = Form.Item;
const confirm = Modal.confirm;

const { 
  addUnit, 
  updateUnit, 
  fetchUnitsIfNeeded, 
  pushUpdateNotification,
  setFilterField,
  setFilterKeyword,
  toggleUploadSoftwareModal, 
  toggleUploadFirmwareModal, 
  toggleEditUnitModal, 
  toggleEditNoteModal,
  toggleRelocateUserAccountModal,
  toggleMessageAllUsersModal,
  updateMessageAllUser,
  sendMessageAllUser
} = unitActions;

const { toggleChangePasswordModal, changePassword } = authActions;

class Units extends Component {
  static propTypes = {
    units: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);

    this.state = {
      selectedSoftwareFile: null,
      softwareFileLoaded: 0,
      selectedSoftwareVersion: null,
      selectedFirmwareFile: null,
      firmwareFileLoaded: 0,
      selectedFirmwareVersion: null,
      selectedRow: null,
      serialToRelocate: '',
      autoCompleteDataSource: [],
    };

    this.uploadSoftwareFileInput = React.createRef();
    this.uploadFirmwareFileInput = React.createRef();
    this.onDateChange = this.onDateChange.bind(this);
    this.onRecordChange = this.onRecordChange.bind(this);
    this.onCellChange = this.onCellChange.bind(this);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchUnitsIfNeeded());
  }
  generateSoftwareRegKey = () => {
    return Math.random().toString().substring(2,12);
  }
  handleChangePasswordModal = () => {
    const { dispatch, toggleChangePasswordModal } = this.props;
    dispatch(toggleChangePasswordModal());
  }
  handleChangePassword = () => {
    const { dispatch, changePassword } = this.props;
    const oldPassword = document.getElementById('inputOldPassword').value || '';
    const newPassword = document.getElementById('inputNewPassword').value || '';
    const confirmNewPassword = document.getElementById('inputConfirmNewPassword').value || '';
    dispatch(changePassword({oldPassword, newPassword, confirmNewPassword}));
  }
  handleAutoCompleteChange = (value) => {
    let { units } = clone(this.props);
    let serials = units.map(unit => unit.serial);
    let filteredSerials = serials.filter(serial => serial.includes(value));
    this.setState({
      autoCompleteDataSource: filteredSerials, 
      serialToRelocate: value
    });
  }
  handleEditUnitModal = (unit) => {
    const { dispatch, toggleEditUnitModal } = this.props;
    dispatch(toggleEditUnitModal(unit));
  }
  handleEditNoteModal = (unit) => {
    const { dispatch, toggleEditNoteModal } = this.props;
    dispatch(toggleEditNoteModal(unit));
  }
  handleEditRecord(unit) {
    console.log(unit);
    if (!unit.serial) {
      notification('error', 'Unit Serial # is empty!');
      return;
    }
    if (unit.serial.length !== 11) {
      notification('error', 'Unit Serial # format is invalid!');
      return;
    }
    if (isNaN(unit.serial.substring(3, 11))) {
      notification('error', 'Unit Serial # last 8 letters must be digit!');
      return;
    }
    if (!unit.software_reg_key) {
      notification('error', 'Software Registration Key is empty!');
      return;
    }
    if (unit.status === '') {
      unit.status = 0;
    }
    const { dispatch, addUnit, toggleEditUnitModal } = this.props;
    dispatch(addUnit(unit));
    dispatch(toggleEditUnitModal());
  }
  handleEditNote(unit) {
    const { dispatch, addUnit, toggleEditNoteModal } = this.props;
    dispatch(addUnit(unit));
    dispatch(toggleEditNoteModal());
  }
  handlePushSoftwareUpdate() {
    let { dispatch, pushUpdateNotification } = this.props;
    confirm({
      title: "Push Update Notification (Software)",
      content:
        "You are about to push a notification to all PATCH APP users. This cannot be undone and will alert the users that there is new update available via a Notification in the Application the next time they launch the PATCH APP and will display a Badge Icon in the settings menu. Do you want to proceed?",
      onOk() {
        dispatch(pushUpdateNotification('software'));
      },
      onCancel() {},
      okText: "Proceed",
      cancelText: "Cancel",
      centered: true
    });
  }
  handlePushFirmwareUpdate() {
    let { dispatch, pushUpdateNotification } = this.props;
    confirm({
      title: "Push Update Notification (Firmware)",
      content:
        "You are about to push a notification to all PATCH APP users. This cannot be undone and will alert the users that there is new update available via a Notification in the Application the next time they launch the PATCH APP and will display a Badge Icon in the settings menu. Do you want to proceed?",
      onOk() {
        dispatch(pushUpdateNotification('firmware'));
      },
      onCancel() {},
      okText: "Proceed",
      cancelText: "Cancel",
      centered: true
    });
  }
  handleMessageAllUsersModal = () => {
    const { dispatch, toggleMessageAllUsersModal } = this.props;
    dispatch(updateMessageAllUser(''));
    dispatch(toggleMessageAllUsersModal());
  }
  handleMessageAllUsers() {
    const { messageAllUser, dispatch, sendMessageAllUser, toggleMessageAllUsersModal } = this.props;
    if(!messageAllUser) {
      notification('error', 'Input message!');
      return;
    }    
    dispatch(sendMessageAllUser());
    dispatch(toggleMessageAllUsersModal());
  }
  onMessageAllUsersChange = (event) => {
    let { dispatch, updateMessageAllUser } = this.props;
    dispatch(updateMessageAllUser(event.target.value));
  };
  handleMarkForRepair() {
    if(!this.state.selectedRow) {
      notification('error', 'Select a row!');
      return;
    }
    let { dispatch, addUnit } = this.props;
    let { units } = clone(this.props);
    let filteredUnits = units.filter(unit => unit.id === this.state.selectedRow.id);
    if(filteredUnits.length === 0) {
      notification('error', 'Unknown error!');
      return;
    }
    confirm({
      title: "Marked for Repair",
      content:
        "You are about to Marked for Repair this system and will highlight Yellow over the entire row making the unit & system as unavailable for use and also remove the Software Reg Keys until later refreshed. Do you want to proceed?",
      onOk() {
        let unit = filteredUnits[0];
        unit['is_repairing'] = 1;
        unit['software_reg_key'] = '';
        dispatch(addUnit(unit));
      },
      onCancel() {},
      okText: "Proceed",
      cancelText: "Cancel",
      centered: true
    });    
  }
  handleDecomission() {
    if(!this.state.selectedRow) {
      notification('error', 'Select a row!');
      return;
    }
    let { dispatch, addUnit } = this.props;
    let { units } = clone(this.props);
    let filteredUnits = units.filter(unit => unit.id === this.state.selectedRow.id);
    if(filteredUnits.length === 0) {
      notification('error', 'Unknown error!');
      return;
    }
    confirm({
      title: "Decommission System",
      content:
        "Decommissioning a system will remove all the user information and mark it in Red, indicating this system is no longer active or able to be in use. You can reverse this process by clicking on \"Reactive System\".",
      onOk() {
        let unit = filteredUnits[0];
        unit['is_decommissioned'] = 1;
        dispatch(addUnit(unit));
      },
      onCancel() {},
      okText: "Proceed",
      cancelText: "Cancel",
      centered: true
    });    
  }
  handleReactiveSystem() {
    if(!this.state.selectedRow) {
      notification('error', 'Select a row!');
      return;
    }
    let { dispatch, addUnit } = this.props;
    let { units } = clone(this.props);
    let filteredUnits = units.filter(unit => unit.id === this.state.selectedRow.id);
    if(filteredUnits.length === 0) {
      notification('error', 'Unknown error!');
      return;
    }
    let softwareRegKey = this.generateSoftwareRegKey();
    confirm({
      title: "Decommission System",
      content:
        "You are about to Reactive System this system and add it into the database as a new or refurbished unit. This will remove the Red highlight and allow the system to be reassigned to a new user. Do you want to proceed?",
      onOk() {
        let unit = filteredUnits[0];
        unit['is_repairing'] = 0;
        unit['is_decommissioned'] = 0;
        unit['software_reg_key'] = softwareRegKey;
        dispatch(addUnit(unit));
      },
      onCancel() {},
      okText: "Proceed",
      cancelText: "Cancel",
      centered: true
    });
    
  }
  handleClearUserInformation() {
    const selectedRow = this.state.selectedRow;
    if(!selectedRow) {
      notification('error', 'Select a row!');
      return;
    }
    let { dispatch, addUnit } = this.props;
    let { units } = clone(this.props);
    const softwareRegKey = this.generateSoftwareRegKey();
    confirm({
      title: "Clear User Information",
      content:
        "You are about to Clear this User information from this specific unit. Once the user information is cleared they will no longer be able to access the PATCH APP and there will be new Software Licenses generated. Do you want to proceed?",
      onOk() {
        let filteredUnits = units.filter(unit => unit.id === selectedRow.id);
        if(filteredUnits.length === 0) {
          notification('error', 'Unknown error!');
          return;
        }
        let unit = filteredUnits[0];
        unit['active_date'] = '';
        unit['os'] = '';
        unit['active_licenses_count'] = 0;
        unit['firstname'] = '';
        unit['lastname'] = '';
        unit['location'] = '';
        unit['email'] = '';
        unit['phone'] = '';
        unit['warranty_type'] = '';
        unit['warranty_claims'] = '';
        unit['warranty_active_date'] = '';
        unit['software_reg_key'] = softwareRegKey;
        dispatch(addUnit(unit));
      },
      onCancel() {},
      okText: "Proceed",
      cancelText: "Cancel",
      centered: true
    });
  }
  handleRefreshUserLicense() {
    const selectedRow = this.state.selectedRow;
    if(!selectedRow) {
      notification('error', 'Select a row!');
      return;
    }
    let { dispatch, addUnit } = this.props;
    let { units } = clone(this.props);
    const softwareRegKey = this.generateSoftwareRegKey();
    confirm({
      title: "Refresh User Licenses",
      content:
        "You are about to refresh this users licenses for the PATCH System. Once the licenses are refreshed, you will need to notify the current or new user of the new licenses that have been generated. Do you want to proceed?",
      onOk() {
        let filteredUnits = units.filter(unit => unit.id === selectedRow.id);
        if(filteredUnits.length === 0) {
          notification('error', 'Unknown error!');
          return;
        }
        let unit = filteredUnits[0];
        unit['software_reg_key'] = softwareRegKey;
        dispatch(addUnit(unit));
      },
      onCancel() {},
      okText: "Proceed",
      cancelText: "Cancel",
      centered: true
    });
  }
  handleRelocateUserAccountModal() {
    const selectedRow = this.state.selectedRow;
    if(!selectedRow) {
      notification('error', 'Select a row!');
      return;
    }
    const { dispatch, toggleRelocateUserAccountModal } = this.props;
    dispatch(toggleRelocateUserAccountModal());
  }  
  proceedRelocateUserAccount = () => {
    if(!this.state.serialToRelocate) {
      notification('error', 'Input a Serial#!');
      return;
    }
    let { dispatch, addUnit } = this.props;
    let { units } = clone(this.props);
    let srcUnit = units.find(unit => unit.id === this.state.selectedRow.id);
    let destUnit = units.find(unit => unit.serial === this.state.serialToRelocate);
    if(!destUnit) {
      notification('error', 'Destination Serial# is invalid!');
      return;
    }
    destUnit['active_date'] = srcUnit.active_date;
    destUnit['os'] = srcUnit.os;
    destUnit['active_licenses_count'] = srcUnit.active_licenses_count;
    destUnit['firstname'] = srcUnit.firstname;
    destUnit['lastname'] = srcUnit.lastname;
    destUnit['location'] = srcUnit.location;
    destUnit['email'] = srcUnit.email;
    destUnit['phone'] = srcUnit.phone;
    destUnit['warranty_type'] = srcUnit.warranty_type;
    destUnit['warranty_claims'] = srcUnit.warranty_claims;
    destUnit['warranty_active_date'] = srcUnit.warranty_active_date;
    srcUnit['active_date'] = '';
    srcUnit['os'] = '';
    srcUnit['active_licenses_count'] = '';
    srcUnit['firstname'] = '';
    srcUnit['lastname'] = '';
    srcUnit['location'] = '';
    srcUnit['email'] = '';
    srcUnit['phone'] = '';
    srcUnit['warranty_type'] = '';
    srcUnit['warranty_claims'] = '';
    srcUnit['warranty_active_date'] = '';
    dispatch(toggleRelocateUserAccountModal());
    dispatch(addUnit(destUnit));
    dispatch(addUnit(srcUnit, false));
  }
  onDateChange = (key, date) => {
    let { dispatch, updateUnit } = this.props;
    let { unit } = clone(this.props);
    if (key) {
      if(date) {
        unit[key] = date.format("YYYY-MM-DD");
      }        
      else {
        unit[key] = '';
      }
    }
    dispatch(updateUnit(unit));
  };
  onRecordChange = (key, event) => {
    let { dispatch, updateUnit } = this.props;
    let { unit } = clone(this.props);
    if (key) unit[key] = event.target.value;
    dispatch(updateUnit(unit));
  };
  onSelectChange = (key, value) => {
    let { dispatch, updateUnit } = this.props;
    let { unit } = clone(this.props);
    if (key) unit[key] = value;
    dispatch(updateUnit(unit));
  };
  onFilterFieldSelectChange = (value) => {
    const { dispatch } = this.props;
    dispatch(setFilterField(value));
    dispatch(fetchUnitsIfNeeded());
  }
  onFilterKeywordChange = (value) => {
    const { dispatch } = this.props;
    dispatch(setFilterKeyword(value));
    dispatch(fetchUnitsIfNeeded());
  }
  onCellChange(id, value, columnsKey, index) {
    const { dispatch, addUnit } = this.props;
    let { units } = clone(this.props);
    let filteredUnits = units.filter(unit => unit.id === id);
    if (filteredUnits.length > 0) {
      let unit = filteredUnits[0];
      if(columnsKey === 'assembly_date' || columnsKey === 'active_date' || columnsKey === 'warranty_active_date') {
        if(value) {
          value = moment(value, 'MM/DD/YYYY').format('YYYY-MM-DD');
        }
      }
      let changed = false;
      if(columnsKey === 'assembly_date' || columnsKey === 'active_date' || columnsKey === 'warranty_active_date') {
        if(moment(unit[columnsKey]).format('YYYY-MM-DD') !== moment(value).format('YYYY-MM-DD')) {
          changed = true;
        }
      }
      else {
        if(unit[columnsKey] !== value) {
          changed = true;
        }
      }
      if(changed) {
        unit[columnsKey] = value;
        dispatch(addUnit(unit));
      }      
    }
    else {
      notification('error', 'Error occured!');
      return;
    }
  }
  handleSelectedSoftwareFile = e => {
    this.setState({
      selectedSoftwareFile: e.target.files[0],
      softwareFileLoaded: 0,
    });
  }
  handleSelectedFirmwareFile = e => {
    this.setState({
      selectedFirmwareFile: e.target.files[0],
      firmwareFileLoaded: 0,
    });
  }
  handleSoftwareUpload = () => {
    if (this.state.selectedSoftwareVersion == null) {
      notification('error', 'Input software version!');
      return;
    }
    if (this.state.selectedSoftwareFile == null) {
      notification('error', 'Select a software file to upload!');
      return;
    }    
    const data = new FormData();
    data.append('file', this.state.selectedSoftwareFile, this.state.selectedSoftwareFile.name);
    data.append('version', this.state.selectedSoftwareVersion);

    axios
      .post(`${settings.apiUrl}upload/software`, data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            softwareFileLoaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
          });
          if (ProgressEvent.loaded === ProgressEvent.total) {
            notification('success', 'Uploading finished.');
          }
        },
      })
      .then(res => {
        console.log(res.statusText)
      })
  }
  handleFirmwareUpload = () => {
    if (this.state.selectedFirmwareVersion == null) {
      notification('error', 'Input firmware version!');
      return;
    }
    if (this.state.selectedFirmwareFile == null) {
      notification('error', 'Select a firmware file to upload!');
      return;
    }    
    const data = new FormData();
    data.append('file', this.state.selectedFirmwareFile, this.state.selectedFirmwareFile.name);
    data.append('version', this.state.selectedFirmwareVersion);

    axios
      .post(`${settings.apiUrl}upload/firmware`, data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            firmwareFileLoaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
          });
          if (ProgressEvent.loaded === ProgressEvent.total) {
            notification('success', 'Uploading finished.');
          }
        },
      })
      .then(res => {
        console.log(res.statusText)
      })
  }
  handleUploadSoftwareModal = () => {
    if (this.uploadSoftwareFileInput.current) {
      this.uploadSoftwareFileInput.current.value = '';
    }
    this.setState({
      selectedSoftwareFile: null,
      softwareFileLoaded: 0,
      selectedSoftwareVersion: null,
    });
    const { dispatch, toggleUploadSoftwareModal } = this.props;
    dispatch(toggleUploadSoftwareModal());
  }
  handleUploadFirmwareModal = () => {
    if (this.uploadFirmwareFileInput.current) {
      this.uploadFirmwareFileInput.current.value = '';
    }
    this.setState({
      selectedFirmwareFile: null,
      firmwareFileLoaded: 0,
      selectedFirmwareVersion: null,
    });
    const { dispatch, toggleUploadFirmwareModal } = this.props;
    dispatch(toggleUploadFirmwareModal());
  }
  render() {
    const margin = {
      margin: rtl === 'rtl' ? '0 0 8px 8px' : '0 8px 8px 0'
    };
    const marginFormItem = {
      marginBottom: '6px'
    };
    const FlockButtonStyle1 = {
      margin: rtl === 'rtl' ? '0 0 8px 8px' : '0 8px 8px 0',
      width: '160px',
      height: '58px',
    };
    const FlockButtonStyle2 = {
      margin: rtl === 'rtl' ? '0 0 8px 8px' : '0 8px 8px 0',
      width: '160px',
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      }
    };

    const { rowStyle, colStyle, gutter } = basicStyle;
    const { editUnitModalActive, messageAllUserModalActive, editNoteModalActive, uploadSoftwareModalActive, uploadFirmwareModalActive, relocateUserAccountModalActive, changePasswordModalActive } = this.props;
    const { units, unit, messageAllUser } = clone(this.props);

    const dataSource = units;
    const columns = [
      {
        title: 'Unit Serial #',
        dataIndex: 'serial',
        key: 'serial',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'serial'}
            value={row.serial}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Date of Assembly',
        dataIndex: 'assembly_date',
        key: 'assembly_date',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'assembly_date'}
            isDatepicker={true}
            value={row.assembly_date ? moment(row.assembly_date).format('MM/DD/YYYY') : ''}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'QA/QC',
        dataIndex: 'qaqc',
        key: 'qaqc',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'qaqc'}
            value={row.qaqc}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Mainboard',
        dataIndex: 'mainboard',
        key: 'mainboard',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'mainboard'}
            value={row.mainboard}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'MCU Board',
        dataIndex: 'mcuboard',
        key: 'mcuboard',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'mcuboard'}
            value={row.mcuboard}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Input Board 1',
        dataIndex: 'inputboard1',
        key: 'inputboard1',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'inputboard1'}
            value={row.inputboard1}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Input Board 2',
        dataIndex: 'inputboard2',
        key: 'inputboard2',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'inputboard2'}
            value={row.inputboard2}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Input Board 3',
        dataIndex: 'inputboard3',
        key: 'inputboard3',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'inputboard3'}
            value={row.inputboard3}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Input Board 4',
        dataIndex: 'inputboard4',
        key: 'inputboard4',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'inputboard4'}
            value={row.inputboard4}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Software Registration Key',
        dataIndex: 'software_reg_key',
        key: 'software_reg_key',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'software_reg_key'}
            value={row.software_reg_key}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'status'}
            isSelect={true}
            selectOptions={[
              {value: '0', text: 'In-Active'},
              {value: '1', text: 'Active'},
            ]}
            defaultSelectOption={'0'}
            value={row.status === 1 ? 'Active' : 'In-Active'}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Active Date',
        dataIndex: 'active_date',
        key: 'active_date',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'active_date'}
            isDatepicker={true}
            value={row.active_date ? moment(row.active_date).format('MM/DD/YYYY') : ''}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Operating System',
        dataIndex: 'os',
        key: 'os',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'os'}
            isSelect={true}
            selectOptions={[
              {value: '', text: 'Select'},
              {value: '1', text: 'OSX'},
              {value: '2', text: 'WIN'},
            ]}
            defaultSelectOption={''}
            value={row.os === 1 ? 'OSX' : (row.os === 2 ? 'WIN' : '')}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: '# of Licenses Active',
        dataIndex: 'active_licenses_count',
        key: 'active_licenses_count',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'active_licenses_count'}
            value={row.active_licenses_count}
            onChange={this.onCellChange.bind(this)}
            type={'number'}
          />;
        },
      },
      {
        title: 'First Name',
        dataIndex: 'firstname',
        key: 'firstname',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'firstname'}
            value={row.firstname}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Last Name',
        dataIndex: 'lastname',
        key: 'lastname',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'lastname'}
            value={row.lastname}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'location'}
            value={row.location}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'email'}
            value={row.email}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Phone:',
        dataIndex: 'phone',
        key: 'phone',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'phone'}
            value={row.phone}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Warranty Type',
        dataIndex: 'warranty_type',
        key: 'warranty_type',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'warranty_type'}
            value={row.warranty_type}
            isSelect={true}
            selectOptions={[
              {value: '', text: 'Select'},
              {value: 'Standard', text: 'Standard'},
            ]}
            defaultSelectOption={''}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Warranty Claims',
        dataIndex: 'warranty_claims',
        key: 'warranty_claims',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'warranty_claims'}
            value={row.warranty_claims}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Warranty Active',
        dataIndex: 'warranty_active_date',
        key: 'warranty_active_date',
        render: (text, row, index) => {
          return <EditableCell
            index={index}
            id={row.id}
            columnsKey={'warranty_active_date'}
            isDatepicker={true}
            value={row.warranty_active_date ? moment(row.warranty_active_date).format('MM/DD/YYYY') : ''}
            onChange={this.onCellChange.bind(this)}
          />;
        },
      },
      {
        title: 'Customer Notes',
        key: 'customer_notes',
        render: (text, row) => {
          return (
            <ActionWrapper>
              <a onClick={this.handleEditNoteModal.bind(this, row)} href="# ">Open Notes</a>
            </ActionWrapper>
          );
        },
      },
      {
        title: 'Actions',
        key: 'action',
        className: 'noWrapCell',
        render: (text, row) => {
          return (
            <ActionWrapper>
              <a onClick={this.handleEditUnitModal.bind(this, row)} href="# ">
                <i className="ion-android-create" />
              </a>
            </ActionWrapper>
          );
        },
      },
    ];

    const groupColumns = [
      columns[0],
      columns[1],
      columns[2],
      {
        title: 'PCB Batch Number',
        children: [columns[3], columns[4], columns[5], columns[6], columns[7], columns[8]]
      },
      columns[9],
      columns[10],
      columns[11],
      columns[12],
      columns[13],
      columns[14],
      columns[15],
      columns[16],
      columns[17],
      columns[18],
      columns[19],
      columns[20],
      columns[21],
      columns[22],
      columns[23],
    ];

    const { autoCompleteDataSource } = this.state;
    const autoCompleteChildren = autoCompleteDataSource.map(item => {
      return <AutoCompleteOption key={item}>{item}</AutoCompleteOption>;
    });

    return (
      <LayoutWrapper style={{ backgroundColor: 'white' }}>
        <Row style={rowStyle} gutter={gutter} justify="start">
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Spin spinning={this.props.isBlocking}>
              <Box style={{ backgroundColor: '#b7b7b7', 'borderRadius': '10px' }}>
                <Row style={rowStyle} gutter={gutter} justify="start">
                  <div style={{ width: '170px' }}>
                    <FlockButton type="primary" style={FlockButtonStyle1} onClick={this.handlePushSoftwareUpdate.bind(this)}>
                      Push Software<br></br>Update Notifications
                    </FlockButton>
                    <FlockButton type="primary" style={FlockButtonStyle1} onClick={this.handlePushFirmwareUpdate.bind(this)}>
                      Push Firmware<br></br>Update Notifications
                    </FlockButton>
                  </div>
                  <div style={{ width: '700px' }}>
                    <FlockButton type="primary" style={FlockButtonStyle2} onClick={this.handleRefreshUserLicense.bind(this)}>
                      Refresh User Licenses
                    </FlockButton>
                    <FlockButton type="primary" style={FlockButtonStyle2} onClick={this.handleReactiveSystem.bind(this)}>
                      Reactive System
                    </FlockButton>
                    <FlockButton type="primary" style={FlockButtonStyle2} onClick={this.handleUploadSoftwareModal}>
                      Upload New Software
                    </FlockButton>
                    <FlockButton type="primary" style={FlockButtonStyle2} onClick={this.handleEditUnitModal.bind(this, null)}>
                      Add New Unit
                    </FlockButton>
                    <FlockButton type="primary" style={FlockButtonStyle2} onClick={this.handleClearUserInformation.bind(this)}>
                      Clear User Information
                    </FlockButton>
                    <FlockButton type="primary" style={FlockButtonStyle2} onClick={this.handleMarkForRepair.bind(this)}>
                      Marked for Repair
                      <span style={{ marginLeft: '9px', width: '12px', height: '12px', backgroundColor: 'yellow', borderRadius: '6px', border: 'solid 1px white' }}></span>
                    </FlockButton>
                    <FlockButton type="primary" style={FlockButtonStyle2} onClick={this.handleUploadFirmwareModal}>
                      Upload New Firmware
                    </FlockButton>
                    <PseudoFlockButton type="primary" style={FlockButtonStyle2} onClick={(e) => { e.preventDefault(); }}>
                    </PseudoFlockButton>
                    <FlockButton type="primary" style={FlockButtonStyle2} onClick={this.handleRelocateUserAccountModal.bind(this)}>
                      Relocate User Account
                    </FlockButton>
                    <FlockButton type="primary" style={FlockButtonStyle2} onClick={this.handleDecomission.bind(this)}>
                      Decomission System
                    <span style={{ marginLeft: '3px', width: '12px', height: '12px', backgroundColor: 'red', borderRadius: '6px', border: 'solid 1px white' }}></span>
                    </FlockButton>
                    <FlockButton type="primary" style={FlockButtonStyle2} onClick={this.handleMessageAllUsersModal.bind(this)}>
                      Message All Users
                    </FlockButton>
                  </div>

                  <div style={{ position: 'absolute', top: '0px', right: '0', width: '300px' }}>
                    <FlockSelect defaultValue="PATCH Systems" style={{ width: '100%' }}>
                      <FlockSelectOption value="PATCH Systems">PATCH Systems</FlockSelectOption>
                    </FlockSelect>
                    <FlockInputSearch placeholder="Search" style={{...margin, marginTop: '8px'}} onSearch={this.onFilterKeywordChange.bind(this)} />
                    <FlockSelect
                      defaultValue="Filter All Results"
                      style={{ width: '100%' }}
                      onChange={this.onFilterFieldSelectChange.bind(this)}>
                      <FlockSelectOption value="">All Results</FlockSelectOption>
                      <FlockSelectOption value="serial">Unit Serial #</FlockSelectOption>
                      {/* <FlockSelectOption value="assembly_date">Date of Assembly</FlockSelectOption> */}
                      <FlockSelectOption value="qaqc">QA/QC</FlockSelectOption>
                      <FlockSelectOption value="mainboard">Mainboard</FlockSelectOption>
                      <FlockSelectOption value="mcuboard">MCU Board</FlockSelectOption>
                      <FlockSelectOption value="inputboard1">Input Board 1</FlockSelectOption>
                      <FlockSelectOption value="inputboard2">Input Board 2</FlockSelectOption>
                      <FlockSelectOption value="inputboard3">Input Board 3</FlockSelectOption>
                      <FlockSelectOption value="inputboard4">Input Board 4</FlockSelectOption>
                      <FlockSelectOption value="software_reg_key">Software Registration Keys</FlockSelectOption>
                      <FlockSelectOption value="status">Active</FlockSelectOption>
                      {/* <FlockSelectOption value="active_date">Active Date</FlockSelectOption> */}
                      <FlockSelectOption value="os">Operating System</FlockSelectOption>
                      <FlockSelectOption value="active_licenses_count"># of Licenses Active</FlockSelectOption>
                      <FlockSelectOption value="firstname">First Name</FlockSelectOption>
                      <FlockSelectOption value="lastname">Last Name</FlockSelectOption>
                      <FlockSelectOption value="location">Location</FlockSelectOption>
                      <FlockSelectOption value="email">Email</FlockSelectOption>
                      <FlockSelectOption value="phone">Phone</FlockSelectOption>
                      <FlockSelectOption value="warranty_type">Warranty Type</FlockSelectOption>
                      <FlockSelectOption value="warranty_claims">Warranty Claims</FlockSelectOption>
                      {/* <FlockSelectOption value="warranty_active_date">Warranty Active</FlockSelectOption> */}
                      <FlockSelectOption value="customer_notes">Customer Notes</FlockSelectOption>
                    </FlockSelect>
                  </div>
                </Row>

                <Row style={rowStyle} gutter={gutter} justify="start">
                  <Col md={24} sm={24} xs={24} style={{ paddingLeft: '0', paddingRight: '0' }}>
                    <TableWrapper
                      key="key"
                      rowKey={record => record.id}
                      columns={groupColumns}
                      bordered={true}
                      dataSource={dataSource}
                      loading={this.props.isFetching}
                      className="isoGroupTable"
                      onRow={(record, index) => {
                        return {
                          onClick: () => {
                            this.setState({ selectedRow: clone(record) });
                          },
                        }
                      }}
                      rowClassName={(record, index) => {
                        let className = '';
                        if (this.state.selectedRow && record.id === this.state.selectedRow.id) className += ' activeRow';
                        if (record.is_repairing === 1) className += ' repairingRow';
                        else if (record.is_decommissioned === 1) className += ' decommissionedRow';
                        return className;
                      }}
                      pagination={{
                        defaultPageSize: 15,
                        hideOnSinglePage: true,
                        total: dataSource.length,
                        showTotal: (total, range) => {
                          return `Showing ${range[0]}-${range[1]} of ${
                            dataSource.length
                            } Results`;
                        },
                      }}
                    />

                    <Modal
                      visible={editUnitModalActive}
                      title={unit.id ? 'Update Unit' : 'Add New Unit'}
                      okText={unit.id ? 'Update' : 'Add'}
                      onCancel={this.handleEditUnitModal.bind(this, null)}
                      onOk={this.handleEditRecord.bind(this, unit)}
                      width={1000}
                      footer={[
                        <Button
                          key="submit"
                          onClick={this.handleEditRecord.bind(this, unit)}
                          style={{marginRight: '50px'}}
                        >
                          {unit.id ? 'Update' : 'Add'}
                        </Button>,
                        <Button key="back"
                          onClick={this.handleEditUnitModal.bind(this, null)}
                        >
                          Cancel
                        </Button>                        
                      ]}
                      >

                      <Form>
                        <Row>
                          <Col md={12} sm={12} xs={24}>
                            <FormItem
                              {...formItemLayout}
                              label={"Unit Serial #"}
                              style={marginFormItem}
                            >
                              <Input
                                placeholder="Enter Unit Serial #"
                                value={unit.serial}
                                onChange={this.onRecordChange.bind(this, 'serial')}
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"Date of Assembly"}
                              style={marginFormItem}
                            >
                              {/* <DatePicker
                              selected={unit.assembly_date ? moment(unit.assembly_date, 'YYYY-MM-DD').toDate() : new Date()}
                              onChange={this.onDateChange.bind(this, 'assembly_date')}
                            /> */}
                              <DatePicker
                                value={unit.assembly_date ? moment(unit.assembly_date) : null}
                                onChange={this.onDateChange.bind(this, 'assembly_date')}
                                format="MM/DD/YYYY"
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"QA/QC"}
                              style={marginFormItem}
                            >
                              <Input
                                placeholder="Enter QA/QC"
                                value={unit.qaqc}
                                onChange={this.onRecordChange.bind(this, 'qaqc')}
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"Mainboard"}
                              style={marginFormItem}
                            >
                              <Input
                                placeholder="Enter Mainboard"
                                value={unit.mainboard}
                                onChange={this.onRecordChange.bind(this, 'mainboard')}
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"MCU Board"}
                              style={marginFormItem}
                            >
                              <Input
                                placeholder="Enter MCU Board"
                                value={unit.mcuboard}
                                onChange={this.onRecordChange.bind(this, 'mcuboard')}
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"InputBoard 1"}
                              style={marginFormItem}
                            >
                              <Input
                                placeholder="Enter InputBoard 1"
                                value={unit.inputboard1}
                                onChange={this.onRecordChange.bind(this, 'inputboard1')}
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"InputBoard 2"}
                              style={marginFormItem}
                            >
                              <Input
                                placeholder="Enter InputBoard 2"
                                value={unit.inputboard2}
                                onChange={this.onRecordChange.bind(this, 'inputboard2')}
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"InputBoard 3"}
                              style={marginFormItem}
                            >
                              <Input
                                placeholder="Enter InputBoard 3"
                                value={unit.inputboard3}
                                onChange={this.onRecordChange.bind(this, 'inputboard3')}
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"InputBoard 4"}
                              style={marginFormItem}
                            >
                              <Input
                                placeholder="Enter InputBoard 4"
                                value={unit.inputboard4}
                                onChange={this.onRecordChange.bind(this, 'inputboard4')}
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"Software Registration Key"}
                              style={marginFormItem}
                            >
                              <Input
                                placeholder="Enter Software Registration Key"
                                value={unit.software_reg_key}
                                onChange={this.onRecordChange.bind(this, 'software_reg_key')}
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"Status"}
                              style={marginFormItem}
                            >
                              <Select
                                value={unit.status === 1 ? 'Active' : 'In-Active'}
                                onChange={this.onSelectChange.bind(this, 'status')}
                                style={{ ...margin, width: '100%', marginTop: '8px' }}
                              >
                                <Option value="0">In-Active</Option>
                                <Option value="1">Active</Option>
                              </Select>
                            </FormItem>
                          </Col>
                          <Col md={12} sm={12} xs={24}>
                            <FormItem
                              {...formItemLayout}
                              label={"Active Date"}
                              style={marginFormItem}
                            >
                              {/* <DatePicker
                              selected={unit.active_date ? moment(unit.active_date, 'YYYY-MM-DD').toDate() : new Date()}
                              onChange={this.onDateChange.bind(this, 'active_date')}
                            /> */}
                              <DatePicker
                                value={unit.active_date ? moment(unit.active_date) : null}
                                onChange={this.onDateChange.bind(this, 'active_date')}
                                format="MM/DD/YYYY"
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"Operating System"}
                              style={marginFormItem}
                            >
                              <Select
                                value={unit.os === 1 ? 'OSX' : (unit.os === 2 ? 'WIN' : 'Select')}
                                onChange={this.onSelectChange.bind(this, 'os')}
                                style={{ ...margin, width: '100%', marginTop: '8px' }}
                              >
                                <Option value="">Select</Option>
                                <Option value="1">OSX</Option>
                                <Option value="2">WIN</Option>
                              </Select>
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"# of Licenses Active"}
                              style={marginFormItem}
                            >
                              <Input
                                placeholder="Enter # of Licenses Active"
                                value={unit.active_licenses_count}
                                onChange={this.onRecordChange.bind(this, 'active_licenses_count')}
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"First Name"}
                              style={marginFormItem}
                            >
                              <Input
                                placeholder="Enter First Name"
                                value={unit.firstname}
                                onChange={this.onRecordChange.bind(this, 'firstname')}
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"Last Name"}
                              style={marginFormItem}
                            >
                              <Input
                                placeholder="Enter Last Name"
                                value={unit.lastname}
                                onChange={this.onRecordChange.bind(this, 'lastname')}
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"Location"}
                              style={marginFormItem}
                            >
                              <Input
                                placeholder="Enter Location"
                                value={unit.location}
                                onChange={this.onRecordChange.bind(this, 'location')}
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"Email"}
                              style={marginFormItem}
                            >
                              <Input
                                placeholder="Enter Email"
                                value={unit.email}
                                onChange={this.onRecordChange.bind(this, 'email')}
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"Phone"}
                              style={marginFormItem}
                            >
                              <Input
                                placeholder="Enter Phone"
                                value={unit.phone}
                                onChange={this.onRecordChange.bind(this, 'phone')}
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"Warranty Type"}
                              style={marginFormItem}
                            >
                              <Select
                                defaultValue={unit.warranty_type ? unit.warranty_type : 'Standard Warranty'}
                                onChange={this.onSelectChange.bind(this, 'warranty_type')}
                                style={{ ...margin, width: '100%', marginTop: '8px' }}
                              >
                                <Option value="Standard Warranty">Standard Warranty</Option>
                              </Select>
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"Warranty Claims"}
                              style={marginFormItem}
                            >
                              <Input
                                placeholder="Enter Warranty Claims"
                                value={unit.warranty_claims}
                                onChange={this.onRecordChange.bind(this, 'warranty_claims')}
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"Warranty Active Date"}
                              style={marginFormItem}
                            >
                              {/* <DatePicker
                              selected={unit.warranty_active_date ? moment(unit.warranty_active_date, 'YYYY-MM-DD').toDate() : new Date()}
                              onChange={this.onDateChange.bind(this, 'warranty_active_date')}
                            /> */}
                              <DatePicker
                                value={unit.warranty_active_date ? moment(unit.warranty_active_date) : null}
                                onChange={this.onDateChange.bind(this, 'warranty_active_date')}
                                format="MM/DD/YYYY"
                              />
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>
                    </Modal>

                    <Modal
                      visible={editNoteModalActive}
                      title={'Serial #:' + unit.serial}
                      okText={'Save'}
                      onCancel={this.handleEditNoteModal.bind(this, null)}
                      onOk={this.handleEditNote.bind(this, unit)}
                      width={1000}>

                      <Textarea
                        placeholder="THIS IS JUST A SIMPLE NOTE PAD THAT WE CAN USE TO MAKE NOTES AND SAVE FOR EACH UNIT, SERIAL, USER ETC."
                        value={unit.customer_notes}
                        rows={20}
                        onChange={this.onRecordChange.bind(this, 'customer_notes')}
                        className="BillFormAddress"
                      />
                    </Modal>

                    <Modal
                      visible={messageAllUserModalActive}
                      title={'Message All Users'}
                      okText={'Save'}
                      onCancel={this.handleMessageAllUsersModal.bind(this)}
                      onOk={this.handleMessageAllUsers.bind(this)}
                      width={1000}>

                      <Textarea
                        placeholder=""
                        value={messageAllUser}
                        rows={20}
                        onChange={this.onMessageAllUsersChange.bind(this)}
                        className="BillFormAddress"
                      />
                    </Modal>

                    <Modal
                      visible={uploadSoftwareModalActive}
                      title={'Upload Software'}
                      okText={'Upload'}
                      cancelText={'Close'}
                      onCancel={this.handleUploadSoftwareModal}
                      onOk={this.handleSoftwareUpload}
                    >
                      <span>New Software Version Number : </span>
                      <InputNumber
                        value={this.state.selectedSoftwareVersion}
                        min={0} max={1000} step={0.1}
                        onChange={(value) => {
                          this.setState({ selectedSoftwareVersion: value });
                        }}
                        style={margin}
                      />
                      <input type="file" onChange={this.handleSelectedSoftwareFile} ref={this.uploadSoftwareFileInput} style={{ width: '100%' }}></input>
                      <Progress percent={Math.round(this.state.softwareFileLoaded, 2)} style={margin} />
                    </Modal>

                    <Modal
                      visible={uploadFirmwareModalActive}
                      title={'Upload Firmware'}
                      okText={'Upload'}
                      cancelText={'Close'}
                      onCancel={this.handleUploadFirmwareModal}
                      onOk={this.handleFirmwareUpload}
                    >
                      <span>New Firmware Version Number : </span>
                      <InputNumber
                        value={this.state.selectedFirmwareVersion}
                        min={0} max={1000} step={0.1}
                        onChange={(value) => {
                          this.setState({ selectedFirmwareVersion: value });
                        }}
                        style={margin}
                      />
                      <input type="file" onChange={this.handleSelectedFirmwareFile} ref={this.uploadFirmwareFileInput} style={{ width: '100%' }}></input>
                      <Progress percent={Math.round(this.state.firmwareFileLoaded, 2)} style={margin} />
                    </Modal>

                    <Modal
                      visible={relocateUserAccountModalActive}
                      title="Relocate User Account"
                      onOk={this.proceedRelocateUserAccount.bind(this)}
                      onCancel={this.handleRelocateUserAccountModal.bind(this)}
                      centered
                      width={'600px'}
                      footer={[
                        <Button
                          key="submit"
                          onClick={this.proceedRelocateUserAccount.bind(this)}
                          style={{marginRight: '50px'}}
                        >
                          Proceed
                        </Button>,
                        <Button key="back"
                          onClick={this.handleRelocateUserAccountModal.bind(this)}
                        >
                          Cancel
                        </Button>                        
                      ]}
                    >
                      <p>
                        You are about to relocate the User Account Information from this specific unit to another unit. This will relocate the User Information. Please input the serial # you wish to move this User Account Information to before clicking proceed.
                      </p>
                      <div style={{textAlign: "center"}}>
                        <span>Serial# : </span>
                        <AutoComplete
                          onChange={this.handleAutoCompleteChange}
                          placeholder="Input Serial#"
                          style={{ width: '200px' }}
                        >
                          {autoCompleteChildren}
                        </AutoComplete>
                      </div>                      
                    </Modal>

                    <Modal
                      visible={changePasswordModalActive}
                      title={'Change Password'}
                      okText={'Update'}
                      onCancel={this.handleChangePasswordModal.bind(this)}
                      onOk={this.handleChangePassword.bind(this)}>
                      <Form>
                        <Row>
                          <Col md={24} sm={24} xs={24}>
                            <FormItem
                              {...formItemLayout}
                              label={"Old Password"}
                              style={marginFormItem}
                            >
                              <Input
                                id="inputOldPassword"
                                type="password"
                                placeholder="Input old password"
                                defaultValue=""
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"New Password"}
                              style={marginFormItem}
                            >
                              <Input
                                id="inputNewPassword"
                                type="password"
                                placeholder="Input new password"
                                defaultValue=""
                              />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={"Confirm New Password"}
                              style={marginFormItem}
                            >
                              <Input
                                id="inputConfirmNewPassword"
                                type="password"
                                placeholder="Input new password again"
                                defaultValue=""
                              />
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>  
                    </Modal>
                  </Col>
                </Row>
              </Box>
            </Spin>            
          </Col>
        </Row>
      </LayoutWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.Units,
    ...state.Auth
  };
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    addUnit,
    updateUnit,
    pushUpdateNotification,
    toggleUploadSoftwareModal,
    toggleUploadFirmwareModal,
    toggleEditUnitModal,
    toggleEditNoteModal,
    toggleRelocateUserAccountModal,
    toggleMessageAllUsersModal,
    updateMessageAllUser,
    sendMessageAllUser,
    toggleChangePasswordModal,
    changePassword
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Units);