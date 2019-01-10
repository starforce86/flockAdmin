import React, { Component } from 'react';
import moment from 'moment';
import Input from '../uielements/input';
import { Icon } from 'antd';
import DatePicker from '../uielements/datePicker';
import Select, {
  SelectOption as Option,
} from '../uielements/select';

export default class extends Component {
  state = {
    value: this.props.value,
    editable: false,
    valueChanged: false,
  };
  handleDateChange = date => {
    let value = '';
    if(date) {
      value = date.format("MM/DD/YYYY");
    }
    this.setState({ value, valueChanged: true });
  };
  handleSelectChange = value => {
    this.setState({ value, valueChanged: true });
  };
  handleChange = event => {
    const value = event.target.value;
    this.setState({ value, valueChanged: true });
  };
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(
        this.props.id,
        this.state.value,
        this.props.columnsKey,
        this.props.index
      );
    }
  };
  edit = () => {
    this.setState({ editable: true, value: this.props.value });
  };
  render() {
    const { editable, valueChanged } = this.state;
    const { isDatepicker, isSelect, selectOptions, defaultSelectOption } = this.props;
    let { value } = this.props;
    if(editable || valueChanged) {
      value = this.state.value;
    } 
    
    let editComponent;
    if (isDatepicker) {
      editComponent = <DatePicker
        value={value ? moment(value, 'MM/DD/YYYY') : null}
        onChange={this.handleDateChange}
        format="MM/DD/YYYY"
      />
    }
    else if(isSelect) {
      editComponent = <Select
        defaultValue={value ? value : defaultSelectOption}
        onChange={this.handleSelectChange}
        style={{ magin: '0 0 8px 8px', width: '100%', marginTop: '8px' }}
      >
        {selectOptions.map((option, index) => <Option key={index} value={option}>{option}</Option>)}
      </Select>
    }
    else {
      editComponent = <Input
        value={value}
        onChange={this.handleChange}
        onPressEnter={this.check}
      />
    }
    return (
      <div className="isoEditData">
        {editable ? (
          <div className="isoEditDataWrapper">
            {editComponent}
            <Icon type="check" className="isoEditIcon" onClick={this.check} />
          </div>
        ) : (
          <p className="isoDataWrapper">
            {value || ' '}
            <Icon type="edit" className="isoEditIcon" onClick={this.edit} />
          </p>
        )}
      </div>
    );
  }
}
