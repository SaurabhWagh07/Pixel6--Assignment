import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [sortConfig, setSortConfig] = useState(null);
  const usersPerPage = 10;

  useEffect(() => {
    fetch('https://dummyjson.com/users')
      .then((result) => result.json())
      .then((res) => {
        setData(res.users);
        setFilteredData(res.users);
      });
  }, []);

  useEffect(() => {
    let filtered = data;

    if (selectedGender !== 'All') {
      filtered = filtered.filter(user => user.gender === selectedGender);
    }

    if (selectedCountry !== 'All') {
      filtered = filtered.filter(user => user.address.state === selectedCountry);
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [selectedGender, selectedCountry, data]);

  // here is useeffect for sorting a data
  useEffect(() => {
    if (sortConfig !== null) {
      let sortedData = [...filteredData];
      sortedData.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'age') {
          aValue = a.age;
          bValue = b.age;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      setFilteredData(sortedData);
    }
  }, [sortConfig, filteredData]);

  // get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);

  // this is change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  // this for sort method

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <header className="App-header">
        <div className="bg-warning fw-bold p-4 text-center">
          <h1 className='fw-bold title01'>EMPLOYEES</h1>
        </div>

        <div className="container-fluid">

        {/* filter data start part 1 */}

<section>

          <div className="row my-4">

{/* filter method for gender */}
  <div className="col-md-3"><i className="fa-solid fa-filter mx-1"></i>
    <label htmlFor="genderFilter">Filter by Gender:</label>

    {/* select option */}
    <select id="genderFilter" className="form-select form-control" value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
      <option value="All">All</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select>
  </div>

  {/* filter method for country by using array and map method */}
  <div className="col-md-3"><i className="fa-solid fa-filter mx-1"></i>
    <label htmlFor="countryFilter" >Filter by Country:</label>

    {/* select option */}
    <select id="countryFilter" className="form-select form-control" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
      <option value="All">All</option>

      {/* Add option dynamically base on available country in data */}

      {Array.from(new Set(data.map(user => user.address.state))).map(country => (
        <option key={country} value={country}>{country}</option>
      ))}
    </select>
  </div>
          </div>

</section>



{/* table code start part 2*/}

<section>
<div className="col-md-12">
            <table className="table table-hover table-striped table-bordered text-center text-dark fw-bold">
              <thead>
                <tr className="bg-dark text-light">
                  <th onClick={() => requestSort('id')}>ID <i className="fa-solid fa-sort mx-1"></i></th>
                  <th>Image</th>
                  <th onClick={() => requestSort('firstName')}>Full Name <i className="fa-solid fa-sort mx-1"></i></th>
                  <th onClick={() => requestSort('age')}>Demography <i className="fa-solid fa-sort mx-1"></i></th>
                  <th>Designation</th>
                  <th onClick={() => requestSort('address.state')}>Location</th>
                </tr>
              </thead>

              <tbody>

              {/* map method  */}
                {currentUsers.map((val, index) => (
                  <tr key={index}>
                    <td>{val.id}</td>
                    <td><img src={val.image} alt="User" width="50" /></td>
                    <td>{val.firstName} {val.maidenName} {val.lastName}</td>
                    <td>{val.gender}/{val.age}</td>
                    <td>{val.company.title}</td>
                    <td>{val.address.city}, {val.address.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* pagination start from here */}
            <div className="">
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => paginate(currentPage - 1)} tabIndex="-1" aria-disabled={currentPage === 1}>Previous</a>
                  </li>
                  {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                      <a onClick={() => paginate(number)} className="page-link" href="#">{number}</a>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => paginate(currentPage + 1)}>Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
</section>

        </div>
      </header>
    </>
  );
}

export default App;
