import notification from '../../components/notification';

const endpoint = 'http://52.15.174.215/Api';

const requestBlocking = () => ({
  type: unitActions.REQUEST_BLOCKING
})

const releaseBlocking = () => ({
  type: unitActions.RELEASE_BLOCKING
})

const requestUnits = () => ({
  type: unitActions.REQUEST_UNITS
})

const receiveUnits = (json) => {
  return {
    type: unitActions.RECEIVE_UNITS,
    payload: json.data,
  }
}

const fetchUnits = (filterField, filterKeyword) => dispatch => {
  dispatch(requestUnits());
  return fetch(`${endpoint}/unit/ajaxList`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filterKeyword: filterKeyword,
      filterField: filterField
    })
  })
    .then(response => response.json())
    .then(json => {
      return dispatch(receiveUnits(json))
    })
}

const insertUnit = (unit, showSuccessMsg=true) => dispatch => {
  dispatch(requestBlocking());
  return fetch(`${endpoint}/unit/ajaxAdd`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(unit)
  })
    .then(response => response.json())
    .then(json => {
      if (json.success === 1) {
        if(showSuccessMsg) {
          if(unit.id == null) {
            notification('success', 'Successfully added.');
          }
          else {
            notification('success', 'Successfully updated.');
          }
        }        
        dispatch(releaseBlocking())
        return dispatch({
          type: unitActions.RECEIVE_UNITS,
          payload: json.data,
        });
      }
      else {
        notification('error', json.errMsg);
        return dispatch(releaseBlocking())
      }
    })
}

const pushSoftwareUpdateNotification = () => dispatch => {
  dispatch(requestBlocking());
  return fetch(`${endpoint}/unit/ajaxPushSoftwareUpdateNotification`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(response => response.json())
    .then(json => {
      if (json.success === 1) {
        notification('success', 'Success.');
      }
      else {
        notification('error', json.errMsg);
      }
      return dispatch(releaseBlocking());
    })
}

const pushFirmwareUpdateNotification = () => dispatch => {
  dispatch(requestBlocking());
  return fetch(`${endpoint}/unit/ajaxPushFirmwareUpdateNotification`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(response => response.json())
    .then(json => {
      if (json.success === 1) {
        notification('success', 'Success.');
      }
      else {
        notification('error', json.errMsg);
      }
      return dispatch(releaseBlocking());
    })
}

const shouldFetchUnits = (state) => {
  const units = state.Units;
  if (!units) {
    return true;
  }
  if (units.isFetching) {
    return false;
  }
  else {
    return true;
  }
}

const generateSoftwareRegKey = () => {
  return Math.random().toString().substring(2,12);
}

const generateSerial = (units) => {
  const serials = units.map(unit => unit.serial);
  let result = 1;
  for(var serial of serials) {
    let intSerial = parseInt(serial.substring(3, 11));
    if(intSerial > result) {
      result = intSerial;
    }
  }
  result += 1;
  result = result.toString();
  const len = result.length;
  if(len < 8) {
    for(var i=0; i<8-len; i++) {
      result = `0${result}`;
    }
  }
  result = `PTH${result}`;
  return result;
}

const unitActions = {
  REQUEST_UNITS: 'REQUEST_UNITS',
  RECEIVE_UNITS: 'RECEIVE_UNITS',
  UPDATE_UNIT: 'UPDATE_UNIT',
  REQUEST_BLOCKING: 'REQUEST_BLOCKING',
  RELEASE_BLOCKING: 'RELEASE_BLOCKING',
  TOGGLE_UPLOAD_SOFTWARE_MODAL: 'TOGGLE_UPLOAD_SOFTWARE_MODAL',
  TOGGLE_UPLOAD_FIRMWARE_MODAL: 'TOGGLE_UPLOAD_FIRMWARE_MODAL',
  TOGGLE_EDITUNIT_MODAL: 'TOGGLE_EDITUNIT_MODAL',
  TOGGLE_EDITNOTE_MODAL: 'TOGGLE_EDITNOTE_MODAL',
  TOGGLE_RELOCATE_USER_ACCOUNT_MODAL: 'TOGGLE_RELOCATE_USER_ACCOUNT_MODAL',
  PUSH_UPDATE_NOTIFICATION: 'PUSH_UPDATE_NOTIFICATION',
  SET_FILTER_FIELD: 'SET_FILTER_FIELD',
  SET_FILTER_KEYWORD: 'SET_FILTER_KEYWORD',

  addUnit: (unit, showSuccessMsg=true) => (dispatch) => {
    return dispatch(insertUnit(unit, showSuccessMsg));
  },
  updateUnit: unit => (dispatch) => {
    return dispatch({
      type: unitActions.UPDATE_UNIT,
      payload: { data: unit}
    });
  },
  fetchUnitsIfNeeded: () => (dispatch, getState) => {
    if (shouldFetchUnits(getState())) {
      const curstate = getState();
      return dispatch(fetchUnits(curstate.Units.filterField, curstate.Units.filterKeyword));
    }
  },
  toggleUploadSoftwareModal: () => (dispatch) => {
    return dispatch({
      type: unitActions.TOGGLE_UPLOAD_SOFTWARE_MODAL,
    });
  },
  toggleUploadFirmwareModal: () => (dispatch) => {
    return dispatch({
      type: unitActions.TOGGLE_UPLOAD_FIRMWARE_MODAL,
    });
  },
  toggleRelocateUserAccountModal: () => (dispatch) => {
    return dispatch({
      type: unitActions.TOGGLE_RELOCATE_USER_ACCOUNT_MODAL,
    });
  },
  toggleEditUnitModal: (data) => (dispatch, getState) => {
    if(!data) {
      const curState = getState();
      data = {
        id: null,
        serial: generateSerial(curState.Units.units),
        assembly_date: '',
        qaqc: '',
        mainboard: '',
        mcuboard: '',
        inputboard1: '',
        inputboard2: '',
        inputboard3: '',
        inputboard4: '',
        software_reg_key: generateSoftwareRegKey(),
        status: '',
        active_date: '',
        os: '',
        active_licenses_count: '',
        firstname: '',
        lastname: '',
        location: '',
        email: '',
        phone: '',
        warranty_type: '',
        warranty_claims: '',
        warranty_active_date: '',
        customer_notes: '',
        is_repairing: 0,
        is_decommissioned: 0,
      }
    }
    return dispatch({
      type: unitActions.TOGGLE_EDITUNIT_MODAL,
      payload: { data },
    });
  },
  toggleEditNoteModal: (data) => (dispatch) => {
    return dispatch({
      type: unitActions.TOGGLE_EDITNOTE_MODAL,
      payload: { data },
    });
  },
  setFilterField: (filterField) => {
    return {
      type: unitActions.SET_FILTER_FIELD,
      payload: filterField
    }    
  },
  setFilterKeyword: (filterKeyword) => {
    return {
      type: unitActions.SET_FILTER_KEYWORD,
      payload: filterKeyword
    }    
  },
  pushUpdateNotification: (data) => (dispatch) => {
    if(data === 'software') {
      return dispatch(pushSoftwareUpdateNotification(data));
    }
    else if(data === 'firmware') {
      return dispatch(pushFirmwareUpdateNotification(data));
    }
    else {
      return null;
    }
  }     
};
export default unitActions;
