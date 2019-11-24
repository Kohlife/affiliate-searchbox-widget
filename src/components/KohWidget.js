import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import 'react-dates/lib/css/_datepicker.css'
import 'react-dates/initialize'
import { SingleDatePicker } from 'react-dates'
import Autocomplete from 'react-autocomplete'
import axios from 'axios'
import moment from 'moment'

// import './KohWidget.scss'
import BackGround from './assets/widget.jpg'
import BackGround02 from './assets/widget02.png'
import KohIcon from './assets/kor_icon.png'
import VehicleIcon from './assets/homepage-icon.png'
import Swap from './assets/swap.png'
import { amountData } from './data'

const ImgDiv = styled.div`
  background-image: url(${props => (props.background === 'widget01' ? BackGround : BackGround02)}) !important;
  background-position: center center !important;
  background-color: grey !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  height: 430px !important;
  width: 320px !important;
  border-radius: 10px !important;
  padding: 10px 18px 0 18px !important;
  box-sizing: border-box !important;

  ._logo {
    height: 58px !important;
    margin-bottom: 5px !important;
  }

  ._webText {
    font-family: 'Ubuntu' !important;
    font-size: 22px !important;
    color: #ffc800 !important;
    font-weight: 700 !important;
    margin: 0 0 10px !important;
    line-height: 1 !important;
  }

  ._descText {
    font-family: 'Ubuntu' !important;
    font-size: 22px !important;
    color: #ffffff !important;
    font-weight: 700 !important;
    margin: 0 0 5px !important;
    width: ${320 - 36}px !important;
    word-wrap: break-word !important;
    line-height: 1 !important;
  }

  ._vehicleIcon {
    height: 37px !important;
    margin-bottom: 5px !important;
  }

  ._swap {
    position: absolute;
    right: 7px;
    top: 7%;
    height: 33px !important;
    cursor: pointer; 
  }

  #date {
    width: 150px !important;
    border: 1px solid #d8d8d8 !important;
    border-radius: 10px !important;
    box-shadow: 0 1px 4px 0 rgba(45, 45, 45, 0.2) !important;
    transition: 0.2s !important;
    font-weight: 400 !important;
    fotn-family: 'Roboto';
    font-size: 16px !important;
    height: 53px !important;
    box-sizing: border-box !important;
  }
  #date:hover {
    box-shadow: 0 1px 7px 0 rgba(255, 200, 0, 0.08) !important;
    border: 1px solid #ffc800 !important;
    cursor: pointer !important;
  }

  .CalendarDay__selected,
  .CalendarDay__selected:active,
  .CalendarDay__selected:hover {
    background: #ffc800 !important;
    border: 1px double #e4e7e7 !important;
    color: #4a4a4a !important;
  }

  .CalendarDay__default:hover {
    background: #fffce6 !important;
    border: 1px solid #e4e7e7 !important;
    color: inherit !important;
  }

  .SingleDatePickerInput {
    background: none !important;
    .DateInput {
      background: none !important;
    }
  }

  .SingleDatePickerInput__withBorder {
    border: none !important;
  }

  .SingleDatePicker {
    position: ${props => (props.position ? 'relatice' : 'static')} !important;
    display: inline-block !important;
  }

  .DateInput {
    position: ${props => (props.position ? 'relatice' : 'static')} !important;
    display: inline-block !important;
  }

  ._button {
    width: 100% !important;
    height: 50px !important;
    border-radius: 10px !important;
    background: #ffc800 !important;
    border: 1px solid #ffc800 !important;
    cursor: pointer !important;

    ._text {
      font-size: 14px !important;
      font-weight: 500 !important;
      font-family: 'Roboto' !important;
      color: #ffffff !important;
      margin-bottom: 0 !important;
      margin-block-start: 0 !important;
      margin-block-end: 0 !important;
    }

    &:hover {
      background: #deb316 !important;
    }
  }
`

const departureData = location => {
  let loc = location.map(({ id, name, url_key }, index) => {
    return {
      ['id']: id,
      ['url_key']: url_key,
      ['label']: name,
      ['value']: name
    }
  })

  return loc
}

const findUrlKey = (option, value) => {
  let url = option.filter(item => {
    return item.label === value
  })

  // console.log('url >>> ', url, 'url_key', url[0])
  return url[0].url_key
}

const filterRouteBlank = (option, routematch) => {
  let filter = []

  Object.keys(routematch).forEach(key => {
    // console.log('filterRouteBlank key >>> ', key)

    option.map(item => {
      if (item.id === Number(key)) {
        filter.push(item)
      }
    })
  })

  return filter
}

