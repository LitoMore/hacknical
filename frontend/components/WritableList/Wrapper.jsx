
import React from 'react'
import PropTypes from 'prop-types'
import { InputGroup } from 'light-ui'
import Hotkeys from 'UTILS/hotkeys'

import styles from './writable.css'
import ListItem from './ListItem'

class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.onLabelChange = this.onLabelChange.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  onLabelChange(index) {
    const { onLabelChange } = this.props
    return (value) => {
      onLabelChange && onLabelChange(value, index)
    }
  }

  onDelete(index) {
    const { onDelete } = this.props
    return () => {
      onDelete && onDelete(index)
    }
  }

  onKeyDown(index) {
    return (e) => {
      const { items } = this.props
      const value = items[index]
      if (Hotkeys.isEnter(e)) {
        this.onFocus(index + 1)
      } else if (Hotkeys.isDelete(e) && !value) {
        this.onDelete(index)()
        this.onFocus(index)
      }
    }
  }

  onFocus(index) {
    const { name, items } = this.props
    let inputIndex = index

    if (items.length - 1 < index || index < 0) inputIndex = 'new'
    setTimeout(() => $(`#WritableList-${name}-${inputIndex}`).focus(), 100)
  }

  renderListItems() {
    const { items, placeholder, name } = this.props
    return items.map((item, index) => (
      <ListItem
        key={index}
        item={item}
        id={`WritableList-${name}-${index}`}
        placeholder={placeholder}
        onKeyDown={this.onKeyDown(index)}
        onDelete={this.onDelete(index)}
        onChange={this.onLabelChange(index)}
      />
    ))
  }

  render() {
    const {
      name,
      items,
      value,
      onChange,
      onKeyDown,
      introList,
      placeholder,
      defaultIntro,
    } = this.props

    return (
      <ul className={styles.items}>
        {this.renderListItems()}
        <li>-&nbsp;&nbsp;
          <InputGroup
            id={`WritableList-${name}-new`}
            value={value}
            required={false}
            theme="borderless"
            subTheme="underline"
            placeholder={placeholder}
            onChange={onChange}
            onKeyDown={onKeyDown}
            wrapperClassName={styles.wrapper}
            tipsoTheme="dark"
          >
            <div className={styles.intro}>
              {introList[items.length] || defaultIntro || placeholder}
            </div>
          </InputGroup>
        </li>
      </ul>
    )
  }
}

Wrapper.propTypes = {
  items: PropTypes.array,
  placeholder: PropTypes.string,
  defaultIntro: PropTypes.string,
  introList: PropTypes.array,
  onDelete: PropTypes.func,
  onChange: PropTypes.func,
  name: PropTypes.string,
}

Wrapper.defaultProps = {
  items: [],
  name: '',
  placeholder: '',
  defaultIntro: '',
  introList: [],
  onDelete: Function.prototype,
  onChange: Function.prototype
}

export default Wrapper
