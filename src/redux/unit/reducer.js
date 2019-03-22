import unitActions from "./actions";

const initState = {
  units: [],
  isFetching: false,
  filterField: '',
  filterKeyword: '',
  uploadSoftwareModalActive: false,
  editUnitModalActive: false,
  editNoteModalActive: false,
  relocateUserAccountModalActive: false,
  messageAllUserModalActive: false,
  messageAllUser: '',
  isBlocking: false,

  unit: {
    id: null,
    serial: '',
    assembly_date: '',
    qaqc: '',
    mainboard: '',
    mcuboard: '',
    inputboard1: '',
    inputboard2: '',
    inputboard3: '',
    inputboard4: '',
    software_reg_key: '',
    status: 0,
    active_date: '',
    os: '',
    licenses_limit: 2,
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
  },
};

export default function reducer(state = initState, { type, payload }) {
  switch (type) {
    case unitActions.REQUEST_UNITS:
      return {
        ...state,
        isFetching: true
      }
    case unitActions.RECEIVE_UNITS:
      return {
        ...state,
        units: payload,
        isFetching: false,
      };
    case unitActions.UPDATE_UNIT:
      return {
        ...state,
        unit: payload.data
      };
    case unitActions.TOGGLE_UPLOAD_SOFTWARE_MODAL:
      return {
        ...state,
        uploadSoftwareModalActive: !state.uploadSoftwareModalActive,
      };
    case unitActions.TOGGLE_UPLOAD_FIRMWARE_MODAL:
      return {
        ...state,
        uploadFirmwareModalActive: !state.uploadFirmwareModalActive,
      };
    case unitActions.TOGGLE_EDITUNIT_MODAL:
      return {
        ...state,
        editUnitModalActive: !state.editUnitModalActive,
        unit: payload.data == null ? initState.unit : payload.data,
      };
    case unitActions.TOGGLE_EDITNOTE_MODAL:
      return {
        ...state,
        editNoteModalActive: !state.editNoteModalActive,
        unit: payload.data == null ? initState.unit : payload.data,
      };
    case unitActions.TOGGLE_RELOCATE_USER_ACCOUNT_MODAL:
      return {
        ...state,
        relocateUserAccountModalActive: !state.relocateUserAccountModalActive,
      };
    case unitActions.TOGGLE_MESSAGE_ALL_USERS_MODAL:
      return {
        ...state,
        messageAllUserModalActive: !state.messageAllUserModalActive,
      };
    case unitActions.UPDATE_MESSAGE_ALL_USERS:
      return {
        ...state,
        messageAllUser: payload.data,
      };
    case unitActions.SET_FILTER_FIELD:
      return {
        ...state,
        filterField: payload,
      };
    case unitActions.SET_FILTER_KEYWORD:
      return {
        ...state,
        filterKeyword: payload,
      };
    case unitActions.REQUEST_BLOCKING:
      return {
        ...state,
        isBlocking: true,
      };
    case unitActions.RELEASE_BLOCKING:
      return {
        ...state,
        isBlocking: false,
      };
    default:
      return state;
  }
}
