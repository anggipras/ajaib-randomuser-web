import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  Navbar,
  Container,
  Form,
  FormControl,
  Button,
  Dropdown,
  Table
 } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TailSpin } from 'react-loader-spinner'

let sortMethod = 'asc'
function App() {
  const [gender, setGender] = useState('All Gender')
  const [inputData, setInputData] = useState('')
  const [newSort, setNewSort] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(0)
  const [userData, setUserData] = useState([
    {
      username: "",
      name: "",
      email: "",
      gender: "",
      registered_date: "" 
    }
  ])
  const [userSearchData, setUserSearchData] = useState([
    {
      username: "",
      name: "",
      email: "",
      gender: "",
      registered_date: "" 
    }
  ])

  // First Load Page
  useEffect(() => {
    if (JSON.parse(localStorage.getItem('FIRST_LOAD'))) {
      localStorage.removeItem('FIRST_LOAD')
    }

    axios.get(`https://randomuser.me/api/?page=0&results=30`)
    .then((res) => {
      let theResult = res.data.results
      let newArrData = theResult.map(val => {
        let newObject = {
          username: val.login.username,
          name: `${val.name.first} ${val.name.last}`,
          email: val.email,
          gender: val.gender,
          registered_date: val.registered.date
        }
        return newObject
      });
      localStorage.setItem('FIRST_LOAD', JSON.stringify(newArrData))
      setUserData(newArrData)
      setPage(page+1)
      setHasMore(true)
    }).catch(err => console.log(err))
  },[])

  // Fetching Random Data By Pagination
  const fetchRandomDataByPagination = () => {
    axios.get(`https://randomuser.me/api/?page=${page}&results=10`)
    .then((res) => {
      let theResult = res.data.results
      let newArrData = theResult.map(val => {
        let newObject = {
          username: val.login.username,
          name: `${val.name.first} ${val.name.last}`,
          email: val.email,
          gender: val.gender,
          registered_date: val.registered.date
        }
        return newObject
      });
      setTimeout(() => {
        setUserData([...userData].concat(newArrData))
        if (JSON.parse(localStorage.getItem('FIRST_LOAD'))) {
          let localStrg = JSON.parse(localStorage.getItem('FIRST_LOAD'))
          localStorage.setItem('FIRST_LOAD', JSON.stringify([...localStrg].concat(newArrData)))
        }
        setPage(page+1)
      }, 1000);
    }).catch(err => {
      console.log(err);
      setHasMore(false)
    })
  }

  // Sort based on Table Data
  const sortTable = (val) => {
    if (sortMethod === 'asc') {
      sortMethod = 'dsc'
    } else {
      sortMethod = 'asc'
    }

    let newUserSortData = userData
    
    newUserSortData.sort((a, b) => {
      if (sortMethod === 'asc') {
        if (val === "name") {
          return (a.name === b.name) ? 0 : (a.name < b.name) ? -1 : 1
        } else if (val === "email") {
          return (a.email === b.email) ? 0 : (a.email < b.email) ? -1 : 1
        } else if (val === "gender") {
          return (a.gender === b.gender) ? 0 : (a.gender < b.gender) ? -1 : 1
        } else {
          return (a.registered_date === b.registered_date) ? 0 : (a.registered_date < b.registered_date) ? -1 : 1
        }
      } else {
        if (val === "name") {
          return (a.name === b.name) ? 0 : (a.name > b.name) ? -1 : 1
        } else if (val === "email") {
          return (a.email === b.email) ? 0 : (a.email > b.email) ? -1 : 1
        } else if (val === "gender") {
          return (a.gender === b.gender) ? 0 : (a.gender > b.gender) ? -1 : 1
        } else {
          return (a.registered_date === b.registered_date) ? 0 : (a.registered_date > b.registered_date) ? -1 : 1
        }
      }
    })
    setNewSort(!newSort)
    setUserData(newUserSortData);
  }

  // Reset All Filter
  const resetFilter = () => {
    if (JSON.parse(localStorage.getItem('FIRST_LOAD'))) {
      let localStrg = JSON.parse(localStorage.getItem('FIRST_LOAD'))
      setUserData(localStrg)
      setGender('All Gender')
      setInputData('')
      setHasMore(true)
    }
  }

  // Filter Gender on dropdown list
  const filterByGender = (gen) => {
    if (JSON.parse(localStorage.getItem('FIRST_LOAD'))) {
      let localStrg = JSON.parse(localStorage.getItem('FIRST_LOAD'))
      let filteredArr = localStrg.filter(val => {
        return val.gender === gen.toLowerCase()
      })
      if (filteredArr.length < 20) {
        setHasMore(false)
      }
      setUserData(filteredArr)
      setGender(gen)
    }
  }

  // Input data on search box
  const getInput = (e) => {
    setInputData(e.target.value)

    if (e.target.value === '') {
      setUserSearchData([
        {
          username: "",
          name: "",
          email: "",
          gender: "",
          registered_date: "" 
        }
      ])
    } else {
      let filteredArr = userData.filter(val => {
        return val.name.toLocaleLowerCase().includes(e.target.value.toLowerCase())
      })
      if (filteredArr.length < 20) {
        setHasMore(false)
      }
      setUserSearchData(filteredArr)
    }
  }

  // Search Data from List
  const searchData = () => {
    if (inputData.length === 0) {
      setUserSearchData([
        {
          username: "",
          name: "",
          email: "",
          gender: "",
          registered_date: "" 
        }
      ])
    } else {
      let filteredArr = userData.filter(val => {
        return val.name.toLocaleLowerCase().includes(inputData.toLowerCase())
      })
      if (filteredArr.length < 20) {
        setHasMore(false)
      }
      setUserSearchData(filteredArr)
    }
  }

  // Mapped List of Random Data
  const listData = () => {
    if (inputData.length > 0) {
      return userSearchData.map((val, ind) => {
        return (
          <tr key={ind}>
            <td>{val.username}</td>
            <td>{val.name}</td>
            <td>{val.email}</td>
            <td>{val.gender}</td>
            <td>{moment(val.registered_date).format("DD-MM-YYYY H:mm")}</td>
          </tr>
        )
      })
    } else {
      return userData.map((val, ind) => {
        return (
          <tr key={ind}>
            <td>{val.username}</td>
            <td>{val.name}</td>
            <td>{val.email}</td>
            <td>{val.gender}</td>
            <td>{moment(val.registered_date).format("DD-MM-YYYY H:mm")}</td>
          </tr>
        )
      })
    }
  }

  return (
    <div>
      <Navbar sticky='top' bg='dark' variant='dark'>
        <Container>
          <Navbar.Brand>Ajaib Random User</Navbar.Brand>
          <Navbar.Toggle />
        </Container>
      </Navbar>

      <div style={{ display: 'flex', margin: '30px' }}>
        <Form className="d-flex">
          <FormControl
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
            onChange={(e) => getInput(e)}
            value={inputData}
          />
          <Button variant="outline-success" onClick={() => searchData()}>Search</Button>
        </Form>

        <Dropdown style={{ marginLeft: '30px' }}>
          <Dropdown.Toggle variant="secondary">
           {gender}
          </Dropdown.Toggle>

          <Dropdown.Menu variant="dark">
            <Dropdown.Item onClick={() => filterByGender('Female')}>Female</Dropdown.Item>
            <Dropdown.Item onClick={() => filterByGender('Male')}>Male</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Button variant='secondary' style={{marginLeft: '10px'}} onClick={resetFilter}>Reset Filter</Button>
      </div>

      <div style={{margin: "30px", justifyContent: 'center', alignItems: 'center'}}>
        <InfiniteScroll
          dataLength={userData.length}
          next={fetchRandomDataByPagination}
          hasMore={hasMore}
          loader={<TailSpin
            type="TailSpin"
            color="blue"
            height={100}
            width={100}
          />}
        >
        <Table striped bordered>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name <FontAwesomeIcon icon={faSort} onClick={() => sortTable('name')}/></th>
              <th>Email <FontAwesomeIcon icon={faSort} onClick={() => sortTable('email')}/></th>
              <th>Gender <FontAwesomeIcon icon={faSort} onClick={() => sortTable('gender')}/></th>
              <th>Registered Date <FontAwesomeIcon icon={faSort} onClick={() => sortTable('date')}/></th>
            </tr>
          </thead>
          <tbody>
            {listData()}
          </tbody>
        </Table>
        </InfiniteScroll>
      </div>

    </div>
  );
}

export default App;
