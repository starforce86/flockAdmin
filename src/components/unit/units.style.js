import styled from 'styled-components';
import { palette } from 'styled-theme';
import Buttons from '../uielements/button';
import Table from '../../containers/Tables/antTables/antTable.style';
import Select, { SelectOption } from '../uielements/select';
import { InputSearch } from '../uielements/input';

const TableWrapper = styled(Table)`
  .ant-table-bordered .ant-table-thead > tr > th,
  .ant-table-bordered .ant-table-tbody > tr > td {
    white-space: normal;
    font-size: 10px;
    &.noWrapCell {
      white-space: nowrap;
    }

    @media only screen and (max-width: 920px) {
      white-space: nowrap;
    }
  }
`;

const StatusTag = styled.span`
  padding: 0 5px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  background-color: ${palette('primary', 0)};
  font-size: 12px;
  color: #ffffff;
  text-transform: capitalize;

  &.draft {
    background-color: ${palette('warning', 0)};
  }

  &.publish {
    background-color: ${palette('success', 0)};
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`;

const ButtonHolders = styled.div``;

const ComponentTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: ${palette('text', 0)};
  margin: 5px 0;
`;

const FlockButton = styled(Buttons)`
  && {
    background-color: #404040 !important;
    border-color: transparent !important;
    padding-left: 10px !important;
    padding-right: 10px !important;
  }  
`;

const PseudoFlockButton = styled(Buttons)`
  && {
    background-color: transparent !important;
    border-color: transparent !important;
    padding-left: 10px !important;
    padding-right: 10px !important;
    box-shadow: none !important;
    cursor: default !important;
  }  
`;

const FlockInputSearch = styled(InputSearch)`
  && {
    background-color: #404040 !important;
    border:none !important;
    border-radius: 5px !important;
    input {
      background: transparent !important;
      color: white !important;
      border:none !important;
      border-radius: 5px !important;
    }
  }  
`;

const FlockSelect = styled(Select)`
  && {
    background-color: #404040 !important;
    color: white !important;
    border:none !important;
    border-radius: 5px !important;
    .ant-select-selection {
      background-color: #404040 !important;
      color: white !important;
      border:none !important;
      border-radius: 5px !important;
    }
  }  
`;

const FlockSelectOption = styled(SelectOption)`
  && {
    background-color: #404040 !important;
    color: white !important;
    ul.ant-select-dropdown-menu {
      background-color: #404040 !important;
      color: white !important;

      li.ant-select-dropdown-menu-item {
        background-color: #404040 !important;
        color: white !important;
      }
    }
  }  
`;

const ActionBtn = styled(Buttons)`
  && {
    padding: 0 12px;
    margin-right: 15px;

    &:last-child {
      margin-right: 0;
    }

    i {
      font-size: 17px;
      color: ${palette('text', 1)};
    }

    &:hover {
      i {
        color: inherit;
      }
    }
  }
`;

const Fieldset = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  font-size: 13px;
  color: ${palette('text', 1)};
  line-height: 1.5;
  font-weight: 500;
  padding: 0;
  margin: 0 0 8px;
`;

const ActionWrapper = styled.div`
  display: flex;
  align-content: center;

  a {
    margin-right: 12px;
    &:last-child {
      margin-right: 0;
    }

    i {
      font-size: 18px;
      color: ${palette('primary', 0)};

      &:hover {
        color: ${palette('primary', 4)};
      }
    }

    &.deleteBtn {
      i {
        color: ${palette('error', 0)};

        &:hover {
          color: ${palette('error', 2)};
        }
      }
    }
  }
`;

const Form = styled.div``;

export {
  ActionBtn,
  FlockButton,
  PseudoFlockButton,
  Fieldset,
  Label,
  Form,
  TitleWrapper,
  ButtonHolders,
  ActionWrapper,
  ComponentTitle,
  TableWrapper,
  StatusTag,
  FlockSelect,
  FlockSelectOption,
  FlockInputSearch
};
