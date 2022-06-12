import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Button, Container, Col, Row, Toast, ToastContainer } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';
// import { FilterContext } from '../config/ReactContext';
import MyNavbar from '../components/MyNavbar';
import DataList from '../components/DataList';
import '../mystyle.css';

const url = 'https://graphql.anilist.co/';
const headers = { 'Content-Type': 'application/json' };
const appIcon = 'https://anilist.co/img/icons/icon.svg';

function Home() {
  // const filterContext = useContext(FilterContext);
  const [additional, setAdditional] = useState([]);
  const [data, setData] = useState([]);
  const [pageInfo, setPageInfo] = useState([]);
  const [error, setError] = useState(false);
  const [perPage, setPerPage] = useState(16);
  // const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(true);

  // MOUNT FUNCTIONS CALL
  useEffect(() => {
    _getApi();
  }, []); // SET EMPTY ARRAY SO USEEFFECT JUST CALL ONCE

  useEffect(() => {
      let unmounted = false; // FLAG TO CHECK COMPONENT UNMOUNT

    // INFINITE SCROLL LOADING ANIMATION - DIBATASI 1000 DATA
    if (!unmounted && data.length === 1000 - perPage) 
      setLoadingMore(false);

    // CLEAR FUNCTION COMPONENT UNMOUNT
    return () => unmounted = true;

  }, [data])

  const _getApi = async () => {
    try {
      await _getList();
      await _getAdditional();
      setLoading(false);
    }

    catch (e) {
      setError([
        <ToastContainer key='error' className="position-fixed p-3" position='bottom-end'>
          <Toast onClose={() => setError([])} delay={3000} autohide>
            <Toast.Header>
              <img src={appIcon} className="ToastImage" alt="toast-icon" />
              <strong className="me-auto">Warning</strong>
            </Toast.Header>
            <Toast.Body>Hit API error!</Toast.Body>
          </Toast>
        </ToastContainer>
      ]);
    }
  };
  
  // GET API DATA ADDITIONAL
  const _getAdditional = useCallback (async () => {
    try {
      const query = {
        query : `{
          genres: GenreCollection
        }`
      };
      
      // console.log(query);

      const response = await axios.post(
        url,
        query,
        { headers }
      );
      
      setAdditional([response.data.data]);
      setLoading(false);
    }

    catch (e) {
      setError([
        <ToastContainer key='error' className="position-fixed p-3" position='bottom-end'>
          <Toast onClose={() => setError([])} delay={3000} autohide>
            <Toast.Header>
              <img src={appIcon} className="ToastImage" alt="toast-icon" />
              <strong className="me-auto">Warning</strong>
            </Toast.Header>
            <Toast.Body>Hit API error!</Toast.Body>
          </Toast>
        </ToastContainer>
      ]);
    }

  }, []);

  // GET API DATA LIST
  const _getList = (async (page = 1) => {
    try {
      const query = {
        query : `{
          list: Page(page: ${page}, perPage: ${perPage}) {
            pageInfo {
              total
              perPage
              currentPage
              lastPage
              hasNextPage
            }
            media: media(sort: TRENDING_DESC isAdult: false) {
              id
              title { userPreferred }
              genres
              coverImage { large }
            }
          }
        }`
      };
      
      // console.log(query);

      const response = await axios.post(
        url,
        query,
        { headers }
      );

      // console.log('length', data.media);
      // console.log(response.data.data.list);
      // console.log('length', data.media);
      
      if (page === 1) {
        setData(response.data.data.list.media);
        setPageInfo(response.data.data.list.pageInfo);
        setLoading(false);
      }
      else {
        setData([ ...data, ...response.data.data.list.media ]);
        setPageInfo(response.data.data.list.pageInfo);
      }
      
      setError([]);
    }

    catch (e) {
      setError([
        <ToastContainer key='error' key='error' className="position-fixed p-3" position='bottom-end'>
          <Toast onClose={() => setError([])} delay={3000} autohide>
            <Toast.Header>
              <img src={appIcon} className="ToastImage" alt="toast-icon" />
              <strong className="me-auto">Warning</strong>
            </Toast.Header>
            <Toast.Body>Hit API error!</Toast.Body>
          </Toast>
        </ToastContainer>
      ]);
    }
  });

  // USEEFFECT FILTER
  // useEffect(() => {
  //   // console.log('USEEFFECT FILTER', page);
  //   let unmounted = false; // FLAG TO CHECK COMPONENT UNMOUNT

  //   if (!unmounted && filterContext.filterValue) {
  //     // console.log('USEEFFECT FILTER RUN _getList');
  //     _getList();
  //   }

  //   // CLEAR FUNCTION COMPONENT UNMOUNT
  //   return () => unmounted = true;

  // }, [filterContext.filterValue]);


  // RENDER
  return loading ? (
    <div className="LoadingContainer">
      <img src={appIcon} className="Loading" alt="logo" />

      {error.length > 0 && error}
    </div>
  ) : (
    <div className="Content">
      <MyNavbar
        hasFilter={true}
        // callbackFilter={_callbackFilter}
      />

      <Container>
        <InfiniteScroll
          pageStart={1}
          loadMore={_getList}
          hasMore={loadingMore}
          loader={
            <div key={0} style={{ marginBottom: 50 }}>
              <img src={appIcon} className="Loading" alt="logo" />
            </div>
          }
        >
          <DataList data={data} />
        </InfiniteScroll>
      </Container>

      {error.length > 0 && error}
    </div>
  );
}

export default Home;