class KohWidget extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      departure: props.Departure,
      departureOption: [],
      departureKey: props.DepartureKey,
      arrival: props.Arrival,
      arrivalOption: [],
      arrivalKey: props.ArrivalKey,
      routematch: {},
      getDate: null,
      focused: null,
      date: null,
      amount: '2'
    }
  }

  componentDidMount() {
    axios
      .get(
        `https://82ywqgk2ik.execute-api.ap-southeast-1.amazonaws.com/dev/locations/searchbox`
      )
      .then(res => {
        const data = res.data
        // console.log('locations data >>> ', data.message)

        if (data.status) {
          this.setState({
            departureOption: departureData(data.message),
            arrivalOption: departureData(data.message)
          })
        }
      })

    axios
      .get(
        `https://7eliseuvsc.execute-api.ap-southeast-1.amazonaws.com/dev/transportations/routesMatch`
      )
      .then(res => {
        const data = res.data
        // console.log('routematch data >>> ', data.message)

        if (data.status) {
          this.setState({ routematch: data.message })
        }
      })

    this.setState({ getDate: moment() })
  }

  handleChange = name => event => {
    const { departureOption, routematch } = this.state

    if (name === 'departure') {
      console.log('departure')

      this.setState({ [name]: event.target.value })
    } else {
      // console.log('arrival')
      this.setState({ [name]: event.target.value })
    }
  }

  handleSelect = name => val => {
    const { departureOption, routematch } = this.state

    if (name === 'departure') {
      this.handleArrival(departureOption, routematch, val)

      // console.log('departure >>> ', val)
      this.setState({
        [name]: val,
        [`${name}Key`]: findUrlKey(departureOption, val)
      })
    } else {
      // console.log('arrival >>> ', val)
      this.setState({
        [name]: val,
        [`${name}Key`]: findUrlKey(departureOption, val)
      })
    }
  }

  handleArrival = (option, routematch, name) => {
    const { arrival } = this.state

    let data = option.filter(item => {
      return item.value === name
    })

    let Route = []
    Object.entries(routematch).forEach(route => {
      // console.log(route[0])
      if (Number(route[0]) === data[0].id) {
        Route.push(route[1])
      }
    })

    // console.log('handleArrival >>> ', Route, data[0].id)

    let Arrival = []
    let checkArrival = ''

    if (Route.length > 0) {
      Object.values(Route[0]).forEach(value => {
        option.map(item => {
          if (item.id === value) {
            Arrival.push(item)
          }
        })
      })
    }

    if (Arrival.length > 0) {
      const result = Arrival.some(route => {
        return route.label === arrival
      })

      checkArrival = result ? arrival : ''
    }

    this.setState({ arrivalOption: Arrival, arrival: checkArrival })

    console.log('arrival value >>> ', Arrival)
  }

  handleAmount = amount => {
    this.setState({ amount })
  }

  handleClick = () => {
    const { amount, date, departureKey, arrivalKey } = this.state

    if (date) {
      console.log('date >>> ', moment(date._d).format('YYYY-MM-DD'))
      const url = `https://www.kohlife.com/transport/${departureKey}/${arrivalKey}/${moment(
        date._d
      ).format('YYYY-MM-DD')}/${amount}?pid=PGQI24`

      // window.location = url
      window.open(url, '_blank')
    } else {
      const url = `https://www.kohlife.com/transport/${departureKey}/${arrivalKey}/${moment()
        .add(1, 'days')
        .format('YYYY-MM-DD')}/${amount}?pid=PGQI24`

      window.open(url, '_blank')
    }
  }

  handleSwap = () => {
    const { departure, arrival, departureKey, arrivalKey } = this.state
    console.log('Swap')
  }

  render() {
    const {
      departureOption,
      arrivalOption,
      departure,
      arrival,
      departureKey,
      arrivalKey,
      routematch,
      getDate,
      date,
      amount,
      focused
    } = this.state

    const {background} = this.props

    const departureList = filterRouteBlank(departureOption, routematch)
    const arrivalList = filterRouteBlank(arrivalOption, routematch)

    // console.log('focused >>> ', focused)
    // console.log('arrivalKey >>> ', arrivalKey)
    return (
        <div>
            {/* <h4>KohWidget</h4> */}
        <ImgDiv position={focused} background={background}>
          <img className="_logo" src={KohIcon} alt={KohIcon} />
          <p className="_webText">KOHLIFE.COM</p>
          <p className="_descText">Get cheap tickets across Southeast Asia</p>
          <img className="_vehicleIcon" src={VehicleIcon} alt="VehicleIcon" />
          <br />
          <div style={{ position: 'relative' }}>
            <Autocomplete
              wrapperStyle={{
                display: 'flex',
                width: '100%',
                position: 'relative'
              }}
              getItemValue={item => item.label}
              items={departureList}
              renderInput={props => {
                return (
                  <input
                    placeholder="From"
                    {...props}
                    style={{
                      display: 'flex',
                      width: '100%',
                      height: '50px',
                      borderRadius: '10px 10px 0 0',
                      border: 'solid 1px #e5e5e5',
                      fontSize: '18px',
                      color: '#4a4a4a',
                      fontFamily: 'Roboto',
                      paddingLeft: '16px',
                      fontWeight: 400
                    }}
                  />
                )
              }}
              renderItem={(item, isHighlighted) => {
                return (
                  <div
                    style={{
                      display: 'flex',
                      background: isHighlighted ? '#ffc800' : 'white',
                      fontSize: '16px',
                      fontFamily: 'Roboto',
                      color: '#4a4a4a',
                      padding: '8px 16px',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </div>
                )
              }}
              value={departure}
              onChange={this.handleChange('departure')}
              onSelect={this.handleSelect('departure')}
            />
            <img
              className="_swap"
              src={Swap}
              alt="Swap"
              onClick={this.handleSwap}
            />
            <Autocomplete
              wrapperStyle={{
                display: 'flex',
                width: '100%',
                marginBottom: '5px'
              }}
              getItemValue={item => item.label}
              items={arrivalList}
              renderInput={props => {
                return (
                  <input
                    placeholder="To Where?"
                    {...props}
                    style={{
                      display: 'flex',
                      width: '100%',
                      height: '50px',
                      borderRadius: '0 0 10px 10px',
                      border: 'solid 1px #e5e5e5',
                      fontSize: '18px',
                      color: '#4a4a4a',
                      fontFamily: 'Roboto',
                      paddingLeft: '16px',
                      fontWeight: 400
                    }}
                  />
                )
              }}
              renderItem={(item, isHighlighted) => {
                return (
                  <div
                    style={{
                      display: 'flex',
                      background: isHighlighted ? '#ffc800' : 'white',
                      fontSize: '16px',
                      fontFamily: 'Roboto',
                      color: '#4a4a4a',
                      padding: '8px 16px',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </div>
                )
              }}
              value={arrival}
              onChange={this.handleChange('arrival')}
              onSelect={this.handleSelect('arrival')}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                marginBottom: '5px'
              }}
            >
              <SingleDatePicker
                placeholder="When?"
                date={date}
                focused={this.state.focused} // PropTypes.bool
                onFocusChange={({ focused }) => this.setState({ focused })}
                onBlur={() => this.setState({ focused: null })}
                onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
                // className="_date-input"
                displayFormat="ddd, MMM DD"
                hideKeyboardShortcutsPanel={true}
                inputIconPosition="after"
                numberOfMonths={1}
                readOnly={true}
              />
              <Autocomplete
                wrapperStyle={{
                  display: 'flex',
                  width: '125px',
                  marginLeft: 'auto',
                  marginRight: 0
                }}
                getItemValue={item => item.label}
                items={amountData}
                renderInput={props => {
                  return (
                    <input
                      {...props}
                      style={{
                        display: 'flex',
                        width: '125px',
                        height: '53px',
                        borderRadius: '10px',
                        border: 'solid 1px #e5e5e5',
                        fontSize: '18px',
                        color: '#4a4a4a',
                        fontFamily: 'Roboto',
                        paddingLeft: '16px',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                        paddingLeft: '12px',
                        fontWeight: 400
                      }}
                      readOnly={true}
                    />
                  )
                }}
                renderItem={(item, isHighlighted) => {
                  return (
                    <div
                      style={{
                        display: 'flex',
                        background: isHighlighted ? '#ffc800' : 'white',
                        fontSize: '16px',
                        fontFamily: 'Roboto',
                        color: '#4a4a4a',
                        padding: '8px 16px',
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </div>
                  )
                }}
                value={amount}
                onSelect={val => this.handleAmount(val)}
              />
            </div>
            <button className="_button" onClick={this.handleClick}>
              <p className="_text">Search</p>
            </button>
          </div>
        </ImgDiv>
      </div>
    )
  }
}


KohWidget.PropTypes = {
  background: PropTypes.string,
  Departure: PropTypes.string,
  DepartureKey: PropTypes.string,
  Arrival: PropTypes.string,
  ArrivalKey: PropTypes.string
}

KohWidget.defaultProps = {
  background: 'widget01',
  Departure: 'Bangkok',
  DepartureKey: 'bangkok',
  Arrival: 'Chiangmai',
  ArrivalKey : 'chiangmai'

}

export default KohWidget
