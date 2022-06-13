import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FilterContext } from '../config/ReactContext';
import { Container, Toast, ToastContainer } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';
import Constants from '../config/Constants';
import MyNavbar from '../components/MyNavbar';
import DataList from '../components/DataList';
import '../mystyle.css';

const headers = { 'Content-Type': 'application/json' };
const appIcon = 'https://anilist.co/img/icons/icon.svg';

function Home() {
  const filterContext = useContext(FilterContext);
  const [dataFilter, setDataFilter] = useState(
    filterContext.filterValue.length > 0
      ? filterContext.filterValue
      : []
  );
  const [pageInfo, setpageInfo] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [perPage, setPerPage] = useState(16);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(true);
  const [loadingFlag, setLoadingFlag] = useState(false);
  

  // MOUNT FUNCTIONS CALL
  useEffect(() => {
    _getApi();
  }, []); // SET EMPTY ARRAY SO USEEFFECT JUST CALL ONCE

  const _getApi = async () => {
    try {
      await _getList();
      if (filterContext.filterValue.length === 0) {
        await _getAdditional();
      }
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
        Constants.url,
        query,
        { headers }
      );
      
      const genre = response.data.data.genres.map((item) => {
        return { genre: item, value: false }
      });
      const data = [genre, { count: 0, filter: [] }]

      localStorage.setItem('filterDefault', JSON.stringify(data)); // SAVE IN LOCAL STORAGE
      localStorage.setItem('filterValue', JSON.stringify(data)); // SAVE IN LOCAL STORAGE
      filterContext.setFilterDefault(data); // UPDATE GLOBAL STATE - FILTER RESET
      filterContext.setFilterValue(data); // UPDATE GLOBAL STATE - FILTER VALUE
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
  const _getList = (async () => {
    // BLOCK MULTIPLE REQUEST
    if (loadingFlag) return false;

    try {
      setLoadingFlag(true);
      let filter = '';

      // CEK JIKA MELAKUKAN FILTER
      if (dataFilter.length > 0 && dataFilter[1].filter.length > 0)
        filter = `, genre_in: [${dataFilter[1].filter}]`;

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
            media: media(sort: TRENDING_DESC isAdult: false ${filter}) {
              id
              title { userPreferred }
              genres
              coverImage { large }
              meanScore
            }
          }
        }`
      };
      
      // console.log('query', query);

      const response = await axios.post(
        Constants.url,
        query,
        { headers }
      );
      
      // UNTUK DATA HALAMAN PERTAMA
      if (page === 1) {
        setpageInfo(response.data.data.list.pageInfo);
        setData(response.data.data.list.media);
        setLoadingMore(true); // RESET hasMore PROPS FOR INFINITE SCROLL
      }
      // UNTUK DATA NEXT PAGE
      else {
        setpageInfo(response.data.data.list.pageInfo);
        setData([ ...data, ...response.data.data.list.media ]);
      }
      
      // UPDATE INFO
      setError([]);
      setPage(page + 1);
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
  });

  // USEEFFECT FILTER
  const _callbackFilter = useCallback((data) => {
    window.scrollTo(0, 0); // SCROLL PAGE TO TOP
    setPage(1); // RESET PAGING

    // SET FILTER DATA THEN HIT API WILL HANDLE BY USE EFFECT OF DATAFILTER
    setTimeout(() => {
      // APPLY FILTER
      if (data.length > 0)
        setDataFilter(data);

      // RESET FILTER
      else
        setDataFilter([]);

    }, 500); // TO GIVE SOME TIME SCROLL TO TOP ANIMATION

  }, []);

  // STATE dataFilter UPDATE CALLBACK
  useEffect(() => {
    // console.log('useEffect dataFilter', dataFilter);
    let unmounted = false; // FLAG TO CHECK COMPONENT UNMOUNT

    // MEMASTIKAN FILTER DATA APPLY - UNTUK PAGE 1
    if (!unmounted && page === 1)
      _getList();

    // CLEAR FUNCTION COMPONENT UNMOUNT
    return () => unmounted = true;

  }, [dataFilter]);

  // STATE data UPDATE CALLBACK
  useEffect(() => {
    // console.log('useEffect data', pageInfo);
    let unmounted = false; // FLAG TO CHECK COMPONENT UNMOUNT

    // INFINITE SCROLL - DIBATASI 1000 DATA
    if (!unmounted && data.length === 1000 - perPage)
      setLoadingMore(false);

    // JIKA SUDAH DATA TERAKHIR
    if (!unmounted && !pageInfo.hasNextPage)
      setLoadingMore(false);

    // BLOCK MULTIPLE CALL API
    if (!unmounted && loadingFlag)
      setLoadingFlag(false);

    // CLEAR FUNCTION COMPONENT UNMOUNT
    return () => unmounted = true;

  }, [data, pageInfo]);


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
        callbackFilter={_callbackFilter}
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
