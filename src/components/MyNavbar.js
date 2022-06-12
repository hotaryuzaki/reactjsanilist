import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Modal, Navbar, ToggleButton } from 'react-bootstrap';
import { FaArrowLeft, FaFilter } from "react-icons/fa";
// import { FilterContext } from '../config/ReactContext';
import '../mystyle.css';

const appIcon = 'https://anilist.co/img/icons/icon.svg';

function MyNavbar(props) {
  // const filterContext = useContext(FilterContext);
  const {
  	hasFilter = false,
    hasBack = false,
    callbackFilter
  } = props;
  const [showModal, setShowModal] = useState(false);
  // const [filter, setFilter] = useState([...filterContext.filterValue]); // COPY ARRAY VALUE NOT REFERENCE!

  // useEffect (() => {
  //   if (hasFilter) callbackShowCheckbox(showCheckbox);
  // }, [showCheckbox])

  // const FilterTypes = () => {
  //   let data = [];

  //   data.push(
  //     <p className='FilterTitle' key='FilterTypes-title'>By Types</p>  
  //   );

  //   filter[0].map((item, index) => {
  //     data.push(
  //       <ToggleButton
  //         key={`FilterTypes-${index}`}
  //         id={`FilterTypes-${index}`}
  //         className="FilterButton"
  //         size="sm"
  //         type="checkbox"
  //         variant="outline-primary"
  //         checked={item.value}
  //         onChange={(e) => setChecked('filterTypes', index, item.name, !item.value)}
  //       >
  //         {item.name}
  //       </ToggleButton>
  //     );

  //     return true;
  //   });

  //   return data;
  // };

  return (
    <>
      <Navbar className="Navbar" sticky="top">
        <Container className="NavbarContainer">
          <span className="NavbarLeft">
            {hasBack && (
              <a key="hasBack" href="/reactjs-anilist/">
                <FaArrowLeft className="NavbarBack" />
              </a>
            )}

            <header key="NavbarLeft" className="App-header">
              <img
                src={appIcon}
                className="App-logo"
                alt="logo"
              />
            </header>
          </span>

          {hasFilter && (
            <span key="hasFilter" className="NavbarRight">
              <a
                className="NavbarFilter"
                href="#filter"
                // onClick={() => setShowModal(true)}
              >
                <FaFilter className="NavbarFilterIcon" />
                {/* {filter[2].count > 0 && (
                  <span className="FilterBadge">{filter[2].count}</span>
                )} */}
              </a>
            </span>
          )}
        </Container>
      </Navbar>

      {/* <Modal
        show={showModal}
        fullscreen="lg-down"
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>

        <div className="FilterContainer">
          <div className="FilterSegment">
            <FilterTypes />
          </div>
          <div className="FilterSegment">
            <FilterGen />
          </div>
        </div>

        <Button
          style={{ margin: 10 }}
          onClick={() => {
            callbackFilter(filter);
            setShowModal(false);
          }}
        >
          Terapkan Filter
        </Button>
      </Modal> */}
      </>
  );
}

export default MyNavbar;
