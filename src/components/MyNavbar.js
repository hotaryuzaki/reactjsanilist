import React, { useContext, useEffect, useState } from 'react';
import { FilterContext } from '../config/ReactContext';
import { Button, Container, Modal, Navbar } from 'react-bootstrap';
import { FaArrowLeft, FaFilter } from "react-icons/fa";
import FilterObject from "./FilterObject";
import '../mystyle.css';

const appIcon = 'https://anilist.co/img/icons/icon.svg';

function MyNavbar(props) {
  const filterContext = useContext(FilterContext);
  const {
  	hasFilter = false,
    hasBack = false,
    callbackFilter
  } = props;
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    console.log('filterContext', filterContext.filterValue);
  }, [filterContext.filterValue])

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
                href="#dataFilter"
                onClick={() => setShowModal(true)}
              >
                <FaFilter className="NavbarFilterIcon" />
                {
                  filterContext.filterValue[1]?.count > 0 && (
                    <span className="FilterBadge">{filterContext.filterValue[1].count}</span>
                  )
                }
              </a>
            </span>
          )}
        </Container>
      </Navbar>

      <Modal
        show={showModal}
        fullscreen="lg-down"
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>

        <div className="FilterContainer">
          <div className="FilterSegment">
            <FilterObject title='By Genres' />
          </div>
        </div>

        <Button
          style={{ margin: 10 }}
          onClick={() => {
            callbackFilter(filterContext.filterValue);
            setShowModal(false);
          }}
        >
          Terapkan Filter
        </Button>
      </Modal>
      </>
  );
}

export default MyNavbar;
