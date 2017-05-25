'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
})()

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

var _propTypes = require('prop-types')

var _propTypes2 = _interopRequireDefault(_propTypes)

var _intersection = require('./intersection')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function _objectWithoutProperties(obj, keys) {
  var target = {}
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
    target[i] = obj[i]
  }
  return target
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    )
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass,
    )
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  })
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass)
} // eslint-disable-line no-unused-vars

var isFunction = function isFunction(func) {
  return typeof func === 'function'
}

/**
 * Monitors scroll, and triggers the children function with updated props
 *
 <Observer>
 {inView => (
   <h1>{`${inView}`}</h1>
 )}
 </Observer>
 */

var Observer = (function(_Component) {
  _inherits(Observer, _Component)

  function Observer() {
    var _ref

    var _temp, _this, _ret

    _classCallCheck(this, Observer)

    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    return (_ret = ((_temp = ((_this = _possibleConstructorReturn(
      this,
      (_ref = Observer.__proto__ || Object.getPrototypeOf(Observer)).call.apply(
        _ref,
        [this].concat(args),
      ),
    )), _this)), (_this.state = {
      inView: false,
    }), (_this.node = null), (_this.handleNode = function(node) {
      if (_this.node) (0, _intersection.unobserve)(_this.node)
      if (node) {
        ;(0, _intersection.observe)(
          node,
          _this.handleChange,
          _this.props.threshold,
        )
      }
      _this.node = node
    }), (_this.handleChange = function(inView) {
      return _this.setState({ inView: inView })
    }), _temp)), _possibleConstructorReturn(_this, _ret)
  }

  _createClass(Observer, [
    {
      key: 'componentWillUpdate',
      value: function componentWillUpdate(nextProps, nextState) {
        if (!!this.props.onChange && nextState.inView !== this.state.inView) {
          this.props.onChange(nextState.inView)
          if (nextState.inView && nextProps.unobserve) {
          }
        }
      },
    },
    {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps, prevState) {
        if (prevState.inView !== this.state.inView) {
          if (this.state.inView && this.props.triggerOnce) {
            ;(0, _intersection.unobserve)(this.node)
            this.node = null
          }
        }
      },
    },
    {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (this.node) {
          ;(0, _intersection.unobserve)(this.node)
          this.node = null
        }
      },
    },
    {
      key: 'render',
      value: function render() {
        var _props = this.props,
          children = _props.children,
          render = _props.render,
          tag = _props.tag,
          triggerOnce = _props.triggerOnce,
          threshold = _props.threshold,
          props = _objectWithoutProperties(_props, [
            'children',
            'render',
            'tag',
            'triggerOnce',
            'threshold',
          ])

        var inView = this.state.inView

        return (0, _react.createElement)(
          tag,
          Object.assign({}, props, {
            ref: this.handleNode,
          }),
          // If render is a function, use it to render content when in view
          inView && isFunction(render) ? render() : null,
          // If children is a function, render it with the current inView status.
          // Otherwise always render children. Assume onChange is being used outside, to control the the state of children.
          isFunction(children) ? children(inView) : children,
        )
      },
    },
  ])

  return Observer
})(_react.Component)

Observer.propTypes = {
  /** Element tag to use for the wrapping */
  tag: _propTypes2.default.node,
  /** Children should be either a function or a node */
  children: _propTypes2.default.oneOfType([
    _propTypes2.default.func,
    _propTypes2.default.node,
  ]),
  /** Only trigger this method once */
  triggerOnce: _propTypes2.default.bool,
  /** Number between 0 and 1 indicating the the percentage that should be visible before triggering */
  threshold: _propTypes2.default.number,
  /** Call this function whenever the in view state changes */
  onChange: _propTypes2.default.func,
  /** Use render method to only render content when inView */
  render: _propTypes2.default.func,
}
Observer.defaultProps = {
  tag: 'div',
  threshold: 0,
  triggerOnce: false,
}
exports.default = Observer
